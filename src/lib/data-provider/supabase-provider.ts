import { supabase } from '@/integrations/supabase/client';
import type { IDataProvider, NewReview, NewStone, Profile, Review, Stone } from './interface';
import { v4 as uuidv4 } from 'uuid';
import { generateThumbnail } from '@/lib/thumbnail-utils';

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
      .select(`
        *,
        photos!inner(thumbnail_path)
      `)
      .eq('id', id)
      .maybeSingle();
    if (error) {
      console.error('getStoneById error', error);
      return null;
    }
    
    if (!data) return null;
    
    // Add the first available thumbnail path to the stone
    const photos = data.photos as any[];
    const thumbnailPath = photos?.find(p => p.thumbnail_path)?.thumbnail_path || null;
    
    return {
      ...data,
      thumbnail_path: thumbnailPath,
      photos: undefined // Remove photos array from final object
    } as unknown as Stone;
  }

  async findStones(query: string): Promise<Stone[]> {
    let sb = supabase.from('stones').select(`
      *,
      photos!left(thumbnail_path)
    `);
    if (query && query.trim()) {
      const q = `%${query.trim()}%`;
      sb = sb.or(`name.ilike.${q},address_text.ilike.${q}`);
    }
    const { data, error } = await sb;
    if (error) {
      console.error('findStones error', error);
      return [];
    }
    
    // Add thumbnail_path to each stone
    return (data || []).map(stone => {
      const photos = stone.photos as any[];
      const thumbnailPath = photos?.find(p => p.thumbnail_path)?.thumbnail_path || null;
      return {
        ...stone,
        thumbnail_path: thumbnailPath,
        photos: undefined
      };
    }) as unknown as Stone[];
  }

  async getTopRatedStones(limit: number): Promise<Stone[]> {
    const { data, error } = await supabase
      .from('stones')
      .select(`
        *,
        photos!left(thumbnail_path)
      `)
      .order('average_rating', { ascending: false })
      .limit(limit);
    if (error) {
      console.error('getTopRatedStones error', error);
      return [];
    }
    
    // Add thumbnail_path to each stone
    return (data || []).map(stone => {
      const photos = stone.photos as any[];
      const thumbnailPath = photos?.find(p => p.thumbnail_path)?.thumbnail_path || null;
      return {
        ...stone,
        thumbnail_path: thumbnailPath,
        photos: undefined
      };
    }) as unknown as Stone[];
  }

  async getStonesByCreator(authUserId: string): Promise<Stone[]> {
    const profile = await getProfileByAuthUserId(authUserId);
    if (!profile) return [];

    const { data, error } = await supabase
      .from('stones')
      .select(`
        *,
        photos!left(thumbnail_path)
      `)
      .eq('creator_id', profile.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('getStonesByCreator error', error);
      return [];
    }
    
    // Add thumbnail_path to each stone
    return (data || []).map(stone => {
      const photos = stone.photos as any[];
      const thumbnailPath = photos?.find(p => p.thumbnail_path)?.thumbnail_path || null;
      return {
        ...stone,
        thumbnail_path: thumbnailPath,
        photos: undefined
      };
    }) as unknown as Stone[];
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

    // Upload photos and generate thumbnails
    for (const file of photos) {
      const fileId = uuidv4();
      const originalPath = `${profile.user_id}/${fileId}-${file.name}`;
      
      // Upload original image
      const { error: upErr } = await supabase.storage
        .from('stone-photos')
        .upload(originalPath, file, {
          cacheControl: '3600',
          upsert: false,
        });
      
      if (upErr) {
        console.error('photo upload error', upErr);
        continue; // don't fail whole flow
      }

      let thumbnailPath: string | null = null;
      let thumbnailWidth: number | null = null;
      let thumbnailHeight: number | null = null;

      // Generate and upload thumbnail
      try {
        const { blob, width, height } = await generateThumbnail(file);
        const thumbPath = `${profile.user_id}/thumb-${fileId}.jpg`;
        
        const { error: thumbUpErr } = await supabase.storage
          .from('stone-thumbnails')
          .upload(thumbPath, blob, {
            cacheControl: '3600',
            upsert: false,
          });

        if (!thumbUpErr) {
          thumbnailPath = thumbPath;
          thumbnailWidth = width;
          thumbnailHeight = height;
        } else {
          console.error('thumbnail upload error', thumbUpErr);
        }
      } catch (error) {
        console.error('thumbnail generation error', error);
      }

      // Insert photo record with thumbnail info
      const { error: insertPhotoErr } = await supabase
        .from('photos')
        .insert({ 
          stone_id: stone.id, 
          uploader_id: profile.id, 
          storage_path: originalPath,
          thumbnail_path: thumbnailPath,
          thumbnail_width: thumbnailWidth,
          thumbnail_height: thumbnailHeight
        });
      
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
