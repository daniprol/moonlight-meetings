import { supabase } from '@/integrations/supabase/client';
import type { IDataProvider, NewReview, NewStone, Profile, Review, Stone } from './interface';
import { v4 as uuidv4 } from 'uuid';

async function getProfileByAuthUserId(authUserId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', authUserId)
    .maybeSingle();
  if (error) {
    console.error('getProfileByAuthUserId error', error);
    return null;
  }
  return data as unknown as Profile | null;
}

class SupabaseDataProvider implements IDataProvider {
  async getStoneById(id: string): Promise<Stone | null> {
    const { data, error } = await supabase
      .from('stones')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) {
      console.error('getStoneById error', error);
      return null;
    }
    return data as unknown as Stone | null;
  }

  async findStones(query: string): Promise<Stone[]> {
    let sb = supabase.from('stones').select('*');
    if (query && query.trim()) {
      const q = `%${query.trim()}%`;
      sb = sb.or(`name.ilike.${q},address_text.ilike.${q}`);
    }
    const { data, error } = await sb;
    if (error) {
      console.error('findStones error', error);
      return [];
    }
    return (data || []) as unknown as Stone[];
  }

  async getTopRatedStones(limit: number): Promise<Stone[]> {
    const { data, error } = await supabase
      .from('stones')
      .select('*')
      .order('average_rating', { ascending: false })
      .limit(limit);
    if (error) {
      console.error('getTopRatedStones error', error);
      return [];
    }
    return (data || []) as unknown as Stone[];
  }

  async addStone(stoneData: NewStone, photos: File[], authUserId: string): Promise<Stone> {
    const profile = await getProfileByAuthUserId(authUserId);
    if (!profile) throw new Error('Profile not found for current user');

    const insertPayload = {
      name: stoneData.name,
      description: stoneData.description ?? null,
      latitude: stoneData.latitude ?? null,
      longitude: stoneData.longitude ?? null,
      address_text: stoneData.address_text ?? null,
      creator_id: profile.id,
    };

    const { data, error } = await supabase
      .from('stones')
      .insert(insertPayload)
      .select('*')
      .single();

    if (error || !data) {
      console.error('addStone error', error);
      throw new Error('Failed to add stone');
    }

    const stone = data as unknown as Stone;

    // Upload photos
    for (const file of photos) {
      const path = `${profile.user_id}/${uuidv4()}-${file.name}`;
      const { error: upErr } = await supabase.storage
        .from('stone-photos')
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false,
        });
      if (upErr) {
        console.error('photo upload error', upErr);
        continue; // don't fail whole flow
      }
      const { error: insertPhotoErr } = await supabase
        .from('photos')
        .insert({ stone_id: stone.id, uploader_id: profile.id, storage_path: path });
      if (insertPhotoErr) {
        console.error('insert photo row error', insertPhotoErr);
      }
    }

    return stone;
  }

  async getReviewsForStone(stoneId: string): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('stone_id', stoneId)
      .order('created_at', { ascending: false });
    if (error) {
      console.error('getReviewsForStone error', error);
      return [];
    }
    return (data || []) as unknown as Review[];
  }

  async addReview(reviewData: NewReview, authUserId: string): Promise<Review> {
    const profile = await getProfileByAuthUserId(authUserId);
    if (!profile) throw new Error('Profile not found for current user');

    const { data, error } = await supabase
      .from('reviews')
      .insert({
        stone_id: reviewData.stone_id,
        rating: reviewData.rating,
        comment: reviewData.comment ?? null,
        user_id: profile.id,
      })
      .select('*')
      .single();
    if (error || !data) {
      console.error('addReview error', error);
      throw new Error('Failed to add review');
    }
    return data as unknown as Review;
  }

  async getUserProfile(authUserId: string): Promise<Profile | null> {
    return await getProfileByAuthUserId(authUserId);
  }

  async getFavoriteStones(authUserId: string): Promise<Stone[]> {
    const profile = await getProfileByAuthUserId(authUserId);
    if (!profile) return [];

    const { data, error } = await supabase
      .from('favorites')
      .select('stone_id, stones!inner(*)')
      .eq('user_id', profile.id);

    if (error) {
      console.error('getFavoriteStones error', error);
      return [];
    }

    const stones = (data || []).map((row: any) => row.stones) as Stone[];
    return stones;
  }

  async addFavorite(authUserId: string, stoneId: string): Promise<void> {
    const profile = await getProfileByAuthUserId(authUserId);
    if (!profile) throw new Error('Profile not found for current user');
    const { error } = await supabase
      .from('favorites')
      .insert({ user_id: profile.id, stone_id: stoneId });
    if (error) throw error;
  }

  async removeFavorite(authUserId: string, stoneId: string): Promise<void> {
    const profile = await getProfileByAuthUserId(authUserId);
    if (!profile) throw new Error('Profile not found for current user');
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', profile.id)
      .eq('stone_id', stoneId);
    if (error) throw error;
  }
}

export const dataProvider: IDataProvider = new SupabaseDataProvider();
