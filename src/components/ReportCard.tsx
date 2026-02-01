import { MapPin, Clock, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReportCardProps {
  id?: string | number;
  title: string;
  location: string;
  status: "pending" | "in-progress" | "resolved";
  time: string;
  image?: string;
}

const statusConfig = {
  pending: {
    label: "Pending",
    icon: AlertTriangle,
    className: "bg-destructive/20 text-destructive border-destructive/30",
  },
  "in-progress": {
    label: "In Progress",
    icon: Loader2,
    className: "bg-accent/20 text-accent border-accent/30",
  },
  resolved: {
    label: "Resolved",
    icon: CheckCircle2,
    className: "bg-success/20 text-success border-success/30",
  },
};

const ReportCard = ({ title, location, status, time, image }: ReportCardProps) => {
  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <div className="bg-card-gradient rounded-xl border border-border p-4 hover:border-primary/50 transition-all duration-300 card-shadow group">
      <div className="flex gap-4">
        <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-secondary">
          {image ? (
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <MapPin className="w-8 h-8 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-foreground truncate">{title}</h3>
            <div
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium flex-shrink-0",
                config.className
              )}
            >
              <StatusIcon className={cn("w-3.5 h-3.5", status === "in-progress" && "animate-spin")} />
              {config.label}
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground text-sm mb-2">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{location}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
            <Clock className="w-3.5 h-3.5" />
            <span>{time}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
