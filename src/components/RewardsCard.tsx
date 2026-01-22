import { motion } from "framer-motion";
import { Gift, IndianRupee, Smartphone, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface RewardsCardProps {
  points: number;
  onRedeem?: () => void;
}

const RewardsCard = ({ points, onRedeem }: RewardsCardProps) => {
  const pointsToRupees = Math.floor(points / 100); // 100 points = ₹1
  const nextMilestone = Math.ceil(points / 500) * 500;
  const progressToMilestone = ((points % 500) / 500) * 100;

  const rewardTiers = [
    { points: 500, reward: "₹5 UPI Cashback", icon: "🎁" },
    { points: 1000, reward: "₹12 UPI Transfer", icon: "💰" },
    { points: 2500, reward: "₹30 + Eco Badge", icon: "🏆" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card-gradient rounded-2xl border border-border p-6 card-shadow overflow-hidden relative"
    >
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6 relative">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-accent-gradient flex items-center justify-center">
            <Gift className="w-6 h-6 text-accent-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Eco Rewards</h3>
            <p className="text-sm text-muted-foreground">Redeem via UPI</p>
          </div>
        </div>
        <Sparkles className="w-5 h-5 text-accent animate-pulse" />
      </div>

      {/* Points Display */}
      <div className="bg-secondary/50 rounded-xl p-4 mb-6">
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl font-bold text-gradient">{points.toLocaleString()}</span>
          <span className="text-muted-foreground text-sm">points</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <IndianRupee className="w-4 h-4 text-success" />
          <span className="text-foreground">Worth <span className="font-semibold text-success">₹{pointsToRupees}</span> in UPI transfers</span>
        </div>
      </div>

      {/* Progress to next milestone */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted-foreground">Next milestone</span>
          <span className="text-foreground font-medium">{points} / {nextMilestone}</span>
        </div>
        <Progress value={progressToMilestone} className="h-2" />
      </div>

      {/* Reward Tiers */}
      <div className="space-y-3 mb-6">
        <p className="text-sm font-medium text-foreground">Reward Tiers</p>
        {rewardTiers.map((tier, index) => (
          <motion.div
            key={tier.points}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
              points >= tier.points
                ? "bg-accent/10 border-accent/30"
                : "bg-secondary/30 border-border"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{tier.icon}</span>
              <div>
                <p className={`text-sm font-medium ${points >= tier.points ? "text-accent" : "text-foreground"}`}>
                  {tier.reward}
                </p>
                <p className="text-xs text-muted-foreground">{tier.points} points</p>
              </div>
            </div>
            {points >= tier.points && (
              <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded-full font-medium">
                Unlocked
              </span>
            )}
          </motion.div>
        ))}
      </div>

      {/* UPI Redeem Button */}
      <Button
        variant="accent"
        className="w-full group"
        onClick={onRedeem}
        disabled={points < 500}
      >
        <Smartphone className="w-4 h-4 mr-2" />
        Redeem to UPI
        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
      </Button>

      {points < 500 && (
        <p className="text-xs text-muted-foreground text-center mt-3">
          Earn {500 - points} more points to unlock UPI redemption
        </p>
      )}
    </motion.div>
  );
};

export default RewardsCard;
