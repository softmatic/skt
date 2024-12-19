// cf.: https://github.com/kilroyjones/sveltekit-stripe-demo (mod.)

import type { PageServerLoad } from './$types';
import type Stripe from 'stripe';
import { redirect } from '@sveltejs/kit';
import { StripeService } from '$src/lib/utility/stripe';

export const load: PageServerLoad = async ({ locals: { supabaseServiceRole }, url }) => {
	const userId = url.searchParams.get('userId');
	if (userId == null) {
		redirect(302, '/error');
	}

	const sessionId = url.searchParams.get('session_id');
	if (sessionId == null) {
		redirect(302, '/error');
	}

	const session = await StripeService.getSession(sessionId);
	if (session?.payment_status != 'paid') {
		redirect(302, '/error');
	}

	const subscription = (await StripeService.getSubscription(
		session.subscription as string
	)) as Stripe.Subscription;

	const { error } = await supabaseServiceRole
		.from('users')
		.update({
			updated: new Date().toISOString(),
			stripe_customerid: session.customer as string,
			stripe_subscriptionid: session.subscription as string,
			stripe_subscriptionstartdate: new Date().toISOString(),
			stripe_subscriptionstatus: subscription.status as string
		})
		.eq('id', userId);
	if (error == null) {
		console.log("Subscribed, updated 'users' table");
		return {};
	}
	console.error(error);
	redirect(302, '/error');
};
