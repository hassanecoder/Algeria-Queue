import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { 
  Building2, 
  CalendarDays, 
  LayoutDashboard, 
  Menu, 
  X, 
  ActivitySquare
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home", icon: Building2 },
    { href: "/offices", label: "Find Office", icon: Building2 },
    { href: "/appointments", label: "My Appointments", icon: CalendarDays },
    { href: "/admin", label: "Admin Access", icon: LayoutDashboard },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 glass-panel">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <img 
                src={`${import.meta.env.BASE_URL}images/logo-icon.png`} 
                alt="Logo" 
                className="w-7 h-7 object-contain mix-blend-multiply"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    parent.classList.add('bg-primary');
                    parent.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>';
                  }
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-foreground leading-tight tracking-tight">Khadamatech</span>
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Public Services</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location === link.href || (link.href !== "/" && location.startsWith(link.href));
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2",
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground border-l border-border pl-4">
              <span className="font-arabic font-medium">عربي</span>
              <span>/</span>
              <span className="font-medium text-foreground">Fr</span>
            </div>
            <button 
              className="md:hidden p-2 -mr-2 text-foreground"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden fixed inset-x-0 top-16 bg-white border-b border-border z-40 shadow-xl"
        >
          <div className="p-4 flex flex-col gap-2">
            {navLinks.map((link) => {
              const isActive = location === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "p-4 rounded-xl text-base font-medium flex items-center gap-3",
                    isActive ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <main className="flex-1 w-full relative">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-border mt-auto">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <ActivitySquare className="w-6 h-6 text-primary" />
                <span className="font-bold text-lg">Khadamatech الجزائر</span>
              </div>
              <p className="text-muted-foreground max-w-sm">
                The official digital portal for queuing and appointment booking across public services in Algeria. Saving your time, organizing our services.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Services</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/offices" className="hover:text-primary transition-colors">Civil Registry</Link></li>
                <li><Link href="/offices" className="hover:text-primary transition-colors">National ID & Passport</Link></li>
                <li><Link href="/offices" className="hover:text-primary transition-colors">Tax Authority</Link></li>
                <li><Link href="/offices" className="hover:text-primary transition-colors">Social Security</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Help Center / المساعدة</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact Us / اتصل بنا</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Ministère de la Numérisation - République Algérienne. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
