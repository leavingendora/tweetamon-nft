import App from './App.svelte';

const config = {
	network: CONFIG_NETWORK,
	network_id: CONFIG_NETWORK_ID,
	endpoint: CONFIG_ENDPOINT,
	ipfs_auth: CONFIG_IPFS_AUTH,
	marketplace: CONFIG_MARKETPLACE,
	etherscan: CONFIG_ETHERSCAN
}

const app = new App({
	target: document.body,
	props: {
		config: config
	},

});

export default app;