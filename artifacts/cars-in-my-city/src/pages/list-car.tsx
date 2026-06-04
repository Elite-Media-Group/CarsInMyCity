import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useCreateCar, CarInput } from "@workspace/api-client-react";
import { CarFront, Camera, MapPin, CheckCircle, ChevronRight, ChevronLeft, Loader2, X, ImagePlus } from "lucide-react";

export default function ListCar() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const createCarMutation = useCreateCar();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState<Partial<CarInput>>({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    price: 0,
    mileage: 0,
    condition: "used",
    sellerType: "private",
    state: "",
    city: "",
    zipCode: "",
    features: [],
    photos: [],
  });

  const updateForm = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const remaining = 20 - (formData.photos?.length ?? 0);
    if (remaining <= 0) {
      toast({ title: "Photo limit reached", description: "You can upload up to 20 photos per listing.", variant: "destructive" });
      return;
    }

    const toUpload = files.slice(0, remaining);
    setUploading(true);

    const urls: string[] = [];
    for (const file of toUpload) {
      try {
        const body = new FormData();
        body.append("photo", file);
        const res = await fetch("/api/uploads/listing-photo", { method: "POST", body });
        if (!res.ok) throw new Error("Upload failed");
        const { url } = await res.json() as { url: string };
        urls.push(url);
      } catch {
        toast({ title: "Upload failed", description: `Could not upload ${file.name}.`, variant: "destructive" });
      }
    }

    updateForm("photos", [...(formData.photos ?? []), ...urls]);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removePhoto = (url: string) => {
    updateForm("photos", (formData.photos ?? []).filter((p) => p !== url));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < totalSteps) {
      nextStep();
      return;
    }

    createCarMutation.mutate(
      { data: formData as CarInput },
      {
        onSuccess: (newCar) => {
          toast({ title: "Listing Created!", description: "Your car has been listed successfully." });
          setLocation(`/cars/${newCar.id}`);
        },
        onError: () => {
          toast({ title: "Error", description: "Failed to create listing. Please try again.", variant: "destructive" });
        },
      }
    );
  };

  const photos = formData.photos ?? [];

  return (
    <Layout>
      <div className="bg-muted/30 py-8 border-b border-border">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-3xl font-bold mb-6 text-center">List Your Car</h1>

          {/* Progress Bar */}
          <div className="relative mb-8">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-border -translate-y-1/2 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
              />
            </div>
            <div className="relative flex justify-between">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`h-8 w-8 rounded-full flex items-center justify-center font-semibold text-sm transition-colors z-10
                    ${step > i ? "bg-primary text-white" : step === i ? "bg-primary text-white ring-4 ring-primary/20" : "bg-background border-2 border-border text-muted-foreground"}`}
                >
                  {step > i ? <CheckCircle className="h-4 w-4" /> : i}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-muted-foreground font-medium px-1">
              <span>Basic Info</span>
              <span className="-ml-4">Details</span>
              <span className="-mr-4">Photos</span>
              <span>Publish</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-3xl mb-24">
        <Card className="border-border/50 shadow-lg">
          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Step 1: Basic Info */}
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center gap-3 text-xl font-bold mb-6 text-primary">
                    <CarFront className="h-6 w-6" /> Vehicle Basics
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="year">Year *</Label>
                      <Input
                        id="year"
                        type="number"
                        required
                        value={formData.year || ""}
                        onChange={(e) => updateForm("year", parseInt(e.target.value) || new Date().getFullYear())}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="make">Make *</Label>
                      <Input
                        id="make"
                        required
                        placeholder="e.g. Toyota"
                        value={formData.make || ""}
                        onChange={(e) => updateForm("make", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="model">Model *</Label>
                      <Input
                        id="model"
                        required
                        placeholder="e.g. Camry"
                        value={formData.model || ""}
                        onChange={(e) => updateForm("model", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="trim">Trim</Label>
                      <Input
                        id="trim"
                        placeholder="e.g. SE"
                        value={formData.trim || ""}
                        onChange={(e) => updateForm("trim", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mileage">Mileage *</Label>
                      <Input
                        id="mileage"
                        type="number"
                        required
                        value={formData.mileage || ""}
                        onChange={(e) => updateForm("mileage", parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="condition">Condition *</Label>
                      <Select value={formData.condition} onValueChange={(v) => updateForm("condition", v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="used">Used</SelectItem>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="certified">Certified Pre-Owned</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Specs & Details */}
              {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center gap-3 text-xl font-bold mb-6 text-primary">
                    <CheckCircle className="h-6 w-6" /> Specifications
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="bodyStyle">Body Style</Label>
                      <Select value={formData.bodyStyle || ""} onValueChange={(v) => updateForm("bodyStyle", v)}>
                        <SelectTrigger><SelectValue placeholder="Select style" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Sedan">Sedan</SelectItem>
                          <SelectItem value="SUV">SUV</SelectItem>
                          <SelectItem value="Truck">Truck</SelectItem>
                          <SelectItem value="Coupe">Coupe</SelectItem>
                          <SelectItem value="Convertible">Convertible</SelectItem>
                          <SelectItem value="Hatchback">Hatchback</SelectItem>
                          <SelectItem value="Wagon">Wagon</SelectItem>
                          <SelectItem value="Van">Van</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="transmission">Transmission</Label>
                      <Select value={formData.transmission || ""} onValueChange={(v) => updateForm("transmission", v)}>
                        <SelectTrigger><SelectValue placeholder="Select transmission" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Automatic">Automatic</SelectItem>
                          <SelectItem value="Manual">Manual</SelectItem>
                          <SelectItem value="CVT">CVT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fuelType">Fuel Type</Label>
                      <Select value={formData.fuelType || ""} onValueChange={(v) => updateForm("fuelType", v)}>
                        <SelectTrigger><SelectValue placeholder="Select fuel type" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Gasoline">Gasoline</SelectItem>
                          <SelectItem value="Diesel">Diesel</SelectItem>
                          <SelectItem value="Hybrid">Hybrid</SelectItem>
                          <SelectItem value="Electric">Electric</SelectItem>
                          <SelectItem value="Plug-in Hybrid">Plug-in Hybrid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="exteriorColor">Exterior Color</Label>
                      <Input
                        id="exteriorColor"
                        placeholder="e.g. Midnight Black"
                        value={formData.exteriorColor || ""}
                        onChange={(e) => updateForm("exteriorColor", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vin">VIN</Label>
                      <Input
                        id="vin"
                        value={formData.vin || ""}
                        onChange={(e) => updateForm("vin", e.target.value)}
                        className="font-mono uppercase"
                      />
                    </div>
                    <div className="col-span-1 md:col-span-2 space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        className="h-32 resize-none"
                        placeholder="Describe your car's condition, features, history, and any flaws..."
                        value={formData.description || ""}
                        onChange={(e) => updateForm("description", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Photos */}
              {step === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center gap-3 text-xl font-bold mb-2 text-primary">
                    <Camera className="h-6 w-6" /> Photos
                  </div>
                  <p className="text-sm text-muted-foreground -mt-2">
                    {photos.length}/20 photos uploaded. The first photo will be the cover image.
                  </p>

                  {/* Upload zone */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handlePhotoSelect}
                  />
                  <div
                    className="border-2 border-dashed border-border rounded-xl p-10 text-center hover:bg-muted/50 transition-colors cursor-pointer flex flex-col items-center"
                    onClick={() => !uploading && fileInputRef.current?.click()}
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="h-10 w-10 text-primary animate-spin mb-3" />
                        <p className="text-sm font-medium">Uploading photos…</p>
                        <p className="text-xs text-muted-foreground mt-1">Please wait</p>
                      </>
                    ) : (
                      <>
                        <div className="h-14 w-14 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                          <ImagePlus className="h-7 w-7 text-primary" />
                        </div>
                        <p className="font-semibold mb-1">Click to add photos</p>
                        <p className="text-sm text-muted-foreground mb-3">JPG, PNG, WebP · up to 10 MB each · max 20 photos</p>
                        <Button variant="outline" type="button" size="sm">Select Files</Button>
                      </>
                    )}
                  </div>

                  {/* Photo grid */}
                  {photos.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                      {photos.map((url, i) => (
                        <div key={url} className="relative aspect-square group">
                          <img
                            src={url}
                            alt={`Photo ${i + 1}`}
                            className="w-full h-full object-cover rounded-lg border border-border"
                          />
                          {i === 0 && (
                            <span className="absolute bottom-1 left-1 text-[10px] bg-black/60 text-white px-1.5 py-0.5 rounded font-medium">
                              Cover
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => removePhoto(url)}
                            className="absolute top-1 right-1 h-5 w-5 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3 text-white" />
                          </button>
                        </div>
                      ))}
                      {/* Add more tile */}
                      {photos.length < 20 && !uploading && (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="aspect-square rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors text-xs gap-1"
                        >
                          <ImagePlus className="h-5 w-5" />
                          Add
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Location & Pricing */}
              {step === 4 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center gap-3 text-xl font-bold mb-6 text-primary">
                    <MapPin className="h-6 w-6" /> Location &amp; Price
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 col-span-1 md:col-span-2">
                      <Label htmlFor="price" className="text-lg">Asking Price *</Label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">$</span>
                        <Input
                          id="price"
                          type="number"
                          required
                          className="pl-8 text-xl font-bold h-14"
                          value={formData.price || ""}
                          onChange={(e) => updateForm("price", parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        required
                        value={formData.city || ""}
                        onChange={(e) => updateForm("city", e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="state">State *</Label>
                        <Input
                          id="state"
                          required
                          placeholder="CA"
                          maxLength={2}
                          className="uppercase"
                          value={formData.state || ""}
                          onChange={(e) => updateForm("state", e.target.value.toUpperCase())}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">ZIP Code *</Label>
                        <Input
                          id="zipCode"
                          required
                          value={formData.zipCode || ""}
                          onChange={(e) => updateForm("zipCode", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-8 mt-8 border-t border-border">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={prevStep}
                  disabled={step === 1}
                  className="gap-2"
                >
                  <ChevronLeft className="h-4 w-4" /> Back
                </Button>
                <Button
                  type="submit"
                  className="gap-2 px-8"
                  disabled={createCarMutation.isPending || uploading}
                >
                  {step < totalSteps ? (
                    <>Next <ChevronRight className="h-4 w-4" /></>
                  ) : (
                    <>{createCarMutation.isPending ? "Publishing…" : "Publish Listing"}</>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
