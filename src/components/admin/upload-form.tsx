
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Sparkles, UploadCloud } from "lucide-react";
import { addDoc, collection } from "firebase/firestore";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { useToast } from "@/hooks/use-toast";
import { useFirestore } from "@/firebase";

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters.").max(100),
  description: z.string().min(10, "Description must be at least 10 characters."),
  type: z.enum(["anime", "movie"]),
  year: z.coerce.number().min(1900).max(new Date().getFullYear() + 1),
  rating: z.coerce.number().min(0).max(10).optional(),
  duration: z.string().optional(),
  genre: z.string(),
  tags: z.string(),
  posterUrl: z.string().url(),
  thumbnailUrl: z.string().url(),
  heroUrl: z.string().url().optional(),
  videoUrl: z.string().url("Please enter a valid URL."),
});

type FormValues = z.infer<typeof formSchema>;

export default function UploadForm() {
    const { toast } = useToast();
    const firestore = useFirestore();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            videoUrl: "",
            type: "movie",
            year: new Date().getFullYear(),
            genre: "",
            tags: "",
            posterUrl: "https://picsum.photos/seed/1/500/750",
            thumbnailUrl: "https://picsum.photos/seed/1/600/338",
            heroUrl: "https://picsum.photos/seed/1/1280/720",
            duration: "",
            rating: 0,
        },
    });

    async function onSubmit(values: FormValues) {
        try {
            const contentCollection = collection(firestore, 'content');
            await addDoc(contentCollection, {
                ...values,
                genre: values.genre.split(',').map(g => g.trim()),
                tags: values.tags.split(',').map(t => t.trim()),
            });
            toast({
                title: "Content Uploaded",
                description: `${values.title} has been successfully added.`,
            });
            form.reset();
        } catch (error) {
            console.error("Error adding document: ", error);
            toast({
                variant: 'destructive',
                title: "Upload Failed",
                description: "There was an error uploading the content.",
            });
        }
    }
    
    function onAutoFetch() {
        toast({
            title: "Fetching Metadata...",
            description: "AI is fetching content metadata. This may take a moment.",
        });
        // Simulate API call and form filling
        setTimeout(() => {
            form.setValue("description", "This is an auto-fetched description of the content, highlighting key plot points and characters.");
            toast({
                title: "Metadata Fetched!",
                description: "Description has been filled automatically.",
            });
        }, 2000);
    }

    return (
        <Card className="border-white/10 bg-card/80 backdrop-blur-lg">
            <CardHeader>
                <CardTitle>Upload New Content</CardTitle>
                <CardDescription>Fill in the details for the new movie or anime.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Attack on Titan" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex items-end gap-2">
                             <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem className="flex-grow">
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="A brief summary of the content..."
                                                className="resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="button" variant="outline" onClick={onAutoFetch}>
                                <Sparkles className="w-4 h-4 mr-2" />
                                Auto-fetch metadata
                            </Button>
                        </div>
                       
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="anime">Anime</SelectItem>
                                                <SelectItem value="movie">Movie</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="videoUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Video URL</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://example.com/video.mp4" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <FormField
                                control={form.control}
                                name="year"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Year</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="rating"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Rating</FormLabel>
                                    <FormControl>
                                        <Input type="number" step="0.1" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="duration"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Duration</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., 2h 30m" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <FormField
                                control={form.control}
                                name="genre"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Genre</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Action, Fantasy, Adventure" {...field} />
                                    </FormControl>
                                     <FormDescription>Comma-separated genres.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="tags"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tags</FormLabel>
                                    <FormControl>
                                        <Input placeholder="demons, sword fight" {...field} />
                                    </FormControl>
                                     <FormDescription>Comma-separated tags.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        </div>
                        
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <FormField
                                control={form.control}
                                name="thumbnailUrl"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Thumbnail URL</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="posterUrl"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Poster URL</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                           <FormField
                                control={form.control}
                                name="heroUrl"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Hero URL (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        </div>

                        <Button type="submit" size="lg" disabled={form.formState.isSubmitting}>
                            <UploadCloud className="w-4 h-4 mr-2" />
                            {form.formState.isSubmitting ? 'Uploading...' : 'Save and Upload'}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
