import { useParams, Link } from "wouter";
import { getCityBySlug } from "@/data/cities";
import { generateCityContent, CLIMATE_CONTENT } from "@/data/city-content";
import { SEO } from "@/components/seo";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { MapPin, Car, ShieldCheck, ChevronRight, Search, Tag } from "lucide-react";

export default function CityPage() {
  const params = useParams<{ state: string; city: string }>();
  const cityData = getCityBySlug(params.state, params.city);

  if (!cityData) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
          <h1 className="text-2xl font-bold">City not found</h1>
          <p className="text-muted-foreground">We couldn't find a page for that city.</p>
          <Link href="/cities">
            <Button>Browse All Cities</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const content = generateCityContent(cityData);
  const climate = CLIMATE_CONTENT[cityData.climate];

  return (
    <Layout>
      <SEO
        title={content.pageTitle}
        description={content.metaDescription}
        canonical={`/cities/${cityData.stateSlug}/${cityData.slug}`}
        keywords={[`used cars ${cityData.city}`, `buy used car ${cityData.city} ${cityData.stateAbbr}`, `sell car ${cityData.city}`, `${cityData.city} auto market`, `used cars ${cityData.state}`]}
        jsonLd={content.jsonLd as Record<string, unknown>[]}
      />

      {/* Breadcrumb */}
      <div className="bg-muted/40 border-b">
        <div className="max-w-5xl mx-auto px-4 py-2 flex items-center gap-1 text-sm text-muted-foreground flex-wrap">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/cities" className="hover:text-foreground transition-colors">Cities</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={`/cities/${cityData.stateSlug}`} className="hover:text-foreground transition-colors">{cityData.state}</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground font-medium">{cityData.city}</span>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/90 to-primary text-white py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-primary-foreground/70 text-sm mb-3">
            <MapPin className="w-4 h-4" />
            <span>{cityData.city}, {cityData.state} · {climate.label}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            {content.h1}
          </h1>
          <p className="city-intro text-primary-foreground/85 text-lg max-w-3xl leading-relaxed mb-8">
            {content.intro}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href={`/search?location=${encodeURIComponent(cityData.city + ', ' + cityData.stateAbbr)}`}>
              <Button size="lg" className="bg-amber-500 hover:bg-amber-400 text-black font-semibold gap-2">
                <Search className="w-4 h-4" />
                Search Cars in {cityData.city}
              </Button>
            </Link>
            <Link href="/list-car">
              <Button size="lg" variant="outline" className="text-white border-white/40 hover:bg-white/10 gap-2">
                <Tag className="w-4 h-4" />
                List Your Car for Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Facts */}
      <section className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="font-bold text-lg text-primary">{cityData.pop.toLocaleString()}</div>
            <div className="text-muted-foreground">City Population</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg text-primary">{climate.label}</div>
            <div className="text-muted-foreground">Climate</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg text-primary">{climate.popularTypes[0]}</div>
            <div className="text-muted-foreground">Top Vehicle Type</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg text-primary">{cityData.stateAbbr}</div>
            <div className="text-muted-foreground">State</div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-10 space-y-12">

        {/* Why Buy Locally */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Why Buy a Car Locally in {cityData.city}?</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed text-base">
            {content.whyBuySection}
          </p>
        </section>

        {/* Best Cars for Climate */}
        <section className="bg-muted/30 rounded-2xl p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
              <Car className="w-5 h-5 text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold">Best Used Cars for {cityData.city}'s Climate</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed text-base mb-5">
            {content.carRecSection}
          </p>
          <div className="flex flex-wrap gap-2">
            {climate.popularTypes.map(t => (
              <span key={t} className="bg-white border rounded-full px-3 py-1 text-sm font-medium text-foreground shadow-sm">
                {t}
              </span>
            ))}
          </div>
        </section>

        {/* State Requirements */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold">{cityData.state} Car Buying Requirements</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed text-base">
            {content.stateRegSection}
          </p>
        </section>

        {/* Neighborhoods */}
        <section>
          <h2 className="text-2xl font-bold mb-4">
            Best Areas to Find Used Cars in {cityData.city}
          </h2>
          <p className="text-muted-foreground leading-relaxed text-base mb-5">
            {content.hoodSection}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {cityData.hoods.map(hood => (
              <div key={hood} className="bg-primary/5 rounded-lg px-3 py-2 text-sm font-medium text-primary text-center">
                {hood}
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="city-faqs">
          <h2 className="text-2xl font-bold mb-6">
            Frequently Asked Questions — Used Cars in {cityData.city}
          </h2>
          <div className="space-y-5">
            {content.faqs.map((faq, i) => (
              <div key={i} className="border rounded-xl p-5">
                <h3 className="font-semibold text-base mb-2">{faq.q}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-primary/10 to-amber-50 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-3">Ready to Buy or Sell in {cityData.city}?</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            CarsInMyCity connects real {cityData.city}-area buyers with local sellers — no middlemen,
            no out-of-state inventory, no surprises. Browse listings or post yours free today.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href={`/search?location=${encodeURIComponent(cityData.city + ', ' + cityData.stateAbbr)}`}>
              <Button size="lg" className="gap-2">
                <Search className="w-4 h-4" />
                Browse {cityData.city} Listings
              </Button>
            </Link>
            <Link href="/list-car">
              <Button size="lg" variant="outline" className="gap-2">
                <Tag className="w-4 h-4" />
                Sell Your Car Free
              </Button>
            </Link>
          </div>
        </section>

        {/* Other Cities in State */}
        <section>
          <h2 className="text-xl font-bold mb-4">Other Cities in {cityData.state}</h2>
          <Link href={`/cities/${cityData.stateSlug}`} className="text-primary hover:underline text-sm font-medium">
            View all {cityData.state} cities →
          </Link>
        </section>

      </div>

      {/* JSON-LD */}
      {content.jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </Layout>
  );
}
