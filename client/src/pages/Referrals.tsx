import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Users, Copy, CheckCircle2, Gift, Share2, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Link } from "wouter";

/**
 * Referral System Page
 * Allows users to generate referral codes and track referrals
 */
export default function Referrals() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [referralCode, setReferralCode] = useState("");

  // Generate referral code
  const generateMutation = trpc.payments.generateReferralCode.useMutation({
    onSuccess: (data) => {
      setReferralCode(data.referralCode);
      toast.success("Referral code generated!");
    },
    onError: () => {
      toast.error("Failed to generate referral code");
    },
  });

  // Get referral stats
  const { data: stats, isLoading } = trpc.payments.getReferralStats.useQuery(undefined, {
    enabled: !!user,
  });

  const handleCopyCode = () => {
    if (referralCode) {
      navigator.clipboard.writeText(referralCode);
      setCopied(true);
      toast.success("Referral code copied!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const referralUrl = referralCode
    ? `${window.location.origin}/join?ref=${referralCode}`
    : "";

  const handleShareUrl = () => {
    if (referralUrl) {
      navigator.clipboard.writeText(referralUrl);
      toast.success("Referral link copied!");
    }
  };

  if (!user) {
    return (
      <div className="container py-12">
        <Card className="border-dashed">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">Please log in to access the referral program</p>
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
        <h1 className="text-3xl font-bold mb-2">Referral Program</h1>
        <p className="text-muted-foreground">Invite friends and earn bonus coins together</p>
      </div>

      {/* How It Works */}
      <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5" />
            How It Works
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
              1
            </div>
            <div>
              <p className="font-medium">Share Your Code</p>
              <p className="text-sm text-muted-foreground">
                Copy your unique referral code and share it with friends
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
              2
            </div>
            <div>
              <p className="font-medium">Friend Signs Up</p>
              <p className="text-sm text-muted-foreground">
                Your friend uses your code when creating their account
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
              3
            </div>
            <div>
              <p className="font-medium">Earn Bonus Coins</p>
              <p className="text-sm text-muted-foreground">
                You get 50 coins, your friend gets 25 coins
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referral Code Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Your Referral Code
          </CardTitle>
          <CardDescription>
            {referralCode ? "Share this code with friends to earn bonus coins" : "Generate your unique referral code"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!referralCode ? (
            <Button
              onClick={() => generateMutation.mutate()}
              disabled={generateMutation.isPending}
              className="w-full"
              size="lg"
            >
              {generateMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Referral Code"
              )}
            </Button>
          ) : (
            <div className="space-y-3">
              {/* Code Display */}
              <div className="flex gap-2">
                <Input
                  value={referralCode}
                  readOnly
                  className="font-mono text-center"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyCode}
                  title="Copy code"
                >
                  {copied ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>

              {/* Referral Link */}
              <div className="pt-2 border-t">
                <p className="text-sm font-medium mb-2">Or share this link:</p>
                <div className="flex gap-2">
                  <Input
                    value={referralUrl}
                    readOnly
                    className="text-xs"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleShareUrl}
                    title="Copy link"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Referral Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Your Referrals
          </CardTitle>
          <CardDescription>Track your successful referrals and earned bonuses</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 py-8">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Loading your referral stats...</span>
            </div>
          ) : stats ? (
            <div className="space-y-4">
              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <p className="text-sm text-muted-foreground mb-1">Total Referrals</p>
                  <p className="text-2xl font-bold">{stats.totalReferrals}</p>
                </div>
                <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                  <p className="text-sm text-muted-foreground mb-1">Successful</p>
                  <p className="text-2xl font-bold">{stats.successfulReferrals}</p>
                </div>
                <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
                  <p className="text-sm text-muted-foreground mb-1">Bonus Coins</p>
                  <p className="text-2xl font-bold">{stats.totalBonusCoins}</p>
                </div>
              </div>

              {/* Referral List */}
              {stats.referrals && stats.referrals.length > 0 && (
                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-3">Recent Referrals</h4>
                  <div className="space-y-2">
                    {stats.referrals.slice(0, 5).map((referral) => (
                      <div
                        key={referral.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted"
                      >
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">
                            Code: {referral.referralCode}
                          </span>
                        </div>
                        <Badge
                          variant={referral.claimedAt ? "default" : "outline"}
                        >
                          {referral.claimedAt ? "Claimed" : "Pending"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {stats.totalReferrals === 0 && (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">No referrals yet. Start sharing!</p>
                </div>
              )}
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Back Button */}
      <div className="mt-8 flex justify-center">
        <Link href="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
