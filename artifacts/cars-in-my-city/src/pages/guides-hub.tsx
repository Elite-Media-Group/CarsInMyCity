import { Link } from "wouter";
import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { buyingGuideTopics, insuranceGuideTopics } from "./guide-data";
import { motion } from "framer-motion";
import {
  Wallet,
  Car,
  ClipboardCheck,
  Gauge,
  ShieldCheck,
  GraduationCap,
  CarFront,
  Wrench,
  FileCheck,
  AlertTriangle,
  Scale,
  Shield,
  ListX,
  Layers,
  ArrowRight,
  HelpCircle,
  BookOpen,
  ShieldAlert,
} from "lucide-react";

const buyIcons = {
  wallet: Wallet,
  car: Car,
  "clipboard-check": ClipboardCheck,
  gauge: Gauge,
  "shield-check": ShieldCheck,
};

const insIcons = {
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

export default function GuidesHub() {
  const canonicalUrl = "https://carsinmycity.com/buying-guide";

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
        description="Everything you need to know before buying a used car locally: budgeting, choosing the right vehicle, inspection checklists, test drive tips, pre-purchase inspections, and 10 insurance guides."
        canonical={canonicalUrl}
        keywords={["used car buying guide", "how to buy a used car", "car buying tips", "car inspection checklist", "car insurance guide"]}
        jsonLd={faqSchema}
      />

      <section className="relative bg-primary pt-20 pb-24 md:pt-28 md:pb-32 overflow-hidden text-primary-foreground">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=2000"
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
            <BookOpen className="h-4 w-4" />
            Buyer Resources · 15 Guides
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-4xl md:text-6xl font-bold mb-5 leading-tight"
          >
            The Complete Used Car <br className="hidden sm:block" />
            <span className="text-accent">Buying Guide</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-9"
          >
            Five essential buying steps plus ten insurance guides — everything you need to buy
            the right car, protect it, and handle whatever comes next.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex flex-wrap items-center justify-center gap-2.5"
          >
            {buyingGuideTopics.map((topic) => {
              const Icon = buyIcons[topic.icon];
              return (
                <a
                  key={topic.slug}
                  href={`#${topic.slug}`}
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 ring-1 ring-white/15 px-4 py-2 text-sm font-medium text-white transition-colors"
                >
                  <Icon className="h-3.5 w-3.5 text-accent" />
                  {topic.navLabel}
                </a>
              );
            })}
            <a
              href="#insurance"
              className="inline-flex items-center gap-2 rounded-full bg-rose-500/20 hover:bg-rose-500/30 ring-1 ring-rose-300/30 px-4 py-2 text-sm font-medium text-white transition-colors"
            >
              <ShieldAlert className="h-3.5 w-3.5 text-rose-300" />
              Insurance (10)
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

      <div className="container mx-auto px-4 py-12 md:py-16 max-w-5xl">
        {/* 5-Step Buying Guide */}
        <div className="grid gap-5 sm:grid-cols-2">
          {buyingGuideTopics.map((topic) => {
            const Icon = buyIcons[topic.icon];
            return (
              <Link key={topic.slug} href={`/guides/${topic.slug}`}>
                <Card id={topic.slug} className="group h-full p-6 cursor-pointer border-border hover:border-primary hover:shadow-lg transition-all scroll-mt-24">
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

        {/* Insurance Guides */}
        <div id="insurance" className="mt-16 scroll-mt-24">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Car Insurance Guides</h2>
              <p className="text-sm text-muted-foreground">
                10 guides covering everything from first-time coverage to what to do after an accident
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {insuranceGuideTopics.map((topic) => {
              const Icon = insIcons[topic.icon];
              return (
                <Link key={topic.slug} href={`/buying-guide/insurance/${topic.slug}`}>
                  <Card className="group h-full p-5 cursor-pointer border-border hover:border-rose-400 hover:shadow-md transition-all">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-bold uppercase tracking-wide text-rose-500">
                          Guide {topic.number}
                        </span>
                        <h3 className="text-base font-bold text-foreground mt-0.5 mb-1 leading-snug">
                          {topic.navLabel}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {topic.excerpt}
                        </p>
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-rose-600 mt-2 group-hover:gap-2 transition-all">
                          Read more <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex justify-between items-center flex-wrap gap-4">
          <Link href="/"><Button variant="outline">Back to Home</Button></Link>
          <Link href="/search"><Button>Browse Cars</Button></Link>
        </div>
      </div>
    </Layout>
  );
}
