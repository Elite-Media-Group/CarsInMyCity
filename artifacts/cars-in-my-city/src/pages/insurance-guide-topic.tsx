import { useParams } from "wouter";
import { Link } from "wouter";
import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  GraduationCap,
  CarFront,
  Wrench,
  FileCheck,
  AlertTriangle,
  Scale,
  Shield,
  ListX,
  Gauge,
  Layers,
  ChevronRight,
  HelpCircle,
  ArrowLeft,
  ArrowRight,
  Clock,
} from "lucide-react";
import { insuranceGuideTopics } from "./guide-data";
import { articles } from "./blog-data";

const iconMap = {
  "graduation-cap": GraduationCap,
  "car-front": CarFront,
  wrench: Wrench,
  "file-check": FileCheck,
  "alert-triangle": AlertTriangle,
  scale: Scale,
  shield: Shield,
  "list-x": ListX,
  gauge: Gauge,
  layers: Layers,
};

const AUTHOR = "CarsInMyCity Editorial Team";

export default function InsuranceGuideTopicPage() {
  const { slug } = useParams<{ slug: string }>();
  const meta = insuranceGuideTopics.find((t) => t.slug === slug);
  const article = articles.find((a) => a.slug === slug);

  if (!meta || !article) {
    return (
      <Layout>
        <SEO title="Guide Not Found" description="This guide topic doesn't exist or may have moved." />
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="text-3xl font-bold mb-4">Guide not found</h1>
          <p className="text-muted-foreground mb-8">
            This guide topic doesn't exist or may have moved.
          </p>
          <Link href="/buying-guide">
            <Button>Back to Buying Guide</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const Icon = iconMap[meta.icon];
  const canonicalUrl = `https://carsinmycity.com/buying-guide/insurance/${slug}`;

  const currentIndex = insuranceGuideTopics.findIndex((t) => t.slug === slug);
  const prev = currentIndex > 0 ? insuranceGuideTopics[currentIndex - 1] : null;
  const next =
    currentIndex < insuranceGuideTopics.length - 1
      ? insuranceGuideTopics[currentIndex + 1]
      : null;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: article.faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.metaDescription,
    image: article.img,
    datePublished: article.publishedIso,
    dateModified: article.modifiedIso,
    author: { "@type": "Organization", name: AUTHOR },
    publisher: { "@type": "Organization", name: "CarsInMyCity", url: "https://carsinmycity.com" },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
    keywords: article.keywords.join(", "),
  };

  return (
    <Layout>
      <SEO
        title={article.title}
        description={article.metaDescription}
        canonical={canonicalUrl}
        keywords={article.keywords}
        publishedTime={article.publishedIso}
        modifiedTime={article.modifiedIso}
        author={AUTHOR}
        jsonLd={[articleSchema, faqSchema]}
      />

      {/* Breadcrumb */}
      <div className="bg-muted/30 border-b border-border">
        <div className="container mx-auto px-4 py-3 max-w-4xl">
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground flex-wrap">
            <Link href="/buying-guide" className="hover:text-primary transition-colors">
              Buying Guide
            </Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0" />
            <Link href="/buying-guide#insurance" className="hover:text-primary transition-colors">
              Insurance
            </Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0" />
            <span className="text-foreground font-medium truncate max-w-[200px]">
              {meta.navLabel}
            </span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-rose-50 border-b border-rose-100">
        <div className="container mx-auto px-4 py-10 max-w-4xl">
          <Link href="/buying-guide">
            <Button variant="ghost" size="sm" className="gap-2 mb-6 -ml-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" /> Back to Buying Guide
            </Button>
          </Link>

          <div className="flex items-start gap-4 mb-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-600 text-white">
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wide text-rose-600">
                Insurance Guide · {meta.number} of {insuranceGuideTopics.length}
              </span>
              <h1 className="text-2xl md:text-4xl font-bold text-foreground mt-1 leading-snug">
                {article.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> {article.readTime}
            </span>
            <span className="text-muted-foreground/60">By {AUTHOR}</span>
          </div>

          <div className="aspect-[21/9] rounded-2xl overflow-hidden bg-muted shadow-sm max-h-64">
            <img
              src={article.img}
              alt={article.title}
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <article className="container mx-auto px-4 py-12 max-w-4xl">
        <p className="text-xl text-muted-foreground leading-relaxed mb-10 font-medium border-l-4 border-rose-500 pl-5">
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

        {/* Key Takeaways */}
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 md:p-8 mb-12">
          <h3 className="text-lg font-bold mb-5 text-rose-700">Key Takeaways</h3>
          <ul className="space-y-3" role="list">
            {article.keyTakeaways.map((point, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-sm md:text-base text-foreground/85"
              >
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-rose-600 text-white text-xs flex items-center justify-center font-bold mt-0.5">
                  {i + 1}
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        {/* FAQ */}
        {article.faq.length > 0 && (
          <div className="mb-12" id="faq">
            <div className="flex items-center gap-2 mb-6">
              <HelpCircle className="h-5 w-5 text-rose-600" />
              <h2 className="text-xl font-bold">Frequently Asked Questions</h2>
            </div>
            <Accordion type="single" collapsible className="border border-border rounded-xl overflow-hidden">
              {article.faq.map((item, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="border-b last:border-0 border-border px-1"
                >
                  <AccordionTrigger className="text-left font-semibold text-sm md:text-base py-5 hover:no-underline hover:text-rose-600">
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

        {/* Prev / Next nav */}
        <div className="mt-10 flex justify-between items-center flex-wrap gap-4 border-t border-border pt-8">
          {prev ? (
            <Link href={`/buying-guide/insurance/${prev.slug}`}>
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" /> {prev.navLabel}
              </Button>
            </Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link href={`/buying-guide/insurance/${next.slug}`}>
              <Button variant="outline" className="gap-2">
                {next.navLabel} <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <div />
          )}
        </div>

        <div className="mt-6 flex justify-between items-center flex-wrap gap-4">
          <Link href="/buying-guide">
            <Button variant="outline">All Insurance Guides</Button>
          </Link>
          <Link href="/search">
            <Button>Browse Cars</Button>
          </Link>
        </div>
      </article>
    </Layout>
  );
}
