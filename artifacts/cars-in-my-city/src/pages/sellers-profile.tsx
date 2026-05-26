import { Layout } from "@/components/layout";
import { useGetMe, useGetMySellerProfile, useUpdateMySellerProfile, SellerProfileUpdate, useGetMyListings } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { CarCard } from "@/components/car-card";
import { PlusCircle } from "lucide-react";

export default function SellerProfilePage() {
  const { data: user, isLoading: userLoading } = useGetMe({ query: { retry: false } });
  const { data: profile, isLoading: profileLoading } = useGetMySellerProfile({ query: { enabled: !!user } });
  const { data: listings = [], isLoading: listingsLoading } = useGetMyListings({ query: { enabled: !!user } });
  
  const updateProfile = useUpdateMySellerProfile();
  const { toast } = useToast();

  const [formData, setFormData] = useState<SellerProfileUpdate>({});

  useEffect(() => {
    if (profile) {
      setFormData({
        displayName: profile.displayName,
        businessName: profile.businessName || undefined,
        description: profile.description || undefined,
        phone: profile.phone || undefined,
        email: profile.email || undefined,
        website: profile.website || undefined,
        address: profile.address || undefined,
        city: profile.city || undefined,
        state: profile.state || undefined,
        zipCode: profile.zipCode || undefined,
        offerDelivery: profile.offerDelivery || false,
      });
    }
  }, [profile]);

  if (userLoading || profileLoading) {
    return (
      <Layout>
        <div className="container mx-auto p-8 max-w-5xl text-center">Loading...</div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto p-8 max-w-xl text-center pt-24">
          <h1 className="text-3xl font-bold mb-4">Please Sign In</h1>
          <p className="text-muted-foreground mb-8">You need to be signed in to view your seller profile.</p>
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
        toast({ title: "Profile Saved", description: "Your seller profile has been updated." });
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to update profile.", variant: "destructive" });
      }
    });
  };

  return (
    <Layout>
      <div className="container mx-auto p-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Seller Dashboard</h1>
          <Link href="/list-car">
            <Button className="gap-2">
              <PlusCircle className="h-4 w-4" /> Create Listing
            </Button>
          </Link>
        </div>
        
        <Tabs defaultValue="listings" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="listings">My Listings</TabsTrigger>
            <TabsTrigger value="profile">Public Profile Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="listings">
            {listingsLoading ? (
              <div className="text-center py-12">Loading listings...</div>
            ) : listings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map(car => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            ) : (
              <Card className="text-center py-16 border-dashed">
                <CardContent>
                  <h3 className="text-xl font-bold mb-2">You don't have any listings yet</h3>
                  <p className="text-muted-foreground mb-6">List your car to reach buyers in your area.</p>
                  <Link href="/list-car">
                    <Button>Create Your First Listing</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="profile">
            <form onSubmit={handleSubmit} className="max-w-3xl">
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Public Information</CardTitle>
                  <CardDescription>This information will be displayed on your public seller page.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Display Name *</Label>
                      <Input 
                        id="displayName" 
                        required
                        value={formData.displayName || ''}
                        onChange={(e) => setFormData(prev => ({...prev, displayName: e.target.value}))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="businessName">Business Name (optional)</Label>
                      <Input 
                        id="businessName" 
                        value={formData.businessName || ''}
                        onChange={(e) => setFormData(prev => ({...prev, businessName: e.target.value}))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Public Phone Number</Label>
                      <Input 
                        id="phone" 
                        value={formData.phone || ''}
                        onChange={(e) => setFormData(prev => ({...prev, phone: e.target.value}))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Public Email</Label>
                      <Input 
                        id="email" 
                        type="email"
                        value={formData.email || ''}
                        onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">About You / Your Dealership</Label>
                    <Textarea 
                      id="description" 
                      className="h-32"
                      value={formData.description || ''}
                      onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Location & Services</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input 
                        id="city" 
                        value={formData.city || ''}
                        onChange={(e) => setFormData(prev => ({...prev, city: e.target.value}))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input 
                        id="state" 
                        value={formData.state || ''}
                        onChange={(e) => setFormData(prev => ({...prev, state: e.target.value}))}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-6 p-4 bg-muted/50 rounded-lg">
                    <Switch 
                      id="offerDelivery" 
                      checked={formData.offerDelivery || false} 
                      onCheckedChange={(v) => setFormData(prev => ({...prev, offerDelivery: v}))} 
                    />
                    <div>
                      <Label htmlFor="offerDelivery" className="font-semibold text-base">Offer Delivery</Label>
                      <p className="text-sm text-muted-foreground">Show buyers that you're willing to deliver the vehicle.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button type="submit" size="lg" disabled={updateProfile.isPending}>
                  {updateProfile.isPending ? "Saving..." : "Save Profile"}
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
