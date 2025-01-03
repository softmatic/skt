<!-- cf.: https://github.com/kilroyjones/sveltekit-stripe-demo (mod.) -->

<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { loadStripe } from '@stripe/stripe-js';

	import { PUBLIC_STRIPE_API_KEY } from '$env/static/public';

	let { data } = $props();

	onMount(async () => {
		const stripe = await loadStripe(PUBLIC_STRIPE_API_KEY);
		const clientSecret = data.clientSecret;
		if (stripe && clientSecret) {
			const checkout = await stripe.initEmbeddedCheckout({
				clientSecret
			});

			if (checkout) {
				checkout.mount('#checkout');
				return;
			}
		}
		goto('/error');
	});
</script>

<svelte:head>
	<title>Checkout</title>
</svelte:head>

<div class="flex items-center justify-center min-h-screen py-12">
	<div class="p-8 rounded-lg shadow-xl">
		<div id="checkout"></div>
	</div>
</div>
