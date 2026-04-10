import { motion } from "framer-motion";
import { MapPin, Calendar, Clock, User, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Challan } from "@/data/mockData";

const statusStyles = {
  pending: "bg-warning/15 text-warning border-warning/30",
  paid: "bg-accent/15 text-accent border-accent/30",
  disputed: "bg-info/15 text-info border-info/30",
  overdue: "bg-destructive/15 text-destructive border-destructive/30",
};

interface ChallanCardProps {
  challan: Challan;
  onPay?: (challan: Challan) => void;
  onView?: (challan: Challan) => void;
  index?: number;
}

export default function ChallanCard({ challan, onPay, onView, index = 0 }: ChallanCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ delay: index * 0.06, type: "spring", stiffness: 220, damping: 20 }}
      className="surface-panel rounded-2xl transition-all group overflow-hidden"
    >
      <div className="p-4 md:p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-xs text-muted-foreground font-mono">{challan.challanNumber}</p>
            <h3 className="font-display font-semibold text-foreground mt-0.5">{challan.violationType}</h3>
          </div>
          <Badge className={`${statusStyles[challan.status]} border text-xs capitalize`}>
            {challan.status}
          </Badge>
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <User className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{challan.ownerName} — {challan.vehicleNumber}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{challan.location}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {challan.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {challan.time}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/70">
          <div>
            <p className="text-xs text-muted-foreground">Fine Amount</p>
            <p className="text-xl font-display font-bold text-foreground">₹{challan.fineAmount.toLocaleString("en-IN")}</p>
          </div>
          <div className="flex gap-2">
            {onView && (
              <Button variant="outline" size="sm" onClick={() => onView(challan)} className="text-xs rounded-full">
                Details
              </Button>
            )}
            {onPay && challan.status !== "paid" && (
              <Button size="sm" onClick={() => onPay(challan)} className="text-xs rounded-full bg-gradient-saffron text-secondary-foreground hover:opacity-90">
                Pay Now <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
