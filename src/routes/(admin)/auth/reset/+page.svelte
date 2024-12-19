<script lang="ts">
	import { goto } from '$app/navigation';

	import KeyIcon from '$lib/icons/Key.svelte?raw';

	let { data } = $props();
	let { supabase } = $derived(data);

	let password = $state('');

	const update = async () => {
		await supabase.auth.updateUser({ password: password });
		goto('/auth/signin');
	};
</script>

<div class="flex grow bg-gray-50 dark:bg-gray-900">
	<div class="m-auto">
		<div class="card w-72 sm:w-96 bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title text-2xl font-bold mb-2">New password</h2>
				<form>
					<div class="form-control mt-4">
						Password
						<label class="input input-bordered flex items-center gap-2">
							<div class="scale-75">{@html KeyIcon}</div>
							<input
								name="password"
								bind:value={password}
								type="password"
								class="grow"
								placeholder="Password"
							/>
						</label>
					</div>
				</form>
				<button class="btn btn-primary mt-4" onclick={update}>Submit</button>
			</div>
		</div>
	</div>
</div>
