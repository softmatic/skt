// cf.: https://github.com/kilroyjones/sveltekit-stripe-demo

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ cookies }) => {
	const clientSecret = cookies.get('client-secret');
	if (clientSecret) {
		return {
			clientSecret
		};
	}
	return {};
};
