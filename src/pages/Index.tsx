import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Search, CreditCard, AlertTriangle, CheckCircle, Clock,
  TrendingUp, Car, Shield, ArrowRight, FileText, X, MapPin, Calendar, User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from "@/components/ui/dialog";
import StatCard from "@/components/StatCard";
import ChallanCard from "@/components/ChallanCard";
import { fetchAllChallans } from "@/lib/challanService";
import type { Challan } from "@/data/mockData";

const statusStyles = {
  pending: "bg-warning/15 text-warning",
  paid: "bg-accent/15 text-accent",
  disputed: "bg-info/15 text-info",
  overdue: "bg-destructive/15 text-destructive",
};

export default function Index() {
  const [challans, setChallans] = useState<Challan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChallan, setSelectedChallan] = useState<Challan | null>(null);

  useEffect(() => {
    loadChallans();
  }, []);

  const loadChallans = async () => {
    setLoading(true);
    const data = await fetchAllChallans();
    setChallans(data);
    setLoading(false);
  };

  const pendingChallans = challans.filter((c) => c.status === "pending" || c.status === "overdue");
  const totalFines = pendingChallans.reduce((s, c) => s + c.fineAmount, 0);
  const uniqueVehicles = new Set(challans.map((c) => c.vehicleNumber.trim().toUpperCase())).size;
  const paidCount = challans.filter((c) => c.status === "paid").length;
  const paidPercentage = challans.length > 0 ? Math.round((paidCount / challans.length) * 100) : 0;
  const connectedStates = new Set(
    challans
      .map((c) => c.state?.trim())
      .filter((state): state is string => Boolean(state))
  ).size;

  const heroStats = [
    { icon: Car, label: "Vehicles Tracked", value: uniqueVehicles.toLocaleString("en-IN") },
    { icon: FileText, label: "Challans Issued", value: challans.length.toLocaleString("en-IN") },
    { icon: CheckCircle, label: "Paid Online", value: `${paidPercentage}%` },
    { icon: TrendingUp, label: "States Connected", value: connectedStates.toLocaleString("en-IN") },
  ];

  const handleViewDetails = (challan: Challan) => {
    setSelectedChallan(challan);
  };

  return (
    <div className="pb-20 lg:pb-0">
      {/* Hero */}
      <section className="bg-gradient-hero text-primary-foreground">
        <div className="container py-10 md:py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 bg-primary-foreground/10 rounded-full px-3 py-1 text-xs font-medium mb-4 backdrop-blur">
                <Shield className="w-3 h-3" /> Official Digital Platform
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-extrabold leading-tight">
                e-Challan
                <span className="block text-secondary">Traffic Management</span>
              </h1>
              <p className="mt-4 text-sm md:text-base opacity-80 max-w-md leading-relaxed">
                Check, pay, and manage your traffic challans digitally. A seamless platform by the Ministry of Road Transport & Highways.
              </p>
              <div className="flex flex-wrap gap-3 mt-6">
                <Link to="/check">
                  <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold">
                    <Search className="w-4 h-4 mr-2" />
                    Check Challan
                  </Button>
                </Link>
                <Link to="/pay">
                  <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Pay Online
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="hidden lg:grid grid-cols-2 gap-4"
            >
              {heroStats.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="bg-primary-foreground/10 backdrop-blur rounded-xl p-4 border border-primary-foreground/10"
                >
                  <item.icon className="w-8 h-8 text-secondary mb-2" />
                  <p className="text-2xl font-display font-bold">{item.value}</p>
                  <p className="text-xs opacity-70">{item.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container -mt-6 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <StatCard title="Total Challans" value={challans.length} icon={FileText} color="primary" />
          <StatCard title="Pending" value={pendingChallans.length} icon={Clock} color="warning" trend="Due soon" />
          <StatCard title="Overdue" value={challans.filter((c) => c.status === "overdue").length} icon={AlertTriangle} color="destructive" />
          <StatCard title="Pending Fines" value={`₹${totalFines.toLocaleString("en-IN")}`} icon={CreditCard} color="secondary" />
        </div>
      </section>

      {/* Recent Challans */}
      <section className="container mt-8 md:mt-12">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl md:text-2xl font-display font-bold text-foreground">Recent Challans</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Your latest traffic violations</p>
          </div>
          <Link to="/history">
            <Button variant="ghost" size="sm" className="text-primary">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {!loading && challans.slice(0, 3).map((challan, i) => (
            <ChallanCard
              key={challan.id}
              challan={challan}
              index={i}
              onPay={() => {}}
              onView={handleViewDetails}
            />
          ))}
          {loading && <p className="col-span-full text-center text-muted-foreground">Loading challans...</p>}
        </div>
      </section>

      {/* Challan Details Modal */}
      <Dialog open={!!selectedChallan} onOpenChange={(open) => !open && setSelectedChallan(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Challan Details</DialogTitle>
          </DialogHeader>
          {selectedChallan && (
            <div className="space-y-4">
              {/* Header */}
              <div className="border-b pb-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-xs text-muted-foreground font-mono">{selectedChallan.challanNumber}</p>
                    <p className="font-display font-bold text-lg mt-1">{selectedChallan.violationType}</p>
                  </div>
                  <Badge className={`${statusStyles[selectedChallan.status]} capitalize`}>
                    {selectedChallan.status}
                  </Badge>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Owner & Vehicle */}
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Owner Name</p>
                  <p className="font-semibold text-sm">{selectedChallan.ownerName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Vehicle Number</p>
                  <p className="font-semibold text-sm">{selectedChallan.vehicleNumber}</p>
                </div>

                {/* Dates */}
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Challan Date</p>
                  <p className="font-semibold text-sm">{selectedChallan.date} at {selectedChallan.time}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Due Date</p>
                  <p className="font-semibold text-sm">{selectedChallan.dueDate}</p>
                </div>

                {/* Officer & Badge */}
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Officer Name</p>
                  <p className="font-semibold text-sm">{selectedChallan.officerName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Officer Badge</p>
                  <p className="font-semibold text-sm font-mono">{selectedChallan.officerBadge}</p>
                </div>

                {/* Fine Amount */}
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground mb-1">Fine Amount</p>
                  <p className="font-display font-bold text-2xl text-primary">₹{selectedChallan.fineAmount.toLocaleString("en-IN")}</p>
                </div>
              </div>

              {/* Location */}
              <div className="border-t pt-4">
                <p className="text-xs text-muted-foreground mb-1 flex items-center gap-2">
                  <MapPin className="w-3 h-3" /> Location
                </p>
                <p className="text-sm">{selectedChallan.location}</p>
              </div>

              {/* Action Buttons */}
              <div className="border-t pt-4 flex gap-2">
                <Link to="/pay" className="flex-1" onClick={() => setSelectedChallan(null)}>
                  <Button className="w-full bg-gradient-saffron text-secondary-foreground">
                    Pay Now
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setSelectedChallan(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Quick Actions */}
      <section className="container mt-8 md:mt-12">
        <h2 className="text-xl md:text-2xl font-display font-bold text-foreground mb-5">Quick Services</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {[
            { icon: Search, label: "Check by Vehicle", desc: "Enter registration number", path: "/check" },
            { icon: CreditCard, label: "Pay Challan", desc: "Pay pending fines", path: "/pay" },
            { icon: FileText, label: "Download Receipt", desc: "Get payment proof", path: "/history" },
            { icon: AlertTriangle, label: "Dispute Challan", desc: "Raise an objection", path: "/help" },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
            >
              <Link
                to={item.path}
                className="flex flex-col items-center text-center p-5 md:p-6 bg-card rounded-xl border shadow-card hover:shadow-elevated hover:-translate-y-1 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="font-display font-semibold text-sm text-foreground">{item.label}</h3>
                <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
