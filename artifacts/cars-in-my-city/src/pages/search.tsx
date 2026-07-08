import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/layout";
import { CarCard } from "@/components/car-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Filter, X, MapPin, SlidersHorizontal, List, Grid, Loader2, AlertCircle, Maximize2 } from "lucide-react";
import { useListMakes } from "@workspace/api-client-react";
import { motion, AnimatePresence } from "framer-motion";

interface SearchCar {
  id: string;
  source?: string;
  vin?: string;
  year?: number;
  make?: string;
  model?: string;
  trim?: string;
  price?: number;
  mileage?: number;
  bodyStyle?: string;
  fuelType?: string;
  transmission?: string;
  drivetrain?: string;
  exteriorColor?: string;
  engineSize?: string;
  mpgCity?: number;
  mpgHighway?: number;
  photos?: string[];
  city?: string;
  state?: string;
  zipCode?: string;
  dealerName?: string;
  distance?: number;
  listingUrl?: string;
  sellerType?: string;
}

interface SearchCarsResponse {
  cars: SearchCar[];
  total: number;
  source: string;
  radius?: number;
  fallback?: boolean;
  message?: string;
}

export default function Search() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  
  const [make, setMake] = useState<string>(searchParams.get("make") || "all");
  const [condition, setCondition] = useState<string>(searchParams.get("condition") || "all");
  const [priceRange, setPriceRange] = useState<number[]>([0, 100000]);
  const [sortBy, setSortBy] = useState<string>(searchParams.get("sort") || "newest");
  const [showFilters, setShowFilters] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [zip, setZip] = useState<string>(searchParams.get("zip") || "");
  const [model, setModel] = useState<string>(searchParams.get("model") || "");
  const [radius, setRadius] = useState<number>(50);

  const { data: makesData } = useListMakes();
  
  // Construct API params
  const searchQuery = useMemo(() => {
    const params = new URLSearchParams();
    if (make && make !== 'all') params.set("make", make);
    if (model.trim()) params.set("model", model.trim());
    if (condition && condition !== 'all') params.set("carType", condition);
    if (priceRange[0] > 0) params.set("minPrice", String(priceRange[0]));
    if (priceRange[1] < 100000) params.set("maxPrice", String(priceRange[1]));
    if (zip.trim()) {
      params.set("zip", zip.trim());
      params.set("radius", String(radius));
    }
    return params.toString();
  }, [make, model, condition, priceRange, zip, radius]);

  const {
    data: searchData,
    isLoading,
    isError,
    refetch,
  } = useQuery<SearchCarsResponse>({
    queryKey: ["search-cars", searchQuery],
    queryFn: async () => {
      const res = await fetch("/api/search-cars?" + searchQuery, {
        headers: { Accept: "application/json" },
      });
      if (!res.ok) {
        throw new Error("Search request failed with status " + res.status);
      }
      return (await res.json()) as SearchCarsResponse;
    },
    staleTime: 60_000,
  });

  const cars = searchData?.cars ?? [];
  const isFallback = searchData?.fallback ?? false;
  const providerMessage = searchData?.message;

  const sortedCars = useMemo(() => {
    const list = [...cars];
    switch (sortBy) {
      case "price_asc":
        return list.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
      case "price_desc":
        return list.sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity));
      case "mileage_asc":
        return list.sort((a, b) => (a.mileage ?? Infinity) - (b.mileage ?? Infinity));
      default:
        return list;
    }
  }, [cars, sortBy]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Mobile Filter Toggle */}
          <div className="md:hidden flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Search Cars</h1>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="gap-2">
              <Filter className="h-4 w-4" /> Filters
            </Button>
          </div>

          {/* Filters Sidebar */}
          <AnimatePresence>
            {showFilters && (
              <motion.div 
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "auto", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="w-full md:w-64 lg:w-72 shrink-0 flex flex-col gap-6"
              >
                <div className="sticky top-24 bg-card border border-border rounded-xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-lg flex items-center gap-2">
                      <SlidersHorizontal className="h-5 w-5" /> Filters
                    </h2>
                    <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" onClick={() => {
                      setMake('all');
                      setCondition('all');
                      setPriceRange([0, 100000]);
                    }}>
                      Reset
                    </Button>
                  </div>

                  <Accordion type="multiple" defaultValue={["location", "condition", "make", "price"]} className="w-full">
                    <AccordionItem value="location">
                      <AccordionTrigger className="font-medium text-sm">Location</AccordionTrigger>
                      <AccordionContent>
                        <div className="flex flex-col gap-3 pt-1">
                          <div className="flex flex-col gap-1.5">
                            <Label htmlFor="zip" className="text-xs text-muted-foreground">ZIP code</Label>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="zip"
                                inputMode="numeric"
                                placeholder="e.g. 90210"
                                value={zip}
                                maxLength={5}
                                onChange={(e) => setZip(e.target.value.replace(/[^0-9]/g, ""))}
                                className="pl-9"
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <Label className="text-xs text-muted-foreground">Search radius</Label>
                            <Select value={String(radius)} onValueChange={(v) => setRadius(Number(v))}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="25">25 miles</SelectItem>
                                <SelectItem value="50">50 miles</SelectItem>
                                <SelectItem value="100">100 miles</SelectItem>
                                <SelectItem value="250">250 miles</SelectItem>
                                <SelectItem value="500">500 miles</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="model">
                      <AccordionTrigger className="font-medium text-sm">Model</AccordionTrigger>
                      <AccordionContent>
                        <div className="pt-1">
                          <Input
                            placeholder="e.g. Camry, F-150"
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                          />
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="condition">
                      <AccordionTrigger className="font-medium text-sm">Condition</AccordionTrigger>
                      <AccordionContent>
                        <div className="flex flex-col gap-2 mt-2">
                          {['all', 'new', 'used', 'certified'].map(c => (
                            <Label key={c} className="flex items-center gap-2 font-normal cursor-pointer">
                              <input 
                                type="radio" 
                                name="condition" 
                                value={c}
                                checked={condition === c}
                                onChange={(e) => setCondition(e.target.value)}
                                className="text-primary focus:ring-primary"
                              />
                              <span className="capitalize">{c}</span>
                            </Label>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="make">
                      <AccordionTrigger className="font-medium text-sm">Make</AccordionTrigger>
                      <AccordionContent>
                        <div className="flex flex-col gap-2 mt-2 max-h-48 overflow-y-auto pr-2">
                          <Label className="flex items-center gap-2 font-normal cursor-pointer">
                            <input 
                              type="radio" 
                              name="make" 
                              value="all"
                              checked={make === 'all'}
                              onChange={(e) => setMake(e.target.value)}
                            />
                            <span>All Makes</span>
                          </Label>
                          {makesData?.map(m => (
                            <Label key={m.make} className="flex items-center gap-2 font-normal cursor-pointer">
                              <input 
                                type="radio" 
                                name="make" 
                                value={m.make}
                                checked={make === m.make}
                                onChange={(e) => setMake(e.target.value)}
                              />
                              <span className="flex-1">{m.make}</span>
                              <span className="text-xs text-muted-foreground">{m.count}</span>
                            </Label>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="price">
                      <AccordionTrigger className="font-medium text-sm">Price Range</AccordionTrigger>
                      <AccordionContent>
                        <div className="px-2 mt-4 mb-2">
                          <Slider
                            min={0}
                            max={100000}
                            step={1000}
                            value={priceRange}
                            onValueChange={setPriceRange}
                            className="mb-6"
                          />
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>${priceRange[0].toLocaleString()}</span>
                            <span>{priceRange[1] >= 100000 ? '$100k+' : `$${priceRange[1].toLocaleString()}`}</span>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Area */}
          <div className="flex-1 flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h1 className="text-2xl font-bold hidden md:block">
                {isLoading ? "Searching..." : `${searchData?.total || 0} Cars Found`}
              </h1>
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-48 bg-card">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest Listings</SelectItem>
                    <SelectItem value="price_asc">Price: Low to High</SelectItem>
                    <SelectItem value="price_desc">Price: High to Low</SelectItem>
                    <SelectItem value="mileage_asc">Mileage: Low to High</SelectItem>
                  </SelectContent>
                </Select>
                <div className="hidden sm:flex bg-card rounded-md border border-border">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={`h-9 w-9 rounded-none rounded-l-md ${viewMode === 'grid' ? 'bg-muted' : ''}`}
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={`h-9 w-9 rounded-none rounded-r-md ${viewMode === 'list' ? 'bg-muted' : ''}`}
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Active Filters Bar */}
            {(make !== 'all' || condition !== 'all' || priceRange[0] > 0 || priceRange[1] < 100000) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {make !== 'all' && (
                  <Badge variant="secondary" className="px-3 py-1 flex items-center gap-1">
                    Make: {make} <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => setMake('all')} />
                  </Badge>
                )}
                {condition !== 'all' && (
                  <Badge variant="secondary" className="px-3 py-1 flex items-center gap-1 capitalize">
                    Condition: {condition} <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => setCondition('all')} />
                  </Badge>
                )}
                {(priceRange[0] > 0 || priceRange[1] < 100000) && (
                  <Badge variant="secondary" className="px-3 py-1 flex items-center gap-1">
                    Price: ${priceRange[0].toLocaleString()} - {priceRange[1] >= 100000 ? 'Max' : `$${priceRange[1].toLocaleString()}`}
                    <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => setPriceRange([0, 100000])} />
                  </Badge>
                )}
              </div>
            )}

            {/* Grid */}
            {isFallback && !isLoading && cars.length > 0 && (
              <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <p>{providerMessage || "Showing local listings while nationwide inventory is unavailable."}</p>
              </div>
            )}
            {isLoading ? (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="flex flex-col gap-3">
                    <Skeleton className="h-48 w-full rounded-xl" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-8 w-1/3 mt-2" />
                  </div>
                ))}
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center justify-center py-24 text-center bg-card rounded-2xl border border-destructive/40 border-dashed">
                <div className="h-16 w-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                  <AlertCircle className="h-8 w-8 text-destructive" />
                </div>
                <h3 className="text-xl font-bold mb-2">Something went wrong</h3>
                <p className="text-muted-foreground max-w-md mb-6">
                  We couldn't load listings right now. Please check your connection and try again.
                </p>
                <Button variant="outline" onClick={() => refetch()}>
                  Retry search
                </Button>
              </div>
            ) : sortedCars.length > 0 ? (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {sortedCars.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center bg-card rounded-2xl border border-border border-dashed">
                <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">No cars found</h3>
                <p className="text-muted-foreground max-w-md mb-6">
                  We couldn't find any cars matching your current filters. Try broadening your search criteria.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  {zip.trim() && radius < 500 && (
                    <Button
                      variant="default"
                      className="gap-2"
                      onClick={() => setRadius((r) => Math.min(500, r + 100))}
                    >
                      <Maximize2 className="h-4 w-4" />
                      Expand search radius to {Math.min(500, radius + 100)} mi
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => {
                    setMake('all');
                    setCondition('all');
                    setPriceRange([0, 100000]);
                  }}>
                    Clear all filters
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
