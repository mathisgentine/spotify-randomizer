import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export type HistoryItem = {
  spotify_user_id: string;
  created_at: string; // Should be an ISO string for Supabase timestamps
  artist: string;
  name: string;
  image: string;
  type: string;
  link: string;
};

export async function getHistory(spotifyUserId: string): Promise<HistoryItem[]> {
  const { data, error } = await supabase
    .from('history') // The Supabase table for storing history
    .select('*')
    .eq('spotify_user_id', spotifyUserId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching history:', error.message);
    throw new Error('Could not fetch history.');
  }

  return data || [];
}

export async function addHistory(item: HistoryItem): Promise<void> {
  const { error } = await supabase
    .from('history') // The Supabase table for storing history
    .insert([item]);

  if (error) {
    console.error('Error adding history:', error.message);
    throw new Error('Could not add history.');
  }
}

export default supabase;
