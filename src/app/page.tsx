import ContentCarousel from '@/components/content-carousel';
import HeroSection from '@/components/hero-section';
import { contentData } from '@/lib/mock-data';
import type { Content } from '@/lib/types';

export default function Home() {
  const trendingContent = contentData
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 10);
  const animeContent = contentData
    .filter((c) => c.type === 'anime')
    .slice(0, 10);
  const movieContent = contentData
    .filter((c) => c.type === 'movie')
    .slice(0, 10);

  const heroContent: Content | undefined = contentData.find(
    (c) => c.id === 'demon-slayer'
  );

  return (
    <div className="flex flex-col gap-12 md:gap-16 pb-16">
      {heroContent && <HeroSection content={heroContent} />}
      <div className="container mx-auto px-4 space-y-12 md:space-y-16">
        <ContentCarousel title="Trending Now" content={trendingContent} />
        <ContentCarousel title="Top Anime" content={animeContent} />
        <ContentCarousel title="New Movies" content={movieContent} />
      </div>
    </div>
  );
}
