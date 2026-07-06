import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useGetMe } from "@workspace/api-client-react";
import { MapPin, User, LogOut, Heart, MessageSquare, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoUrl from "@assets/carsinmycity_1783358675675.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { data: user } = useGetMe({ query: { retry: false } });

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center shrink-0">
            <img
              src={logoUrl}
              alt="Cars In My City"
              className="w-auto"
              style={{ height: "clamp(5.5rem, 9vw + 2.5rem, 7.5rem)" }}
            />
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-base font-bold">
            <Link href="/search" className="text-foreground/80 hover:text-foreground transition-colors">Buy</Link>
            <Link href="/sell" className="text-foreground/80 hover:text-foreground transition-colors">Sell</Link>
            <Link href="/cities" className="text-foreground/80 hover:text-foreground transition-colors">Cities</Link>
            <Link href="/guides" className="text-foreground/80 hover:text-foreground transition-colors">Guides</Link>
            <Link href="/blog" className="text-foreground/80 hover:text-foreground transition-colors">Blog</Link>
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link href="/list-car" className="hidden sm:inline-flex">
                  <Button size="sm" className="gap-2 bg-[#4A7DC7] hover:bg-[#3D6BB0] text-white font-bold">
                    <PlusCircle className="h-4 w-4" /> List a Car
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-9 w-9 border-2 border-accent">
                        <AvatarImage src={user.avatarUrl || ""} alt={user.firstName} />
                        <AvatarFallback className="bg-primary text-white font-sans font-bold">{user.firstName[0]}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/favorites" className="flex w-full items-center gap-2 cursor-pointer">
                        <Heart className="h-4 w-4" /> Saved Cars
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/inquiries" className="flex w-full items-center gap-2 cursor-pointer">
                        <MessageSquare className="h-4 w-4" /> Messages
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={user.role === 'buyer' ? '/buyers/profile' : '/sellers/profile'} className="flex w-full items-center gap-2 cursor-pointer">
                        <User className="h-4 w-4" /> Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer gap-2">
                      <LogOut className="h-4 w-4" /> Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">Log in</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Sign up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {children}
      </main>

      <footer className="border-t border-border bg-muted/40 text-muted-foreground mt-auto">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <Link href="/" className="flex items-center opacity-90 hover:opacity-100 transition-opacity">
                <img
                  src={logoUrl}
                  alt="Cars In My City"
                  className="w-auto"
                  style={{ height: "clamp(5.5rem, 9vw + 2.5rem, 7.5rem)" }}
                />
              </Link>
              <p className="text-sm leading-relaxed">
                The hyper-local car marketplace connecting buyers and sellers in their community. Fast, transparent, and built for you.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-4">Shop</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/search?condition=used" className="hover:text-primary transition-colors">Used Cars</Link></li>
                <li><Link href="/search?condition=new" className="hover:text-primary transition-colors">New Cars</Link></li>
                <li><Link href="/search?condition=certified" className="hover:text-primary transition-colors">Certified Pre-Owned</Link></li>
                <li><Link href="/cities" className="hover:text-primary transition-colors">Browse by City</Link></li>
                <li><Link href="/guides" className="hover:text-primary transition-colors">All Guides</Link></li>
                <li><Link href="/buying-guide" className="hover:text-primary transition-colors">Buying Guide</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Sell</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/sell" className="hover:text-primary transition-colors">Sell Your Car</Link></li>
                <li><Link href="/selling-guide" className="hover:text-primary transition-colors">Selling Guide</Link></li>
                <li><Link href="/list-car" className="hover:text-primary transition-colors">Create Listing</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
            <p>© {new Date().getFullYear()} CarsInMyCity. All rights reserved.</p>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Part of the In My City network
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
