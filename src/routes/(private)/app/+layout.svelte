<script lang="ts">
	import '$src/styles/app.css';
	import { page } from '$app/stores';

	import UserIcon from '$lib/icons/UserDark.svelte?raw';
	import CogIcon from '$lib/icons/CogDark.svelte?raw';
	import HomeIcon from '$lib/icons/HomeDark.svelte?raw';
	import ExitIcon from '$lib/icons/ExitDark.svelte?raw';

	let { children } = $props();
	let currentPage = $derived($page.url.pathname.split('/').filter(Boolean).pop());
</script>

<div class="drawer drawer-open">
	<!-- NOTE: Toggle unused but req'd for the drawer to show -->
	<input type="checkbox" class="drawer-toggle" />
	<div class="drawer-content flex flex-col min-h-full dark:bg-gray-900">
		{@render children()}
	</div>
	<div class="drawer-side z-50 shadow-[rgba(0,0,0,0.3)_3px_0px_4px_0px]">
		<div class="menu menu-xs sm:menu-sm min-h-full bg-slate-800">
			<ul class="top-2 space-y-2">
				<li>
					<a class:hover:bg-slate-700={true} href="/" aria-label="Exit">
						{@html ExitIcon}
					</a>
				</li>
			</ul>
			<ul class="absolute bottom-2 space-y-2">
				<li>
					<a
						class:hover:bg-slate-700={currentPage != 'app'}
						class:hover:bg-red-800={currentPage == 'app'}
						class:bg-red-800={currentPage == 'app'}
						href="/app"
						aria-label="Home"
					>
						{@html HomeIcon}
					</a>
				</li>
				<li>
					<a
						class:hover:bg-slate-700={currentPage != 'account'}
						class:hover:bg-red-800={currentPage == 'account'}
						class:bg-red-800={currentPage == 'account'}
						href="/app/account"
						aria-label="App"
					>
						{@html UserIcon}
					</a>
				</li>
				<li>
					<a
						class:hover:bg-slate-700={currentPage != 'settings'}
						class:hover:bg-red-800={currentPage == 'settings'}
						class:bg-red-800={currentPage == 'settings'}
						href="/app/settings"
						aria-label="Settings"
					>
						{@html CogIcon}
					</a>
				</li>
			</ul>
		</div>
	</div>
</div>
