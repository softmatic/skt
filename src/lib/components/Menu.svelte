<script lang="ts">
	import { getUserId } from '../utility/helper';
	let { currentPage, dropdown, session } = $props();
</script>

<ul
	class:dropdown-content={dropdown}
	class="menu rounded bg-base-100 shadow-xl m-2 sm:shadow-none sm:bg-transparent sm:menu-horizontal sm:justify-end sm:space-x-2 sm:w-full sm:p-1 sm:m-0 sm:mr-2"
>
	<li>
		<a
			class="dark:hover:bg-slate-600"
			class:bg-gray-300={currentPage == 'signin'}
			class:dark:bg-slate-600={currentPage == 'signin'}
			href="/app">{getUserId(session) ? 'Launch' : 'Sign in'}</a
		>
	</li>
	<li>
		<a
			class="dark:hover:bg-slate-600"
			class:bg-gray-300={currentPage == 'pricing'}
			class:dark:bg-slate-600={currentPage == 'pricing'}
			href="/pricing">Pricing</a
		>
	</li>
	<li>
		<a
			class="dark:hover:bg-slate-600"
			class:bg-gray-300={currentPage == 'about'}
			class:dark:bg-slate-600={currentPage == 'about'}
			href="/about">About</a
		>
	</li>
	<li>
		<a
			class="dark:hover:bg-slate-600"
			class:bg-gray-300={currentPage == 'contact'}
			class:dark:bg-slate-600={currentPage == 'contact'}
			href="/contact">Contact</a
		>
	</li>
</ul>
