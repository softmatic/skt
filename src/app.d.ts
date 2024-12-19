import type { Session, SupabaseClient, User } from '@supabase/supabase-js'

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			// cf.: https://supabase.com/docs/guides/auth/server-side/sveltekit (mod.) 
			supabase: SupabaseClient
			supabaseServiceRole: SupabaseClient
			safeGetSession: () => Promise<{ session: Session | null; user: User | null }>
			session: Session | null
			user: User | null
		  }
		  interface PageData {
			session: Session | null
		  }
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
