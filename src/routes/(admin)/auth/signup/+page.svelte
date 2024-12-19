<script lang="ts">
	import '$src/styles/app.css';

	import EnvelopeIcon from '$lib/icons/Envelope.svelte?raw';
	import KeyIcon from '$lib/icons/Key.svelte?raw';
</script>

<div class="flex grow bg-gray-50 dark:bg-gray-900">
	<div class="m-auto">
		<div class="card w-72 sm:w-96 bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title text-2xl font-bold mb-6">Sign up</h2>
				<form method="POST" action="?/signup">
					<div class="form-control">
						Email
						<label class="input input-bordered flex items-center gap-2">
							<div class="scale-75">{@html EnvelopeIcon}</div>
							<input
								name="email"
								type="email"
								class="grow"
								autocomplete="username"
								placeholder="email@example.com"
							/>
						</label>
					</div>
					<div class="form-control mt-4">
						Password
						<label class="input input-bordered flex items-center gap-2">
							<div class="scale-75">{@html KeyIcon}</div>
							<input
								name="password"
								type="password"
								class="grow"
								autocomplete="current-password"
								placeholder="Password"
							/>
						</label>
					</div>
					<div class="form-control mt-6">
						<button class="btn btn-primary"> Sign up </button>
					</div>
				</form>
				<div class="text-center p-4">
					<p>Please check your email and click the confirmation link.</p>
				</div>
			</div>
		</div>
	</div>
</div>
