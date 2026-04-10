import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, CheckCircle, Smartphone, Building2, Wallet, ArrowRight, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { fetchPendingChallans } from "@/lib/challanService";
import ChallanCard from "@/components/ChallanCard";
import type { Challan } from "@/data/mockData";

const paymentMethods = [
  { id: "upi", label: "UPI", desc: "Google Pay, PhonePe, Paytm", icon: Smartphone },
  { id: "card", label: "Debit/Credit Card", desc: "Visa, Mastercard, RuPay", icon: CreditCard },
  { id: "netbanking", label: "Net Banking", desc: "All major banks", icon: Building2 },
  { id: "wallet", label: "E-Wallet", desc: "Paytm, Mobikwik", icon: Wallet },
];

export default function PayChallan() {
  const { user, loading: authLoading } = useAuth();
  const [challans, setChallans] = useState<Challan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChallan, setSelectedChallan] = useState<Challan | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [step, setStep] = useState<"select" | "payment" | "success">("select");
  const [upiId, setUpiId] = useState("");

  useEffect(() => {
    if (user) {
      loadChallans();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadChallans = async () => {
    setLoading(true);
    const data = await fetchPendingChallans();
    setChallans(data);
    setLoading(false);
  };

  const pendingChallans = challans.filter((c) => c.status !== "paid");

  const handlePay = (challan: Challan) => {
    setSelectedChallan(challan);
    setStep("payment");
  };

  const confirmPayment = () => {
    setStep("success");
  };

  const resetFlow = () => {
    setStep("select");
    setSelectedChallan(null);
    setUpiId("");
  };

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
          <p className="text-muted-foreground mb-6">Please log in to pay your challans.</p>
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
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Pay Challan</h1>
        <p className="text-muted-foreground text-sm mt-1">Select a pending challan and pay securely online.</p>
      </motion.div>

      <AnimatePresence mode="wait">
        {step === "select" && (
          <motion.div key="select" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-6">
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">
                Loading pending challans...
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingChallans.length > 0 ? (
                  pendingChallans.map((c, i) => (
                    <ChallanCard key={c.id} challan={c} index={i} onPay={handlePay} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <CheckCircle className="w-12 h-12 mx-auto mb-3 text-accent" />
                    <p className="font-display font-semibold text-foreground">No pending challans</p>
                    <p className="text-sm text-muted-foreground mt-1">All your challans are paid!</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}

        {step === "payment" && selectedChallan && (
          <motion.div key="payment" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-6 max-w-lg mx-auto">
            <div className="bg-card rounded-xl border shadow-card p-5 md:p-8">
              <div className="flex items-center justify-between mb-6 pb-4 border-b">
                <div>
                  <p className="text-xs text-muted-foreground">{selectedChallan.challanNumber}</p>
                  <p className="font-display font-semibold text-foreground">{selectedChallan.violationType}</p>
                </div>
                <p className="text-2xl font-display font-bold text-foreground">₹{selectedChallan.fineAmount.toLocaleString("en-IN")}</p>
              </div>

              <h3 className="font-display font-semibold text-foreground mb-4">Select Payment Method</h3>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                {paymentMethods.map((m) => (
                  <Label
                    key={m.id}
                    htmlFor={m.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      paymentMethod === m.id ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                    }`}
                  >
                    <RadioGroupItem value={m.id} id={m.id} />
                    <m.icon className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{m.label}</p>
                      <p className="text-xs text-muted-foreground">{m.desc}</p>
                    </div>
                  </Label>
                ))}
              </RadioGroup>

              {paymentMethod === "upi" && (
                <div className="mt-4">
                  <Label htmlFor="upi" className="text-sm font-medium text-foreground">UPI ID</Label>
                  <Input id="upi" value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="yourname@upi" className="mt-1" />
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <Button variant="outline" onClick={resetFlow} className="flex-1">Back</Button>
                <Button onClick={confirmPayment} className="flex-1 bg-gradient-saffron text-secondary-foreground hover:opacity-90">
                  Pay ₹{selectedChallan.fineAmount.toLocaleString("en-IN")} <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {step === "success" && (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-12 text-center max-w-md mx-auto">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 10 }}
              className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-10 h-10 text-accent" />
            </motion.div>
            <h2 className="text-2xl font-display font-bold text-foreground">Payment Successful!</h2>
            <p className="text-muted-foreground mt-2 text-sm">
              Your challan <span className="font-mono text-foreground">{selectedChallan?.challanNumber}</span> has been paid.
            </p>
            <p className="text-xs text-muted-foreground mt-1">Transaction ID: TXN-{Date.now()}</p>
            <div className="flex gap-3 mt-6 justify-center">
              <Button variant="outline" onClick={resetFlow}>Pay Another</Button>
              <Button className="bg-gradient-primary text-primary-foreground">Download Receipt</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
