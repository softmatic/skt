import type { PageServerLoad } from './$types';
import type { SubscriptionStatus } from '$lib/utility/stripe';
import { redirect } from '@sveltejs/kit';
import { StripeService } from '$lib/utility/stripe';

export const load: PageServerLoad = async ({
	locals: { safeGetSession, supabaseServiceRole },
	cookies
}) => {
	const { session } = await safeGetSession();

	const { error, data } = await supabaseServiceRole
		.from('users')
		.select(`*`)
		.eq('id', session?.user.id)
		.single();

	let status: SubscriptionStatus | undefined = undefined;
	if (error == null && data.stripe_subscriptionid) {
		status = await StripeService.getSubscriptionStatus(data.stripe_subscriptionid);
	}
	return {
		session,
		status,
		cookies: cookies.getAll()
	};
};

export const actions = {
	subscribe: async ({ request, cookies }) => {
		const form = await request.formData();
		const priceId = form.get('priceId') as string;
		const userId = form.get('userId') as string;
		const session = await StripeService.subscribe(priceId, userId);

		if (session?.client_secret) {
			cookies.set('client-secret', session.client_secret, {
				path: '/',
				httpOnly: true,
				secure: true
			});
			redirect(302, '/checkout');
		}
		redirect(302, '/error');
	},

	toSignIn: async ({}) => {
		redirect(302, '/auth/signin');
	},
	toApp: async ({}) => {
		redirect(302, '/app');
	},
	toContact: async ({}) => {
		redirect(302, '/contact');
	}
};
