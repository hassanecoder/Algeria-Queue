import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  Search, 
  ArrowRight, 
  Clock, 
  CalendarCheck, 
  ActivitySquare,
  Users,
  Building,
  FileText
} from "lucide-react";
import { useListServiceCategories } from "@workspace/api-client-react";

export default function Home() {
  const { data: categories, isLoading } = useListServiceCategories();

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`} 
            alt="Background" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Live Queue Tracking Available
            </span>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-6 text-balance">
              Skip the line. <br />
              <span className="text-primary">Book your turn</span> online.
            </h1>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
              Book appointments at clinics, banks, salons, garages and more — then track your spot in the queue in real time. <span className="font-arabic">احجز موعدك وتتبع دورك بكل سهولة</span>
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/offices"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Find a Business <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/appointments"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-foreground font-semibold shadow-md hover:shadow-lg border border-border hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
              >
                My Appointments <CalendarCheck className="w-5 h-5 text-primary" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats / Features */}
      <section className="py-16 bg-white relative z-20 -mt-10 rounded-t-[3rem] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Clock, title: "Save Time", desc: "Know exactly when it's your turn without waiting in crowded halls." },
              { icon: CalendarCheck, title: "Plan Ahead", desc: "Book your appointment days in advance for essential services." },
              { icon: ActivitySquare, title: "Live Updates", desc: "Track the current ticket being served on your smartphone." }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4 p-6 rounded-3xl bg-background border border-border/50"
              >
                <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                  <feature.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground mb-1">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Available Services</h2>
              <p className="text-muted-foreground font-arabic">الخدمات المتوفرة</p>
            </div>
            <Link href="/services" className="text-primary font-medium flex items-center gap-1 hover:underline">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-40 rounded-3xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories?.slice(0, 8).map((cat, i) => (
                <Link 
                  key={cat.id} 
                  href={`/offices?categoryId=${cat.id}`}
                  className="group block p-6 rounded-3xl bg-white border border-border/60 hover:border-primary/30 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    {/* Simplified icon rendering based on generic names */}
                    <div className="text-primary text-2xl font-bold opacity-80">{cat.nameFr.charAt(0)}</div>
                  </div>
                  <h3 className="font-semibold text-foreground leading-tight mb-1">{cat.nameFr}</h3>
                  <p className="text-xs text-muted-foreground font-arabic">{cat.nameAr}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
