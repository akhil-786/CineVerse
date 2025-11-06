'use client';

import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Clock, Star, Tag } from 'lucide-react';

import ContentCarousel from '@/components/content-carousel';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCollection, useDoc } from '@/firebase';
import type { Content } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

type WatchPageProps = {
  params: { id: string };
};

export default function WatchPage({ params }: WatchPageProps) {
  const { data: content, loading, error } = useDoc<Content>('content', params.id);
  
  const { data: recommendedContent, loading: recommendedLoading } = useCollection<Content>(
    'content', 
    content ? { where: ['type', '==', content.type] } : undefined
  );

  if (loading) {
      return (
          <div className="pb-16">
            <Skeleton className="w-full aspect-video" />
            <div className="container mx-auto px-4 mt-8">
                <div className="max-w-4xl mx-auto">
                    <Skeleton className="h-12 w-3/4 mb-4" />
                    <Skeleton className="h-6 w-1/2 mb-6" />
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
    .filter(c => c.id !== params.id)
    .slice(0, 10);

  return (
    <div className="pb-16">
      <div className="relative w-full aspect-video bg-black">
        <Image 
          src={content.heroUrl ?? content.thumbnailUrl}
          alt={`Backdrop for ${content.title}`}
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 flex items-center justify-center">
            {/* Player Placeholder */}
            <div className="w-full max-w-4xl aspect-video bg-black/80 rounded-lg shadow-2xl shadow-primary/20 ring-2 ring-primary/50 flex items-center justify-center">
                <p className="text-2xl font-headline text-muted-foreground">Video Player</p>
            </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8">
        <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-headline font-bold text-neutral-50">
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

            <p className="mt-6 text-neutral-300">{content.description}</p>
            
            <div className="flex flex-wrap items-center gap-2 mt-6">
                <Tag className="w-4 h-4 text-muted-foreground" />
                {content.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
            </div>

            <Separator className="my-12" />

            <ContentCarousel title="You might also like" content={filteredRecommended} loading={recommendedLoading} />
        </div>
      </div>
    </div>
  );
}
