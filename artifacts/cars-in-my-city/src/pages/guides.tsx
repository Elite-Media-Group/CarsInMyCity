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
