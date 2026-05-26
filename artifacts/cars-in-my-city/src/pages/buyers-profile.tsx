import { Layout } from "@/components/layout";
import { useGetMe, useGetMyBuyerProfile, useUpdateMyBuyerProfile, BuyerProfileUpdate } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

export default function BuyerProfilePage() {
  const { data: user, isLoading: userLoading } = useGetMe({ query: { retry: false } });
  const { data: profile, isLoading: profileLoading } = useGetMyBuyerProfile({ query: { enabled: !!user } });
  const updateProfile = useUpdateMyBuyerProfile();
  const { toast } = useToast();

  const [formData, setFormData] = useState<BuyerProfileUpdate>({});

  useEffect(() => {
    if (profile) {
      setFormData({
        preferredMakes: profile.preferredMakes || [],
        preferredBodyStyles: profile.preferredBodyStyles || [],
        maxPrice: profile.maxPrice || undefined,
        minYear: profile.minYear || undefined,
        maxMileage: profile.maxMileage || undefined,
        preferredColors: profile.preferredColors || [],
        fuelType: profile.fuelType || undefined,
        transmission: profile.transmission || undefined,
        useLocation: profile.useLocation || false,
        zipCode: profile.zipCode || undefined,
        searchRadius: profile.searchRadius || undefined,
        notifyOnMatch: profile.notifyOnMatch || false,
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
      }
    });
  };

  return (
    <Layout>
      <div className="container mx-auto p-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Buyer Preferences</h1>
        
        <form onSubmit={handleSubmit}>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Dream Car Alerts</CardTitle>
              <CardDescription>Tell us what you're looking for, and we'll notify you when a match is listed nearby.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
                <div className="space-y-0.5">
                  <Label className="text-base font-semibold">Enable Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive email alerts when cars matching your criteria are added.</p>
                </div>
                <Switch 
                  checked={formData.notifyOnMatch || false} 
                  onCheckedChange={(v) => setFormData(prev => ({...prev, notifyOnMatch: v}))} 
                />
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="maxPrice">Maximum Price ($)</Label>
                  <Input 
                    id="maxPrice" 
                    type="number" 
                    placeholder="e.g. 25000"
                    value={formData.maxPrice || ''}
                    onChange={(e) => setFormData(prev => ({...prev, maxPrice: parseInt(e.target.value) || undefined}))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minYear">Minimum Year</Label>
                  <Input 
                    id="minYear" 
                    type="number" 
                    placeholder="e.g. 2018"
                    value={formData.minYear || ''}
                    onChange={(e) => setFormData(prev => ({...prev, minYear: parseInt(e.target.value) || undefined}))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxMileage">Maximum Mileage</Label>
                  <Input 
                    id="maxMileage" 
                    type="number" 
                    placeholder="e.g. 60000"
                    value={formData.maxMileage || ''}
                    onChange={(e) => setFormData(prev => ({...prev, maxMileage: parseInt(e.target.value) || undefined}))}
                  />
                </div>
              </div>

            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Location Search</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="useLocation" 
                  checked={formData.useLocation || false} 
                  onCheckedChange={(v) => setFormData(prev => ({...prev, useLocation: v}))} 
                />
                <Label htmlFor="useLocation">Restrict search to my area</Label>
              </div>

              {formData.useLocation && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input 
                      id="zipCode" 
                      value={formData.zipCode || ''}
                      onChange={(e) => setFormData(prev => ({...prev, zipCode: e.target.value}))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="searchRadius">Search Radius (miles)</Label>
                    <Input 
                      id="searchRadius" 
                      type="number"
                      value={formData.searchRadius || ''}
                      onChange={(e) => setFormData(prev => ({...prev, searchRadius: parseInt(e.target.value) || undefined}))}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" size="lg" disabled={updateProfile.isPending}>
              {updateProfile.isPending ? "Saving..." : "Save Preferences"}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
