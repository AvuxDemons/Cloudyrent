"use server";

import { supabase } from '@/lib/supabase';

export const createOrUpdate = async (model: any) => {
  try {
    const { data: result, error } = await supabase
      .from('wishlist')
      .upsert(model)
      .select()
      .single();

    if (error) throw error;
    return result;
  } catch (error) {
    console.error('Error creating/updating wishlist:', error);
    throw error;
  }
}

export const deleteWishlist = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('wishlist')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error deleting wishlist:', error);
    throw error;
  }
}
