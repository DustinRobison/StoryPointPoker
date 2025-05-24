<script lang="ts">
	import { loadStripe, type Stripe } from '@stripe/stripe-js';
	import { Button, Card, Input, Label } from 'flowbite-svelte';
	import { PaperPlaneSolid } from 'flowbite-svelte-icons';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let amount: any = $state();
	let isDisabled = $derived(!amount || amount < 1);

	let stripePromise: Promise<Stripe | null> | undefined;

	async function handleDonate() {
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
		// Load Stripe and generate BTC QR code on mount
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
				<Button class="w-full" type="button" on:click={() => (amount = amt)}>
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
		<p class="mb-2 min-h-12 text-sm text-gray-500 dark:text-shadow-white">
			Coming soon...
		</p>
	</Card>
</div>
