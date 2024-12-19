import type { Session } from '@supabase/supabase-js';

export const getUserId = (session: Session) => {
	if (session && session.user) {
		return session.user.id;
	}
	return null;
};
