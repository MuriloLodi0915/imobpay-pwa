import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://snbrhrwdzccoijhvdmrv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNuYnJocndkemNjb2lqaHZkbXJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwMDMzNDIsImV4cCI6MjA2NjU3OTM0Mn0.y3qK8ODTpXfy5OfUwEQrpQtxoqCHNWW-dekXDq8zuus';
export const supabase = createClient(supabaseUrl, supabaseKey); 