<script lang="ts">
	import '$src/styles/app.css';
	import { plans } from '$lib/utility/plans';
	import PlanCard from '$src/lib/components/PlanCard.svelte';

	let { data } = $props();
	let { status, session } = $derived(data);
</script>

<svelte:head>
	<title>Pricing</title>
</svelte:head>

<div class="flex flex-col grow items-center bg-gray-50 dark:bg-gray-900">
	<div>
		<div class="m-auto text-center space-y-4">
			<h1>Pricing</h1>
			<p>Pricing introduction here</p>
		</div>
		<div
			class="flex flex-col space-y-16 mt-24 mb-4 lg:flex-row lg:space-y-0 lg:space-x-8 m-auto"
		>
			{#each plans as plan}
				<PlanCard {plan} {status} {session} />
			{/each}
		</div>
	</div>
</div>
