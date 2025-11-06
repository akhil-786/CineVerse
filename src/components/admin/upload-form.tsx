"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Sparkles, UploadCloud } from "lucide-react";

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

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters.").max(100),
  description: z.string().min(10, "Description must be at least 10 characters."),
  category: z.enum(["anime", "movie"]),
  thumbnail: z.any().refine(file => file?.length == 1, "Thumbnail is required."),
  heroPoster: z.any().optional(),
  videoUrl: z.string().url("Please enter a valid URL."),
});

export default function UploadForm() {
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            videoUrl: "",
            category: "movie",
            thumbnail: undefined,
            heroPoster: undefined,
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
        toast({
            title: "Upload Submitted",
            description: "Content has been successfully submitted for processing.",
        });
        form.reset();
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

    // A ref for the file inputs to reset them
    const thumbnailRef = React.useRef<HTMLInputElement>(null);
    const heroPosterRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
      if (form.formState.isSubmitSuccessful) {
        form.reset();
        if (thumbnailRef.current) thumbnailRef.current.value = "";
        if (heroPosterRef.current) heroPosterRef.current.value = "";
      }
    }, [form.formState, form]);

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
                                name="category"
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

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <FormField
                                control={form.control}
                                name="thumbnail"
                                render={({ field: { onChange, value, ...rest }}) => (
                                <FormItem>
                                    <FormLabel>Thumbnail Image</FormLabel>
                                    <FormControl>
                                        <Input type="file" onChange={e => onChange(e.target.files)} {...rest} ref={thumbnailRef} />
                                    </FormControl>
                                    <FormDescription>16:9 aspect ratio recommended.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="heroPoster"
                                render={({ field: { onChange, value, ...rest } }) => (
                                <FormItem>
                                    <FormLabel>Hero Poster (Optional)</FormLabel>
                                    <FormControl>
                                         <Input type="file" onChange={e => onChange(e.target.files)} {...rest} ref={heroPosterRef} />
                                    </FormControl>
                                     <FormDescription>Wide aspect ratio for hero sections.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        </div>
                        
                        <Button type="submit" size="lg">
                            <UploadCloud className="w-4 h-4 mr-2" />
                            Save and Upload
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
