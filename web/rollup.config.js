import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';
import json from "@rollup/plugin-json";
import dotenv from "dotenv"
import replace from '@rollup/plugin-replace';


import sveltePreprocess from 'svelte-preprocess';
const svelteConfig = require('./svelte.config.js');

const production = !process.env.ROLLUP_WATCH;

dotenv.config()

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

export default {
	input: 'src/main.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'public/build/bundle.js'
	},
	plugins: [
		replace({
			CONFIG_NETWORK: JSON.stringify(process.env.NETWORK),
			CONFIG_NETWORK_ID: JSON.stringify(process.env.NETWORK_ID),
			CONFIG_ENDPOINT: JSON.stringify(process.env.ENDPOINT),
			CONFIG_IPFS_AUTH: JSON.stringify(process.env.IPFS_AUTH),
			CONFIG_MARKETPLACE: JSON.stringify(process.env.MARKETPLACE),
			CONFIG_ETHERSCAN: JSON.stringify(process.env.ETHERSCAN),
		}),
		svelte({
			...svelteConfig,
			compilerOptions: {
				// enable run-time checks when not in production
				dev: !production
			},
			preprocess: sveltePreprocess({ postcss: true })
		}),
		// we'll extract any component CSS out into
		// a separate file - better for performance
		css({ output: 'bundle.css' }),

		json(),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		commonjs(),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],
	watch: {
		clearScreen: false
	}
};
