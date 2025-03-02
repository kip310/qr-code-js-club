import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm"; 

const SUPABASE_URL = "https://hzbsawrxgxtqxlnmgmlm.supabase.co";  
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6YnNhd3J4Z3h0cXhsbm1nbWxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5MDA3ODUsImV4cCI6MjA1NjQ3Njc4NX0.ld6LnR0qXCamIgV_mQDLoBsR4h4kd66S3eSwWDAFO48"; 

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export {supabase}; 

