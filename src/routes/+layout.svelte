<script lang="ts">
	import { links, meta } from '$lib/data';
	import {
		Footer,
		FooterCopyright,
		FooterLink,
		FooterLinkGroup,
		Navbar,
		NavBrand,
		NavHamburger,
		NavLi,
		NavUl
	} from 'flowbite-svelte';
	import '../app.css';

	let { children } = $props();
</script>

<div class="flex min-h-[calc(100svh)] w-full flex-col md:min-h-screen">
	<div class="relative px-8">
		<Navbar class="px-2 sm:px-4 py-2.5 fixed w-full z-20 top-0 start-0 border-b">
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
			<NavHamburger />
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
		{@render children()}
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
