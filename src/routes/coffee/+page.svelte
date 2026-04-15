<script lang="ts">
	import { loadStripe, type Stripe } from '@stripe/stripe-js';
	import { Button, Card, Input, Label } from 'flowbite-svelte';
	import { PaperPlaneSolid } from 'flowbite-svelte-icons';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import type { PageData } from './$types';

	const props = $props<{ data: PageData }>();
	/** Avoid destructuring `$props()` so nested `data.*` stays reactive in Svelte 5. */
	const data = $derived(props.data);

	let amount: any = $state();
	let isDisabled = $derived(!data.stripeConfigured || !amount || amount < 1);

	let stripePromise: Promise<Stripe | null> | undefined;

	async function handleDonate() {
		if (!data.stripeConfigured) {
			alert('Stripe is not configured for this deployment. You can still support the project via Patreon below.');
			return;
		}
		const stripe = await stripePromise;
		if (!stripe) {
			console.error('Stripe.js not loaded');
			return;
		}

		try {
			const response = await fetch('/api/donate', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ amount })
			});

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			const { sessionId } = await response.json();
			const result = await stripe.redirectToCheckout({ sessionId });

			if (result.error) {
				console.error(result.error.message);
			}
		} catch (error) {
			console.error('Error:', error);
			alert('An error occurred while processing your donation. Please try again.');
		}
	}

	onMount(async () => {
		if (!data.stripeConfigured || !data.stripePublicKey) return;
		stripePromise = loadStripe(data.stripePublicKey);
	});

	const prices = [1, 5, 10, 20, 50, 100];

	function donationMessage(amount: number) {
		const boldAmount = `<span class="font-bold bg-accent text-accent-foreground">$${amount || '0'}</span>`;
		if (!amount) return 'Enter an amount to donate, or choose from the options below.';
		if (amount === 1) return `Thank you for your ${boldAmount} donation! Each bean counts.`;
		if (amount <= 5) return `Your ${boldAmount} donation is a coffee!`;
		if (amount <= 10) return `Thank you for your ${boldAmount} donation! That's multiple coffees.`;
		if (amount <= 20)
			return `Thank you for your ${boldAmount} donation! I drink my brew in honor of you.`;
		if (amount <= 50) return `A ${boldAmount} donation is amazing! I bathe in coffee.`;
		if (amount <= 100)
			return `Your ${boldAmount} donation is deeply appreciated. I swim will swim in pools of coffee!`;

		return `You are donating ${boldAmount}. Thank you for your contribution!`;
	}
</script>

<div class="flex justify-around" transition:fade={{ duration: 300 }}>
	<!-- Donate Card -->
	<Card class="w-1/2">
		<h5 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Donate:</h5>
		{#if !data.stripeConfigured}
			<p class="mb-2 text-sm text-amber-700 dark:text-amber-300">
				Card donations are temporarily unavailable (Stripe is not configured). Please use Patreon below.
			</p>
		{/if}
		<p class="mb-2 min-h-12 text-sm text-gray-500 dark:text-shadow-white">
			{@html donationMessage(amount)}
		</p>

		<div class="my-4">
			<Label for="name" class="mb-2 block">One time amount:</Label>
			<div class="flex items-center space-x-2">
				<Input
					id="name"
					name="name"
					size="lg"
					type="number"
					bind:value={amount}
					min="1"
					placeholder="Enter amount"
					required
				/>

				<Button onclick={handleDonate} disabled={isDisabled}>
					<span>Donate</span>
					<PaperPlaneSolid class="ml-2 rotate-90" />
				</Button>
			</div>
		</div>

		<div class="my-4 grid grid-cols-3 gap-2">
			{#each prices as amt}
				<Button class="w-full" type="button" onclick={() => (amount = amt)}>
					{amt}
				</Button>
			{/each}
		</div>

		<hr class="my-8 h-px border-0 bg-gray-200 dark:bg-gray-700" />

		<div class="my-4">
			<h5 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
				Or use Patreon:
			</h5>

			<Button
				href="https://www.patreon.com/c/ScrumStoryPoints"
				target="_blank"
				rel="noopener noreferrer"
				class="my-4 w-full"
			>
				<span>Become a Patron</span>
				<PaperPlaneSolid class="ml-2 rotate-90" />
			</Button>
		</div>
	</Card>

	<!-- Donators feed card -->
	<Card class="w-1/2">
		<h5 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Donators feed:</h5>
		
		<!-- Show featured donators in a list -->
		<ul>
			{#each data.featuredDonators as donator}
				<li class="m-2">
					<Card class="p-4">
						<div class="flex items-center justify-between">
							<h5 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">#{donator.rank}   {donator.name}</h5>
							<!-- Github button -->
							{#if donator.link}
								<a
									href={donator.link}
									target="_blank"
									rel="noopener noreferrer"
									class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
									aria-label="View {donator.name}'s GitHub profile"
								>
									<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
										<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
									</svg>
								</a>
							{/if}
						</div>
					</Card>
				</li>
			{/each}
		</ul>
	</Card>
</div>
