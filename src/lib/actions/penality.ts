"use server";

import { supabase } from '@/lib/supabase';

export const createOrUpdate = async (model: any) => {
  try {
    const { data: result, error } = await supabase
      .from('penalties')
      .upsert(model)
      .select()
      .single();

    if (error) throw error;
    return result;
  } catch (error) {
    console.error('Error creating/updating penalty:', error);
    throw error;
  }
}

export const deletePenalty = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('penalties')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error deleting penalty:', error);
    throw error;
  }
}
