import { useEffect } from "react";
import { useLocation } from "wouter";
import { useNearestCity } from "@/hooks/use-nearest-city";
import { getCityBySlug } from "@/data/cities";
import { Button } from "@/components/ui/button";
import { Navigation, Loader2, AlertCircle } from "lucide-react";

interface NearMeButtonProps {
  size?: "default" | "sm" | "lg";
  variant?: "default" | "outline" | "ghost";
  className?: string;
  label?: string;
}

export function NearMeButton({
  size = "default",
  variant = "outline",
  className = "",
  label = "Cars Near Me",
}: NearMeButtonProps) {
  const { status, nearest, error, locate, reset } = useNearestCity();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (status === "found" && nearest) {
      navigate(`/cities/${nearest.stateSlug}/${nearest.citySlug}`);
      reset();
    }
  }, [status, nearest, navigate, reset]);

  const city = nearest ? getCityBySlug(nearest.stateSlug, nearest.citySlug) : null;

  if (status === "error") {
    return (
      <div className="flex flex-col items-start gap-1">
        <Button
          size={size}
          variant="outline"
          className={`gap-2 border-red-200 text-red-600 hover:bg-red-50 ${className}`}
          onClick={reset}
        >
          <AlertCircle className="w-4 h-4" />
          Try Again
        </Button>
        {error && (
          <p className="text-xs text-red-500 max-w-xs">{error}</p>
        )}
      </div>
    );
  }

  return (
    <Button
      size={size}
      variant={variant}
      className={`gap-2 ${className}`}
      onClick={locate}
      disabled={status === "locating"}
    >
      {status === "locating" ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          {city ? `Found ${city.city}…` : "Locating…"}
        </>
      ) : (
        <>
          <Navigation className="w-4 h-4" />
          {label}
        </>
      )}
    </Button>
  );
}
