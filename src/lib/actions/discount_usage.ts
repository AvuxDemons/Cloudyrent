"use server";

import { supabase } from '@/lib/supabase';

export const createOrUpdate = async (model: any) => {
  try {
    const { data: result, error } = await supabase
      .from('discount_usage')
      .upsert(model)
      .select()
      .single();

    if (error) throw error;
    return result;
  } catch (error) {
    console.error('Error creating/updating discountUsage:', error);
    throw error;
  }
}

export const deleteDiscountUsage = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('discount_usage')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error deleting discountUsage:', error);
    throw error;
  }
}
