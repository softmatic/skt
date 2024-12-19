import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PRIVATE_STRIPE_WHSECRET } from '$env/static/private';
import { StripeService } from '$src/lib/utility/stripe';

// Stripe webhook. Use this to handle subscription events.
// Unused with the embedded Stripe checkout

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.text();

	const signature = request.headers.get('stripe-signature') ?? '';

	try {
		const event = StripeService.stripe?.webhooks.constructEvent(
			body,
			signature,
			PRIVATE_STRIPE_WHSECRET
		);
		console.log(event);
	} catch (error) {
		console.error(error);
	}
	return json({ success: true });
};
