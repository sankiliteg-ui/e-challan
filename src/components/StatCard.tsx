import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color: "primary" | "secondary" | "accent" | "destructive" | "warning" | "info";
}

const colorMap = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/10 text-secondary",
  accent: "bg-accent/10 text-accent",
  destructive: "bg-destructive/10 text-destructive",
  warning: "bg-warning/10 text-warning",
  info: "bg-info/10 text-info",
};

export default function StatCard({ title, value, icon: Icon, trend, color }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 240, damping: 20 }}
      className="surface-panel rounded-2xl p-4 md:p-5"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs md:text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-2xl md:text-3xl font-display font-bold mt-1 text-foreground">{value}</p>
          {trend && (
            <p className="text-xs text-accent mt-1 font-medium">{trend}</p>
          )}
        </div>
        <div className={`p-2.5 rounded-xl ${colorMap[color]} ring-1 ring-black/5`}>
          <Icon className="w-5 h-5 md:w-6 md:h-6" />
        </div>
      </div>
    </motion.div>
  );
}
