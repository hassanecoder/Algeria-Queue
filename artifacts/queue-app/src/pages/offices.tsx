import { useState } from "react";
import { Link, useSearch } from "wouter";
import { 
  useListOffices, 
  useListWilayas, 
  useListServiceCategories 
} from "@workspace/api-client-react";
import { 
  MapPin, 
  Clock, 
  Users, 
  Search, 
  Building2,
  ChevronRight
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { motion } from "framer-motion";

export default function Offices() {
  const searchString = useSearch();
  const urlParams = new URLSearchParams(searchString);
  const initialCategoryId = urlParams.get('categoryId') ? Number(urlParams.get('categoryId')) : undefined;

  const [wilayaId, setWilayaId] = useState<number | undefined>();
  const [categoryId, setCategoryId] = useState<number | undefined>(initialCategoryId);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search slightly
  useState(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(handler);
  }, [search]);

  const { data: offices, isLoading } = useListOffices({
    wilayaId,
    categoryId,
    search: debouncedSearch || undefined
  });

  const { data: wilayas } = useListWilayas();
  const { data: categories } = useListServiceCategories();

  return (
    <div className="bg-muted/30 min-h-screen pb-20">
      {/* Search Header */}
      <div className="bg-primary pt-12 pb-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="container mx-auto max-w-5xl relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">Find a Business Near You</h1>
          
          <div className="bg-white p-2 rounded-2xl shadow-xl flex flex-col md:flex-row gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search clinic, bank, salon..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-transparent border-none focus:outline-none focus:ring-0 text-foreground"
              />
            </div>
            
            <div className="h-px md:h-12 w-full md:w-px bg-border/50 mx-2" />
            
            <select 
              value={wilayaId || ""}
              onChange={(e) => setWilayaId(e.target.value ? Number(e.target.value) : undefined)}
              className="px-4 py-4 bg-transparent border-none focus:outline-none focus:ring-0 text-foreground md:w-48 appearance-none cursor-pointer"
            >
              <option value="">All Wilayas</option>
              {wilayas?.map(w => (
                <option key={w.id} value={w.id}>{w.code} - {w.nameFr}</option>
              ))}
            </select>

            <div className="h-px md:h-12 w-full md:w-px bg-border/50 mx-2" />

            <select 
              value={categoryId || ""}
              onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : undefined)}
              className="px-4 py-4 bg-transparent border-none focus:outline-none focus:ring-0 text-foreground md:w-48 appearance-none cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories?.map(c => (
                <option key={c.id} value={c.id}>{c.nameFr}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto max-w-5xl px-4 -mt-10 relative z-20">
        {isLoading ? (
          <div className="flex justify-center py-20 bg-white rounded-3xl shadow-sm"><Spinner className="w-8 h-8" /></div>
        ) : !offices?.length ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-border">
            <Building2 className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">No results found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or search term.</p>
            <button 
              onClick={() => { setWilayaId(undefined); setCategoryId(undefined); setSearch(""); }}
              className="mt-6 text-primary font-medium hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {offices.map((office, i) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                key={office.id}
              >
                <Link href={`/offices/${office.id}`} className="block">
                  <div className="bg-white p-6 rounded-3xl border border-border/50 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 flex flex-col md:flex-row gap-6 group">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold px-2 py-1 rounded-md bg-secondary text-secondary-foreground">
                          {office.categoryName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {office.wilayaName}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{office.name}</h3>
                      <p className="text-sm font-arabic text-muted-foreground mb-4">{office.nameAr}</p>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {office.address}</span>
                        <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {office.openTime.substring(0,5)} - {office.closeTime.substring(0,5)}</span>
                      </div>
                    </div>
                    
                    <div className="md:w-64 flex flex-col justify-center border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
                      <div className="bg-primary/5 rounded-2xl p-4 flex items-center justify-between group-hover:bg-primary/10 transition-colors">
                        <div>
                          <p className="text-xs text-muted-foreground font-medium mb-1 uppercase tracking-wider">Queue Today</p>
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-primary">{office.todayQueueCount}</span>
                            <span className="text-sm text-muted-foreground flex items-center gap-1"><Users className="w-3 h-3"/> waiting</span>
                          </div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                          <ChevronRight className="w-5 h-5 text-primary group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
