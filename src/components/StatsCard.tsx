import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  trend: string;
  color: "primary" | "success" | "accent";
}

const colorConfig = {
  primary: {
    iconBg: "bg-primary/20",
    iconColor: "text-primary",
  },
  success: {
    iconBg: "bg-success/20",
    iconColor: "text-success",
  },
  accent: {
    iconBg: "bg-accent/20",
    iconColor: "text-accent",
  },
};

const StatsCard = ({ icon: Icon, label, value, trend, color }: StatsCardProps) => {
  const config = colorConfig[color];

  return (
    <div className="bg-card-gradient rounded-xl border border-border p-5 card-shadow hover:border-primary/30 transition-all duration-300">
      <div className="flex items-center gap-3 mb-3">
        <div
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center",
            config.iconBg
          )}
        >
          <Icon className={cn("w-5 h-5", config.iconColor)} />
        </div>
        <span className="text-muted-foreground text-sm font-medium">{label}</span>
      </div>
      <p className="text-2xl font-bold text-foreground mb-1">{value}</p>
      <p className="text-xs text-muted-foreground">{trend}</p>
    </div>
  );
};

export default StatsCard;
