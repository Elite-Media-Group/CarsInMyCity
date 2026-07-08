import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Layout } from "@/components/layout";
import { CarCard } from "@/components/car-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, ShieldCheck, Zap, Handshake } from "lucide-react";
import { NearMeButton } from "@/components/near-me-button";
import { useGetRecentCars, useGetFeaturedCars, useGetMarketplaceSummary, useGetTopMakes } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { USMap } from "@/components/us-map";
import { SEO } from "@/components/seo";

export default function Home() {
  const { data: recentCars = [], isLoading: recentLoading } = useGetRecentCars({ limit: 4 });
  const { data: featuredCars = [], isLoading: featuredLoading } = useGetFeaturedCars({ limit: 4 });
  const { data: summary } = useGetMarketplaceSummary();
  const { data: topMakes = [], isLoading: makesLoading } = useGetTopMakes({ limit: 6 });
  const [, navigate] = useLocation();
  const [keyword, setKeyword] = useState("");
  const [zip, setZip] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (keyword.trim()) params.set("make", keyword.trim());
    if (zip.trim()) params.set("zip", zip.trim());
    const qs = params.toString();
    navigate(qs ? `/search?${qs}` : "/search");
  };


  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-primary pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=2000" 
            alt="Hero background" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary/40" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
            >
              Find the perfect car, <br/>
              <span className="text-accent">right in your neighborhood.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl"
            >
              Connect with local sellers and trusted dealerships. Transparent pricing, no hidden fees, just great cars near you.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-3 shadow-xl max-w-2xl flex flex-col sm:flex-row gap-3"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
                  placeholder="Make, model, or keyword..."
                  className="pl-10 h-12 border-0 bg-muted/50 rounded-xl focus-visible:ring-primary/20 text-base"
                />
              </div>
              <div className="relative w-full sm:w-48">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
                  placeholder="ZIP code"
                  className="pl-10 h-12 border-0 bg-muted/50 rounded-xl focus-visible:ring-primary/20 text-base"
                />
              </div>
              <Button onClick={handleSearch} size="lg" className="h-12 w-full sm:w-auto rounded-xl px-8 font-semibold text-base">
                Search Cars
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-4"
            >
              <NearMeButton
                size="lg"
                variant="outline"
                className="h-11 rounded-xl px-6 font-semibold text-sm bg-transparent border-white/30 text-white hover:bg-white/10"
                label="Use My Location Instead"
              />
            </motion.div>
            
            {summary && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-8 flex gap-6 text-white/80 text-sm font-medium"
              >
                <div><strong className="text-white text-lg">{summary.totalListings.toLocaleString()}+</strong> local listings</div>
                <div><strong className="text-white text-lg">{summary.totalSellers.toLocaleString()}+</strong> trusted sellers</div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-12 bg-background border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0">
                <ShieldCheck className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Verified Sellers</h3>
                <p className="text-muted-foreground text-sm">Every dealer is background-checked and rated by the community.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Lightning Fast Search</h3>
                <p className="text-muted-foreground text-sm">Find exactly what you want with our powerful filtering system.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center shrink-0">
                <Handshake className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Direct Connection</h3>
                <p className="text-muted-foreground text-sm">Message sellers directly. No middlemen, no runarounds.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Map Section */}
      <section className="py-16 md:py-24 bg-background border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">Find Cars in Your State</h2>
            <p className="text-muted-foreground">Browse the largest hyper-local inventory across the country</p>
          </div>
          <USMap />
        </div>
      </section>

      {/* Featured Cars */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Deals</h2>
              <p className="text-muted-foreground">Handpicked premium listings in your area</p>
            </div>
            <Link href="/search?featured=true">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredLoading ? (
                <p className="col-span-full text-center text-muted-foreground py-8">Loading featured cars...</p>
              ) : featuredCars.length === 0 ? (
                <p className="col-span-full text-center text-muted-foreground py-8">No featured cars available right now.</p>
              ) : (
                featuredCars.map(car => (
                  <CarCard key={car.id} car={car} />
                ))
              )}
          </div>
        </div>
      </section>

      {/* Top Makes */}
      <section className="py-16 md:py-24 bg-background border-y border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">Popular Brands</h2>
            <p className="text-muted-foreground">Browse vehicles from the most trusted manufacturers</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {makesLoading ? (
                <p className="col-span-full text-center text-muted-foreground py-8">Loading brands...</p>
              ) : topMakes.length === 0 ? (
                <p className="col-span-full text-center text-muted-foreground py-8">No brands to show yet.</p>
              ) : (
                topMakes.map(make => (
                  <Link key={make.make} href={`/search?make=${make.make}`}>
                    <div className="bg-muted hover:bg-primary/5 rounded-2xl p-6 text-center transition-colors border border-transparent hover:border-primary/20 cursor-pointer group">
                      <div className="font-semibold text-lg group-hover:text-primary transition-colors">{make.make}</div>
                      <div className="text-sm text-muted-foreground">{make.count} listings</div>
                    </div>
                  </Link>
                ))
              )}
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Just Arrived</h2>
              <p className="text-muted-foreground">The newest cars added to the marketplace</p>
            </div>
            <Link href="/search?sort=newest">
              <Button variant="outline">Browse Fresh Inventory</Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentLoading ? (
                <p className="col-span-full text-center text-muted-foreground py-8">Loading latest cars...</p>
              ) : recentCars.length === 0 ? (
                <p className="col-span-full text-center text-muted-foreground py-8">No cars have been added yet.</p>
              ) : (
                recentCars.map(car => (
                  <CarCard key={car.id} car={car} />
                ))
              )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10 text-center text-white">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to sell your car?</h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Reach thousands of local buyers. List your car in minutes, manage inquiries easily, and sell faster.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/list-car">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 h-14 px-8 text-lg rounded-xl">
                Create a Listing
              </Button>
            </Link>
            <Link href="/selling-guide">
              <Button variant="outline" size="lg" className="bg-transparent border-white/30 text-white hover:bg-white/10 h-14 px-8 text-lg rounded-xl">
                Read Selling Guide
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
