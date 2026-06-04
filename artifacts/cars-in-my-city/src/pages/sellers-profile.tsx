import { Layout } from "@/components/layout";
import {
  useGetMe,
  useGetMySellerProfile,
  useUpdateMySellerProfile,
  SellerProfileUpdate,
  useGetMyListings,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { CarCard } from "@/components/car-card";
import { PlusCircle, Store, User, BadgeCheck } from "lucide-react";

type SellerType = "private" | "dealer" | "certified_dealer";

const SELLER_TYPES: { value: SellerType; label: string; description: string; icon: React.ReactNode }[] = [
  {
    value: "private",
    label: "Private Seller",
    description: "I'm an individual selling my personal vehicle(s).",
    icon: <User className="h-5 w-5" />,
  },
  {
    value: "dealer",
    label: "Dealer",
    description: "I'm a licensed car dealership with an inventory of vehicles.",
    icon: <Store className="h-5 w-5" />,
  },
  {
    value: "certified_dealer",
    label: "Certified Dealer",
    description: "A verified dealership with certified pre-owned programs.",
    icon: <BadgeCheck className="h-5 w-5" />,
  },
];

function SellerTypeSelector({
  value,
  onChange,
}: {
  value: SellerType;
  onChange: (v: SellerType) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {SELLER_TYPES.map((type) => (
        <button
          key={type.value}
          type="button"
          onClick={() => onChange(type.value)}
          className={`text-left p-4 rounded-xl border-2 transition-all ${
            value === type.value
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/40"
          }`}
        >
          <div className={`mb-2 ${value === type.value ? "text-primary" : "text-muted-foreground"}`}>
            {type.icon}
          </div>
          <div className="font-semibold text-sm">{type.label}</div>
          <div className="text-xs text-muted-foreground mt-1">{type.description}</div>
        </button>
      ))}
    </div>
  );
}

export default function SellerProfilePage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: user, isLoading: userLoading } = useGetMe({ query: { retry: false } as any });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile, isLoading: profileLoading } = useGetMySellerProfile({ query: { enabled: !!user } as any });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: listings = [], isLoading: listingsLoading } = useGetMyListings({ query: { enabled: !!user } as any });

  const updateProfile = useUpdateMySellerProfile();
  const { toast } = useToast();

  const [formData, setFormData] = useState<SellerProfileUpdate & { sellerType?: SellerType }>({});

  useEffect(() => {
    if (profile) {
      setFormData({
        sellerType: (profile.sellerType as SellerType) ?? "private",
        displayName: profile.displayName,
        businessName: profile.businessName ?? undefined,
        description: profile.description ?? undefined,
        phone: profile.phone ?? undefined,
        email: profile.email ?? undefined,
        website: profile.website ?? undefined,
        address: profile.address ?? undefined,
        city: profile.city ?? undefined,
        state: profile.state ?? undefined,
        zipCode: profile.zipCode ?? undefined,
        offerDelivery: profile.offerDelivery ?? false,
      });
    }
  }, [profile]);

  if (userLoading || profileLoading) {
    return (
      <Layout>
        <div className="container mx-auto p-8 max-w-5xl text-center">Loading…</div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto p-8 max-w-xl text-center pt-24">
          <h1 className="text-3xl font-bold mb-4">Please Sign In</h1>
          <p className="text-muted-foreground mb-8">You need to be signed in to view your seller dashboard.</p>
          <Link href="/login">
            <Button size="lg">Sign In</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { data: formData as any },
      {
        onSuccess: () => {
          toast({ title: "Profile Saved", description: "Your seller profile has been updated." });
        },
        onError: () => {
          toast({ title: "Error", description: "Failed to update profile.", variant: "destructive" });
        },
      }
    );
  };

  const isDealer = formData.sellerType === "dealer" || formData.sellerType === "certified_dealer";

  return (
    <Layout>
      <div className="container mx-auto p-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Seller Dashboard</h1>
            {profile && (
              <p className="text-muted-foreground mt-1">
                {profile.displayName} · {profile.totalListings ?? 0} listing{profile.totalListings !== 1 ? "s" : ""}
              </p>
            )}
          </div>
          <Link href="/list-car">
            <Button className="gap-2">
              <PlusCircle className="h-4 w-4" /> Create Listing
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="listings" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="listings">My Listings</TabsTrigger>
            <TabsTrigger value="profile">Profile Settings</TabsTrigger>
          </TabsList>

          {/* ── Listings tab ─────────────────────────────────────────────── */}
          <TabsContent value="listings">
            {listingsLoading ? (
              <div className="text-center py-12">Loading listings…</div>
            ) : listings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            ) : (
              <Card className="text-center py-16 border-dashed">
                <CardContent>
                  <h3 className="text-xl font-bold mb-2">No listings yet</h3>
                  <p className="text-muted-foreground mb-6">List your car to reach buyers in your area.</p>
                  <Link href="/list-car">
                    <Button>Create Your First Listing</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* ── Profile settings tab ──────────────────────────────────────── */}
          <TabsContent value="profile">
            <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">

              {/* Seller type */}
              <Card>
                <CardHeader>
                  <CardTitle>Seller Type</CardTitle>
                  <CardDescription>How you sell cars on CarsInMyCity.</CardDescription>
                </CardHeader>
                <CardContent>
                  <SellerTypeSelector
                    value={(formData.sellerType as SellerType) ?? "private"}
                    onChange={(v) => setFormData((prev) => ({ ...prev, sellerType: v }))}
                  />
                </CardContent>
              </Card>

              {/* Public information */}
              <Card>
                <CardHeader>
                  <CardTitle>Public Information</CardTitle>
                  <CardDescription>This information is shown on your public seller page.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Display Name *</Label>
                      <Input
                        id="displayName"
                        required
                        value={formData.displayName ?? ""}
                        onChange={(e) => setFormData((prev) => ({ ...prev, displayName: e.target.value }))}
                      />
                    </div>
                    {isDealer && (
                      <div className="space-y-2">
                        <Label htmlFor="businessName">Business / Dealership Name</Label>
                        <Input
                          id="businessName"
                          value={formData.businessName ?? ""}
                          onChange={(e) => setFormData((prev) => ({ ...prev, businessName: e.target.value }))}
                        />
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="phone">Public Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(555) 000-0000"
                        value={formData.phone ?? ""}
                        onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Public Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="contact@example.com"
                        value={formData.email ?? ""}
                        onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        type="url"
                        placeholder="https://yoursite.com"
                        value={formData.website ?? ""}
                        onChange={(e) => setFormData((prev) => ({ ...prev, website: e.target.value }))}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="description">
                      {isDealer ? "About Your Dealership" : "About You"}
                    </Label>
                    <Textarea
                      id="description"
                      className="h-28"
                      placeholder={
                        isDealer
                          ? "Describe your dealership, specialties, and what makes you stand out…"
                          : "Tell buyers a little about yourself and why they should trust you…"
                      }
                      value={formData.description ?? ""}
                      onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Location */}
              <Card>
                <CardHeader>
                  <CardTitle>Location</CardTitle>
                  <CardDescription>Help local buyers find you.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      placeholder={isDealer ? "123 Main St" : "Optional — shown to interested buyers only"}
                      value={formData.address ?? ""}
                      onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2 md:col-span-1">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData.city ?? ""}
                        onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        placeholder="e.g. TX"
                        maxLength={2}
                        value={formData.state ?? ""}
                        onChange={(e) => setFormData((prev) => ({ ...prev, state: e.target.value.toUpperCase() }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        placeholder="e.g. 75001"
                        value={formData.zipCode ?? ""}
                        onChange={(e) => setFormData((prev) => ({ ...prev, zipCode: e.target.value }))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Services */}
              <Card>
                <CardHeader>
                  <CardTitle>Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
                    <div>
                      <Label htmlFor="offerDelivery" className="text-base font-semibold">Offer Vehicle Delivery</Label>
                      <p className="text-sm text-muted-foreground mt-0.5">Show buyers that you're willing to deliver the vehicle to them.</p>
                    </div>
                    <Switch
                      id="offerDelivery"
                      checked={formData.offerDelivery ?? false}
                      onCheckedChange={(v) => setFormData((prev) => ({ ...prev, offerDelivery: v }))}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end pb-8">
                <Button type="submit" size="lg" disabled={updateProfile.isPending}>
                  {updateProfile.isPending ? "Saving…" : "Save Profile"}
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
