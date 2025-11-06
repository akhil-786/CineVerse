'use client';
import ContentCarousel from '@/components/content-carousel';
import HeroSection from '@/components/hero-section';
import { useCollection } from '@/firebase';
import type { Content } from '@/lib/types';
import { useMemo } from 'react';

export default function Home() {
  const { data: contentData, loading, error } = useCollection<Content>('content');
  
  const { trendingContent, animeContent, movieContent, heroContent } = useMemo(() => {
    if (!contentData) return { trendingContent: [], animeContent: [], movieContent: [], heroContent: null };

    const sortedByRating = [...contentData].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    
    const trendingContent = sortedByRating.slice(0, 10);
    const animeContent = contentData.filter((c) => c.type === 'anime').slice(0, 10);
    const movieContent = contentData.filter((c) => c.type === 'movie').slice(0, 10);
    
    const heroContent = sortedByRating.length > 0 ? sortedByRating[0] : null;

    return { trendingContent, animeContent, movieContent, heroContent };
  }, [contentData]);

  if (error) return <p className="text-center py-16 text-destructive">Error loading content: {error.message}</p>

  return (
    <div className="flex flex-col gap-12 md:gap-16 pb-16">
      <HeroSection content={heroContent} loading={loading} />
      <div className="container mx-auto px-4 space-y-12 md:space-y-16">
        <ContentCarousel title="Trending Now" content={trendingContent} loading={loading} />
        <ContentCarousel title="Top Anime" content={animeContent} loading={loading} />
        <ContentCarousel title="New Movies" content={movieContent} loading={loading} />
      </div>
    </div>
  );
}
