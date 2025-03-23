/* eslint-disable import/prefer-default-export */

import { createBrowserClient } from "@supabase/ssr";

import { Database } from "./types";

export function createClient() {
  return createBrowserClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );
}
