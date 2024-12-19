import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [sveltekit()],

	// // https://stackoverflow.com/a/77430525
	// optimizeDeps: {
    //     esbuildOptions: {
    //         loader: {
    //             ".svg": "text",
    //         },
    //     },
    // },
});
