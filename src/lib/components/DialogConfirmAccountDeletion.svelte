<script>
	let { showModal = $bindable(), confirm = $bindable() } = $props();
	let dialog = $state();
	$effect(() => {
		if (showModal) {
			dialog.showModal();
		}
	});
</script>

<dialog bind:this={dialog} onclose={() => (showModal = false)} class="rounded-xl shadow-xl">
	<div class="m-auto flex flex-col items-center justify-center z-50 p-8 dark:bg-slate-600">
		<div class="space-y-4 text-center">
			<p class="text-4xl font-bold mb-8">Warning!</p>
			<p class="text-xl">Please confirm that you want to delete your account.</p>
			<p class="text-xl">This action cannot be undone.</p>
		</div>
		<div class="mt-8 flex flex-col space-y-6 sm:flex-row sm:space-y-0 sm:space-x-8">
			<button
				onclick={() => {
					showModal = false;
					confirm = true;
					dialog.close();
				}}
				class="w-56 btn btn-error"
			>
				Delete
			</button>
			<button
				onclick={() => {
					showModal = false;
					confirm = false;
					dialog.close();
				}}
				class="w-56 btn btn-primary"
			>
				Cancel
			</button>
		</div>
	</div>
</dialog>
