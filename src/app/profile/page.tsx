import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ContentCard from "@/components/content-card";
import { contentData } from "@/lib/mock-data";
import placeholderData from '@/lib/placeholder-images.json';
import { LogOut } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
    const avatarUrl = placeholderData.placeholderImages.find(p => p.id === "user-avatar")?.imageUrl;
    const watchlistContent = contentData.slice(0, 5);

    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="flex flex-col md:flex-row items-start gap-8">
                <div className="w-full md:w-1/4">
                    <Card className="border-white/10 bg-card/80 backdrop-blur-lg">
                        <CardHeader className="items-center text-center">
                            <Avatar className="w-24 h-24 mb-4 ring-2 ring-primary">
                                <AvatarImage src={avatarUrl} alt="@user" />
                                <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                            <CardTitle className="text-2xl font-headline">User</CardTitle>
                            <p className="text-sm text-muted-foreground">user@cineverse.app</p>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2">
                             <Button asChild variant="outline">
                                <Link href="/auth"><LogOut className="mr-2 h-4 w-4" />Sign Out</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
                <div className="w-full md:w-3/4">
                    <h2 className="text-3xl font-headline font-bold mb-6">My Watchlist</h2>
                     {watchlistContent.length > 0 ? (
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
