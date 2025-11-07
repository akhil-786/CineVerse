
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { Episode } from '@/lib/types';
import { PlayCircle } from 'lucide-react';
import { motion } from 'framer-motion';

type EpisodeListProps = {
  contentId: string;
  episodes: Episode[];
  currentEpisodeIndex: number;
};

export default function EpisodeList({ contentId, episodes, currentEpisodeIndex }: EpisodeListProps) {
  if (!episodes || episodes.length === 0) return null;

  return (
    <div>
      <h2 className="text-2xl font-headline font-bold mb-4">Episodes</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {episodes.map((episode, index) => {
          const isActive = index === currentEpisodeIndex;
          return (
            <Link
              key={index}
              href={`/watch/${contentId}?episode=${index}`}
              className={cn(
                'group block relative rounded-lg overflow-hidden border-2',
                isActive ? 'border-primary' : 'border-transparent'
              )}
            >
              <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                <Image
                  src={episode.thumbnailUrl}
                  alt={episode.title}
                  width={600}
                  height={338}
                  className="object-cover aspect-video"
                  data-ai-hint="episode thumbnail"
                />
              </motion.div>
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 text-sm font-bold rounded-md backdrop-blur-sm">
                {episode.seasonNumber}x{episode.episodeNumber}
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <PlayCircle className="w-12 h-12 text-white/80" />
              </div>
              <div className="p-2 bg-gradient-to-t from-black/80 to-transparent absolute bottom-0 left-0 right-0">
                 <p className="text-white text-sm font-bold truncate">{episode.title}</p>
              </div>

               {isActive && (
                <div className="absolute inset-0 bg-primary/30 flex items-center justify-center pointer-events-none">
                  <PlayCircle className="w-12 h-12 text-white" />
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
