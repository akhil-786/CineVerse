'use client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ContentCard from "@/components/content-card";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { useUser, useCollection } from "@/firebase";
import type { Content } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { getAuth, signOut } from "firebase/auth";

export default function ProfilePage() {
    const { user, loading: userLoading } = useUser();
    const { data: watchlistContent, loading: contentLoading, error } = useCollection<Content>(
        user ? `users/${user.uid}/watchlist` : ''
    );
    const isLoading = userLoading || contentLoading;

    const handleSignOut = () => {
        const auth = getAuth();
        signOut(auth);
    }

    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="flex flex-col md:flex-row items-start gap-8">
                <div className="w-full md:w-1/4">
                    <Card className="border-white/10 bg-card/80 backdrop-blur-lg">
                        <CardHeader className="items-center text-center">
                            {userLoading ? <Skeleton className="w-24 h-24 rounded-full mb-4" /> : (
                                <Avatar className="w-24 h-24 mb-4 ring-2 ring-primary">
                                    <AvatarImage src={user?.photoURL ?? ''} alt={user?.displayName ?? 'User'} />
                                    <AvatarFallback>{user?.displayName?.charAt(0) ?? 'U'}</AvatarFallback>
                                </Avatar>
                            )}
                             {userLoading ? <Skeleton className="h-8 w-32 mb-2" /> : <CardTitle className="text-2xl font-headline">{user?.displayName ?? 'User'}</CardTitle>}
                             {userLoading ? <Skeleton className="h-4 w-40" /> : <p className="text-sm text-muted-foreground">{user?.email ?? 'user@cineverse.app'}</p>}
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2">
                             <Button asChild variant="outline" onClick={handleSignOut}>
                                <Link href="/auth"><LogOut className="mr-2 h-4 w-4" />Sign Out</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
                <div className="w-full md:w-3/4">
                    <h2 className="text-3xl font-headline font-bold mb-6">My Watchlist</h2>
                     {isLoading ? (
                         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                            {Array.from({ length: 5 }).map((_, i) => <div key={i} className="aspect-[2/3]"><Skeleton className="w-full h-full rounded-xl" /></div>)}
                        </div>
                     ) : error ? (
                        <p className="text-center py-24 text-destructive">Error loading watchlist: {error.message}</p>
                     ) : watchlistContent.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                            {watchlistContent.map((item) => (
                                <ContentCard key={item.id} content={item} glow={item.type === 'anime' ? 'accent' : 'primary'} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center py-24 border-2 border-dashed border-muted-foreground/20 rounded-lg">
                            <h2 className="text-2xl font-bold mb-2">Your Watchlist is Empty</h2>
                            <p className="text-muted-foreground">Add shows and movies to see them here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
