import { useParams, Link } from "wouter";
import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { buyingGuideTopics, getGuideTopic } from "./guide-data";
import { Wallet, Car, ClipboardCheck, Gauge, ShieldCheck, ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";

const icons = {
  wallet: Wallet,
  car: Car,
  "clipboard-check": ClipboardCheck,
  gauge: Gauge,
  "shield-check": ShieldCheck,
};

export default function GuideTopicPage() {
  const { slug } = useParams<{ slug: string }>();
  const topic = slug ? getGuideTopic(slug) : undefined;

  if (!topic) {
    return (
      <Layout>
        <SEO title="Guide Not Found" description="This guide topic doesn't exist or may have moved." />
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="text-3xl font-bold mb-4">Guide not found</h1>
          <p className="text-muted-foreground mb-8">This guide topic doesn't exist or may have moved.</p>
          <Link href="/guides"><Button>Back to Guides</Button></Link>
        </div>
      </Layout>
    );
  }

  const index = buyingGuideTopics.findIndex((t) => t.slug === topic.slug);
  const prevTopic = index > 0 ? buyingGuideTopics[index - 1] : undefined;
  const nextTopic = index < buyingGuideTopics.length - 1 ? buyingGuideTopics[index + 1] : undefined;
  const Icon = icons[topic.icon];
  const canonicalUrl = `https://carsinmycity.com/guides/${topic.slug}`;

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
          <Link href="/guides" className="hover:text-primary">Guides</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium">{topic.navLabel}</span>
        </div>

        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </div>
          <span className="text-sm font-bold uppercase tracking-wide text-accent">
            Step {topic.number} of {buyingGuideTopics.length}
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
            <Link href={`/guides/${prevTopic.slug}`}>
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
            <Link href={`/guides/${nextTopic.slug}`}>
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
          <Link href="/guides"><Button variant="outline">All Guide Topics</Button></Link>
          <Link href="/search"><Button>Browse Cars</Button></Link>
        </div>
      </div>
    </Layout>
  );
}
