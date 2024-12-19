<script lang="ts">
	import '$src/styles/app.css';
	import { page } from '$app/stores';
	import Menu from '$src/lib/components/Menu.svelte';
	import HamburgerIcon from '$lib/icons/Hamburger.svelte?raw';

	import { PUBLIC_PROJECT } from '$env/static/public';

	let { data, children } = $props();
	let { session } = $derived(data);
	let currentPage = $derived($page.url.pathname.split('/').filter(Boolean).pop());
</script>

<!-- Mobile menu bar -->
<div class="sticky top-0 z-40 bg-base-200 dark:bg-slate-700 hide-xs">
	<div class="flex flex-row grow place-content-between">
		<p class="p-3 font-extrabold"><a href="/">{PUBLIC_PROJECT}</a></p>
		<div class="dropdown dropdown-end dropdown-bottom">
			<div tabindex="0" role="button" class="btn btn-ghost rounded-btn">
				{@html HamburgerIcon}
				<Menu {currentPage} dropdown={true} {session} />
			</div>
		</div>
	</div>
</div>
<!-- Desktop menu bar -->
<div class="sticky top-0 z-50 bg-base-200 dark:bg-slate-700 hide-sm">
	<div class="flex flex-row grow">
		<p class="flex-none p-3 font-extrabold"><a href="/">{PUBLIC_PROJECT}</a></p>
		<Menu {currentPage} dropdown={false} {session} />
	</div>
</div>
{@render children()}
<footer class="footer bg-base-200 dark:bg-slate-700 sticky z-40 bottom-0 justify-end p-3">
	<div>&copy 2024 {PUBLIC_PROJECT}. All rights reserved.</div>
</footer>
