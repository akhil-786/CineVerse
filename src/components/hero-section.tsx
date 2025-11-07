
'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { PlayCircle, Info } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import type { Content } from '@/lib/types';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';

type HeroSectionProps = {
  content: Content | null;
  loading?: boolean;
};

export default function HeroSection({ content, loading }: HeroSectionProps) {
  if (loading) {
    return (
      <div className="relative h-[60vh] md:h-[85vh] w-full">
        <Skeleton className="absolute inset-0" />
      </div>
    )
  }

  if (!content) {
    return null; // Or a placeholder
  }

  const hasEpisodes = content.episodes && content.episodes.length > 0;
  const playUrl = hasEpisodes ? `/watch/${content.id}?episode=0` : `/watch/${content.id}`;

  return (
    <div className="relative h-[60vh] md:h-[85vh] w-full">
      <div className="absolute inset-0">
        <Image
          src={content.heroUrl ?? content.posterUrl}
          alt={`Hero image for ${content.title}`}
          fill
          priority
          className="object-cover"
          data-ai-hint={`${content.type} hero`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
      </div>

      <div className="relative z-10 h-full flex flex-col justify-end pb-12 md:pb-24 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="max-w-xl text-white"
        >
          {hasEpisodes && (
             <motion.div 
              className="flex flex-wrap items-center gap-2 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            >
              {content.episodes?.map((episode, index) => (
                <Button asChild key={index} size="sm" variant="outline" className="border-white/20 bg-black/20 text-neutral-300 backdrop-blur-sm hover:bg-primary/80 hover:text-white">
                  <Link href={`/watch/${content.id}?episode=${index}`}>
                    EP {episode.episodeNumber}
                  </Link>
                </Button>
              ))}
            </motion.div>
          )}
          <motion.h1 
            className="text-4xl md:text-6xl font-headline font-bold text-neutral-50 drop-shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          >
            {content.title}
          </motion.h1>
          <motion.div 
            className="flex items-center gap-4 mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
          >
            {content.genre.slice(0, 3).map(g => (
              <Badge key={g} variant="outline" className="border-white/20 bg-black/20 text-neutral-300 backdrop-blur-sm">
                {g}
              </Badge>
            ))}
             <span className="text-neutral-300 text-sm">{content.year}</span>
          </motion.div>
          <motion.p 
            className="mt-4 text-sm md:text-base text-neutral-300 line-clamp-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
          >
            {content.description}
          </motion.p>
          <motion.div 
            className="mt-8 flex gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: 'easeOut' }}
          >
            <Button asChild size="lg" className="bg-primary hover:bg-primary/80 text-white font-bold">
              <Link href={playUrl}>
                <PlayCircle className="mr-2 h-6 w-6" />
                Play
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white font-bold backdrop-blur-md">
              <Link href={`/watch/${content.id}`}>
                <Info className="mr-2 h-6 w-6" />
                More Info
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
