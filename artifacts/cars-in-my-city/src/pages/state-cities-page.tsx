import { useParams, Link } from "wouter";
import { getCitiesByState, getStates } from "@/data/cities";
import { CLIMATE_CONTENT, STATE_REGS } from "@/data/city-content";
import { SEO } from "@/components/seo";
import { Layout } from "@/components/layout";
import { MapPin, ChevronRight, Car } from "lucide-react";

export default function StateCitiesPage() {
  const params = useParams<{ state: string }>();
  const cities = getCitiesByState(params.state);

  if (cities.length === 0) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
          <h1 className="text-2xl font-bold">State not found</h1>
          <Link href="/cities">
            <span className="text-primary hover:underline">Browse all cities →</span>
          </Link>
        </div>
      </Layout>
    );
  }

  const stateInfo = cities[0];
  const stateReg = STATE_REGS[params.state] ?? "";
  const allStates = getStates();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Used Cars for Sale in ${stateInfo.state} — Top Cities | CarsInMyCity`,
    description: `Browse used car listings across the top ${cities.length} cities in ${stateInfo.state}. Find local sellers and dealers near you.`,
    url: `https://carsinmycity.com/cities/${params.state}`,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://carsinmycity.com" },
        { "@type": "ListItem", position: 2, name: "Cities", item: "https://carsinmycity.com/cities" },
        { "@type": "ListItem", position: 3, name: stateInfo.state, item: `https://carsinmycity.com/cities/${params.state}` },
      ],
    },
  };

  return (
    <Layout>
      <SEO
        title={`Used Cars for Sale in ${stateInfo.state} — Top Cities | CarsInMyCity`}
        description={`Find used cars for sale in ${stateInfo.state}'s top cities. Browse hyper-local listings from private sellers and dealers in ${cities.map(c => c.city).slice(0, 3).join(", ")}, and more.`}
        canonical={`/cities/${params.state}`}
        keywords={[`used cars ${stateInfo.state}`, `buy used car ${stateInfo.stateAbbr}`, `local car listings ${stateInfo.state}`, ...cities.map(c => c.city)]}
        jsonLd={jsonLd}
      />

      {/* Breadcrumb */}
      <div className="bg-muted/40 border-b">
        <div className="max-w-5xl mx-auto px-4 py-2 flex items-center gap-1 text-sm text-muted-foreground flex-wrap">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/cities" className="hover:text-foreground transition-colors">Cities</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground font-medium">{stateInfo.state}</span>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/90 to-primary text-white py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-primary-foreground/70 text-sm mb-3">
            <MapPin className="w-4 h-4" />
            <span>{stateInfo.state} · {stateInfo.stateAbbr} · {cities.length} cities</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Used Cars for Sale in {stateInfo.state}
          </h1>
          <p className="text-primary-foreground/85 text-lg max-w-2xl leading-relaxed">
            Browse hyper-local used car listings across {stateInfo.state}'s top {cities.length} cities.
            Each city page includes market insights, climate tips, and {stateInfo.state}-specific buying guidance.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* City Cards */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-6">
            Top {cities.length} Cities in {stateInfo.state} for Used Cars
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {cities.map(city => {
              const climateInfo = CLIMATE_CONTENT[city.climate];
              return (
                <Link key={city.slug} href={`/cities/${city.stateSlug}/${city.slug}`}>
                  <div className="border rounded-xl p-5 bg-white hover:border-primary hover:shadow-md transition-all cursor-pointer group">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                          {city.city}
                        </h3>
                        <div className="text-sm text-muted-foreground">
                          Pop. {city.pop.toLocaleString()}
                        </div>
                      </div>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                        {climateInfo.label}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4">
                      {city.insight.split(".")[0]}.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {climateInfo.popularTypes.slice(0, 2).map(t => (
                        <span key={t} className="text-xs border rounded-full px-2 py-0.5 text-muted-foreground">
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-primary font-medium">
                      <Car className="w-3.5 h-3.5" />
                      <span>Browse {city.city} listings</span>
                      <ChevronRight className="w-3.5 h-3.5 ml-auto" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* State Reg Info */}
        {stateReg && (
          <section className="bg-muted/30 rounded-2xl p-6 mb-10">
            <h2 className="text-lg font-bold mb-3">
              {stateInfo.state} Used Car Buying Requirements
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">{stateReg}</p>
          </section>
        )}

        {/* Other States */}
        <section>
          <h2 className="text-lg font-bold mb-4">Browse Other States</h2>
          <div className="flex flex-wrap gap-2">
            {allStates
              .filter(s => s.stateSlug !== params.state)
              .map(s => (
                <Link key={s.stateSlug} href={`/cities/${s.stateSlug}`}>
                  <span className="text-sm border rounded-full px-3 py-1 hover:border-primary hover:text-primary transition-colors cursor-pointer">
                    {s.stateAbbr}
                  </span>
                </Link>
              ))}
          </div>
        </section>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </Layout>
  );
}
