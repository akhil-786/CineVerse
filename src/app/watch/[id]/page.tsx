
'use client';

import Image from 'next/image';
import { notFound, useSearchParams } from 'next/navigation';
import { Clock, Star, Tag } from 'lucide-react';
import * as React from 'react';

import ContentCarousel from '@/components/content-carousel';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCollection, useDoc } from '@/firebase';
import type { Content } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import EpisodeList from '@/components/episode-list';

type WatchPageProps = {
  params: { id: string };
};

export default function WatchPage({ params }: WatchPageProps) {
  const { id } = params;
  const searchParams = useSearchParams();
  const episodeQuery = searchParams.get('episode');

  const { data: content, loading, error } = useDoc<Content>('content', id);
  
  const { data: recommendedContent, loading: recommendedLoading } = useCollection<Content>(
    'content', 
    content ? { where: ['type', '==', content.type] } : undefined
  );
  
  const currentEpisodeIndex = React.useMemo(() => {
    if (!content) return 0;
    if (content.episodes && content.episodes.length > 0) {
      return parseInt(episodeQuery ?? '0', 10);
    }
    return 0;
  }, [content, episodeQuery]);

  const currentVideoUrl = React.useMemo(() => {
    if (!content) return '';
    if (content.episodes && content.episodes.length > 0) {
      return content.episodes[currentEpisodeIndex]?.videoUrl ?? content.videoUrl;
    }
    return content.videoUrl;
  }, [content, currentEpisodeIndex]);

  if (loading) {
      return (
          <div className="pb-16">
            <Skeleton className="w-full aspect-[16/7]" />
            <div className="container mx-auto px-4 mt-8">
                <div className="max-w-4xl mx-auto">
                    <Skeleton className="h-12 w-3/4 mb-4" />
                    <Skeleton className="h-6 w-1/2 mb-6" />
                    <Skeleton className="w-full aspect-video mb-8" />
                    <Skeleton className="h-24 w-full mb-12" />
                    <Skeleton className="h-48 w-full" />
                </div>
            </div>
          </div>
      );
  }

  if (error) return <p>Error: {error.message}</p>;
  if (!content) {
    notFound();
  }
  
  const filteredRecommended = recommendedContent
    .filter(c => c.id !== id)
    .slice(0, 10);

  return (
    <div className="pb-16">
      <div className="relative w-full h-[40vh] md:h-[50vh] bg-black">
        <Image 
          src={content.heroUrl ?? content.thumbnailUrl}
          alt={`Backdrop for ${content.title}`}
          fill
          className="object-cover opacity-30"
          priority
          data-ai-hint={`${content.type} hero background`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>

      <div className="container mx-auto px-4 -mt-24 md:-mt-32">
        <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-headline font-bold text-neutral-50 drop-shadow-lg">
              {content.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 mt-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span>{content.rating?.toFixed(1) ?? 'N/A'}</span>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{content.duration ?? 'N/A'}</span>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <span>{content.year}</span>
            </div>
            
            <div className="mt-8">
              <h2 className="text-2xl font-headline font-bold mb-4">Watch Now</h2>
              <iframe
                  key={currentVideoUrl}
                  src={currentVideoUrl}
                  title={content.title}
                  className="w-full aspect-video bg-black/80 rounded-lg shadow-2xl shadow-primary/20 ring-2 ring-primary/50"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
              ></iframe>
            </div>

            <p className="mt-8 text-neutral-300">{content.description}</p>
            
            <div className="flex flex-wrap items-center gap-2 mt-6">
                <Tag className="w-4 h-4 text-muted-foreground" />
                {content.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
            </div>
            
            {content.episodes && content.episodes.length > 0 && (
                <>
                    <Separator className="my-12" />
                    <EpisodeList contentId={id} episodes={content.episodes} currentEpisodeIndex={currentEpisodeIndex} />
                </>
            )}

            <Separator className="my-12" />

            <ContentCarousel title="You might also like" content={filteredRecommended} loading={recommendedLoading} />
        </div>
      </div>
    </div>
  );
}
