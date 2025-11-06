'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PlayCircle, Star } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { Content } from '@/lib/types';

type ContentCardProps = {
  content: Content;
  className?: string;
  aspectRatio?: 'portrait' | 'video';
  width?: number;
  height?: number;
  glow?: 'primary' | 'accent';
};

export default function ContentCard({
  content,
  className,
  aspectRatio = 'portrait',
  width,
  height,
  glow = 'primary',
}: ContentCardProps) {

  const glowClass = {
    primary: 'hover:shadow-[0_0_20px_hsl(var(--primary))]',
    accent: 'hover:shadow-[0_0_20px_hsl(var(--accent))]',
  }[glow];

  return (
    <motion.div
      whileHover="hover"
      className={cn(
        'relative group rounded-xl overflow-hidden cursor-pointer transition-all duration-300',
        glowClass,
        className
      )}
    >
      <Link href={`/watch/${content.id}`} className="absolute inset-0 z-10">
        <span className="sr-only">View {content.title}</span>
      </Link>
      <motion.div 
        className="relative"
        variants={{
          initial: { scale: 1 },
          hover: { scale: 1.05 }
        }}
        transition={{ duration: 0.3 }}
      >
        <Image
          src={aspectRatio === 'portrait' ? content.posterUrl : content.thumbnailUrl}
          alt={content.title}
          width={width ?? (aspectRatio === 'portrait' ? 500 : 600)}
          height={height ?? (aspectRatio === 'portrait' ? 750 : 338)}
          className={cn(
            'object-cover transition-all duration-300',
            aspectRatio === 'portrait' ? 'aspect-[2/3]' : 'aspect-video'
          )}
        />
      </motion.div>
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute inset-0 flex flex-col justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="flex justify-end">
          {content.rating && (
            <div className="flex items-center gap-1 bg-black/50 text-white text-xs font-bold py-1 px-2 rounded-full backdrop-blur-md">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span>{content.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
        <div className="flex flex-col items-center justify-center flex-grow">
          <PlayCircle className="w-16 h-16 text-white/80 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
        </div>
        <div className="text-white">
          <h3 className="font-bold font-headline truncate">{content.title}</h3>
          <p className="text-xs text-neutral-300">{content.year}</p>
        </div>
      </div>
    </motion.div>
  );
}
