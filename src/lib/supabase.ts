import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase Environment Variables')
}

// Dynamic fetch wrapper that injects Clerk token automatically
const customFetch = async (url: RequestInfo | URL, options: RequestInit = {}) => {
  // Access global window.Clerk object provided by Clerk Provider
  const clerk = (window as any).Clerk;
  
  const headers = new Headers(options?.headers);
  
  if (clerk && clerk.session) {
    try {
      // Fetch the Supabase-specific JWT
      const token = await clerk.session.getToken({ template: 'supabase' });
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    } catch (e) {
      console.warn("Failed to get Clerk Supabase token", e);
    }
  }

  return fetch(url, { ...options, headers });
};

// Unified client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: customFetch
  }
})
