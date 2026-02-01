import { motion } from "framer-motion";
import { Gift, Sparkles, Award, ShoppingBag, Shield, Crown } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface RewardsCardProps {
  points: number;
}

const RewardsCard = ({ points }: RewardsCardProps) => {
  const nextMilestone = Math.ceil(points / 500) * 500;
  const progressToMilestone = ((points % 500) / 500) * 100;

  const badges = [
    { name: "Eco Warrior", icon: Shield, unlocked: points >= 500, requirement: 500 },
    { name: "Green Champion", icon: Crown, unlocked: points >= 1000, requirement: 1000 },
    { name: "Earth Guardian", icon: Award, unlocked: points >= 2500, requirement: 2500 },
  ];

  const vouchers = [
    { brand: "Eco-Friendly Store", discount: "20% off", available: false },
    { brand: "Green Cafe", discount: "Free coffee", available: false },
    { brand: "Sustainable Fashion", discount: "15% off", available: false },
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
            <p className="text-sm text-muted-foreground">Earn & redeem</p>
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
        <p className="text-sm text-muted-foreground">
          Keep reporting to earn more points!
        </p>
      </div>

      {/* Progress to next milestone */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted-foreground">Next badge</span>
          <span className="text-foreground font-medium">{points} / {nextMilestone}</span>
        </div>
        <Progress value={progressToMilestone} className="h-2" />
      </div>

      {/* Exclusive Badges */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Award className="w-4 h-4 text-accent" />
          <p className="text-sm font-medium text-foreground">Exclusive Social Media Badges</p>
        </div>
        <div className="space-y-2">
          {badges.map((badge, index) => (
            <motion.div
              key={badge.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                badge.unlocked
                  ? "bg-accent/10 border-accent/30"
                  : "bg-secondary/30 border-border"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  badge.unlocked ? "bg-accent/20" : "bg-muted"
                }`}>
                  <badge.icon className={`w-4 h-4 ${badge.unlocked ? "text-accent" : "text-muted-foreground"}`} />
                </div>
                <div>
                  <p className={`text-sm font-medium ${badge.unlocked ? "text-accent" : "text-foreground"}`}>
                    {badge.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{badge.requirement} points</p>
                </div>
              </div>
              {badge.unlocked ? (
                <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded-full font-medium">
                  Unlocked!
                </span>
              ) : (
                <span className="text-xs text-muted-foreground">
                  {badge.requirement - points} pts to go
                </span>
              )}
            </motion.div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3 text-center">
          Use these badges on your social media profiles to show your eco-commitment! 🌱
        </p>
      </div>

      {/* Brand Vouchers */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <ShoppingBag className="w-4 h-4 text-primary" />
          <p className="text-sm font-medium text-foreground">Brand Vouchers</p>
        </div>
        
        <div className="space-y-2">
          {vouchers.map((voucher, index) => (
            <motion.div
              key={voucher.brand}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border opacity-60"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground/70">{voucher.brand}</p>
                  <p className="text-xs text-muted-foreground">{voucher.discount}</p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                Coming Soon
              </span>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
          <p className="text-sm text-center text-muted-foreground">
            🎉 <span className="text-foreground font-medium">Exciting partnerships coming soon!</span>
            <br />
            <span className="text-xs">
              Redeem your points for vouchers from eco-friendly brands and apps.
            </span>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default RewardsCard;
