import { Clapperboard } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type LogoProps = {
  className?: string;
};

export default function Logo({ className }: LogoProps) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <Clapperboard className="h-7 w-7 text-primary" />
      <span className="text-xl font-bold font-headline tracking-wider text-neutral-50">
        CineVerse
      </span>
    </Link>
  );
}
