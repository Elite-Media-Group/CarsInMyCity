import { Link } from "wouter";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { CarFront, Camera, MessageSquare, DollarSign, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Sell() {
  return (
    <Layout>
      <div className="relative bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container mx-auto px-4 py-24 relative z-10 text-center text-white">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Sell your car <span className="text-accent">locally</span>.<br/> Sell it <span className="text-accent">fast</span>.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/90 mb-10 max-w-2xl mx-auto"
          >
            Reach thousands of motivated buyers in your community. No hidden fees, no dealership lowballs, just a seamless selling experience.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link href="/list-car">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 h-14 px-8 text-lg rounded-xl">
                List Your Car Now
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How it works</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Three simple steps to turn your current car into cash.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="text-center group">
              <div className="h-20 w-20 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                <CarFront className="h-10 w-10 text-primary group-hover:text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3">1. Tell us about your car</h3>
              <p className="text-muted-foreground">Enter your VIN or plate number, and we'll automatically pull the specs. Add your mileage and condition.</p>
            </div>
            
            <div className="text-center group">
              <div className="h-20 w-20 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                <Camera className="h-10 w-10 text-primary group-hover:text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3">2. Snap some photos</h3>
              <p className="text-muted-foreground">Upload photos from your phone. Our guide helps you take the best angles to attract buyers.</p>
            </div>
            
            <div className="text-center group">
              <div className="h-20 w-20 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                <MessageSquare className="h-10 w-10 text-primary group-hover:text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3">3. Connect with buyers</h3>
              <p className="text-muted-foreground">Receive inquiries directly in your inbox. Negotiate safely and close the deal locally.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Why sell on CarsInMyCity?</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="mt-1"><CheckCircle2 className="h-6 w-6 text-accent" /></div>
                  <div>
                    <h4 className="text-lg font-bold mb-1">Keep more of your money</h4>
                    <p className="text-muted-foreground">Selling private party typically nets you 15-25% more than dealership trade-in offers.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="mt-1"><CheckCircle2 className="h-6 w-6 text-accent" /></div>
                  <div>
                    <h4 className="text-lg font-bold mb-1">Hyper-local targeting</h4>
                    <p className="text-muted-foreground">We show your car to people in your city who are actively looking to buy.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="mt-1"><CheckCircle2 className="h-6 w-6 text-accent" /></div>
                  <div>
                    <h4 className="text-lg font-bold mb-1">Secure messaging</h4>
                    <p className="text-muted-foreground">Communicate without giving out your personal phone number or email address.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-tr from-primary to-blue-500 rounded-3xl opacity-10 absolute inset-0 transform rotate-3 scale-105" />
              <img 
                src="https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=1200" 
                alt="Happy seller handing over keys" 
                className="rounded-3xl relative z-10 shadow-2xl object-cover aspect-[4/3]"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-background text-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <DollarSign className="h-16 w-16 text-accent mx-auto mb-6" />
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to see what it's worth?</h2>
          <p className="text-xl text-muted-foreground mb-10">It takes less than 3 minutes to create your listing.</p>
          <Link href="/list-car">
            <Button size="lg" className="h-14 px-10 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              Start Your Listing
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
