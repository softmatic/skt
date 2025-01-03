<script lang="ts">
	import { goto } from '$app/navigation';
	import DialogConfirmAccountDeletion from '$src/lib/components/DialogConfirmAccountDeletion.svelte';
	import { getUserId } from '$src/lib/utility/helper.js';

	import EnvelopeIcon from '$lib/icons/Envelope.svelte?raw';
	import UserIcon from '$lib/icons/User.svelte?raw';
	import GlobeIcon from '$lib/icons/Globe.svelte?raw';
	import CompanyIcon from '$lib/icons/Company.svelte?raw';

	import { PUBLIC_STRIPE_CUSTOMER_PORTAL } from '$env/static/public';

	let confirmDeletionDialog = $state(false);
	let confirmDeletion = $state(false);

	$effect(() => {
		if (confirmDeletion) {
			deleteAccount();
		}
	});

	let { data } = $props();
	let { supabase, profile, subscriptionStatus, session } = $derived(data);
	let modified = $state(false);

	const signOut = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error(error);
		}
		goto('/');
	};
	const deleteAccount = async () => {
		if (session) {
			const userId = getUserId(session);
			const { error } = await supabase.auth.signOut();
			if (!error) {
				const response = await fetch('/auth/delete', {
					method: 'POST',
					body: JSON.stringify({ userId }),
					headers: {
						'content-type': 'application/json'
					}
				});
				let result = await response.json();
				if (result && result.result == 'true') {
					goto('/');
				} else {
					goto('/auth/error');
				}
			}
		}
	};
</script>

<svelte:head>
	<title>Account</title>
</svelte:head>

<div class="flex flex-col m-auto grow p-4 space-y-4 sm:space-y-6 sm:p-8">
	<div class="card w-72 sm:w-96 bg-base-100 shadow-xl">
		<div class="card-body">
			<div class="card-title text-2xl font-bold mb-6">Profile</div>
			<form method="POST" action="?/updateProfile">
				<div class="form-control">
					<p class="mt-4">Email</p>
					<label class="input input-bordered flex items-center gap-2">
						<div class="scale-75">{@html EnvelopeIcon}</div>
						<input disabled value={profile.email} type="email" class="grow" />
					</label>
					<p class="mt-4">Full name</p>
					<label class="input input-bordered flex items-center gap-2">
						<div class="scale-75">{@html UserIcon}</div>
						<input
							name="userName"
							value={profile.user_name}
							onkeyup={() => (modified = true)}
							class="grow"
						/>
					</label>
					<p class="mt-4">Company</p>
					<label class="input input-bordered flex items-center gap-2">
						<div class="scale-75">{@html CompanyIcon}</div>
						<input
							name="companyName"
							value={profile.company_name}
							onkeyup={() => (modified = true)}
							class="grow"
						/>
					</label>
					<p class="mt-4">Website</p>
					<label class="input input-bordered flex items-center gap-2">
						<div class="scale-75">{@html GlobeIcon}</div>
						<input
							name="website"
							value={profile.website}
							onkeyup={() => (modified = true)}
							class="grow"
						/>
					</label>
				</div>
				<button class="w-full btn btn-primary mt-8" disabled={!modified}>Update</button>
			</form>
		</div>
	</div>
	<div class="card w-72 sm:w-96 bg-base-100 shadow-xl">
		<div class="card-body">
			<div class="card-title text-2xl font-bold mb-6">Subscription</div>
			{#if subscriptionStatus == undefined}
				<div class="grid grid-cols-2 gap-4 mb-8">
					<div>Plan:</div>
					<div><span class="font-bold">Free</span></div>
				</div>
				<p><a class="link" href="/pricing">Upgrade</a></p>
			{:else}
				<div class="grid grid-cols-2 gap-4 mb-8">
					<div>Plan:</div>
					<div><span class="font-bold">{subscriptionStatus?.plan}</span></div>
					<div>Billing:</div>
					<div>
						<span class="font-bold" style="text-transform: capitalize"
							>{subscriptionStatus?.interval}</span
						>
					</div>
					<div>Status:</div>
					<div>
						<span class="font-bold" style="text-transform: capitalize"
							>{subscriptionStatus?.status}</span
						>
						{#if subscriptionStatus?.canceled}
							(canceled)
						{/if}
					</div>
				</div>
				<div class="text-center">
					<p>
						<a href={PUBLIC_STRIPE_CUSTOMER_PORTAL} class="link">Manage subscription</a>
					</p>
				</div>
			{/if}
		</div>
	</div>

	<div class="card w-72 sm:w-96 bg-base-100 shadow-xl">
		<div class="card-body">
			<div class="card-title text-2xl font-bold mb-6">Options</div>
			<button class="btn btn-primary w-full mt-4" onclick={signOut}>Sign out</button>
			<button class="btn btn-error w-full mt-8" onclick={() => (confirmDeletionDialog = true)}
				>Delete account</button
			>
		</div>
	</div>
</div>

<DialogConfirmAccountDeletion bind:showModal={confirmDeletionDialog} bind:confirm={confirmDeletion}
></DialogConfirmAccountDeletion>
