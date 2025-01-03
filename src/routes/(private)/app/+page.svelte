<script lang="ts">
	let { data } = $props();
	let { subscriptionStatus } = $derived(data);
</script>

<svelte:head>
	<title>App</title>
</svelte:head>

<div class="flex grow bg-gray-50 dark:bg-gray-900">
	<div class="flex flex-col m-auto items-center space-y-4">
		<h1>App</h1>
		<p>App content here</p>
	</div>
</div>
