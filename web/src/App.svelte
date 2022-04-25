<script>
	import { getContext, setContext } from "svelte";

	// Scaffold
	import TailwindCSS from "./TailwindCSS.svelte";
	import Header from "./Header.svelte";
	import Footer from "./Footer.svelte";

	// Content
	import Mint from "./content/Mint.svelte";
	import NoMetamask from "./content/NoMetamask.svelte";
	import FAQ from "./content/FAQ.svelte";

	export let config;

	setContext("helper", { connectMetamask, hasMetamask, isConnected });

	// Dev
	const development = true;
	// Check for MetaMask
	let metamask = false;

	if (typeof window.ethereum !== "undefined" && ethereum.isMetaMask) {
		metamask = true;

		// Reload window on account changed; this will also be emitted on login
		window.ethereum.on("accountsChanged", () => {
			location.reload();
		});
	} else {
		metamask = false;
	}

	function isConnected() {
		return window.ethereum.isConnected();
	}

	function hasMetamask() {
		return metamask;
	}

	async function connectMetamask() {
		try {
			const accounts = await ethereum.request({
				method: "eth_requestAccounts",
			});
			console.log(accounts);

			location.reload();
		} catch (e) {
			console.log(e);
		}
	}
</script>

<TailwindCSS />
<Header {metamask} />
<main class="mx-auto max-w-full sm:max-w-screen-xl px-4 pb-2 ">
	<!-- Check if Metamask Chrome extension is installed.   -->
	{#if metamask}
		<Mint {config} />
	{:else}
		<NoMetamask />
	{/if}
	<FAQ />
	<Footer />
</main>

<style>
	.bg {
		background: #181425;
	}

	main {
		background: #262b44;
	}

	:global(body) {
		padding: 0px;
		background: #181425;
		color: #ffffff;
	}

	:global(.box) {
		border: 2px solid;
		border-color: #5a6988 !important;
		background-color: #3a4466 !important;
		border-left: 18px solid #5a6988 !important;
		padding: 1rem;
		margin-bottom: 1rem;
		box-shadow: 8px 8px #181425;
	}

	:global(.button) {
		border: 2px solid;
		border-color: #5a6988 !important;
		background-color: #5a6988;
		color: #181425;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}
</style>
