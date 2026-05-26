import { Layout } from "@/components/layout";

export default function About() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-center text-primary">About CarsInMyCity</h1>
        
        <div className="prose prose-lg max-w-none prose-headings:text-primary prose-a:text-accent">
          <p className="lead text-xl text-muted-foreground mb-8 text-center">
            We're building the most transparent, hyper-local car marketplace on the internet.
          </p>

          <h2>Our Mission</h2>
          <p>
            Buying or selling a car locally shouldn't feel like navigating a maze. For too long, the options have been either dealing with the high margins of traditional dealerships or braving the unpredictable wilderness of generic classified sites.
          </p>
          <p>
            CarsInMyCity was built to sit right in the middle: providing the slick, secure, trustworthy experience of a modern tech product, combined with the community-driven, direct-connection benefits of a local marketplace.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12 not-prose">
            <div className="bg-muted/30 p-8 rounded-2xl border border-border">
              <h3 className="text-2xl font-bold mb-4">For Buyers</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 font-bold text-sm">1</div>
                  <p>Search hyper-local inventory with advanced filters</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 font-bold text-sm">2</div>
                  <p>Message sellers securely without exposing personal info</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 font-bold text-sm">3</div>
                  <p>Find vetted local dealers and private sellers</p>
                </li>
              </ul>
            </div>
            
            <div className="bg-muted/30 p-8 rounded-2xl border border-border">
              <h3 className="text-2xl font-bold mb-4">For Sellers</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-accent/20 text-accent flex items-center justify-center shrink-0 font-bold text-sm">1</div>
                  <p>Create a beautiful, detailed listing in minutes</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-accent/20 text-accent flex items-center justify-center shrink-0 font-bold text-sm">2</div>
                  <p>Reach motivated buyers exactly in your ZIP code</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-accent/20 text-accent flex items-center justify-center shrink-0 font-bold text-sm">3</div>
                  <p>Keep more money compared to trade-in offers</p>
                </li>
              </ul>
            </div>
          </div>

          <h2>The "In My City" Network</h2>
          <p>
            CarsInMyCity is proud to be part of the <strong>In My City</strong> family of local marketplaces. We believe the best transactions happen between neighbors. Be sure to check out our sister sites, <em>CareInMyCity</em> and <em>PetsInMyCity</em>, for other local marketplace needs.
          </p>
        </div>
      </div>
    </Layout>
  );
}
