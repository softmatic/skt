<script lang="ts">
	import { goto } from '$app/navigation';

	import EnvelopeIcon from '$lib/icons/Envelope.svelte?raw';

	let { data } = $props();
	let { supabase } = $derived(data);

	let email = $state('');

	const reset = async () => {
		const { data, error } = await supabase.auth.resetPasswordForEmail(email);
		goto('/auth/signin');
	};
</script>

<div class="flex grow bg-gray-50 dark:bg-gray-900">
	<div class="m-auto">
		<div class="card w-72 sm:w-96 bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title text-2xl font-bold mb-2">Password recovery</h2>
				<form>
					<div class="form-control mt-4">
						Email
						<label class="input input-bordered flex items-center gap-2">
							<div class="scale-75">{@html EnvelopeIcon}</div>
							<input
								name="email"
								bind:value={email}
								type="email"
								class="grow"
								placeholder="email@example.com"
							/>
						</label>
					</div>
				</form>
				<button class="btn btn-primary mt-4" onclick={reset}>Submit</button>
				<div class="text-center p-4">
					<p>Please check your email and click the link to reset your password.</p>
				</div>
			</div>
		</div>
	</div>
</div>
