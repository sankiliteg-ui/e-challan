import { useState } from "react";
import { motion } from "framer-motion";
import { HelpCircle, Phone, Mail, MessageCircle, ChevronDown } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const faqs = [
  { q: "How do I check my pending challans?", a: "Go to the 'Check Challan' page and enter your vehicle registration number, challan number, or driving license number to view all pending challans." },
  { q: "What payment methods are accepted?", a: "We accept UPI (Google Pay, PhonePe, Paytm), Debit/Credit Cards (Visa, Mastercard, RuPay), Net Banking, and E-Wallets." },
  { q: "How long does it take for payment to reflect?", a: "Online payments are usually reflected within 24-48 hours. In some cases, it may take up to 72 hours during peak times." },
  { q: "Can I dispute a challan?", a: "Yes, you can dispute a challan by visiting the nearest traffic police station or filing an online grievance through this portal. You'll need to provide evidence and a valid reason." },
  { q: "What happens if I don't pay my challan?", a: "Unpaid challans accrue additional penalties. Your vehicle registration or driving license may be suspended. You may also face legal action." },
  { q: "How do I download my payment receipt?", a: "Go to 'History', find the paid challan, and click the 'Receipt' button to download a PDF receipt." },
  { q: "Is my payment data secure?", a: "Yes, all transactions are processed through government-approved payment gateways with bank-grade encryption (256-bit SSL)." },
];

export default function HelpSupport() {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    toast({ title: "Query Submitted", description: "We'll respond within 24-48 hours." });
    setName(""); setEmail(""); setMessage("");
  };

  return (
    <div className="container py-6 md:py-10 pb-20 lg:pb-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Help & Support</h1>
        <p className="text-muted-foreground text-sm mt-1">Find answers or reach out to our support team.</p>
      </motion.div>

      {/* Contact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
        {[
          { icon: Phone, label: "Helpline", value: "1800-XXX-XXXX", sub: "Mon-Sat, 9AM-6PM" },
          { icon: Mail, label: "Email", value: "support@echallan.gov.in", sub: "Response in 24-48 hrs" },
          { icon: MessageCircle, label: "Live Chat", value: "Available", sub: "Mon-Fri, 10AM-5PM" },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card rounded-xl border shadow-card p-5 text-center"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <item.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-display font-semibold text-foreground text-sm">{item.label}</h3>
            <p className="text-sm text-foreground font-medium mt-1">{item.value}</p>
            <p className="text-xs text-muted-foreground">{item.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-8">
        {/* FAQ */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="text-lg font-display font-bold text-foreground mb-4 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-primary" /> Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="bg-card border rounded-lg px-4">
                <AccordionTrigger className="text-sm font-medium text-foreground hover:no-underline py-3">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground pb-3">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        {/* Contact Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h2 className="text-lg font-display font-bold text-foreground mb-4">Submit a Query</h2>
          <form onSubmit={handleSubmit} className="bg-card rounded-xl border shadow-card p-5 space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-foreground">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-foreground">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="msg" className="text-sm font-medium text-foreground">Message</Label>
              <Textarea id="msg" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Describe your issue..." rows={4} className="mt-1" />
            </div>
            <Button type="submit" className="w-full bg-gradient-saffron text-secondary-foreground hover:opacity-90">Submit Query</Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
