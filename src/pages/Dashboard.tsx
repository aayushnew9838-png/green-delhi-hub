import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Leaf,
  MapPin,
  Plus,
  Bell,
  Search,
  Trash2,
  CheckCircle2,
  Clock,
  Camera,
  LogOut,
  User,
  TrendingUp,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import ReportCard from "@/components/ReportCard";
import StatsCard from "@/components/StatsCard";
import ReportModal from "@/components/ReportModal";
import RewardsCard from "@/components/RewardsCard";
import NotificationsPanel from "@/components/NotificationsPanel";
import MyContributions from "@/components/MyContributions";
import AnimatedBackground from "@/components/AnimatedBackground";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Report {
  id: string;
  title: string;
  location: string;
  status: "pending" | "in-progress" | "resolved";
  created_at: string;
  image_url: string | null;
}

const Dashboard = () => {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isContributionsOpen, setIsContributionsOpen] = useState(false);
  const [userPoints, setUserPoints] = useState(0);
  const [userName, setUserName] = useState("Volunteer");
  const [reports, setReports] = useState<Report[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    resolved: 0,
    inProgress: 0,
  });
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    fetchData();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Fetch profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (profile) {
      setUserPoints(profile.points || 0);
      setUserName(profile.full_name || "Volunteer");
    }

    // Fetch reports
    const { data: reportsData } = await supabase
      .from("reports")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    if (reportsData) {
      setReports(reportsData as Report[]);
      setStats({
        total: reportsData.length,
        resolved: reportsData.filter(r => r.status === "resolved").length,
        inProgress: reportsData.filter(r => r.status === "in-progress").length,
      });
    }

    // Fetch unread notifications count
    const { count } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("is_read", false);

    setUnreadNotifications(count || 0);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully",
    });
    navigate("/auth");
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return "Just now";
  };

  return (
    <div className="min-h-screen bg-background relative">
      <AnimatedBackground />
      
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-gradient flex items-center justify-center">
              <Leaf className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground hidden sm:block">
              Revibe Delhi
            </span>
          </div>

          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search reports, areas..."
                className="pl-10 bg-secondary border-border"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
              onClick={() => setIsNotificationsOpen(true)}
            >
              <Bell className="w-5 h-5" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-accent-foreground text-xs font-bold rounded-full flex items-center justify-center">
                  {unreadNotifications > 9 ? "9+" : unreadNotifications}
                </span>
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSignOut}
            >
              <LogOut className="w-5 h-5" />
            </Button>
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <User className="w-5 h-5 text-primary-foreground" />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, <span className="text-gradient">{userName}!</span>
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening in your community today
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <StatsCard
            icon={Trash2}
            label="Total Reports"
            value={stats.total.toString()}
            trend="+12 this week"
            color="primary"
          />
          <StatsCard
            icon={CheckCircle2}
            label="Resolved"
            value={stats.resolved.toString()}
            trend={`${stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}% success rate`}
            color="success"
          />
          <StatsCard
            icon={Clock}
            label="In Progress"
            value={stats.inProgress.toString()}
            trend="Being addressed"
            color="accent"
          />
          <StatsCard
            icon={Award}
            label="Your Points"
            value={userPoints.toLocaleString()}
            trend="Keep reporting!"
            color="primary"
          />
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Reports Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">
                Recent Reports
              </h2>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>

            <div className="space-y-4">
              {reports.length === 0 ? (
                <div className="bg-card-gradient rounded-2xl border border-border p-8 text-center">
                  <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No reports yet</p>
                  <p className="text-sm text-muted-foreground/70">
                    Be the first to report an issue!
                  </p>
                </div>
              ) : (
                reports.slice(0, 5).map((report, index) => (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <ReportCard 
                      id={report.id}
                      title={report.title}
                      location={report.location}
                      status={report.status}
                      time={formatTimeAgo(report.created_at)}
                      image={report.image_url || undefined}
                    />
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>

          {/* Quick Actions & Rewards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Quick Actions */}
            <div className="bg-card-gradient rounded-2xl p-6 border border-border card-shadow">
              <h3 className="text-lg font-bold text-foreground mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Button
                  variant="accent"
                  className="w-full justify-start"
                  onClick={() => setIsReportModalOpen(true)}
                >
                  <Camera className="w-5 h-5 mr-3" />
                  Report Garbage
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MapPin className="w-5 h-5 mr-3" />
                  View Nearby Issues
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  onClick={() => setIsContributionsOpen(true)}
                >
                  <TrendingUp className="w-5 h-5 mr-3" />
                  My Contributions
                </Button>
              </div>
            </div>

            {/* Rewards Card */}
            <RewardsCard points={userPoints} />
          </motion.div>
        </div>
      </main>

      {/* Floating Action Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        className="fixed bottom-6 right-6 z-40"
      >
        <Button
          variant="accent"
          size="icon"
          className="w-14 h-14 rounded-full shadow-lg glow-primary"
          onClick={() => setIsReportModalOpen(true)}
        >
          <Plus className="w-6 h-6" />
        </Button>
      </motion.div>

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSuccess={fetchData}
      />

      <NotificationsPanel
        isOpen={isNotificationsOpen}
        onClose={() => {
          setIsNotificationsOpen(false);
          fetchData(); // Refresh notification count
        }}
      />

      <MyContributions
        isOpen={isContributionsOpen}
        onClose={() => setIsContributionsOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
