import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRegisterUser, UserRegistrationRole } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { CarFront } from "lucide-react";

export default function Register() {
  const registerMutation = useRegisterUser();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "buyer" as UserRegistrationRole
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate({ data: formData }, {
      onSuccess: () => {
        toast({ title: "Account created!", description: "Welcome to CarsInMyCity" });
        setLocation("/");
      },
      onError: () => {
        toast({ title: "Registration failed", description: "Please check your information and try again", variant: "destructive" });
      }
    });
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-14rem)] flex items-center justify-center p-4 py-12 bg-muted/30">
        <Card className="w-full max-w-md border-border/60 shadow-xl">
          <CardHeader className="text-center pb-6 pt-8">
            <div className="mx-auto bg-primary/10 h-16 w-16 rounded-full flex items-center justify-center mb-4">
              <CarFront className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Create an Account</CardTitle>
            <CardDescription>Join your local car community</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    required 
                    value={formData.firstName}
                    onChange={e => setFormData(prev => ({...prev, firstName: e.target.value}))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    required 
                    value={formData.lastName}
                    onChange={e => setFormData(prev => ({...prev, lastName: e.target.value}))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  required 
                  value={formData.email}
                  onChange={e => setFormData(prev => ({...prev, email: e.target.value}))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  value={formData.password}
                  onChange={e => setFormData(prev => ({...prev, password: e.target.value}))}
                />
              </div>
              <div className="space-y-2 pb-2">
                <Label>I want to...</Label>
                <Select value={formData.role} onValueChange={(v: UserRegistrationRole) => setFormData(prev => ({...prev, role: v}))}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select intent" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buyer">Buy a car</SelectItem>
                    <SelectItem value="seller">Sell a car</SelectItem>
                    <SelectItem value="both">Both buy and sell</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={registerMutation.isPending}>
                {registerMutation.isPending ? "Creating account..." : "Sign Up"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-border/50 py-6">
            <div className="text-sm text-muted-foreground">
              Already have an account? <Link href="/login" className="text-primary font-bold hover:underline">Log in</Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
}
