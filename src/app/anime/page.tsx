import ContentGrid from "@/components/content-grid";

export default function AnimePage() {
  return (
    <div>
      <div className="container mx-auto px-4 pt-12">
        <h1 className="text-4xl font-headline font-bold mb-4">Anime</h1>
        <p className="text-muted-foreground max-w-2xl">
          Explore our vast collection of anime series and movies. Use the filters to find your next favorite show.
        </p>
      </div>
      <ContentGrid contentType="anime" glow="accent" />
    </div>
  );
}
