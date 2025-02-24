// import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "hhttps://hzbsawrxgxtqxlnmgmlm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6YnNhd3J4Z3h0cXhsbm1nbWxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0MDIzMzUsImV4cCI6MjA1NTk3ODMzNX0.l2yvLiTPaEzuIWDpqfrYGAjcS1clCwsG7wf9jNa7X80";

// export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
window.supabaseClient = supabase;
