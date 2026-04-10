import { motion } from "framer-motion";
import { AlertTriangle, IndianRupee } from "lucide-react";

const violations = [
  { name: "Over Speeding", fine: "1,000 – 2,000", section: "Section 183", desc: "Exceeding prescribed speed limit for the vehicle class." },
  { name: "Red Light Violation", fine: "1,000 – 5,000", section: "Section 119/177", desc: "Jumping a red traffic signal at an intersection." },
  { name: "No Helmet", fine: "1,000", section: "Section 129", desc: "Riding a two-wheeler without wearing a helmet." },
  { name: "No Seat Belt", fine: "1,000", section: "Section 194B", desc: "Driving a four-wheeler without wearing a seat belt." },
  { name: "Drunk Driving", fine: "10,000", section: "Section 185", desc: "Driving under the influence of alcohol or drugs." },
  { name: "Using Mobile Phone", fine: "1,000 – 5,000", section: "Section 184", desc: "Using mobile phone while driving or riding." },
  { name: "Wrong Side Driving", fine: "1,000 – 5,000", section: "Section 184", desc: "Driving against the flow of traffic." },
  { name: "Driving Without License", fine: "5,000", section: "Section 181", desc: "Operating a vehicle without a valid driving license." },
  { name: "No Parking", fine: "500 – 1,500", section: "Section 177", desc: "Parking in a no-parking zone or obstructing traffic." },
  { name: "Overloading (Goods)", fine: "2,000 – 20,000", section: "Section 194", desc: "Exceeding permitted carrying capacity of the vehicle." },
  { name: "Document Missing", fine: "500 – 1,000", section: "Section 177", desc: "Not carrying required documents like RC, insurance, PUC." },
  { name: "Dangerous Driving", fine: "1,000 – 5,000", section: "Section 184", desc: "Rash or negligent driving endangering others." },
];

export default function ViolationsGuide() {
  return (
    <div className="container py-6 md:py-10 pb-20 lg:pb-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Traffic Violations & Fines</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Penalties under the Motor Vehicles (Amendment) Act, 2019
        </p>
      </motion.div>

      <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {violations.map((v, i) => (
          <motion.div
            key={v.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="bg-card rounded-xl border shadow-card p-4 md:p-5 hover:shadow-elevated transition-shadow"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-semibold text-foreground text-sm">{v.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{v.section}</p>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{v.desc}</p>
                <div className="flex items-center gap-1 mt-3 text-sm font-display font-bold text-foreground">
                  <IndianRupee className="w-3.5 h-3.5" />
                  {v.fine}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
