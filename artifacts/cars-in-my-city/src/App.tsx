import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Home from "@/pages/home";
import Search from "@/pages/search";
import CarDetail from "@/pages/car-detail";
import Sell from "@/pages/sell";
import ListCar from "@/pages/list-car";
import BuyerProfilePage from "@/pages/buyers-profile";
import SellerProfilePage from "@/pages/sellers-profile";
import FavoritesPage from "@/pages/favorites";
import InquiriesPage from "@/pages/inquiries";
import Login from "@/pages/login";
import Register from "@/pages/register";
import About from "@/pages/about";
import Blog from "@/pages/blog";
import BlogArticle from "@/pages/blog-article";
import { BuyingGuide, SellingGuide } from "@/pages/guides";
import { Terms, Privacy, Affiliates } from "@/pages/legal";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/search" component={Search} />
      <Route path="/cars/:id" component={CarDetail} />
      <Route path="/sell" component={Sell} />
      <Route path="/list-car" component={ListCar} />
      <Route path="/buyers/profile" component={BuyerProfilePage} />
      <Route path="/sellers/profile" component={SellerProfilePage} />
      <Route path="/favorites" component={FavoritesPage} />
      <Route path="/inquiries" component={InquiriesPage} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      
      {/* Content Pages */}
      <Route path="/about" component={About} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogArticle} />
      <Route path="/buying-guide" component={BuyingGuide} />
      <Route path="/selling-guide" component={SellingGuide} />
      <Route path="/terms" component={Terms} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/affiliates" component={Affiliates} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
