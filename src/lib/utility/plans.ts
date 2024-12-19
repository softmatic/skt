export interface Plan {
	id: string;
	name: string;
	description: string;
	popular: string;
	price: Array<string> | null;
	priceIntervalName: Array<string> | null;
	priceId: Array<string> | null;
	productId: string | null;
	features: Array<string>;
}

export const plans: Plan[] = [
	{
		id: 'free',
		name: 'Free',
		description: 'Free plan description',
		popular: 'false',
		price: null,
		priceIntervalName: null,
		priceId: null,
		productId: null,
		features: ['Feature 1', 'Feature 2', 'Feature 3']
	},
	{
		id: 'core',
		name: 'Core',
		description: 'Core plan description.',
		popular: 'true',
		price: ['$9.99', '$99.99'],
		priceIntervalName: ['monthly', 'yearly'],
		priceId: ['price_1QSdXlEIoDgScXMg0KHwWiDH', 'price_1QSdXlEIoDgScXMgrEfsS170'],
		productId: 'prod_RLKCfgua9ZWSiN',
		features: ['Everything in Free', 'Core Feature 1', 'Core Feature 2']
	},
	{
		id: 'pro',
		name: 'Pro',
		description: 'Pro plan description.',
		popular: 'false ',
		price: ['$29.99', '$199.99'],
		priceIntervalName: ['monthly', 'yearly'],
		priceId: ['price_1QWDY6EIoDgScXMgZk4Apq3J', 'price_1QWDY6EIoDgScXMgP3qR1Wc4'],
		productId: 'prod_RP1bsXIDPxf5O0',
		features: ['Everything in Core', 'Pro Feature 1', 'Pro Feature 2']
	}
];

export const findPlan = (productId: string) => {
	let filtered = plans.filter((plan) => plan.productId == productId);
	if (filtered) {
		return filtered[0];
	}
	return null;
};

export const findPriceInterval = (plan: Plan, priceId: string) => {
	if (plan.priceId && plan.priceIntervalName) {
		let index = plan.priceId.indexOf(priceId);
		if (index >= 0) {
			return plan.priceIntervalName[index];
		}
	}
	return '';
};
