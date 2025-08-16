export type UUID = string;

export interface Stone {
  id: UUID;
  name: string;
  description?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  address_text?: string | null;
  creator_id: UUID; // profiles.id
  average_rating: number;
  created_at: string;
  updated_at: string;
}

export interface NewStone {
  name: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  address_text?: string;
}

export interface Review {
  id: UUID;
  stone_id: UUID;
  user_id: UUID; // profiles.id
  rating: number; // 1..5
  comment?: string | null;
  created_at: string;
}

export interface NewReview {
  stone_id: UUID;
  rating: number;
  comment?: string;
}

export interface Profile {
  id: UUID; // profiles.id
  user_id: UUID; // auth.users.id
  email: string;
  username?: string | null;
  display_name?: string | null;
  avatar_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface IDataProvider {
  // Stone Methods
  getStoneById(id: string): Promise<Stone | null>;
  findStones(query: string): Promise<Stone[]>; // search by name/address
  getTopRatedStones(limit: number): Promise<Stone[]>;
  addStone(stoneData: NewStone, photos: File[], authUserId: string): Promise<Stone>;

  // Review Methods
  getReviewsForStone(stoneId: string): Promise<Review[]>;
  addReview(reviewData: NewReview, authUserId: string): Promise<Review>;

  // User & Favorites Methods
  getUserProfile(authUserId: string): Promise<Profile | null>;
  getFavoriteStones(authUserId: string): Promise<Stone[]>;
  addFavorite(authUserId: string, stoneId: string): Promise<void>;
  removeFavorite(authUserId: string, stoneId: string): Promise<void>;
}
