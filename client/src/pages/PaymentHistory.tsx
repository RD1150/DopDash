import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coins, Calendar, DollarSign, Loader2 } from "lucide-react";
import { Link } from "wouter";

/**
 * Payment History Page
 * Shows user's past coin purchases with transaction details
 */
export default function PaymentHistory() {
  const { user } = useAuth();
  const { data: purchases, isLoading } = trpc.payments.getPaymentHistory.useQuery(
    { limit: 50 },
    { enabled: !!user }
  );

  if (!user) {
    return (
      <div className="container py-12">
        <Card className="border-dashed">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">Please log in to view your payment history</p>
            <Link href="/login">
              <Button>Log In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Payment History</h1>
        <p className="text-muted-foreground">View all your coin purchases and transactions</p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="pt-6 flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading your payment history...</span>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!isLoading && (!purchases || purchases.length === 0) && (
        <Card className="border-dashed">
          <CardContent className="pt-6 text-center">
            <Coins className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="font-semibold mb-2">No purchases yet</h3>
            <p className="text-muted-foreground mb-4">Start your coin collection today!</p>
            <Link href="/buy-coins">
              <Button>Buy Coins</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Purchases List */}
      {!isLoading && purchases && purchases.length > 0 && (
        <div className="space-y-4">
          {purchases.map((purchase) => (
            <Card key={purchase.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  {/* Left: Package Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <Coins className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold capitalize">
                          {purchase.packageId} Package
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {purchase.coinsAmount.toLocaleString()} coins
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Middle: Date & Price */}
                  <div className="text-right space-y-1">
                    <div className="flex items-center justify-end gap-1 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(purchase.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center justify-end gap-1 font-semibold">
                      <DollarSign className="w-4 h-4" />
                      <span>${(purchase.priceInCents / 100).toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Right: Status Badge */}
                  <div>
                    <Badge
                      variant={
                        purchase.status === "completed"
                          ? "default"
                          : purchase.status === "failed"
                            ? "destructive"
                            : purchase.status === "refunded"
                              ? "secondary"
                              : "outline"
                      }
                      className="capitalize"
                    >
                      {purchase.status}
                    </Badge>
                  </div>
                </div>

                {/* Transaction ID (small) */}
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    Transaction ID: {purchase.stripePaymentIntentId.slice(0, 20)}...
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-8 flex gap-3 justify-center">
        <Link href="/buy-coins">
          <Button variant="default">Buy More Coins</Button>
        </Link>
        <Link href="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
