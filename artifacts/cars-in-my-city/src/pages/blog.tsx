import { Layout } from "@/components/layout";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Blog() {
  const articles = [
    { title: "10 Things to Check When Buying a Used Car", category: "Buying", date: "Oct 12, 2023", readTime: "5 min read", img: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=600" },
    { title: "How to Price Your Car for a Fast Sale", category: "Selling", date: "Oct 05, 2023", readTime: "7 min read", img: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=600" },
    { title: "Understanding Car Title Types: Clean, Salvage, Rebuilt", category: "Guides", date: "Sep 28, 2023", readTime: "6 min read", img: "https://images.unsplash.com/photo-1554744512-d6c603f27c54?auto=format&fit=crop&q=80&w=600" },
    { title: "New vs Used vs Certified Pre-Owned: What's Right for You?", category: "Buying", date: "Sep 20, 2023", readTime: "8 min read", img: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=600" },
    { title: "Tips for Taking Great Car Photos for Your Listing", category: "Selling", date: "Sep 15, 2023", readTime: "4 min read", img: "https://images.unsplash.com/photo-1516862523118-a3724eb136d7?auto=format&fit=crop&q=80&w=600" },
    { title: "Financing a Used Car: What You Need to Know", category: "Finance", date: "Sep 08, 2023", readTime: "9 min read", img: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=600" },
    { title: "How to Transfer a Car Title Safely", category: "Guides", date: "Sep 01, 2023", readTime: "5 min read", img: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=600" },
    { title: "The Best Time of Year to Buy a Car", category: "Buying", date: "Aug 25, 2023", readTime: "4 min read", img: "https://images.unsplash.com/photo-1485291571150-772bcfc10da5?auto=format&fit=crop&q=80&w=600" },
  ];

  return (
    <Layout>
      <div className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Automotive Insights & Guides</h1>
          <p className="text-xl text-primary-foreground/80">
            Expert advice, local market trends, and everything you need to know about buying and selling cars.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-wrap gap-4 justify-center mb-12">
          {["All", "Buying", "Selling", "Guides", "Finance"].map(cat => (
            <Button key={cat} variant={cat === "All" ? "default" : "outline"} className="rounded-full px-6">
              {cat}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {articles.map((article, i) => (
            <Card key={i} className="overflow-hidden hover:shadow-lg transition-all group cursor-pointer border-border/50 hover:border-primary/30">
              <div className="aspect-[16/10] overflow-hidden bg-muted relative">
                <img src={article.img} alt={article.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute top-3 left-3 bg-background/90 backdrop-blur text-foreground px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                  {article.category}
                </div>
              </div>
              <CardContent className="p-5">
                <div className="flex items-center text-xs text-muted-foreground mb-3 gap-2">
                  <span>{article.date}</span>
                  <span>•</span>
                  <span>{article.readTime}</span>
                </div>
                <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-3">
                  {article.title}
                </h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
