import { Layout } from "@/components/layout";
import { useGetMe, useListFavorites } from "@workspace/api-client-react";
import { CarCard } from "@/components/car-card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Heart } from "lucide-react";

export default function FavoritesPage() {
  const { data: user, isLoading: userLoading } = useGetMe({ query: { retry: false } });
  const { data: favorites = [], isLoading: favLoading } = useListFavorites({ query: { enabled: !!user } });

  if (userLoading || favLoading) {
    return <Layout><div className="container mx-auto p-8 text-center">Loading...</div></Layout>;
  }

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto p-8 text-center pt-24">
          <h1 className="text-3xl font-bold mb-4">Please Sign In</h1>
          <p className="text-muted-foreground mb-8">You need to be signed in to view your saved cars.</p>
          <Link href="/login"><Button size="lg">Sign In</Button></Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="h-8 w-8 text-destructive fill-destructive" />
          <h1 className="text-3xl font-bold">Saved Cars</h1>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-24 bg-card rounded-2xl border border-border border-dashed">
            <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">No saved cars yet</h2>
            <p className="text-muted-foreground mb-6">Hit the heart icon on any listing to save it for later.</p>
            <Link href="/search"><Button>Browse Cars</Button></Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {favorites.map(car => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
