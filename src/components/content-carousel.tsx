import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Content } from '@/lib/types';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import ContentCard from './content-card';

type ContentCarouselProps = {
  title: string;
  content: Content[];
  viewAllHref?: string;
};

export default function ContentCarousel({
  title,
  content,
  viewAllHref,
}: ContentCarouselProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-headline font-bold">{title}</h2>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="flex items-center gap-2 text-sm text-neutral-400 hover:text-primary transition-colors"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {content.map((item, index) => (
            <CarouselItem
              key={index}
              className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
            >
              <ContentCard content={item} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </section>
  );
}
