import ContentGrid from "@/components/content-grid";

export default function MoviesPage() {
  return (
    <div>
      <div className="container mx-auto px-4 pt-12">
        <h1 className="text-4xl font-headline font-bold mb-4">Movies</h1>
        <p className="text-muted-foreground max-w-2xl">
          From blockbusters to indie gems, find your next movie night pick here. Use the filters to narrow down your search.
        </p>
      </div>
      <ContentGrid contentType="movie" glow="primary" />
    </div>
  );
}
