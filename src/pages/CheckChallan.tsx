import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Car, CreditCard, FileText, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChallanCard from "@/components/ChallanCard";
import { useAuth } from "@/contexts/AuthContext";
import {
  searchChallansByVehicle,
  searchChallansByNumber,
  searchChallansByOwner,
} from "@/lib/challanService";
import type { Challan } from "@/data/mockData";

export default function CheckChallan() {
  const { user, loading } = useAuth();
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState("vehicle");
  const [results, setResults] = useState<Challan[] | null>(null);
  const [searched, setSearched] = useState(false);
  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    if (!query.trim() || !user) return;
    setSearching(true);
    setSearched(true);
    
    let filtered: Challan[] = [];
    const q = query.toUpperCase().replace(/\s/g, "");
    
    if (searchType === "vehicle") {
      filtered = await searchChallansByVehicle(query);
    } else if (searchType === "challan") {
      filtered = await searchChallansByNumber(query);
    } else if (searchType === "dl") {
      filtered = await searchChallansByOwner(query);
    }
    
    setResults(filtered);
    setSearching(false);
  };

  return (
    <div className="container py-6 md:py-10 pb-20 lg:pb-10">
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && !user && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-destructive/10 rounded-xl p-8 text-center border border-destructive/20"
        >
          <Lock className="w-12 h-12 mx-auto mb-4 text-destructive" />
          <h2 className="text-2xl font-display font-bold text-foreground mb-2">Authentication Required</h2>
          <p className="text-muted-foreground mb-6">Please log in to access your challan information.</p>
          <a href="/auth">
            <Button className="bg-gradient-saffron text-secondary-foreground">Sign In / Sign Up</Button>
          </a>
        </motion.div>
      )}

      {!loading && user && (
        <>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Check Challan Status</h1>
            <p className="text-muted-foreground text-sm mt-1">Search your pending challans using vehicle number, challan number, or driving license.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 bg-card rounded-xl border shadow-card p-5 md:p-8"
          >
            <Tabs value={searchType} onValueChange={setSearchType}>
              <TabsList className="w-full grid grid-cols-3 mb-6">
                <TabsTrigger value="vehicle" className="flex items-center gap-1.5 text-xs md:text-sm">
                  <Car className="w-4 h-4" /> Vehicle No.
                </TabsTrigger>
                <TabsTrigger value="challan" className="flex items-center gap-1.5 text-xs md:text-sm">
                  <FileText className="w-4 h-4" /> Challan No.
                </TabsTrigger>
                <TabsTrigger value="dl" className="flex items-center gap-1.5 text-xs md:text-sm">
                  <CreditCard className="w-4 h-4" /> DL / Name
                </TabsTrigger>
              </TabsList>

              <TabsContent value="vehicle">
                <p className="text-sm text-muted-foreground mb-3">Enter your vehicle registration number (e.g., DL 01 AB 1234)</p>
              </TabsContent>
              <TabsContent value="challan">
                <p className="text-sm text-muted-foreground mb-3">Enter your challan number (e.g., DL-2024-00145823)</p>
              </TabsContent>
              <TabsContent value="dl">
                <p className="text-sm text-muted-foreground mb-3">Enter driving license number or owner name</p>
              </TabsContent>
            </Tabs>

            <div className="flex gap-3">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder={
                  searchType === "vehicle" ? "DL 01 AB 1234" :
                  searchType === "challan" ? "DL-2024-00145823" : "Name or DL Number"
                }
                className="text-sm md:text-base uppercase"
                disabled={searching}
              />
              <Button
                onClick={handleSearch}
                className="bg-gradient-saffron text-secondary-foreground shrink-0"
                disabled={searching}
              >
                <Search className="w-4 h-4 mr-2" /> {searching ? "Searching..." : "Search"}
              </Button>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {searched && results !== null && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-8"
              >
                <h2 className="text-lg font-display font-semibold text-foreground mb-4">
                  {results.length > 0 ? `Found ${results.length} challan(s)` : "No challans found"}
                </h2>
                {results.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {results.map((c, i) => (
                      <ChallanCard key={c.id} challan={c} index={i} onPay={() => {}} onView={() => {}} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-accent/10 rounded-xl p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-accent" />
                    </div>
                    <p className="font-display font-semibold text-foreground">No pending challans!</p>
                    <p className="text-sm text-muted-foreground mt-1">Great! You have no traffic violations on record.</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
