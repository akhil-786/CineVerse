'use client';

import { motion } from 'framer-motion';
import ContentCard from '@/components/content-card';
import { Bookmark } from 'lucide-react';
import { useUser, useCollection } from '@/firebase';
import type { Content } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function WatchlistPage() {
  const { user, loading: userLoading } = useUser();
  const { data: watchlistContent, loading: contentLoading, error } = useCollection<Content>(
    user ? `users/${user.uid}/watchlist` : ''
  );

  const isLoading = userLoading || contentLoading;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="flex items-center gap-4 mb-8">
        <Bookmark className="w-8 h-8 text-primary" />
        <h1 className="text-4xl font-headline font-bold">My Watchlist</h1>
      </div>

      {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[2/3]"><Skeleton className="w-full h-full rounded-xl" /></div>
            ))}
          </div>
      ) : error ? (
        <p className="text-center text-destructive">Error loading watchlist: {error.message}</p>
      ) : watchlistContent.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {watchlistContent.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <ContentCard content={item} glow={item.type === 'anime' ? 'accent' : 'primary'} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-24 border-2 border-dashed border-muted-foreground/20 rounded-lg">
          <h2 className="text-2xl font-bold mb-2">Your Watchlist is Empty</h2>
          <p className="text-muted-foreground">Add movies and anime to your watchlist to see them here.</p>
        </div>
      )}
    </div>
  );
}
