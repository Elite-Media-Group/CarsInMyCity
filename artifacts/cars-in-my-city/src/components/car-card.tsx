import { Link } from "wouter";
import { Car } from "@workspace/api-client-react";
import { Heart, MapPin, Gauge, Calendar, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion } from "framer-motion";

interface CarCardProps {
  car: Car;
}

export function CarCard({ car }: CarCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Format currency
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(car.price);

  // Format mileage
  const formattedMileage = new Intl.NumberFormat('en-US').format(car.mileage);

  // Fallback image if none
  const mainImage = car.photos && car.photos.length > 0 
    ? car.photos[0] 
    : "https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&q=80&w=600&h=400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card 
        className="overflow-hidden group h-full flex flex-col hover-elevate transition-all duration-300 hover:shadow-lg border-border/50 hover:border-primary/20"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <Link href={`/cars/${car.id}`}>
            <img 
              src={mainImage} 
              alt={`${car.year} ${car.make} ${car.model}`}
              className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
            />
          </Link>
          
          {car.condition === 'certified' && (
            <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground border-none font-semibold shadow-sm">
              Certified Pre-Owned
            </Badge>
          )}
          
          {car.condition === 'new' && (
            <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground border-none font-semibold shadow-sm">
              New
            </Badge>
          )}

          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-3 right-3 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background hover:text-destructive text-muted-foreground shadow-sm"
          >
            <Heart className={`h-4 w-4 ${car.isFavorited ? 'fill-destructive text-destructive' : ''}`} />
          </Button>
          
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
            <div className="flex items-center text-white/90 text-xs font-medium gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-accent" />
              {car.city}, {car.state}
            </div>
          </div>
        </div>

        <CardContent className="p-4 flex-1 flex flex-col">
          <Link href={`/cars/${car.id}`} className="block group-hover:text-primary transition-colors">
            <h3 className="font-bold text-lg leading-tight line-clamp-1 mb-1">
              {car.year} {car.make} {car.model}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {car.trim || `${car.engineSize || ''} ${car.drivetrain || ''}`}
            </p>
          </Link>

          <div className="mt-4 mb-1">
            <span className="text-xl font-extrabold text-foreground">{formattedPrice}</span>
          </div>
          
          <div className="flex flex-wrap gap-x-4 gap-y-2 mt-auto pt-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Gauge className="h-3.5 w-3.5" />
              {formattedMileage} mi
            </div>
            {car.sellerType === 'dealer' && (
              <div className="flex items-center gap-1.5 text-primary/80">
                <ShieldCheck className="h-3.5 w-3.5" />
                Dealer
              </div>
            )}
            {car.deliveryAvailable && (
              <div className="flex items-center gap-1.5 text-accent/80">
                <MapPin className="h-3.5 w-3.5" />
                Delivery
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
