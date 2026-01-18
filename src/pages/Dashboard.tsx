import { useState } from "react";
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
  AlertTriangle,
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

const Dashboard = () => {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const navigate = useNavigate();

  const reports = [
    {
      id: 1,
      title: "Garbage pile near Connaught Place",
      location: "Block A, Connaught Place",
      status: "pending" as const,
      time: "2 hours ago",
      image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&h=300&fit=crop",
    },
    {
      id: 2,
      title: "Overflowing dustbin at Lajpat Nagar",
      location: "Central Market, Lajpat Nagar",
      status: "in-progress" as const,
      time: "5 hours ago",
      image: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=400&h=300&fit=crop",
    },
    {
      id: 3,
      title: "Street cleanup completed",
      location: "Sarojini Nagar Market",
      status: "resolved" as const,
      time: "1 day ago",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border">
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
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-accent-foreground text-xs font-bold rounded-full flex items-center justify-center">
                3
              </span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/auth")}
            >
              <LogOut className="w-5 h-5" />
            </Button>
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <User className="w-5 h-5 text-primary-foreground" />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, <span className="text-gradient">Volunteer!</span>
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
            value="156"
            trend="+12 this week"
            color="primary"
          />
          <StatsCard
            icon={CheckCircle2}
            label="Resolved"
            value="89"
            trend="57% success rate"
            color="success"
          />
          <StatsCard
            icon={Clock}
            label="In Progress"
            value="34"
            trend="8 assigned to you"
            color="accent"
          />
          <StatsCard
            icon={Award}
            label="Your Points"
            value="1,250"
            trend="Top 10% volunteer"
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
              {reports.map((report, index) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <ReportCard {...report} />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions & Map */}
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
                <Button variant="glass" className="w-full justify-start">
                  <TrendingUp className="w-5 h-5 mr-3" />
                  My Contributions
                </Button>
              </div>
            </div>

            {/* Map Preview */}
            <div className="bg-card-gradient rounded-2xl p-6 border border-border card-shadow">
              <h3 className="text-lg font-bold text-foreground mb-4">
                Hotspot Areas
              </h3>
              <div className="aspect-square rounded-xl bg-secondary/50 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&h=400&fit=crop')] opacity-20 bg-cover bg-center" />
                <div className="relative z-10 text-center p-4">
                  <MapPin className="w-12 h-12 text-accent mx-auto mb-3" />
                  <p className="text-muted-foreground text-sm">
                    Interactive map coming soon
                  </p>
                </div>
              </div>
            </div>
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
      />
    </div>
  );
};

export default Dashboard;
