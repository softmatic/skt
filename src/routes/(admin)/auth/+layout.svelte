<script lang="ts">
	import HomeIcon from '$lib/icons/Home.svelte?raw';

	import { PUBLIC_PROJECT } from '$env/static/public';

	let { children } = $props();
</script>

<div class="flex flex-row grow bg-gray-50 dark:bg-gray-900 sm:divide-x">
	<div class="m-auto space-y-4 sm:ml-24 sm:mr-24 sm:mb-auto sm:mt-auto">
		<div class="absolute top-4">
			<a href="/" aria-label="Home">
				{@html HomeIcon}
			</a>
		</div>
		{@render children()}
	</div>
	<div class="w-full bg-gradient-to-br to-purple-900 from-slate-900 via-slate-900 hide-sm">
		<div class="m-auto h-full text-center content-center space-y-8 text-white">
			<h1>{PUBLIC_PROJECT}</h1>
			<h2>Features</h2>
			<ul class="space-y-8">
				<li>Feature 1</li>
				<li>Feature 2</li>
				<li>Feature 3</li>
			</ul>
		</div>
	</div>
</div>
