import { useState } from "react";
import { Layout } from "@/components/layout";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, ArrowRight } from "lucide-react";
import { articles } from "./blog-data";

const categories = ["All", "Buying", "Selling", "Guides", "Finance"];

const categoryColors: Record<string, string> = {
  Buying: "bg-primary/10 text-primary",
  Selling: "bg-accent/10 text-amber-700",
  Guides: "bg-emerald-50 text-emerald-700",
  Finance: "bg-purple-50 text-purple-700",
};

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? articles
      : articles.filter((a) => a.category === activeCategory);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <Layout>
      <div className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Automotive Insights & Guides
          </h1>
          <p className="text-xl text-primary-foreground/80">
            Expert advice, local market trends, and everything you need to know
            about buying and selling cars.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-wrap gap-3 justify-center mb-12">
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

        {featured && (
          <Link href={`/blog/${featured.slug}`}>
            <div className="group mb-12 cursor-pointer">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all">
                <div className="aspect-[16/9] lg:aspect-auto overflow-hidden bg-muted">
                  <img
                    src={featured.img}
                    alt={featured.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-8 lg:p-10 flex flex-col justify-center bg-card">
                  <span
                    className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-4 w-fit ${categoryColors[featured.category] ?? "bg-muted text-muted-foreground"}`}
                  >
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
                      <Calendar className="h-4 w-4" /> {featured.date}
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
                <Card className="overflow-hidden hover:shadow-lg transition-all group cursor-pointer border-border/50 hover:border-primary/30 h-full">
                  <div className="aspect-[16/10] overflow-hidden bg-muted relative">
                    <img
                      src={article.img}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className={`absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full shadow-sm ${categoryColors[article.category] ?? "bg-background/90 text-foreground"} backdrop-blur`}>
                      {article.category}
                    </div>
                  </div>
                  <CardContent className="p-5 flex flex-col flex-1">
                    <div className="flex items-center text-xs text-muted-foreground mb-3 gap-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {article.date}
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
            No articles in this category yet.
          </div>
        )}
      </div>
    </Layout>
  );
}
