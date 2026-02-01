import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera, MapPin, Clock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";

interface Report {
  id: string;
  title: string;
  location: string;
  status: "pending" | "in-progress" | "resolved";
  image_url: string | null;
  created_at: string;
  points_awarded: number;
}

interface MyContributionsProps {
  isOpen: boolean;
  onClose: () => void;
}

const MyContributions = ({ isOpen, onClose }: MyContributionsProps) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchMyReports();
    }
  }, [isOpen]);

  const fetchMyReports = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setReports(data as Report[]);
      }
    }
    setLoading(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved":
        return <CheckCircle2 className="w-4 h-4 text-success" />;
      case "in-progress":
        return <Loader2 className="w-4 h-4 text-accent animate-spin" />;
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "resolved":
        return "Resolved";
      case "in-progress":
        return "In Progress";
      default:
        return "Pending";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-success/20 text-success";
      case "in-progress":
        return "bg-accent/20 text-accent";
      default:
        return "bg-yellow-500/20 text-yellow-500";
    }
  };

  const totalPoints = reports.reduce((sum, r) => sum + (r.status === "resolved" ? r.points_awarded : 0), 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-x-4 top-20 bottom-4 max-w-2xl mx-auto bg-card rounded-2xl border border-border z-50 shadow-2xl overflow-hidden"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div>
                  <h2 className="text-xl font-bold text-foreground">My Contributions</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {reports.length} reports · {totalPoints} points earned
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Reports List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                  </div>
                ) : reports.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-48 text-center">
                    <Camera className="w-12 h-12 text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground">No contributions yet</p>
                    <p className="text-sm text-muted-foreground/70">
                      Start reporting garbage to earn points!
                    </p>
                  </div>
                ) : (
                  reports.map((report, index) => (
                    <motion.div
                      key={report.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-secondary/50 rounded-xl overflow-hidden border border-border"
                    >
                      <div className="flex gap-4 p-4">
                        {/* Image */}
                        {report.image_url ? (
                          <img
                            src={report.image_url}
                            alt={report.title}
                            className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                          />
                        ) : (
                          <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                            <Camera className="w-8 h-8 text-muted-foreground" />
                          </div>
                        )}

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold text-foreground line-clamp-1">
                              {report.title}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(report.status)}`}>
                              {getStatusIcon(report.status)}
                              {getStatusLabel(report.status)}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
                            <MapPin className="w-3 h-3" />
                            <span className="line-clamp-1">{report.location}</span>
                          </div>
                          
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}
                            </div>
                            
                            {report.status === "resolved" && (
                              <span className="text-xs font-medium text-success">
                                +{report.points_awarded} points
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MyContributions;
