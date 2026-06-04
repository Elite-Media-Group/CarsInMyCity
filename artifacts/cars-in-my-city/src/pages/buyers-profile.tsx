import { Layout } from "@/components/layout";
import { useGetMe, useGetMyBuyerProfile, useUpdateMyBuyerProfile, BuyerProfileUpdate } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect, KeyboardEvent } from "react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { X } from "lucide-react";

const BODY_STYLES = ["Sedan", "SUV", "Truck", "Coupe", "Convertible", "Hatchback", "Minivan", "Van", "Wagon", "Sports Car"];
const COLORS = ["White", "Black", "Silver", "Gray", "Red", "Blue", "Green", "Brown", "Orange", "Yellow", "Beige", "Gold"];

function TogglePills({
  options,
  selected,
  onChange,
}: {
  options: string[];
  selected: string[];
  onChange: (v: string[]) => void;
}) {
  const toggle = (opt: string) => {
    onChange(selected.includes(opt) ? selected.filter((s) => s !== opt) : [...selected, opt]);
  };
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => toggle(opt)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
            selected.includes(opt)
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-background text-foreground border-border hover:border-primary/50"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function MakesInput({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const [input, setInput] = useState("");

  const add = () => {
    const trimmed = input.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setInput("");
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") { e.preventDefault(); add(); }
    if (e.key === "Backspace" && !input && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 min-h-10 p-2 border rounded-md bg-background">
        {value.map((make) => (
          <Badge key={make} variant="secondary" className="gap-1 pr-1">
            {make}
            <button type="button" onClick={() => onChange(value.filter((m) => m !== make))} className="ml-1 rounded-full hover:bg-muted-foreground/20 p-0.5">
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
          onBlur={add}
          placeholder={value.length === 0 ? "Type a make and press Enter (e.g. Toyota)" : "Add another…"}
          className="flex-1 min-w-[160px] bg-transparent outline-none text-sm placeholder:text-muted-foreground"
        />
      </div>
      <p className="text-xs text-muted-foreground">Press Enter or Tab after each make.</p>
    </div>
  );
}

export default function BuyerProfilePage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: user, isLoading: userLoading } = useGetMe({ query: { retry: false } as any });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile, isLoading: profileLoading } = useGetMyBuyerProfile({ query: { enabled: !!user } as any });
  const updateProfile = useUpdateMyBuyerProfile();
  const { toast } = useToast();

  const [formData, setFormData] = useState<BuyerProfileUpdate>({});

  useEffect(() => {
    if (profile) {
      setFormData({
        preferredMakes: profile.preferredMakes ?? [],
        preferredBodyStyles: profile.preferredBodyStyles ?? [],
        maxPrice: profile.maxPrice ?? undefined,
        minYear: profile.minYear ?? undefined,
        maxMileage: profile.maxMileage ?? undefined,
        preferredColors: profile.preferredColors ?? [],
        fuelType: profile.fuelType ?? undefined,
        transmission: profile.transmission ?? undefined,
        useLocation: profile.useLocation ?? false,
        zipCode: profile.zipCode ?? undefined,
        searchRadius: profile.searchRadius ?? undefined,
        notifyOnMatch: profile.notifyOnMatch ?? false,
      });
    }
  }, [profile]);

  if (userLoading || profileLoading) {
    return (
      <Layout>
        <div className="container mx-auto p-8 max-w-4xl text-center">Loading...</div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto p-8 max-w-xl text-center pt-24">
          <h1 className="text-3xl font-bold mb-4">Please Sign In</h1>
          <p className="text-muted-foreground mb-8">You need to be signed in to view your buyer profile.</p>
          <Link href="/login">
            <Button size="lg">Sign In</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate({ data: formData }, {
      onSuccess: () => {
        toast({ title: "Preferences Saved", description: "Your buyer preferences have been updated." });
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to update preferences.", variant: "destructive" });
      },
    });
  };

  return (
    <Layout>
      <div className="container mx-auto p-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-2">Buyer Preferences</h1>
        <p className="text-muted-foreground mb-8">Set your dream car criteria and we'll notify you when a match is listed nearby.</p>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle>Dream Car Alerts</CardTitle>
              <CardDescription>Get notified when a car matching your criteria is listed.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
                <div className="space-y-0.5">
                  <Label className="text-base font-semibold">Enable Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive alerts when matching cars are added.</p>
                </div>
                <Switch
                  checked={formData.notifyOnMatch ?? false}
                  onCheckedChange={(v) => setFormData((prev) => ({ ...prev, notifyOnMatch: v }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Car Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Car Preferences</CardTitle>
              <CardDescription>Narrow down the makes, styles, and colors you're interested in.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">

              <div className="space-y-2">
                <Label>Preferred Makes</Label>
                <MakesInput
                  value={formData.preferredMakes ?? []}
                  onChange={(v) => setFormData((prev) => ({ ...prev, preferredMakes: v }))}
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Body Styles</Label>
                <TogglePills
                  options={BODY_STYLES}
                  selected={formData.preferredBodyStyles ?? []}
                  onChange={(v) => setFormData((prev) => ({ ...prev, preferredBodyStyles: v }))}
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Preferred Colors</Label>
                <TogglePills
                  options={COLORS}
                  selected={formData.preferredColors ?? []}
                  onChange={(v) => setFormData((prev) => ({ ...prev, preferredColors: v }))}
                />
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Fuel Type</Label>
                  <Select
                    value={formData.fuelType ?? "any"}
                    onValueChange={(v) => setFormData((prev) => ({ ...prev, fuelType: v === "any" ? undefined : v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any fuel type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="Gasoline">Gasoline</SelectItem>
                      <SelectItem value="Diesel">Diesel</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                      <SelectItem value="Electric">Electric</SelectItem>
                      <SelectItem value="Plug-in Hybrid">Plug-in Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Transmission</Label>
                  <Select
                    value={formData.transmission ?? "any"}
                    onValueChange={(v) => setFormData((prev) => ({ ...prev, transmission: v === "any" ? undefined : v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any transmission" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="Automatic">Automatic</SelectItem>
                      <SelectItem value="Manual">Manual</SelectItem>
                      <SelectItem value="CVT">CVT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Budget & Vehicle Age */}
          <Card>
            <CardHeader>
              <CardTitle>Budget &amp; Mileage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="maxPrice">Max Price ($)</Label>
                  <Input
                    id="maxPrice"
                    type="number"
                    placeholder="e.g. 25000"
                    value={formData.maxPrice ?? ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, maxPrice: parseInt(e.target.value) || undefined }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minYear">Min Year</Label>
                  <Input
                    id="minYear"
                    type="number"
                    placeholder="e.g. 2018"
                    value={formData.minYear ?? ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, minYear: parseInt(e.target.value) || undefined }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxMileage">Max Mileage</Label>
                  <Input
                    id="maxMileage"
                    type="number"
                    placeholder="e.g. 60000"
                    value={formData.maxMileage ?? ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, maxMileage: parseInt(e.target.value) || undefined }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle>Location Search</CardTitle>
              <CardDescription>Restrict alerts to listings within a set distance of your ZIP code.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-3">
                <Switch
                  id="useLocation"
                  checked={formData.useLocation ?? false}
                  onCheckedChange={(v) => setFormData((prev) => ({ ...prev, useLocation: v }))}
                />
                <Label htmlFor="useLocation">Restrict search to my area</Label>
              </div>

              {formData.useLocation && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      placeholder="e.g. 90210"
                      value={formData.zipCode ?? ""}
                      onChange={(e) => setFormData((prev) => ({ ...prev, zipCode: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="searchRadius">Search Radius (miles)</Label>
                    <Input
                      id="searchRadius"
                      type="number"
                      placeholder="e.g. 50"
                      value={formData.searchRadius ?? ""}
                      onChange={(e) => setFormData((prev) => ({ ...prev, searchRadius: parseInt(e.target.value) || undefined }))}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end pb-8">
            <Button type="submit" size="lg" disabled={updateProfile.isPending}>
              {updateProfile.isPending ? "Saving…" : "Save Preferences"}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
