export type Episode = {
  seasonNumber: number;
  episodeNumber: number;
  episodeCode: string;
  title: string;
  videoUrl: string;
  thumbnailUrl: string;
};

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
  videoUrl: string; // For single-video content like movies
  episodes?: Episode[]; // For multi-episode content like anime series
  episodeInfo?: string;
};

export type UserProfile = {
  id: string;
  displayName: string;
  email: string;
  photoURL?: string;
  role: 'user' | 'admin';
};
