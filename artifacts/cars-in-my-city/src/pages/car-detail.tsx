import { useRoute } from "wouter";
import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { useGetCar, useGetRecentCars } from "@workspace/api-client-react";
import { CarCard } from "@/components/car-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Heart, MapPin, Gauge, Calendar, ShieldCheck, Check, Share2, Info, ChevronRight, MessageSquare } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";
import { trackLoopEvent } from "@/lib/loop-client";
import { LOOP_EVENTS } from "@/lib/loop-event-names";

export default function CarDetail() {
  const [, params] = useRoute("/cars/:id");
  const id = params?.id ? parseInt(params.id, 10) : 0;
  
  const { data: car, isLoading, error } = useGetCar(id, { query: { enabled: !!id } });

  // Emit a Loop "car_viewed" event once the listing has loaded. Best-effort
  // telemetry; Loop is the source of truth for view/behavior data. Never
  // blocks render and never exposes any secret (server signs the webhook).
  useEffect(() => {
    if (!car) return;
    void trackLoopEvent(LOOP_EVENTS.CAR_VIEWED, {
      car_id: car.id,
      vin: car.vin ?? null,
      year: car.year,
      make: car.make,
      model: car.model,
      trim: car.trim ?? null,
      price: car.price ?? null,
      mileage: car.mileage ?? null,
      condition: car.condition ?? null,
      city: car.city ?? null,
      state: car.state ?? null,
      seller_type: car.sellerType ?? null,
    });
  }, [car]);
  const { data: similarCars = [] } = useGetRecentCars({ limit: 4 }); // Mock similar cars

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-10 w-3/4 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-[400px] w-full rounded-xl" />
              <div className="flex gap-2">
                {[1,2,3,4].map(i => <Skeleton key={i} className="h-20 w-24 rounded-lg" />)}
              </div>
            </div>
            <div className="space-y-6">
              <Skeleton className="h-[300px] w-full rounded-xl" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !car) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-3xl font-bold mb-4">Car Not Found</h1>
          <p className="text-muted-foreground">The car you're looking for doesn't exist or has been removed.</p>
        </div>
      </Layout>
    );
  }

  const formattedPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(car.price);
  const formattedMileage = new Intl.NumberFormat('en-US').format(car.mileage);
  const mainImage = car.photos && car.photos.length > 0 ? car.photos[0] : "https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&q=80&w=1200";

  const seoTitle = `${car.year} ${car.make} ${car.model}${car.trim ? ` ${car.trim}` : ""} — ${formattedPrice}`;
  const seoDescription = `${car.year} ${car.make} ${car.model} with ${formattedMileage} miles for ${formattedPrice} in ${car.city}, ${car.state}. ${car.condition ? car.condition.charAt(0).toUpperCase() + car.condition.slice(1) : "Used"} • ${car.transmission ?? ""} • ${car.drivetrain ?? ""}. Listed on CarsInMyCity.`;

  return (
    <Layout>
      <SEO
        title={seoTitle}
        description={seoDescription}
        image={`https://carsinmycity.com/api/og/cars/${car.id}`}
        type="website"
        canonical={`https://carsinmycity.com/cars/${car.id}`}
      />
      <div className="bg-muted/30 border-b border-border py-4">
        <div className="container mx-auto px-4 flex items-center text-sm text-muted-foreground gap-2">
          <span>Search</span> <ChevronRight className="h-4 w-4" />
          <span>{car.make}</span> <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">{car.model}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="outline" className="uppercase">{car.condition}</Badge>
              <span className="text-muted-foreground text-sm flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {car.city}, {car.state}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              {car.year} {car.make} {car.model} {car.trim}
            </h1>
            <p className="text-lg text-muted-foreground mt-1">
              {car.engineSize} • {car.drivetrain} • {car.transmission}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="h-10 w-10 rounded-full">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-10 w-10 rounded-full text-destructive hover:text-destructive">
              <Heart className={`h-4 w-4 ${car.isFavorited ? 'fill-current' : ''}`} />
            </Button>
            <div className="text-3xl font-extrabold text-primary">{formattedPrice}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery */}
            <div className="space-y-3">
              <div className="aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden bg-muted relative group">
                <img src={mainImage} alt={car.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
              </div>
              {car.photos && car.photos.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 snap-x">
                  {car.photos.map((photo, idx) => (
                    <div key={idx} className={`h-20 w-28 shrink-0 rounded-lg overflow-hidden cursor-pointer snap-start ${idx === 0 ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : 'opacity-70 hover:opacity-100'}`}>
                      <img src={photo} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Key Specs */}
            <section className="bg-card rounded-2xl p-6 border border-border shadow-sm">
              <h2 className="text-xl font-bold mb-6">Key Specifications</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">
                <div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1.5 mb-1"><Gauge className="h-4 w-4" /> Mileage</div>
                  <div className="font-semibold">{formattedMileage} mi</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1.5 mb-1"><Calendar className="h-4 w-4" /> Year</div>
                  <div className="font-semibold">{car.year}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1.5 mb-1"><Info className="h-4 w-4" /> Body Style</div>
                  <div className="font-semibold">{car.bodyStyle || '-'}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1.5 mb-1"><Info className="h-4 w-4" /> Fuel Type</div>
                  <div className="font-semibold">{car.fuelType || '-'}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Exterior Color</div>
                  <div className="font-semibold">{car.exteriorColor || '-'}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Interior Color</div>
                  <div className="font-semibold">{car.interiorColor || '-'}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">MPG (City/Hwy)</div>
                  <div className="font-semibold">{car.mpgCity || '-'}/{car.mpgHighway || '-'}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">VIN</div>
                  <div className="font-semibold text-xs font-mono mt-1">{car.vin || 'Not provided'}</div>
                </div>
              </div>
            </section>

            {/* Description */}
            <section>
              <h2 className="text-xl font-bold mb-4">Seller's Notes</h2>
              <div className="prose max-w-none text-muted-foreground leading-relaxed">
                {car.description ? (
                  <p>{car.description}</p>
                ) : (
                  <p className="italic">No description provided by the seller.</p>
                )}
              </div>
            </section>

            <Separator />

            {/* Features */}
            {car.features && car.features.length > 0 && (
              <section>
                <h2 className="text-xl font-bold mb-4">Features & Options</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {car.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-foreground">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar / Action Area */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card className="sticky top-24 border-primary/20 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                    {car.sellerName ? car.sellerName.charAt(0) : 'S'}
                  </div>
                  <div>
                    <div className="font-bold text-lg">{car.sellerName || 'Private Seller'}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      {car.sellerType === 'dealer' && <ShieldCheck className="h-3.5 w-3.5 text-primary" />}
                      <span className="capitalize">{car.sellerType?.replace('_', ' ')}</span>
                    </div>
                  </div>
                </div>

                <form className="space-y-4">
                  <div className="space-y-2">
                    <Textarea 
                      placeholder="Hi, is this still available?" 
                      className="resize-none h-24 bg-muted/50" 
                      defaultValue={`Hi, I'm interested in your ${car.year} ${car.make} ${car.model}. Is it still available?`}
                    />
                  </div>
                  
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="financing" />
                      <label htmlFor="financing" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        I'm interested in financing
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="trade" />
                      <label htmlFor="trade" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        I have a trade-in
                      </label>
                    </div>
                    {car.deliveryAvailable && (
                      <div className="flex items-center space-x-2">
                        <Checkbox id="delivery" />
                        <label htmlFor="delivery" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          I want home delivery {car.deliveryFee ? `(+$${car.deliveryFee})` : ''}
                        </label>
                      </div>
                    )}
                  </div>

                  <Button className="w-full h-12 text-base font-semibold gap-2 mt-4">
                    <MessageSquare className="h-5 w-5" /> Contact Seller
                  </Button>
                  <p className="text-xs text-center text-muted-foreground pt-2">
                    By contacting the seller, you agree to our Terms of Use.
                  </p>
                </form>
              </CardContent>
            </Card>

            {/* Delivery/Protection Badges */}
            <div className="bg-muted/50 rounded-xl p-5 space-y-4">
              <div className="flex gap-3">
                <ShieldCheck className="h-5 w-5 text-green-600 shrink-0" />
                <div>
                  <div className="font-semibold text-sm">Purchase Protection</div>
                  <div className="text-xs text-muted-foreground">Transactions are secure and monitored.</div>
                </div>
              </div>
              <Separator className="bg-border/50" />
              <div className="flex gap-3">
                <MapPin className="h-5 w-5 text-blue-600 shrink-0" />
                <div>
                  <div className="font-semibold text-sm">Local Pickup</div>
                  <div className="text-xs text-muted-foreground">Located in {car.city}, {car.state} {car.zipCode}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Listings */}
      <section className="bg-background py-16 mt-8 border-t border-border">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Similar Cars Nearby</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarCars.map(c => (
              <CarCard key={c.id} car={c} />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
