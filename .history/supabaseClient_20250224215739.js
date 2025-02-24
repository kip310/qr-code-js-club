// import { createClient } from "@supabase/supabase-js";

// const SUPABASE_URL = "hhttps://hzbsawrxgxtqxlnmgmlm.supabase.co";
// const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6YnNhd3J4Z3h0cXhsbm1nbWxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0MDIzMzUsImV4cCI6MjA1NTk3ODMzNX0.l2yvLiTPaEzuIWDpqfrYGAjcS1clCwsG7wf9jNa7X80";

// export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
// window.supabaseClient = supabase;

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm"; // ✅ Use ES Module CDN

const SUPABASE_URL = "https://hzbsawrxgxtqxlnmgmlm.supabase.co"; // ✅ Fixed URL
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6YnNhd3J4Z3h0cXhsbm1nbWxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0MDIzMzUsImV4cCI6MjA1NTk3ODMzNX0.l2yvLiTPaEzuIWDpqfrYGAjcS1clCwsG7wf9jNa7X80"; // ✅ Keep your API key

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase; // ✅ Use default export

