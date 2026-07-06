import { useParams, Link } from "wouter";
import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { sellingGuideTopics, getSellingGuideTopic } from "./guide-data";
import { Sparkles, Camera, Tag, FileText, Handshake, ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";

const icons = {
  sparkles: Sparkles,
  camera: Camera,
  tag: Tag,
  "file-text": FileText,
  handshake: Handshake,
};

export default function SellingGuideTopicPage() {
  const { slug } = useParams<{ slug: string }>();
  const topic = slug ? getSellingGuideTopic(slug) : undefined;

  if (!topic) {
    return (
      <Layout>
        <SEO title="Guide Not Found" description="This guide topic doesn't exist or may have moved." />
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="text-3xl font-bold mb-4">Guide not found</h1>
          <p className="text-muted-foreground mb-8">This guide topic doesn't exist or may have moved.</p>
          <Link href="/selling-guide"><Button>Back to Selling Guide</Button></Link>
        </div>
      </Layout>
    );
  }

  const index = sellingGuideTopics.findIndex((t) => t.slug === topic.slug);
  const prevTopic = index > 0 ? sellingGuideTopics[index - 1] : undefined;
  const nextTopic = index < sellingGuideTopics.length - 1 ? sellingGuideTopics[index + 1] : undefined;
  const Icon = icons[topic.icon];
  const canonicalUrl = `https://carsinmycity.com/selling-guide/${topic.slug}`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: topic.question,
    description: topic.metaDescription,
    author: { "@type": "Organization", name: "CarsInMyCity" },
    publisher: { "@type": "Organization", name: "CarsInMyCity" },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: topic.faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <Layout>
      <SEO
        title={topic.question}
        description={topic.metaDescription}
        canonical={canonicalUrl}
        keywords={topic.keywords}
        type="article"
        jsonLd={[articleSchema, faqSchema]}
      />

      <div className="container mx-auto px-4 py-10 max-w-3xl">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6 flex-wrap">
          <Link href="/selling-guide" className="hover:text-primary">Selling Guide</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium">{topic.navLabel}</span>
        </div>

        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </div>
          <span className="text-sm font-bold uppercase tracking-wide text-accent">
            Step {topic.number} of {sellingGuideTopics.length}
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-5 leading-tight">
          {topic.question}
        </h1>

        <Card className="p-5 bg-primary/5 border-primary/20 mb-8">
          <p className="text-lg text-foreground font-medium leading-relaxed">{topic.shortAnswer}</p>
        </Card>

        <div className="prose prose-lg max-w-none text-muted-foreground prose-headings:text-foreground prose-headings:font-bold prose-a:text-primary hover:prose-a:text-accent prose-strong:text-foreground">
          {topic.sections.map((section) => (
            <div key={section.heading}>
              <h2>{section.heading}</h2>
              {section.body.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
              {section.bullets && (
                <ul>
                  {section.bullets.map((bullet, i) => (
                    <li key={i}>{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-5">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {topic.faqs.map((faq) => (
              <Card key={faq.question} className="p-5">
                <h3 className="font-bold text-foreground mb-2">{faq.question}</h3>
                <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-border grid gap-4 sm:grid-cols-2">
          {prevTopic ? (
            <Link href={`/selling-guide/${prevTopic.slug}`}>
              <Card className="p-4 h-full flex items-center gap-3 cursor-pointer hover:border-primary transition-colors">
                <ArrowLeft className="h-4 w-4 text-primary shrink-0" />
                <div>
                  <span className="text-xs text-muted-foreground block">Previous</span>
                  <span className="text-sm font-semibold text-foreground">{prevTopic.navLabel}</span>
                </div>
              </Card>
            </Link>
          ) : <div />}

          {nextTopic ? (
            <Link href={`/selling-guide/${nextTopic.slug}`}>
              <Card className="p-4 h-full flex items-center justify-end gap-3 cursor-pointer hover:border-primary transition-colors text-right">
                <div>
                  <span className="text-xs text-muted-foreground block">Next</span>
                  <span className="text-sm font-semibold text-foreground">{nextTopic.navLabel}</span>
                </div>
                <ArrowRight className="h-4 w-4 text-primary shrink-0" />
              </Card>
            </Link>
          ) : <div />}
        </div>

        <div className="mt-8 flex justify-between items-center flex-wrap gap-4">
          <Link href="/selling-guide"><Button variant="outline">All Selling Guide Topics</Button></Link>
          <Link href="/list-car"><Button>List Your Car</Button></Link>
        </div>
      </div>
    </Layout>
  );
}
