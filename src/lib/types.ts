import type { ImagePlaceholder } from './placeholder-images';

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
  poster: ImagePlaceholder;
  thumbnail: ImagePlaceholder;
  hero?: ImagePlaceholder;
};
