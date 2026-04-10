import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus, FileText, Users, BarChart3, Trash2, Edit,
  Search, Filter, AlertTriangle, CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import StatCard from "@/components/StatCard";
import { violationTypes, indianStates } from "@/data/mockData";

const statusStyles: Record<string, string> = {
  pending: "bg-warning/15 text-warning",
  paid: "bg-accent/15 text-accent",
  disputed: "bg-info/15 text-info",
  overdue: "bg-destructive/15 text-destructive",
};

const stateCodes: Record<string, string> = {
  "Delhi": "DL", "Maharashtra": "MH", "Karnataka": "KA", "Tamil Nadu": "TN",
  "Uttar Pradesh": "UP", "Gujarat": "GJ", "Rajasthan": "RJ", "West Bengal": "WB",
  "Haryana": "HR", "Punjab": "PB", "Kerala": "KL", "Telangana": "TS",
  "Andhra Pradesh": "AP", "Madhya Pradesh": "MP", "Bihar": "BR",
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Form state
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [violationType, setViolationType] = useState("");
  const [location, setLocation] = useState("");
  const [fineAmount, setFineAmount] = useState("");
  const [officerName, setOfficerName] = useState("");
  const [officerBadge, setOfficerBadge] = useState("");
  const [state, setState] = useState("Delhi");
  const [dueDate, setDueDate] = useState("");

  const { data: challans = [], isLoading } = useQuery({
    queryKey: ["admin-challans"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("challans")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const stateCode = stateCodes[state] || state.substring(0, 2).toUpperCase();
      const challanNumber = `${stateCode}-${new Date().getFullYear()}-${String(Date.now()).slice(-8)}`;

      const { error } = await supabase.from("challans").insert({
        challan_number: challanNumber,
        vehicle_number: vehicleNumber.toUpperCase(),
        owner_name: ownerName,
        violation_type: violationType,
        location,
        fine_amount: parseInt(fineAmount),
        officer_name: officerName,
        officer_badge: officerBadge,
        state,
        due_date: dueDate,
        created_by: user?.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-challans"] });
      toast({ title: "Challan Created", description: "New challan has been issued successfully." });
      resetForm();
      setCreateOpen(false);
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("challans").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-challans"] });
      toast({ title: "Status Updated" });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("challans").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-challans"] });
      toast({ title: "Challan Deleted" });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const resetForm = () => {
    setVehicleNumber(""); setOwnerName(""); setViolationType(""); setLocation("");
    setFineAmount(""); setOfficerName(""); setOfficerBadge(""); setState("Delhi"); setDueDate("");
  };

  const filtered = challans.filter((c: any) => {
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (search) {
      const q = search.toUpperCase();
      return c.vehicle_number?.toUpperCase().includes(q) || c.challan_number?.toUpperCase().includes(q) || c.owner_name?.toUpperCase().includes(q);
    }
    return true;
  });

  const pendingCount = challans.filter((c: any) => c.status === "pending").length;
  const overdueCount = challans.filter((c: any) => c.status === "overdue").length;
  const totalFines = challans.filter((c: any) => c.status !== "paid").reduce((s: number, c: any) => s + (c.fine_amount || 0), 0);

  return (
    <div className="container py-6 md:py-10 pb-20 lg:pb-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage and issue traffic challans</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-saffron text-secondary-foreground hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" /> Issue New Challan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display">Issue New Challan</DialogTitle>
            </DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate(); }} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm text-foreground">Vehicle Number</Label>
                  <Input value={vehicleNumber} onChange={(e) => setVehicleNumber(e.target.value)} placeholder="DL 01 AB 1234" className="mt-1 uppercase" required />
                </div>
                <div>
                  <Label className="text-sm text-foreground">Owner Name</Label>
                  <Input value={ownerName} onChange={(e) => setOwnerName(e.target.value)} placeholder="Full name" className="mt-1" required />
                </div>
              </div>
              <div>
                <Label className="text-sm text-foreground">Violation Type</Label>
                <Select value={violationType} onValueChange={setViolationType} required>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Select violation" /></SelectTrigger>
                  <SelectContent>
                    {violationTypes.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm text-foreground">Location</Label>
                <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Road, area, city" className="mt-1" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm text-foreground">Fine Amount (₹)</Label>
                  <Input type="number" value={fineAmount} onChange={(e) => setFineAmount(e.target.value)} placeholder="1000" className="mt-1" required />
                </div>
                <div>
                  <Label className="text-sm text-foreground">State</Label>
                  <Select value={state} onValueChange={setState}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {indianStates.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm text-foreground">Officer Name</Label>
                  <Input value={officerName} onChange={(e) => setOfficerName(e.target.value)} placeholder="SI Name" className="mt-1" required />
                </div>
                <div>
                  <Label className="text-sm text-foreground">Badge Number</Label>
                  <Input value={officerBadge} onChange={(e) => setOfficerBadge(e.target.value)} placeholder="DTP-1234" className="mt-1" required />
                </div>
              </div>
              <div>
                <Label className="text-sm text-foreground">Due Date</Label>
                <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="mt-1" required />
              </div>
              <Button type="submit" disabled={createMutation.isPending} className="w-full bg-gradient-primary text-primary-foreground">
                {createMutation.isPending ? "Creating..." : "Issue Challan"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
        <StatCard title="Total Challans" value={challans.length} icon={FileText} color="primary" />
        <StatCard title="Pending" value={pendingCount} icon={AlertTriangle} color="warning" />
        <StatCard title="Overdue" value={overdueCount} icon={AlertTriangle} color="destructive" />
        <StatCard title="Unpaid Fines" value={`₹${totalFines.toLocaleString("en-IN")}`} icon={BarChart3} color="secondary" />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search challans..." className="flex-1" />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40"><Filter className="w-4 h-4 mr-2" /><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="disputed">Disputed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="mt-8 text-center text-muted-foreground">Loading challans...</div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="mt-6 hidden md:block bg-card rounded-xl border shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-3 font-medium text-muted-foreground">Challan No.</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Vehicle</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Violation</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Owner</th>
                    <th className="text-right p-3 font-medium text-muted-foreground">Fine</th>
                    <th className="text-center p-3 font-medium text-muted-foreground">Status</th>
                    <th className="text-center p-3 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c: any) => (
                    <tr key={c.id} className="border-t hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-mono text-xs">{c.challan_number}</td>
                      <td className="p-3">{c.vehicle_number}</td>
                      <td className="p-3">{c.violation_type}</td>
                      <td className="p-3">{c.owner_name}</td>
                      <td className="p-3 text-right font-semibold">₹{c.fine_amount?.toLocaleString("en-IN")}</td>
                      <td className="p-3 text-center">
                        <Select value={c.status} onValueChange={(val) => updateStatusMutation.mutate({ id: c.id, status: val })}>
                          <SelectTrigger className="h-7 text-xs w-24 mx-auto">
                            <Badge className={`${statusStyles[c.status]} capitalize text-xs`}>{c.status}</Badge>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="overdue">Overdue</SelectItem>
                            <SelectItem value="disputed">Disputed</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-3 text-center">
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteMutation.mutate(c.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && (
              <div className="p-8 text-center text-muted-foreground text-sm">No challans found.</div>
            )}
          </div>

          {/* Mobile cards */}
          <div className="mt-6 md:hidden space-y-3">
            {filtered.map((c: any, i: number) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card rounded-xl border shadow-card p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-xs font-mono text-muted-foreground">{c.challan_number}</p>
                    <p className="font-display font-semibold text-foreground text-sm">{c.violation_type}</p>
                  </div>
                  <Badge className={`${statusStyles[c.status]} capitalize text-xs`}>{c.status}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{c.vehicle_number} — {c.owner_name}</p>
                <div className="flex items-center justify-between mt-3 pt-2 border-t">
                  <p className="font-display font-bold text-foreground">₹{c.fine_amount?.toLocaleString("en-IN")}</p>
                  <div className="flex gap-1">
                    <Select value={c.status} onValueChange={(val) => updateStatusMutation.mutate({ id: c.id, status: val })}>
                      <SelectTrigger className="h-7 text-xs w-24"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                        <SelectItem value="disputed">Disputed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteMutation.mutate(c.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
