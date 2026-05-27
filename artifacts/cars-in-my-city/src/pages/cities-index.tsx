import { Link } from "wouter";
import { getStates } from "@/data/cities";
import { SEO } from "@/components/seo";
import { Layout } from "@/components/layout";
import { MapPin, ChevronRight } from "lucide-react";

const US_REGION: Record<string, string> = {
  alabama: "South", alaska: "West", arizona: "Southwest", arkansas: "South",
  california: "West", colorado: "Mountain West", connecticut: "Northeast",
  delaware: "Mid-Atlantic", florida: "South", georgia: "South",
  hawaii: "West", idaho: "Northwest", illinois: "Midwest", indiana: "Midwest",
  iowa: "Midwest", kansas: "Midwest", kentucky: "South", louisiana: "South",
  maine: "Northeast", maryland: "Mid-Atlantic", massachusetts: "Northeast",
  michigan: "Midwest", minnesota: "Midwest", mississippi: "South",
  missouri: "Midwest", montana: "Mountain West", nebraska: "Midwest",
  nevada: "Southwest", "new-hampshire": "Northeast", "new-jersey": "Northeast",
  "new-mexico": "Southwest", "new-york": "Northeast", "north-carolina": "South",
  "north-dakota": "Midwest", ohio: "Midwest", oklahoma: "South",
  oregon: "Northwest", pennsylvania: "Northeast", "rhode-island": "Northeast",
  "south-carolina": "South", "south-dakota": "Midwest", tennessee: "South",
  texas: "South", utah: "Mountain West", vermont: "Northeast",
  virginia: "South", washington: "Northwest", "west-virginia": "South",
  wisconsin: "Midwest", wyoming: "Mountain West",
};

const REGIONS = ["Northeast", "Mid-Atlantic", "South", "Midwest", "Mountain West", "Southwest", "Northwest", "West"];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Used Cars for Sale by City — All 50 States | CarsInMyCity",
  description: "Browse hyper-local used car listings across 250 cities in all 50 US states. Find cars near you on CarsInMyCity.",
  url: "https://carsinmycity.com/cities",
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://carsinmycity.com" },
      { "@type": "ListItem", position: 2, name: "Browse by City", item: "https://carsinmycity.com/cities" },
    ],
  },
};

export default function CitiesIndex() {
  const states = getStates();
  const byRegion = new Map<string, typeof states>();
  for (const region of REGIONS) byRegion.set(region, []);
  for (const s of states) {
    const region = US_REGION[s.stateSlug] ?? "Other";
    if (!byRegion.has(region)) byRegion.set(region, []);
    byRegion.get(region)!.push(s);
  }

  return (
    <Layout>
      <SEO
        title="Used Cars for Sale by City — All 50 States | CarsInMyCity"
        description="Browse hyper-local used car listings from private sellers and dealers in 250 cities across all 50 US states. Find the perfect car near you on CarsInMyCity."
        canonical="/cities"
        keywords={["used cars by city", "buy used car near me", "local car listings USA", "used cars all states"]}
        jsonLd={jsonLd}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/90 to-primary text-white py-14 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 text-primary-foreground/70 text-sm mb-3">
            <MapPin className="w-4 h-4" />
            <span>250 cities · All 50 states</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Find Used Cars Near You — Browse by City
          </h1>
          <p className="text-primary-foreground/85 text-lg max-w-2xl mx-auto leading-relaxed">
            CarsInMyCity is built for local car buying. Every city page includes hyper-local
            market insights, climate-specific buying tips, and state regulation guides — so you
            walk into every deal prepared.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-4 mb-10 text-center">
          <div className="bg-muted/40 rounded-xl p-4">
            <div className="text-2xl font-bold text-primary">50</div>
            <div className="text-sm text-muted-foreground">States covered</div>
          </div>
          <div className="bg-muted/40 rounded-xl p-4">
            <div className="text-2xl font-bold text-primary">250</div>
            <div className="text-sm text-muted-foreground">City pages</div>
          </div>
          <div className="bg-muted/40 rounded-xl p-4">
            <div className="text-2xl font-bold text-primary">100%</div>
            <div className="text-sm text-muted-foreground">Local listings</div>
          </div>
        </div>

        {/* States by region */}
        {REGIONS.map(region => {
          const regionStates = byRegion.get(region) ?? [];
          if (regionStates.length === 0) return null;
          return (
            <section key={region} className="mb-10">
              <h2 className="text-xl font-bold mb-4 pb-2 border-b">{region}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {regionStates.map(s => (
                  <Link key={s.stateSlug} href={`/cities/${s.stateSlug}`}>
                    <div className="flex items-center justify-between p-4 rounded-xl border bg-white hover:border-primary hover:shadow-sm transition-all cursor-pointer group">
                      <div>
                        <div className="font-semibold group-hover:text-primary transition-colors">{s.state}</div>
                        <div className="text-xs text-muted-foreground">{s.cityCount} cities</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}

        {/* Bottom CTA */}
        <div className="bg-gradient-to-r from-primary/10 to-amber-50 rounded-2xl p-8 text-center mt-4">
          <h2 className="text-xl font-bold mb-2">Don't see your city?</h2>
          <p className="text-muted-foreground mb-4 text-sm">
            CarsInMyCity works everywhere in the US. Search by zip code or browse all listings nationally.
          </p>
          <Link href="/search">
            <span className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors">
              Search All Listings
            </span>
          </Link>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </Layout>
  );
}
