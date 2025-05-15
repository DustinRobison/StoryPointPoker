<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import { links, meta } from '$lib/data';
	import { toast } from '$lib/stores/toast';
	import {
		Button,
		Footer,
		FooterCopyright,
		FooterLink,
		FooterLinkGroup,
		Navbar,
		NavBrand,
		NavHamburger,
		NavLi,
		NavUl,
		Toast,
		Tooltip
	} from 'flowbite-svelte';
	import { GithubSolid } from 'flowbite-svelte-icons';
	import { fade } from 'svelte/transition';
	import '../app.css';

	let { children } = $props();
	let visible = $state(true);
</script>

<!-- Toast in abosolute postion appears on z-top -->
<div class="fixed right-0 bottom-0 z-50 m-4">
	{#if $toast.show}
		<Toast id={`ToastTime`} toastStatus={$toast.show}>
			{$toast.message}
		</Toast>
	{/if}
</div>


  <!-- Just Delete this P tag for Viewing the Dot Center Pattern -->
  <Background
    class="fixed [mask-image:radial-gradient(600px_circle_at_center,white,transparent)] -z-50"
  />

<div class="flex min-h-[calc(100svh)] w-full flex-col md:min-h-screen z-10">
	<div class="relative px-8">
		<Navbar class="fixed start-0 top-0 z-20 w-full border-b px-2 py-2.5 sm:px-4">
			<NavBrand href="/">
				<img src={meta.logo} class="me-3 h-6 sm:h-9" alt="Flowbite Logo" />
				<div>
					<h3
						class="self-center text-xl font-semibold whitespace-nowrap text-gray-800 dark:text-white"
					>
						{meta.title}
					</h3>
					<h5>{meta.subTitle}</h5>
				</div>
			</NavBrand>

			<div class="flex items-center md:order-2">
				<div>
					<Tooltip triggeredBy="#fork-button" placement="bottom" color="green"
						>Fork me on Github</Tooltip
					>
					<Button
						id="fork-button"
						href="https://github.com/DustinRobison/StoryPointPoker"
						target="_blank"
						color="alternative"
						pill
					>
						<GithubSolid class="h-5 w-5" />
					</Button>
				</div>
				<NavHamburger />
			</div>

			<NavUl>
				{#each links as link}
					{#if link.inNavBar}
						<NavLi href={link.url}>{link.name}</NavLi>
					{/if}
				{/each}
			</NavUl>
		</Navbar>
	</div>
	<div class="h-[74px]"></div>

	<main class={`mx-auto my-4 w-full max-w-5xl flex-grow overflow-x-clip px-2`}>
		<div transition:fade={{ duration: 300 }}>
			{@render children()}
		</div>
	</main>

	<Footer>
		<div class="p-6 sm:flex sm:items-center sm:justify-between">
			<FooterCopyright href="/" by="Dustin Robison" year={new Date().getFullYear()} />
			<FooterLinkGroup
				ulClass="flex flex-wrap items-center mt-3 text-sm text-gray-500 dark:text-gray-400 sm:mt-0"
			>
				{#each links as link}
					<FooterLink href={link.url}>{link.name}</FooterLink>
				{/each}
			</FooterLinkGroup>
		</div>
	</Footer>
</div>
