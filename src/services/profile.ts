import { supabase } from '../lib/supabase';

export const profileService = {
    async getProfile(userId: string) {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
        if (error && error.code !== 'PGRST116') throw error; // PGRST116 is code for 'no rows found'
        return data;
    },

    async updateProfile(userId: string, profile: any) {
        const { data, error } = await supabase
            .from('profiles')
            .upsert({ id: userId, ...profile, updated_at: new Date().toISOString() })
            .select()
            .single();
        if (error) throw error;
        return data;
    }
};
