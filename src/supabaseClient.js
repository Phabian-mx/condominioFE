import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://npcszvkkxwffoposogqa.supabase.co';


const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5wY3N6dmtreHdmZm9wb3NvZ3FhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MDgwNDMsImV4cCI6MjA4NTE4NDA0M30.ikvp0mtFTYNz_agX36Nr72PgNg3lhqnLzp4y8JdJibI';

export const supabase = createClient(supabaseUrl, supabaseKey);