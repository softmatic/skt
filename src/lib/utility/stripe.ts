// cf.: https://github.com/kilroyjones/sveltekit-stripe-demo (mod.)

import { Stripe } from 'stripe';
import { findPlan, findPriceInterval } from '$lib/utility/plans';
import { PUBLIC_DOMAIN, PUBLIC_STRIPE_API_KEY } from '$env/static/public';
import { PRIVATE_STRIPE_API_KEY } from '$env/static/private';

export interface SubscriptionStatus {
	plan: string;
	status: string;
	interval: string;
	canceled: boolean;
}

let stripe: Stripe | undefined;

const getSession = async (sessionId: string): Promise<Stripe.Checkout.Session | undefined> => {
	if (stripe) {
		try {
			return await stripe.checkout.sessions.retrieve(sessionId);
		} catch (error: any) {
			console.error(error);
		}
	}
};

const getSubscription = async (
	subscriptionId: string
): Promise<Stripe.Subscription | undefined> => {
	if (stripe) {
		try {
			return await stripe.subscriptions.retrieve(subscriptionId);
		} catch (error: any) {
			console.error(error);
		}
	}
};

const getSubscriptionStatus = async (
	subscriptionId: string
): Promise<SubscriptionStatus | undefined> => {
	if (stripe) {
		try {
			const subscription: any = await getSubscription(subscriptionId);
			if (subscription) {
				let plan = findPlan(subscription.plan.product);
				if (plan) {
					let interval = findPriceInterval(plan, subscription.plan.id);
					let status: SubscriptionStatus = {
						status: subscription.status,
						plan: plan.name,
						interval: interval,
						canceled: subscription.canceled_at != null
					};
					return status;
				}
			}
		} catch (error: any) {
			console.error(error);
		}
	}
};

const subscribe = async (
	priceId: string,
	userId: string
): Promise<Stripe.Checkout.Session | undefined> => {
	if (stripe) {
		try {
			return await stripe.checkout.sessions.create({
				ui_mode: 'embedded',
				line_items: [
					{
						price: priceId,
						quantity: 1
					}
				],
				mode: 'subscription',
				// NOTE: We append the user id so that the callback in subscribed/+page.server.ts can update the entry in 'users' table
				return_url:
					`${PUBLIC_DOMAIN}/subscribed?session_id={CHECKOUT_SESSION_ID}&userId=` + userId
			});
		} catch (error: any) {
			console.error(error);
		}
	}
};

const initializeStripe = async (): Promise<boolean> => {
	if (PRIVATE_STRIPE_API_KEY && PUBLIC_STRIPE_API_KEY) {
		stripe = new Stripe(PRIVATE_STRIPE_API_KEY);
		return true;
	}
	return false;
};

(async () => {
	const result = await initializeStripe();
	if (!result) {
		console.error('Stripe initialization error');
	}
})();

export const StripeService = {
	stripe,
	getSession,
	getSubscription,
	getSubscriptionStatus,
	subscribe
};
