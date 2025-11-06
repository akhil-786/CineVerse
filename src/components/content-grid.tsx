'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';

import type { Content } from '@/lib/types';
import ContentCard from './content-card';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { useDebounce } from '@/hooks/use-debounce';
import { useCollection } from '@/firebase';
import { Skeleton } from './ui/skeleton';

type ContentGridProps = {
  contentType: 'anime' | 'movie';
  glow?: 'primary' | 'accent';
};

export default function ContentGrid({ contentType, glow }: ContentGridProps) {
  const { data: contentData, loading, error } = useCollection<Content>('content', { where: ['type', '==', contentType] });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [sortBy, setSortBy] = useState('rating-desc');
  const [mounted, setMounted] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { filteredContent, allGenres, allYears } = useMemo(() => {
    let items = contentData;

    const allGenres = [
      ...new Set(items.flatMap((c) => c.genre)),
    ].sort();
    const allYears = [
      ...new Set(items.map((c) => c.year.toString())),
    ].sort((a, b) => Number(b) - Number(a));

    if (debouncedSearchTerm) {
      items = items.filter((c) =>
        c.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    }

    if (selectedGenre !== 'all') {
      items = items.filter((c) => c.genre.includes(selectedGenre));
    }

    if (selectedYear !== 'all') {
      items = items.filter((c) => c.year.toString() === selectedYear);
    }

    items.sort((a, b) => {
      switch (sortBy) {
        case 'rating-desc':
          return (b.rating ?? 0) - (a.rating ?? 0);
        case 'rating-asc':
          return (a.rating ?? 0) - (b.rating ?? 0);
        case 'year-desc':
          return b.year - a.year;
        case 'year-asc':
          return a.year - b.year;
        default:
          return 0;
      }
    });

    return { filteredContent: items, allGenres, allYears };
  }, [contentData, debouncedSearchTerm, selectedGenre, selectedYear, sortBy]);

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-[2/3]">
              <Skeleton className="w-full h-full rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) return <p className="text-center py-16 text-destructive">Error loading content: {error.message}</p>

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="sticky top-16 z-40 bg-background/80 backdrop-blur-md rounded-lg p-4 mb-8 -mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Search ${contentType}s...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>
          <Select value={selectedGenre} onValueChange={setSelectedGenre} disabled={loading}>
            <SelectTrigger><SelectValue placeholder="All Genres" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genres</SelectItem>
              {allGenres.map((genre) => (
                <SelectItem key={genre} value={genre}>{genre}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedYear} onValueChange={setSelectedYear} disabled={loading}>
            <SelectTrigger><SelectValue placeholder="All Years" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {allYears.map((year) => (
                <SelectItem key={year} value={year}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy} disabled={loading}>
            <SelectTrigger><SelectValue placeholder="Sort By" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="rating-desc">Rating: High to Low</SelectItem>
              <SelectItem value="rating-asc">Rating: Low to High</SelectItem>
              <SelectItem value="year-desc">Year: Newest First</SelectItem>
              <SelectItem value="year-asc">Year: Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <AnimatePresence>
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6"
        >
          {loading ? (
             Array.from({ length: 12 }).map((_, i) => (
                <motion.div
                    key={`skeleton-${i}`}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    className="aspect-[2/3]"
                >
                    <Skeleton className="w-full h-full rounded-xl" />
                </motion.div>
             ))
          ) : (
            filteredContent.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <ContentCard content={item} glow={glow} />
              </motion.div>
            ))
          )}
        </motion.div>
      </AnimatePresence>
      {!loading && filteredContent.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
            No {contentType}s found matching your criteria.
        </div>
      )}
    </div>
  );
}
