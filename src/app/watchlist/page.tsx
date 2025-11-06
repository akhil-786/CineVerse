import { motion } from 'framer-motion';
import ContentCard from '@/components/content-card';
import { contentData } from '@/lib/mock-data';
import { Bookmark } from 'lucide-react';

export default function WatchlistPage() {
  // Mock: first 5 items are in the watchlist
  const watchlistContent = contentData.slice(0, 5);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="flex items-center gap-4 mb-8">
        <Bookmark className="w-8 h-8 text-primary" />
        <h1 className="text-4xl font-headline font-bold">My Watchlist</h1>
      </div>

      {watchlistContent.length > 0 ? (
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
