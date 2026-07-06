import { useState, useMemo } from "react";
import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, Calendar, ArrowRight, Search, X } from "lucide-react";
import { articles } from "./blog-data";

const categories = ["All", "Buying", "Selling", "Guides", "Finance", "Insurance"];

const categoryColors: Record<string, string> = {
  Buying: "bg-primary/10 text-primary",
  Selling: "bg-amber-50 text-amber-700",
  Guides: "bg-emerald-50 text-emerald-700",
  Finance: "bg-purple-50 text-purple-700",
  Insurance: "bg-rose-50 text-rose-700",
};

const blogJsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "CarsInMyCity — Automotive Insights & Guides",
  description:
    "Expert advice on buying and selling cars, financing, titles, and local market trends from the CarsInMyCity editorial team.",
  url: "https://carsinmycity.com/blog",
  publisher: {
    "@type": "Organization",
    name: "CarsInMyCity",
    url: "https://carsinmycity.com",
  },
  blogPost: articles.map((a) => ({
    "@type": "BlogPosting",
    headline: a.title,
    url: `https://carsinmycity.com/blog/${a.slug}`,
    datePublished: a.publishedIso,
    image: a.img,
    description: a.metaDescription,
  })),
};

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    let result = activeCategory === "All" ? articles : articles.filter((a) => a.category === activeCategory);
    const q = query.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q) ||
          a.keywords.some((k) => k.toLowerCase().includes(q))
      );
    }
    return result;
  }, [activeCategory, query]);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <Layout>
      <SEO
        title="Automotive Insights & Guides — CarsInMyCity Blog"
        description="Expert advice on buying and selling cars, financing, title types, car photography, and local market trends. Updated guides for smart car buyers and sellers."
        canonical="https://carsinmycity.com/blog"
        keywords={["car buying guide", "car selling tips", "used car advice", "auto finance guide", "car title types"]}
        jsonLd={blogJsonLd}
      />

      <div className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Automotive Insights & Guides
          </h1>
          <p className="text-xl text-primary-foreground/80 mb-10">
            Expert advice, local market trends, and everything you need to know
            about buying and selling cars.
          </p>
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles — e.g. 'financing', 'title', 'photos'…"
              className="pl-11 pr-10 h-12 text-foreground bg-background border-transparent text-base shadow-lg rounded-xl"
              aria-label="Search blog articles"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-wrap gap-3 justify-center mb-4">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "outline"}
              className="rounded-full px-6"
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>

        {query && (
          <p className="text-center text-sm text-muted-foreground mb-8">
            {filtered.length === 0
              ? `No articles match "${query}"`
              : `${filtered.length} article${filtered.length === 1 ? "" : "s"} matching "${query}"`}
          </p>
        )}

        {!query && <div className="mb-8" />}

        {featured && (
          <Link href={`/blog/${featured.slug}`}>
            <div className="group mb-12 cursor-pointer">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all">
                <div className="aspect-[16/9] lg:aspect-auto overflow-hidden bg-muted">
                  <img
                    src={featured.img}
                    alt={featured.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="eager"
                  />
                </div>
                <div className="p-8 lg:p-10 flex flex-col justify-center bg-card">
                  <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-4 w-fit ${categoryColors[featured.category] ?? "bg-muted text-muted-foreground"}`}>
                    {featured.category}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold leading-tight mb-4 group-hover:text-primary transition-colors">
                    {featured.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {featured.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      <time dateTime={featured.publishedIso}>{featured.date}</time>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" /> {featured.readTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all">
                    Read Article <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        )}

        {rest.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rest.map((article) => (
              <Link key={article.slug} href={`/blog/${article.slug}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-all group cursor-pointer border-border/50 hover:border-primary/30 h-full flex flex-col">
                  <div className="aspect-[16/10] overflow-hidden bg-muted relative">
                    <img
                      src={article.img}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className={`absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full shadow-sm backdrop-blur ${categoryColors[article.category] ?? "bg-background/90 text-foreground"}`}>
                      {article.category}
                    </div>
                  </div>
                  <CardContent className="p-5 flex flex-col flex-1">
                    <div className="flex items-center text-xs text-muted-foreground mb-3 gap-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <time dateTime={article.publishedIso}>{article.date}</time>
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {article.readTime}
                      </span>
                    </div>
                    <h3 className="font-bold text-base leading-snug group-hover:text-primary transition-colors line-clamp-3 mb-3">
                      {article.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-4 flex-1">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center gap-1.5 text-primary text-sm font-semibold group-hover:gap-2.5 transition-all">
                      Read more <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-24 text-muted-foreground">
            <p className="text-lg mb-4">No articles found{query ? ` for "${query}"` : " in this category"}.</p>
            <Button variant="outline" onClick={() => { setQuery(""); setActiveCategory("All"); }}>
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
