import { redirect } from '@sveltejs/kit';

export const actions = {
	updateProfile: async ({ locals: { safeGetSession, supabase }, request }) => {
		const form = await request.formData();
		const website = form.get('website') as string;
		const userName = form.get('userName') as string;
		const companyName = form.get('companyName') as string;
		const { session } = await safeGetSession();
		const { error } = await supabase
			.from('profiles')
			.update({
				user_name: userName as string,
				company_name: companyName as string,
				website: website as string
			})
			.eq('id', session?.user.id);
		if (error == null) {
			redirect(302, '/app/account');
		}
		console.error(error);
		redirect(302, '/app');
	}
};
