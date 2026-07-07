import { Link } from "wouter";
import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { buyingGuideTopics, sellingGuideTopics, insuranceGuideTopics } from "./guide-data";
import { motion } from "framer-motion";
import {
  Wallet,
  Car,
  ClipboardCheck,
  Gauge,
  ShieldCheck,
  Sparkles,
  Camera,
  Tag,
  FileText,
  Handshake,
  ArrowRight,
  BookOpen,
  GraduationCap,
  ShieldAlert,
} from "lucide-react";

const buyIcons = {
  wallet: Wallet,
  car: Car,
  "clipboard-check": ClipboardCheck,
  gauge: Gauge,
  "shield-check": ShieldCheck,
};

const sellIcons = {
  sparkles: Sparkles,
  camera: Camera,
  tag: Tag,
  "file-text": FileText,
  handshake: Handshake,
};

export default function GuidesLandingPage() {
  const canonicalUrl = "https://carsinmycity.com/guides";

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [...buyingGuideTopics, ...sellingGuideTopics].map((topic) => ({
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
        title="Car Buying & Selling Guides — The Knowledge Center"
        description="Every bit of knowledge a car buyer or seller could need, in one place. Ten in-depth guides covering budgeting, inspections, test drives, pricing, listing photos, safe transactions, and more."
        canonical={canonicalUrl}
        keywords={[
          "car buying guide",
          "car selling guide",
          "how to buy a used car",
          "how to sell a car",
          "car marketplace resources",
        ]}
        jsonLd={faqSchema}
      />

      {/* Hero */}
      <section className="relative bg-primary pt-20 pb-24 md:pt-28 md:pb-32 overflow-hidden text-primary-foreground">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=2000"
            alt=""
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary/70" />
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
          <div className="absolute -bottom-32 -left-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10 max-w-5xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full bg-white/10 ring-1 ring-white/20 px-4 py-1.5 text-sm font-semibold text-accent mb-6"
          >
            <GraduationCap className="h-4 w-4" />
            The Knowledge Center
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-4xl md:text-6xl font-bold mb-5 leading-tight"
          >
            Everything you need to <br className="hidden sm:block" />
            <span className="text-accent">buy or sell</span> with confidence
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-9"
          >
            Twenty expert-built guides — ten for buyers (including 10 insurance guides), five for
            sellers — covering every step of a local car transaction, from budgeting to safe
            handoffs and everything in between.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            <a
              href="#buying"
              className="inline-flex items-center gap-2 rounded-full bg-white text-primary px-5 py-2.5 text-sm font-semibold hover:bg-white/90 transition-colors"
            >
              <Wallet className="h-4 w-4" />
              I'm Buying
            </a>
            <a
              href="#selling"
              className="inline-flex items-center gap-2 rounded-full bg-accent text-accent-foreground px-5 py-2.5 text-sm font-semibold hover:bg-accent/90 transition-colors"
            >
              <Tag className="h-4 w-4" />
              I'm Selling
            </a>
          </motion.div>
        </div>

        <svg
          className="absolute bottom-0 left-0 w-full text-background"
          viewBox="0 0 1440 60"
          fill="currentColor"
          preserveAspectRatio="none"
        >
          <path d="M0,32 C240,60 480,60 720,40 C960,20 1200,4 1440,24 L1440,60 L0,60 Z" />
        </svg>
      </section>

      {/* Two category showcase */}
      <section className="container mx-auto px-4 py-16 md:py-20 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          <div id="buying" className="scroll-mt-24 relative rounded-3xl overflow-hidden border border-border bg-gradient-to-br from-primary/5 to-primary/10 p-8 md:p-10 flex flex-col">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground mb-6">
              <BookOpen className="h-7 w-7" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wide text-primary mb-2">
              For Buyers · 15 Guides
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              The Complete Used Car Buying Guide
            </h2>
            <p className="text-muted-foreground mb-5 leading-relaxed">
              From setting a realistic budget to walking away confident after a professional
              inspection — plus ten insurance guides so you're covered before and after the sale.
            </p>

            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-2">
              5-Step Buying Guide
            </p>
            <ul className="space-y-2 mb-5">
              {buyingGuideTopics.map((topic) => {
                const Icon = buyIcons[topic.icon];
                return (
                  <li key={topic.slug}>
                    <Link
                      href={`/guides/${topic.slug}`}
                      className="group flex items-center gap-2.5 text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
                    >
                      <Icon className="h-4 w-4 text-primary shrink-0" />
                      {topic.navLabel}
                      <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center gap-1.5 mb-2">
              <ShieldAlert className="h-3.5 w-3.5 text-rose-500" />
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Insurance Guides (10)
              </p>
            </div>
            <ul className="space-y-2 mb-8">
              {insuranceGuideTopics.map((topic) => (
                <li key={topic.slug}>
                  <Link
                    href={`/buying-guide/insurance/${topic.slug}`}
                    className="group flex items-center gap-2.5 text-sm font-medium text-foreground/80 hover:text-rose-600 transition-colors"
                  >
                    <ShieldAlert className="h-4 w-4 text-rose-400 shrink-0" />
                    {topic.navLabel}
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-auto">
              <Link href="/buying-guide">
                <Button size="lg" className="w-full sm:w-auto">
                  Explore the Buying Guide <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>

          <div id="selling" className="scroll-mt-24 relative rounded-3xl overflow-hidden border border-border bg-gradient-to-br from-accent/10 to-accent/15 p-8 md:p-10 flex flex-col">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground mb-6">
              <Handshake className="h-7 w-7" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wide text-accent mb-2">
              For Sellers · 5 Guides
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              The Complete Car Selling Guide
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              From prepping and photographing your car to closing a safe, fair deal — everything
              you need to sell faster and for more money.
            </p>
            <ul className="space-y-2.5 mb-8">
              {sellingGuideTopics.map((topic) => {
                const Icon = sellIcons[topic.icon];
                return (
                  <li key={topic.slug}>
                    <Link
                      href={`/selling-guide/${topic.slug}`}
                      className="group flex items-center gap-2.5 text-sm font-medium text-foreground/80 hover:text-accent-foreground transition-colors"
                    >
                      <Icon className="h-4 w-4 text-accent shrink-0" />
                      {topic.navLabel}
                      <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="mt-auto">
              <Link href="/selling-guide">
                <Button size="lg" className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90">
                  Explore the Selling Guide <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Key takeaways summary */}
      <section className="bg-muted/30 py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              The short version, if you're in a hurry
            </h2>
            <p className="text-muted-foreground">
              A quick summary of the most important takeaways from both guides — read the full
              topics above for the details.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            <div>
              <div className="flex items-center gap-2 mb-5">
                <Wallet className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-bold text-foreground">Top 5 Buying Takeaways</h3>
              </div>
              <div className="space-y-3">
                {buyingGuideTopics.map((topic) => (
                  <Card key={topic.slug} className="p-4">
                    <p className="text-sm font-semibold text-foreground mb-1">{topic.navLabel}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      {topic.shortAnswer}
                    </p>
                  </Card>
                ))}
              </div>
              <Link href="/buying-guide">
                <Button variant="outline" className="w-full mt-4">
                  Read the Full Buying Guide
                </Button>
              </Link>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-5">
                <Tag className="h-5 w-5 text-accent" />
                <h3 className="text-lg font-bold text-foreground">Top 5 Selling Takeaways</h3>
              </div>
              <div className="space-y-3">
                {sellingGuideTopics.map((topic) => (
                  <Card key={topic.slug} className="p-4">
                    <p className="text-sm font-semibold text-foreground mb-1">{topic.navLabel}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      {topic.shortAnswer}
                    </p>
                  </Card>
                ))}
              </div>
              <Link href="/selling-guide">
                <Button variant="outline" className="w-full mt-4 border-accent/40 text-accent-foreground hover:bg-accent/10">
                  Read the Full Selling Guide
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <div className="container mx-auto px-4 py-14 max-w-5xl">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 rounded-2xl border border-border bg-card p-8 text-center sm:text-left">
          <div>
            <h3 className="text-xl font-bold text-foreground mb-1">Ready to put this into action?</h3>
            <p className="text-muted-foreground">Browse cars near you, or list your own in minutes.</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link href="/search"><Button variant="outline">Browse Cars</Button></Link>
            <Link href="/list-car"><Button>List Your Car</Button></Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
