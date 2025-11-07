
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Sparkles, UploadCloud, PlusCircle, XCircle } from "lucide-react";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";

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
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useFirestore } from "@/firebase";
import type { Content } from "@/lib/types";

const episodeSchema = z.object({
  seasonNumber: z.coerce.number().min(1),
  episodeNumber: z.coerce.number().min(1),
  episodeCode: z.string().min(1, "Episode code (e.g., 1x1) is required."),
  title: z.string().min(2, "Title must be at least 2 characters."),
  videoUrl: z.string().url(),
  thumbnailUrl: z.string().url(),
});

const formSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, "Title must be at least 2 characters.").max(100),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters."),
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
  episodes: z.array(episodeSchema).optional(),
});

type FormValues = z.infer<typeof formSchema>;

type UploadFormProps = {
  isEditMode?: boolean;
  initialData?: Content | null;
  onSuccess?: () => void;
};

export default function UploadForm({
  isEditMode = false,
  initialData = null,
  onSuccess,
}: UploadFormProps) {
  const { toast } = useToast();
  const firestore = useFirestore();

  const defaultValues: FormValues = {
    title: "",
    description: "",
    videoUrl: "",
    type: "movie" as "anime" | "movie",
    year: new Date().getFullYear(),
    genre: "",
    tags: "",
    posterUrl: "https://picsum.photos/seed/1/500/750",
    thumbnailUrl: "https://picsum.photos/seed/1/600/338",
    heroUrl: "https://picsum.photos/seed/1/1280/720",
    duration: "",
    rating: 0,
    episodes: [],
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues:
      isEditMode && initialData
        ? {
            ...initialData,
            genre: initialData.genre.join(", "),
            tags: initialData.tags.join(", "),
            episodes: initialData.episodes ?? [],
          }
        : defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "episodes",
  });

  const contentType = form.watch("type");

  React.useEffect(() => {
    if (isEditMode && initialData) {
      form.reset({
        ...initialData,
        genre: initialData.genre.join(", "),
        tags: initialData.tags.join(", "),
        episodes: initialData.episodes ?? [],
      });
    }
  }, [initialData, isEditMode, form]);

  React.useEffect(() => {
    if (contentType === "anime" && fields.length === 0) {
      append({
        seasonNumber: 1,
        episodeNumber: 1,
        episodeCode: "1x1",
        title: "",
        videoUrl: "",
        thumbnailUrl: "https://picsum.photos/seed/1/600/338",
      });
    }

    if (contentType === "movie") {
      remove(); // Removes all fields
    }
  }, [contentType, fields.length, append, remove]);

  async function onSubmit(values: FormValues) {
    try {
      const dataToSave: Omit<Content, 'id'> & { id?: string } = {
        ...values,
        genre: values.genre.split(",").map((g) => g.trim()),
        tags: values.tags.split(",").map((t) => t.trim()),
        episodes: values.type === "anime" ? values.episodes : [],
      };
      
      delete dataToSave.id;

      if (isEditMode && initialData?.id) {
        const contentDocRef = doc(firestore, "content", initialData.id);
        await updateDoc(contentDocRef, dataToSave);
        toast({
          title: "Content Updated",
          description: `${values.title} has been successfully updated.`,
        });
      } else {
        const contentCollection = collection(firestore, "content");
        await addDoc(contentCollection, dataToSave);
        toast({
          title: "Content Uploaded",
          description: `${values.title} has been successfully added.`,
        });
        form.reset(defaultValues);
      }
      onSuccess?.();
    } catch (error) {
      console.error("Error saving document: ", error);
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: "There was an error saving the content.",
      });
    }
  }

  function onAutoFetch() {
    toast({
      title: "Fetching Metadata...",
      description: "AI is fetching content metadata. This may take a moment.",
    });
    setTimeout(() => {
      form.setValue(
        "description",
        "This is an auto-fetched description of the content, highlighting key plot points and characters."
      );
      toast({
        title: "Metadata Fetched!",
        description: "Description has been filled automatically.",
      });
    }, 2000);
  }

  const Wrapper = isEditMode ? "div" : Card;
  const wrapperProps = isEditMode
    ? {}
    : { className: "border-white/10 bg-card/80 backdrop-blur-lg" };

  return (
    <Wrapper {...wrapperProps}>
      {!isEditMode && (
        <CardHeader>
          <CardTitle>Upload New Content</CardTitle>
          <CardDescription>
            Fill in the details for the new movie or anime.
          </CardDescription>
        </CardHeader>
      )}
      <CardContent className={isEditMode ? "pt-6" : ""}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Title + Description */}
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
                Auto-fetch
              </Button>
            </div>

            {/* Type + Video URL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
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
                    <FormLabel>
                      Video URL {contentType === "anime" && "(Fallback)"}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/video.mp4"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Year + Rating + Duration */}
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

            {/* Genre + Tags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="genre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Genre</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Action, Fantasy, Adventure"
                        {...field}
                      />
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

            {/* URLs */}
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

            {/* Episodes Section */}
            {contentType === "anime" && fields.length > 0 && (
              <div className="space-y-6">
                <Separator />
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Episodes</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      append({
                        seasonNumber: 1,
                        episodeNumber: fields.length + 1,
                        episodeCode: `1x${fields.length + 1}`,
                        title: "",
                        videoUrl: "",
                        thumbnailUrl: "https://picsum.photos/seed/1/600/338",
                      })
                    }
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Episode
                  </Button>
                </div>

                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="p-4 border rounded-lg space-y-4 relative bg-muted/20"
                    >
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
                        onClick={() => remove(index)}
                      >
                        <XCircle className="h-5 w-5" />
                      </Button>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name={`episodes.${index}.seasonNumber`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Season</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="1" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`episodes.${index}.episodeNumber`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Episode No.</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder={`${index + 1}`}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`episodes.${index}.episodeCode`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Episode Code</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., 1x1" {...field} />
                              </FormControl>
                              <FormDescription>e.g., 1x1, S01E01</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name={`episodes.${index}.title`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Episode Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Episode Title" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`episodes.${index}.videoUrl`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Episode Video URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`episodes.${index}.thumbnailUrl`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Episode Thumbnail URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={form.formState.isSubmitting}
            >
              <UploadCloud className="w-4 h-4 mr-2" />
              {form.formState.isSubmitting
                ? isEditMode
                  ? "Saving..."
                  : "Uploading..."
                : isEditMode
                ? "Save Changes"
                : "Upload Content"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Wrapper>
  );
}
