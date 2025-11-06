'use client';

import Link from 'next/link';
import {
  Menu,
  Film,
  Tv,
  Bookmark,
  User,
  LogOut,
  LayoutDashboard,
} from 'lucide-react';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Logo from '@/components/ui/logo';
import placeholderData from '@/lib/placeholder-images.json';

const navLinks = [
  { href: '/anime', label: 'Anime', icon: Tv },
  { href: '/movies', label: 'Movies', icon: Film },
  { href: '/watchlist', label: 'Watchlist', icon: Bookmark },
];

export default function Header() {
  const pathname = usePathname();
  const avatarUrl = placeholderData.placeholderImages.find(p => p.id === "user-avatar")?.imageUrl;

  const NavLink = ({ href, label, icon: Icon, isMobile = false }: { href: string; label: string; icon: React.ElementType; isMobile?: boolean; }) => (
    <Link
      href={href}
      className={cn(
        'transition-colors font-medium flex items-center gap-2',
        pathname === href
          ? 'text-primary'
          : 'text-neutral-400 hover:text-neutral-200',
        isMobile ? 'text-lg p-4' : 'text-sm'
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center mx-auto px-4">
        <Logo className="mr-8" />
        
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={avatarUrl} alt="@user" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">User</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    user@cineverse.app
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
               <DropdownMenuItem asChild>
                <Link href="/profile"><User className="mr-2 h-4 w-4" /><span>Profile</span></Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin"><LayoutDashboard className="mr-2 h-4 w-4" /><span>Admin</span></Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/auth"><LogOut className="mr-2 h-4 w-4" /><span>Log out</span></Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="p-4">
                 <Logo />
              </div>
              <nav className="grid gap-2 p-4">
                {navLinks.map((link) => (
                  <NavLink key={link.href} {...link} isMobile />
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
