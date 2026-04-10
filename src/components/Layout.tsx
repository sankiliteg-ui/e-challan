import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, Search, CreditCard, History, FileText, HelpCircle,
  Menu, X, Shield, ChevronRight, LogIn, LogOut,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";

const publicNavItems = [
  { label: "Dashboard", path: "/", icon: Home },
  { label: "Check Challan", path: "/check", icon: Search },
  { label: "Pay Challan", path: "/pay", icon: CreditCard },
  { label: "History", path: "/history", icon: History },
  { label: "Violations Guide", path: "/violations", icon: FileText },
  { label: "Help & Support", path: "/help", icon: HelpCircle },
];

const adminNavItems = [
  { label: "Admin Panel", path: "/admin", icon: ShieldCheck },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAdmin, signOut } = useAuth();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    ...publicNavItems,
    ...(isAdmin ? adminNavItems : []),
  ];

  const mobileBottomNavItems = [
    publicNavItems[0],
    publicNavItems[1],
    publicNavItems[2],
    publicNavItems[3],
    isAdmin ? adminNavItems[0] : publicNavItems[5],
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-gradient-hero text-primary-foreground text-xs py-1 text-center font-body hidden sm:block">
        🇮🇳 Government of India — Ministry of Road Transport & Highways
      </div>

      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80">
        <div className="container h-16 lg:h-20">
          <div className="flex h-full items-center justify-between gap-3">
            <Link to="/" className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary shadow-card flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display font-bold text-sm md:text-base leading-tight text-foreground">e-Challan India</h1>
              <p className="text-[10px] md:text-xs text-muted-foreground leading-none">Traffic Enforcement Portal</p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 rounded-full border bg-card/80 p-1 shadow-card">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all ${
                    active
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            {user ? (
              <div className="hidden sm:flex items-center gap-2 rounded-full border bg-card/80 px-2 py-1">
                <span className="max-w-[170px] truncate text-xs text-muted-foreground px-1">{user.email}</span>
                {isAdmin && <Badge className="bg-secondary/15 text-secondary text-[10px]">Admin</Badge>}
                <Button variant="ghost" size="sm" onClick={() => void signOut()} className="h-8 rounded-full text-xs px-3">
                  <LogOut className="w-4 h-4 mr-1" /> Sign Out
                </Button>
              </div>
            ) : (
              <Link to="/auth" className="hidden sm:block">
                <Button size="sm" className="h-9 rounded-full bg-gradient-saffron text-secondary-foreground hover:opacity-90">
                  <LogIn className="w-4 h-4 mr-1" /> Sign In
                </Button>
              </Link>
            )}

            <Button
              variant="outline"
              size="icon"
              className="lg:hidden rounded-full"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/40 z-50 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-card z-50 shadow-elevated flex flex-col lg:hidden"
            >
              <div className="flex items-center justify-between p-4 border-b">
                <div>
                  <p className="font-display font-bold text-foreground">Navigation</p>
                  <p className="text-xs text-muted-foreground">e-Challan India</p>
                </div>
                <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {user && (
                <div className="px-4 py-3 border-b bg-muted/30">
                  <p className="text-sm font-medium text-foreground truncate">{user.email}</p>
                  {isAdmin && <Badge className="mt-1 bg-secondary/15 text-secondary text-[10px]">Admin</Badge>}
                </div>
              )}

              <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => {
                  const active = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        active
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      <span className="flex items-center gap-3"><item.icon className="w-5 h-5" />{item.label}</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  );
                })}

                {user ? (
                  <button
                    onClick={() => {
                      void signOut();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 w-full"
                  >
                    <LogOut className="w-5 h-5" /> Sign Out
                  </button>
                ) : (
                  <Link to="/auth" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-primary hover:bg-primary/10">
                    <LogIn className="w-5 h-5" /> Sign In
                  </Link>
                )}
              </nav>

              <div className="p-4 border-t">
                <p className="text-xs text-muted-foreground text-center">e-Challan v2.0 — MoRTH, Govt of India</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={location.pathname}
          className="flex-1"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.24, ease: "easeOut" }}
        >
          {children}
        </motion.main>
      </AnimatePresence>

      <footer className="border-t bg-card mt-8">
        <div className="container py-6 md:py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
            <div>
              <h4 className="font-display font-semibold mb-3 text-foreground">Quick Links</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/check" className="hover:text-foreground transition-colors">Check Challan</Link></li>
                <li><Link to="/pay" className="hover:text-foreground transition-colors">Pay Challan</Link></li>
                <li><Link to="/history" className="hover:text-foreground transition-colors">Payment History</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-display font-semibold mb-3 text-foreground">Resources</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/violations" className="hover:text-foreground transition-colors">Violations List</Link></li>
                <li><Link to="/help" className="hover:text-foreground transition-colors">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-display font-semibold mb-3 text-foreground">Contact</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>Helpline: 1800-XXX-XXXX</li>
                <li>Email: support@echallan.gov.in</li>
              </ul>
            </div>
            <div>
              <h4 className="font-display font-semibold mb-3 text-foreground">Government</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">MoRTH</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Parivahan</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t text-center text-xs text-muted-foreground">
            © 2024 e-Challan — Ministry of Road Transport & Highways, Government of India.
          </div>
        </div>
      </footer>

      <div className="fixed bottom-0 left-0 right-0 lg:hidden glass border-t z-40">
        <nav className="flex items-center justify-around h-16">
          {mobileBottomNavItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} className={`flex flex-col items-center gap-0.5 text-[10px] font-medium px-2 py-1 rounded-lg transition-all ${active ? "text-primary" : "text-muted-foreground"}`}>
                <item.icon className={`w-5 h-5 ${active ? "text-primary" : ""}`} />
                {item.label.split(" ")[0]}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
