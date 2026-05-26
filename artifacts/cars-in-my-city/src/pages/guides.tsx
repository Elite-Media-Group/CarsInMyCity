import { Layout } from "@/components/layout";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function GenericContentPage({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-primary">{title}</h1>
        <div className="prose prose-lg max-w-none text-muted-foreground prose-headings:text-foreground prose-a:text-primary hover:prose-a:text-accent prose-strong:text-foreground">
          {children}
        </div>
        <div className="mt-16 pt-8 border-t border-border flex justify-between items-center">
          <Link href="/"><Button variant="outline">Back to Home</Button></Link>
          <Link href="/search"><Button>Browse Cars</Button></Link>
        </div>
      </div>
    </Layout>
  );
}

export function BuyingGuide() {
  return (
    <GenericContentPage title="The Ultimate Used Car Buying Guide">
      <p className="lead text-xl text-foreground font-medium">Buying a car is one of the largest purchases you'll make. Doing it right takes patience, research, and a bit of know-how. Use this guide to navigate the local market safely.</p>
      
      <h2>1. Set Your Budget</h2>
      <p>Before you even look at a listing, determine how much you can afford. The rule of thumb: your total car payment (including insurance and maintenance) shouldn't exceed 15% of your monthly take-home pay.</p>
      
      <h2>2. Choose the Right Car for Your Needs</h2>
      <p>It's easy to fall in love with a sporty coupe, but if you have three kids, you need a different vehicle. Consider your daily commute, cargo needs, and weekend activities.</p>

      <h2>3. The Inspection Checklist</h2>
      <p>Never buy a used car without checking these crucial areas:</p>
      <ul>
        <li><strong>Exterior:</strong> Check for uneven panel gaps, mismatched paint, and rust.</li>
        <li><strong>Tires:</strong> Look for uneven wear, which could indicate alignment issues.</li>
        <li><strong>Under the Hood:</strong> Check oil level and color (shouldn't be milky), look for leaks, and inspect belts.</li>
        <li><strong>Interior:</strong> Check all electronics, air conditioning, and look for water damage signs.</li>
      </ul>

      <h2>4. The Test Drive</h2>
      <p>Drive the car on both local roads and the highway. Listen for strange noises, feel how the transmission shifts, and test the brakes firmly in a safe area.</p>

      <h2>5. The Pre-Purchase Inspection (PPI)</h2>
      <p>For private party sales especially, we strongly recommend spending $100-$200 to have an independent mechanic inspect the vehicle before you buy it.</p>
    </GenericContentPage>
  );
}

export function SellingGuide() {
  return (
    <GenericContentPage title="How to Sell Your Car Locally">
      <p className="lead text-xl text-foreground font-medium">Selling your car privately can net you 15-25% more than trading it in. Here is how to do it efficiently and safely.</p>
      
      <h2>1. Prep the Car</h2>
      <p>A clean car implies a well-maintained car. Invest in a professional detail or spend a weekend thoroughly cleaning the interior and exterior. Fix minor cosmetic issues if they are cheap to repair.</p>
      
      <h2>2. Take Great Photos</h2>
      <p>Good photos are the #1 factor in getting clicks on your listing. Take photos during "golden hour" (just after sunrise or just before sunset). Ensure you capture:</p>
      <ul>
        <li>3/4 angle shots of front and rear</li>
        <li>Straight on shots of all four sides</li>
        <li>Interior dashboard (wide shot)</li>
        <li>Front and rear seats</li>
        <li>Odometer showing current mileage</li>
        <li>Any major flaws (honesty saves time!)</li>
      </ul>

      <h2>3. Price it Right</h2>
      <p>Check similar listings in your area on CarsInMyCity. Price slightly above your absolute bottom line to leave room for negotiation.</p>

      <h2>4. Write a Detailed Description</h2>
      <p>Include the history of the car, major maintenance recently performed, reasons for selling, and be transparent about any known issues.</p>

      <h2>5. Safe Transactions</h2>
      <p>Meet in public, well-lit places (police station parking lots are great). Never accept personal checks. Cash or cashier's checks drawn at the buyer's bank during business hours are the safest methods.</p>
    </GenericContentPage>
  );
}
