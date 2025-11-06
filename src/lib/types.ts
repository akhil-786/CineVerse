export type Content = {
  id: string;
  title: string;
  description: string;
  type: 'movie' | 'anime';
  genre: string[];
  year: number;
  rating?: number;
  duration?: string;
  tags: string[];
  posterUrl: string;
  thumbnailUrl: string;
  heroUrl?: string;
  videoUrl: string;
};

export type UserProfile = {
  id: string;
  displayName: string;
  email: string;
  photoURL?: string;
  role: 'user' | 'admin';
};
