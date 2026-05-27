import { useParams } from "wouter";
import { Link } from "wouter";
import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowLeft, Clock, Calendar, ChevronRight, HelpCircle } from "lucide-react";
import { articles } from "./blog-data";

const categoryColors: Record<string, string> = {
  Buying: "bg-primary/10 text-primary",
  Selling: "bg-amber-50 text-amber-700",
  Guides: "bg-emerald-50 text-emerald-700",
  Finance: "bg-purple-50 text-purple-700",
};

const AUTHOR = "CarsInMyCity Editorial Team";
const PUBLISHER = {
  "@type": "Organization",
  name: "CarsInMyCity",
  url: "https://carsinmycity.com",
  logo: {
    "@type": "ImageObject",
    url: "https://carsinmycity.com/favicon.svg",
  },
};

export default function BlogArticle() {
  const { slug } = useParams<{ slug: string }>();
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    return (
      <Layout>
        <SEO title="Article Not Found" description="This article doesn't exist or may have moved." />
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="text-3xl font-bold mb-4">Article not found</h1>
          <p className="text-muted-foreground mb-8">This article doesn't exist or may have moved.</p>
          <Link href="/blog"><Button>Back to Blog</Button></Link>
        </div>
      </Layout>
    );
  }

  const canonicalUrl = `https://carsinmycity.com/blog/${article.slug}`;

  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.metaDescription,
    image: article.img,
    datePublished: article.publishedIso,
    dateModified: article.modifiedIso,
    author: {
      "@type": "Organization",
      name: AUTHOR,
      url: "https://carsinmycity.com",
    },
    publisher: PUBLISHER,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    keywords: article.keywords.join(", "),
    articleSection: article.category,
    wordCount: article.sections.reduce((acc, s) => acc + s.body.split(" ").length, 0),
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["article h1", "article h2", ".article-excerpt"],
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: article.faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };

  const jsonLd = [blogPostingSchema, faqSchema];

  const related = articles
    .filter((a) => a.slug !== article.slug && a.category === article.category)
    .slice(0, 3);

  return (
    <Layout>
      <SEO
        title={article.title}
        description={article.metaDescription}
        image={`https://carsinmycity.com/api/og/blog/${article.slug}`}
        type="article"
        canonical={canonicalUrl}
        keywords={article.keywords}
        publishedTime={article.publishedIso}
        modifiedTime={article.modifiedIso}
        author={AUTHOR}
        jsonLd={jsonLd}
      />

      <div className="bg-muted/30 border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3 flex-shrink-0" />
            <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
            <ChevronRight className="h-3 w-3 flex-shrink-0" />
            <span className="text-foreground truncate max-w-[220px]">{article.title}</span>
          </nav>
        </div>
      </div>

      <article className="container mx-auto px-4 py-12 max-w-4xl">
        <Link href="/blog">
          <Button variant="ghost" size="sm" className="gap-2 mb-8 -ml-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> All Articles
          </Button>
        </Link>

        <header className="mb-8">
          <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-4 ${categoryColors[article.category] ?? "bg-muted text-muted-foreground"}`}>
            {article.category}
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
            {article.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <time dateTime={article.publishedIso}>{article.date}</time>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> {article.readTime}
            </span>
            <span className="text-muted-foreground/60">By {AUTHOR}</span>
          </div>
        </header>

        <div className="aspect-[21/9] rounded-2xl overflow-hidden mb-10 bg-muted shadow-md">
          <img
            src={article.img}
            alt={article.title}
            className="w-full h-full object-cover"
            loading="eager"
          />
        </div>

        <p className="article-excerpt text-xl text-muted-foreground leading-relaxed mb-10 font-medium border-l-4 border-primary pl-5">
          {article.excerpt}
        </p>

        <div className="space-y-10 mb-12">
          {article.sections.map((section, i) => (
            <section key={i}>
              <h2 className="text-xl md:text-2xl font-bold mb-4 text-foreground">
                {section.heading}
              </h2>
              <p className="text-foreground/80 leading-relaxed text-base md:text-lg">
                {section.body}
              </p>
            </section>
          ))}
        </div>

        <div className="bg-primary/5 border border-primary/15 rounded-2xl p-6 md:p-8 mb-12">
          <h3 className="text-lg font-bold mb-5 text-primary">Key Takeaways</h3>
          <ul className="space-y-3" role="list">
            {article.keyTakeaways.map((point, i) => (
              <li key={i} className="flex items-start gap-3 text-sm md:text-base text-foreground/85">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold mt-0.5" aria-hidden>
                  {i + 1}
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        {article.faq.length > 0 && (
          <div className="mb-12" id="faq">
            <div className="flex items-center gap-2 mb-6">
              <HelpCircle className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold">Frequently Asked Questions</h2>
            </div>
            <Accordion type="single" collapsible className="border border-border rounded-xl overflow-hidden">
              {article.faq.map((item, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border-b last:border-0 border-border px-1">
                  <AccordionTrigger className="text-left font-semibold text-sm md:text-base py-5 hover:no-underline hover:text-primary">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-foreground/80 leading-relaxed pb-5 text-sm md:text-base">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}

        <Separator className="my-10" />

        {related.length > 0 && (
          <div className="mb-12">
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
                        loading="lazy"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="text-xs text-muted-foreground mb-2 flex items-center gap-2">
                        <span>{rel.date}</span><span>·</span><span>{rel.readTime}</span>
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

        <div className="bg-muted/50 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold mb-2">Ready to find your perfect car?</h3>
          <p className="text-muted-foreground mb-6">Browse 26+ local listings across the US.</p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link href="/search"><Button size="lg">Browse Listings</Button></Link>
            <Link href="/blog"><Button variant="outline" size="lg">More Articles</Button></Link>
          </div>
        </div>
      </article>
    </Layout>
  );
}
