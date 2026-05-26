import { Layout } from "@/components/layout";

export function Terms() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 max-w-4xl prose prose-slate">
        <h1>Terms and Conditions</h1>
        <p>Last Updated: October 2023</p>
        <h2>1. Acceptance of Terms</h2>
        <p>By accessing or using CarsInMyCity, you agree to be bound by these Terms. If you disagree, do not use the platform.</p>
        <h2>2. User Conduct</h2>
        <p>Users must provide accurate information when creating listings. Fraudulent listings, scams, and deceptive practices will result in immediate account termination.</p>
        <h2>3. Transaction Liability</h2>
        <p>CarsInMyCity is a venue connecting buyers and sellers. We do not own the vehicles, nor are we a party to the actual transaction. All vehicle purchases are strictly between the buyer and the seller.</p>
      </div>
    </Layout>
  );
}

export function Privacy() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 max-w-4xl prose prose-slate">
        <h1>Privacy Policy</h1>
        <p>Last Updated: October 2023</p>
        <h2>1. Information We Collect</h2>
        <p>We collect information you provide directly (account details, listings), automatically collected data (cookies, usage data), and location data to provide hyper-local results.</p>
        <h2>2. How We Use Information</h2>
        <p>We use your data to operate the marketplace, facilitate communication between buyers and sellers, and improve our services.</p>
        <h2>3. Information Sharing</h2>
        <p>We do not sell your personal data to third parties. Public listing data is visible to all users.</p>
      </div>
    </Layout>
  );
}

export function Affiliates() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 max-w-4xl text-center">
        <h1 className="text-4xl font-bold mb-6">Partner With Us</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Join the In My City network. If you run a local dealership, automotive service center, or community portal, we want to talk.
        </p>
        <div className="bg-muted/50 p-8 rounded-2xl inline-block text-left border border-border">
          <h3 className="font-bold text-lg mb-2">Contact Partnerships</h3>
          <p className="text-primary font-medium">partners@carsinmycity.com</p>
          <p className="mt-4 text-sm text-muted-foreground">Please include your business name, location, and nature of inquiry.</p>
        </div>
      </div>
    </Layout>
  );
}
