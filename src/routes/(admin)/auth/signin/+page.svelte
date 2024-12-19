<script lang="ts">
	import { goto } from '$app/navigation';
	import '$src/styles/app.css';
	import '$src/styles/google.css';

	import GoogleIcon from '$lib/icons/Google.svelte?raw';
	import EnvelopeIcon from '$lib/icons/Envelope.svelte?raw';
	import KeyIcon from '$lib/icons/Key.svelte?raw';

	let { data } = $props();
	let { supabase } = $derived(data);

	const signInWithGoogle = async () => {
		console.log('SignIn with Google');
		await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				// NOTE: Must match setting in Supabase Redirect URLs exactly or it will go to "/"
				redirectTo: 'http://localhost:5173/auth/callback'
			}
		});
	};

	let email = $state('');
	let password = $state('');

	const signInWithPassword = async () => {
		console.log('SignIn with Password');
		const { error } = await supabase.auth.signInWithPassword({ email, password });
		if (error) {
			console.error(error);
			goto('/auth/error');
		} else {
			goto('/app');
		}
	};
</script>

<div class="card w-72 sm:w-96 bg-base-100 shadow-xl">
	<div class="card-body">
		<h2 class="card-title text-2xl font-bold mb-6">Sign in</h2>
		<button class="gsi-material-button" onclick={signInWithGoogle}>
			<div class="gsi-material-button-state"></div>
			<div class="gsi-material-button-content-wrapper">
				<div class="gsi-material-button-icon">
					{@html GoogleIcon}
				</div>
				<span class="gsi-material-button-contents">Sign in with Google</span>
			</div>
		</button>
		<div class="divider">OR</div>
		<!-- NOTE: Need to put this in a form or Chrome will complain about the PW field -->
		<form>
			<div class="form-control">
				Email
				<label class="input input-bordered flex items-center gap-2">
					<div class="scale-75">{@html EnvelopeIcon}</div>
					<input
						name="email"
						bind:value={email}
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
						bind:value={password}
						type="password"
						class="grow"
						autocomplete="current-password"
						placeholder="Password"
					/>
				</label>
			</div>
		</form>
		<!-- NOTE: Button must stay outside form or data will be visible as URL params when clicked -->
		<div class="form-control mt-6">
			<button class="btn btn-primary" onclick={signInWithPassword}> Sign in </button>
		</div>
		<div class="text-center text-sm mt-4">
			<p>Don't have an account?</p>
			<a href="/auth/signup" class="link link-primary">Sign up</a>
		</div>
		<div class="text-center text-sm">
			<p>Forgot your password?</p>
			<a href="/auth/recover" class="justify-end link link-primary">Recover</a>
		</div>
	</div>
</div>
