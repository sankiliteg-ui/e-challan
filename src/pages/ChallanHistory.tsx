import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, Filter, SlidersHorizontal, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { fetchAllChallans, type ChallanRow } from "@/lib/challanService";
import { downloadReceipt } from "@/lib/receiptGenerator";
import type { Challan } from "@/data/mockData";

const statusStyles: Record<string, string> = {
  pending: "bg-warning/15 text-warning",
  paid: "bg-accent/15 text-accent",
  disputed: "bg-info/15 text-info",
  overdue: "bg-destructive/15 text-destructive",
};

export default function ChallanHistory() {
  const { user, loading: authLoading } = useAuth();
  const [allChallans, setAllChallans] = useState<Challan[]>([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadChallans();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadChallans = async () => {
    setLoading(true);
    const data = await fetchAllChallans();
    setAllChallans(data);
    setLoading(false);
  };

  const filtered = allChallans.filter((c) => {
    if (filter !== "all" && c.status !== filter) return false;
    if (search) {
      const q = search.toUpperCase();
      return c.vehicleNumber.toUpperCase().includes(q) || c.challanNumber.toUpperCase().includes(q) || c.ownerName.toUpperCase().includes(q);
    }
    return true;
  });

  if (authLoading) {
    return (
      <div className="container py-6 md:py-10 pb-20 lg:pb-10 flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container py-6 md:py-10 pb-20 lg:pb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-destructive/10 rounded-xl p-8 text-center border border-destructive/20"
        >
          <Lock className="w-12 h-12 mx-auto mb-4 text-destructive" />
          <h2 className="text-2xl font-display font-bold text-foreground mb-2">Authentication Required</h2>
          <p className="text-muted-foreground mb-6">Please log in to view your challan history.</p>
          <a href="/auth">
            <Button className="bg-gradient-saffron text-secondary-foreground">Sign In / Sign Up</Button>
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container py-6 md:py-10 pb-20 lg:pb-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Challan History</h1>
        <p className="text-muted-foreground text-sm mt-1">View and track all your traffic challans.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-6 flex flex-col sm:flex-row gap-3"
      >
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by vehicle, challan number or name..."
          className="flex-1"
        />
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="disputed">Disputed</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Table view for desktop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-6 hidden md:block"
      >
        <div className="bg-card rounded-xl border shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 font-medium text-muted-foreground">Challan No.</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Vehicle</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Violation</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Amount</th>
                  <th className="text-center p-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-center p-3 font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                      Loading challans...
                    </td>
                  </tr>
                ) : (
                  filtered.map((c) => (
                    <tr key={c.id} className="border-t hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-mono text-xs">{c.challanNumber}</td>
                      <td className="p-3">{c.vehicleNumber}</td>
                      <td className="p-3">{c.violationType}</td>
                      <td className="p-3 text-muted-foreground">{c.date}</td>
                      <td className="p-3 text-right font-semibold">₹{c.fineAmount.toLocaleString("en-IN")}</td>
                      <td className="p-3 text-center">
                        <Badge className={`${statusStyles[c.status]} capitalize text-xs`}>{c.status}</Badge>
                      </td>
                      <td className="p-3 text-center">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-xs"
                          onClick={() => downloadReceipt(c)}
                        >
                          <Download className="w-3 h-3 mr-1" /> Receipt
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Card view for mobile */}
      <div className="mt-6 md:hidden space-y-3">
        {loading ? (
          <div className="text-center text-muted-foreground py-8">
            Loading challans...
          </div>
        ) : (
          filtered.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card rounded-xl border shadow-card p-4"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-xs font-mono text-muted-foreground">{c.challanNumber}</p>
                  <p className="font-display font-semibold text-foreground text-sm">{c.violationType}</p>
                </div>
                <Badge className={`${statusStyles[c.status]} capitalize text-xs`}>{c.status}</Badge>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>{c.vehicleNumber} — {c.ownerName}</p>
                <p>{c.date} at {c.time}</p>
              </div>
              <div className="flex items-center justify-between mt-3 pt-2 border-t">
                <p className="font-display font-bold text-foreground">₹{c.fineAmount.toLocaleString("en-IN")}</p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs"
                  onClick={() => downloadReceipt(c)}
                >
                  <Download className="w-3 h-3 mr-1" /> Receipt
                </Button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {!loading && filtered.length === 0 && (
        <div className="mt-12 text-center text-muted-foreground">
          <SlidersHorizontal className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="font-display font-semibold text-foreground">No results found</p>
          <p className="text-sm mt-1">Try adjusting your search or filter.</p>
        </div>
      )}
    </div>
  );
}
