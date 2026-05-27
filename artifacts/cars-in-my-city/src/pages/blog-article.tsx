import { useParams } from "wouter";
import { Link } from "wouter";
import { Layout } from "@/components/layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Clock, Calendar, ChevronRight } from "lucide-react";
import { articles } from "./blog-data";

export default function BlogArticle() {
  const { slug } = useParams<{ slug: string }>();
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="text-3xl font-bold mb-4">Article not found</h1>
          <p className="text-muted-foreground mb-8">This article doesn't exist or may have moved.</p>
          <Link href="/blog">
            <Button>Back to Blog</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const related = articles.filter(
    (a) => a.slug !== article.slug && (a.category === article.category)
  ).slice(0, 3);

  const categoryColors: Record<string, string> = {
    Buying: "bg-primary/10 text-primary",
    Selling: "bg-accent/10 text-amber-700",
    Guides: "bg-emerald-50 text-emerald-700",
    Finance: "bg-purple-50 text-purple-700",
  };

  return (
    <Layout>
      <div className="bg-muted/30 border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground truncate max-w-[200px]">{article.title}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link href="/blog">
          <Button variant="ghost" size="sm" className="gap-2 mb-8 -ml-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> All Articles
          </Button>
        </Link>

        <div className="mb-8">
          <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-4 ${categoryColors[article.category] ?? "bg-muted text-muted-foreground"}`}>
            {article.category}
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
            {article.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" /> {article.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> {article.readTime}
            </span>
          </div>
        </div>

        <div className="aspect-[21/9] rounded-2xl overflow-hidden mb-10 bg-muted shadow-md">
          <img
            src={article.img}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-muted-foreground leading-relaxed mb-10 font-medium border-l-4 border-primary pl-5">
            {article.excerpt}
          </p>

          {article.sections.map((section, i) => (
            <div key={i} className="mb-10">
              <h2 className="text-xl md:text-2xl font-bold mb-4 text-foreground">
                {section.heading}
              </h2>
              <p className="text-foreground/80 leading-relaxed text-base md:text-lg">
                {section.body}
              </p>
            </div>
          ))}
        </div>

        <Separator className="my-10" />

        <div className="bg-primary/5 border border-primary/15 rounded-2xl p-6 md:p-8 mb-12">
          <h3 className="text-lg font-bold mb-4 text-primary">Key Takeaways</h3>
          <ul className="space-y-3">
            {article.keyTakeaways.map((point, i) => (
              <li key={i} className="flex items-start gap-3 text-sm md:text-base text-foreground/85">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold mt-0.5">
                  {i + 1}
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        {related.length > 0 && (
          <div>
            <h3 className="text-xl font-bold mb-6">More in {article.category}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {related.map((rel) => (
                <Link key={rel.slug} href={`/blog/${rel.slug}`}>
                  <Card className="overflow-hidden hover:shadow-md transition-all group cursor-pointer border-border/50 hover:border-primary/30 h-full">
                    <div className="aspect-[16/9] overflow-hidden bg-muted">
                      <img
                        src={rel.img}
                        alt={rel.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="text-xs text-muted-foreground mb-2 flex items-center gap-2">
                        <span>{rel.date}</span>
                        <span>·</span>
                        <span>{rel.readTime}</span>
                      </div>
                      <h4 className="font-semibold text-sm leading-snug group-hover:text-primary transition-colors line-clamp-3">
                        {rel.title}
                      </h4>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        <Separator className="my-10" />

        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">Ready to find your perfect car?</h3>
          <p className="text-muted-foreground mb-6">Browse 26+ local listings across the US.</p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/search">
              <Button size="lg">Browse Listings</Button>
            </Link>
            <Link href="/blog">
              <Button variant="outline" size="lg">More Articles</Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
