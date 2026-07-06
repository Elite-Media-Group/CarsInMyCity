import { Link } from "wouter";
import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { buyingGuideTopics } from "./guide-data";
import { Wallet, Car, ClipboardCheck, Gauge, ShieldCheck, ArrowRight, HelpCircle } from "lucide-react";

const icons = {
  wallet: Wallet,
  car: Car,
  "clipboard-check": ClipboardCheck,
  gauge: Gauge,
  "shield-check": ShieldCheck,
};

export default function GuidesHub() {
  const canonicalUrl = "https://carsinmycity.com/guides";

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: buyingGuideTopics.map((topic) => ({
      "@type": "Question",
      name: topic.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: topic.shortAnswer,
      },
    })),
  };

  return (
    <Layout>
      <SEO
        title="The Complete Used Car Buying Guide"
        description="Everything you need to know before buying a used car locally: budgeting, choosing the right vehicle, inspection checklists, test drive tips, and pre-purchase inspections."
        canonical={canonicalUrl}
        keywords={["used car buying guide", "how to buy a used car", "car buying tips", "car inspection checklist"]}
        jsonLd={faqSchema}
      />

      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-16 md:py-20 max-w-5xl text-center">
          <span className="inline-block rounded-full bg-white/10 px-4 py-1 text-sm font-semibold text-accent mb-4">
            Buyer Resources
          </span>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            The Complete Used Car Buying Guide
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Five essential steps to buying a used car with confidence — from setting a realistic
            budget to getting a professional inspection before you sign anything.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 md:py-16 max-w-5xl">
        <div className="grid gap-5 sm:grid-cols-2">
          {buyingGuideTopics.map((topic) => {
            const Icon = icons[topic.icon];
            return (
              <Link key={topic.slug} href={`/guides/${topic.slug}`}>
                <Card className="group h-full p-6 cursor-pointer border-border hover:border-primary hover:shadow-lg transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <span className="text-xs font-bold uppercase tracking-wide text-accent">
                        Step {topic.number}
                      </span>
                      <h2 className="text-lg font-bold text-foreground mt-1 mb-2 leading-snug">
                        {topic.question}
                      </h2>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {topic.shortAnswer}
                      </p>
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary mt-3 group-hover:gap-2 transition-all">
                        Read more <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}

          <Card className="h-full p-6 border-dashed border-2 border-border flex flex-col items-center justify-center text-center bg-muted/30">
            <HelpCircle className="h-8 w-8 text-accent mb-3" />
            <h2 className="text-base font-bold text-foreground mb-1">Selling instead?</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Check out our step-by-step guide to selling your car locally.
            </p>
            <Link href="/selling-guide">
              <Button variant="outline" size="sm">View Selling Guide</Button>
            </Link>
          </Card>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex justify-between items-center flex-wrap gap-4">
          <Link href="/"><Button variant="outline">Back to Home</Button></Link>
          <Link href="/search"><Button>Browse Cars</Button></Link>
        </div>
      </div>
    </Layout>
  );
}
