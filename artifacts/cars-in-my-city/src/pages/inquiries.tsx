import { Layout } from "@/components/layout";
import { useGetMe, useListInquiries } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { MessageSquare, CarFront, Clock } from "lucide-react";
import { format } from "date-fns";

export default function InquiriesPage() {
  const { data: user, isLoading: userLoading } = useGetMe({ query: { retry: false } });
  const { data: inquiries = [], isLoading: inqLoading } = useListInquiries({ query: { enabled: !!user } });

  if (userLoading || inqLoading) {
    return <Layout><div className="container mx-auto p-8 text-center">Loading...</div></Layout>;
  }

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto p-8 text-center pt-24">
          <h1 className="text-3xl font-bold mb-4">Please Sign In</h1>
          <p className="text-muted-foreground mb-8">You need to be signed in to view your messages.</p>
          <Link href="/login"><Button size="lg">Sign In</Button></Link>
        </div>
      </Layout>
    );
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'replied': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400';
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-400';
      default: return '';
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="flex items-center gap-3 mb-8">
          <MessageSquare className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Messages</h1>
        </div>

        {inquiries.length === 0 ? (
          <div className="text-center py-24 bg-card rounded-2xl border border-border border-dashed">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">No messages yet</h2>
            <p className="text-muted-foreground mb-6">Inquiries you send or receive will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {inquiries.map(inq => (
              <Card key={inq.id} className="hover:border-primary/30 transition-colors cursor-pointer group">
                <CardContent className="p-5">
                  <div className="flex flex-col md:flex-row gap-4 justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className={getStatusColor(inq.status)}>{inq.status}</Badge>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {format(new Date(inq.createdAt), "MMM d, yyyy")}
                        </span>
                      </div>
                      
                      <Link href={`/cars/${inq.carId}`}>
                        <h3 className="font-bold text-lg group-hover:text-primary transition-colors flex items-center gap-2">
                          <CarFront className="h-5 w-5 text-muted-foreground" />
                          {inq.carTitle || `Car #${inq.carId}`}
                        </h3>
                      </Link>
                      
                      <p className="text-muted-foreground text-sm line-clamp-2 mt-2 bg-muted/30 p-3 rounded-lg border border-border/50">
                        "{inq.message}"
                      </p>
                    </div>
                    
                    <div className="flex flex-col items-start md:items-end justify-between min-w-[200px] border-l border-border md:pl-4">
                      <div className="text-sm space-y-1 mb-4">
                        <div className="font-medium">From: {inq.buyerName || 'Unknown'}</div>
                        {inq.wantsDelivery && <div className="text-accent">🚚 Wants Delivery</div>}
                        {inq.tradeIn && <div className="text-blue-500">🔄 Has Trade-in</div>}
                        {inq.financing && <div className="text-green-500">💰 Needs Financing</div>}
                      </div>
                      <Button variant="outline" size="sm" className="w-full md:w-auto">Reply</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
