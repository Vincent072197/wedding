import { createClient } from "@supabase/supabase-js";

export const supabaseBrowser = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, // 前綴是 NEXT_PUBLIC_，這樣 Next.js 才會把這兩個變數傳給瀏覽器。
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // 前綴是 NEXT_PUBLIC_，這樣 Next.js 才會把這兩個變數傳給瀏覽器。
);
