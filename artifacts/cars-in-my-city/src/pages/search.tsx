import { useState, useMemo } from "react";
import { useLocation } from "wouter";
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
import { Filter, X, MapPin, SlidersHorizontal, List, Grid } from "lucide-react";
import { useListCars, useListMakes, ListCarsCondition, ListCarsSortBy } from "@workspace/api-client-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Search() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  
  const [make, setMake] = useState<string>(searchParams.get("make") || "all");
  const [condition, setCondition] = useState<string>(searchParams.get("condition") || "all");
  const [priceRange, setPriceRange] = useState<number[]>([0, 100000]);
  const [sortBy, setSortBy] = useState<string>(searchParams.get("sort") || "newest");
  const [zip, setZip] = useState<string>(searchParams.get("zip") || "");
  const [showFilters, setShowFilters] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data: makesData } = useListMakes();
  
  // Construct API params
  const apiParams = useMemo(() => {
    const params: any = {};
    if (make && make !== 'all') params.make = make;
    if (condition && condition !== 'all') params.condition = condition as ListCarsCondition;
    if (priceRange[0] > 0) params.priceMin = priceRange[0];
    if (priceRange[1] < 100000) params.priceMax = priceRange[1];
    if (sortBy) params.sortBy = sortBy as ListCarsSortBy;
    if (zip) params.zipCode = zip;
    return params;
  }, [make, condition, priceRange, sortBy, zip]);

  const { data: carsResponse, isLoading } = useListCars(apiParams);
  const cars = carsResponse?.cars || [];

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

                  <Accordion type="multiple" defaultValue={["condition", "make", "price"]} className="w-full">
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
                {isLoading ? "Searching..." : `${carsResponse?.total || 0} Cars Found`}
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
            ) : cars.length > 0 ? (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {cars.map((car) => (
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
                <Button variant="outline" onClick={() => {
                  setMake('all');
                  setCondition('all');
                  setPriceRange([0, 100000]);
                }}>
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
