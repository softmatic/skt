import type { LayoutServerLoad } from './$types';
import type { SubscriptionStatus } from '$lib/utility/stripe';
import { StripeService } from '$lib/utility/stripe';

export const load: LayoutServerLoad = async ({
	locals: { safeGetSession, supabase, supabaseServiceRole },
	cookies
}) => {
	const { session } = await safeGetSession();
	const { data: profile } = await supabase
		.from('profiles')
		.select(`*`)
		.eq('id', session?.user.id)
		.single();

	const { error, data } = await supabaseServiceRole
		.from('users')
		.select(`*`)
		.eq('id', session?.user.id)
		.single();

	let subscriptionStatus: SubscriptionStatus | undefined = undefined;
	if (data.stripe_subscriptionid) {
		subscriptionStatus = await StripeService.getSubscriptionStatus(data.stripe_subscriptionid);
		if (subscriptionStatus) {
			const { error } = await supabaseServiceRole
				.from('users')
				.update({
					stripe_subscriptionstatus: subscriptionStatus.status as string,
					updated: new Date().toISOString()
				})
				.eq('id', session?.user.id);
			if (error) {
				console.error(error);
			}
		}
	} else {
		if (error) {
			console.error(error);
		}
	}
	return {
		session,
		profile,
		subscriptionStatus,
		cookies: cookies.getAll()
	};
};
