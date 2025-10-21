"use server";

import { supabase } from '@/lib/supabase';

export const createOrUpdate = async (model: any) => {
  try {
    const { data: result, error } = await supabase
      .from('payment_accounts')
      .upsert(model)
      .select()
      .single();

    if (error) throw error;
    return result;
  } catch (error) {
    console.error('Error creating/updating paymentAccount:', error);
    throw error;
  }
}

export const deletePaymentAccount = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('payment_accounts')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error deleting paymentAccount:', error);
    throw error;
  }
}
