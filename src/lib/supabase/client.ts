import { createBrowserClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import { Database } from "./database-types";

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      realtime: {
        params: {
          eventsPerSecond: 0, // 禁用实时功能以避免WebSocket连接问题
        },
      },
      global: {
        fetch: (url, options = {}) => {
          options.cache = "no-store"; // 防止缓存问题

          // Add authorization header for public access
          if (!options.headers) {
            options.headers = {};
          }

          // Ensure proper object structure for headers
          if (
            !(options.headers instanceof Headers) &&
            typeof options.headers !== "object"
          ) {
            options.headers = {};
          }

          // Add the authorization header with the anon key
          const headers = options.headers as Record<string, string>;
          if (!headers["apikey"]) {
            headers["apikey"] = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
          }

          return fetch(url, options);
        },
      },
    }
  );
}

export function createServerClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
