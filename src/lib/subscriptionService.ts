import { supabase } from './supabase';

/**
 * Updates the price and renewal date of a subscription row by its ID.
 * RLS ensures only the owning user can mutate their own rows.
 */
export async function updateSubscription(id: string, newPrice: number, newDate: string): Promise<void> {
  const { error } = await supabase
    .from('subscriptiontable')
    .update({ pricenaira: newPrice, renewaldatestring: newDate })
    .eq('id', id);

  if (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }
}

/**
 * Deletes a subscription row by its ID.
 * RLS ensures only the owning user can delete their own rows.
 */
export async function deleteSubscription(id: string): Promise<void> {
  const { error } = await supabase
    .from('subscriptiontable')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting subscription:', error);
    throw error;
  }
}
