import { useListServiceCategories } from "@workspace/api-client-react";
import { Link } from "wouter";
import { ArrowRight, Briefcase } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { motion } from "framer-motion";

export default function Services() {
  const { data: categories, isLoading, error } = useListServiceCategories();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">Service Categories</h1>
        <p className="text-lg text-muted-foreground">
          Browse all government services available for online booking and queue tracking.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner className="w-10 h-10" /></div>
      ) : error ? (
        <div className="p-8 text-center bg-red-50 text-red-600 rounded-3xl">Failed to load categories.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories?.map((cat, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={cat.id}
            >
              <Link 
                href={`/offices?categoryId=${cat.id}`}
                className="flex flex-col h-full p-8 rounded-[2rem] bg-white border border-border shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 group"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform duration-300">
                  <Briefcase className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{cat.nameFr}</h3>
                <p className="text-sm font-arabic text-muted-foreground mb-4">{cat.nameAr}</p>
                <p className="text-sm text-muted-foreground mb-8 flex-1">{cat.description}</p>
                
                <div className="flex items-center text-sm font-semibold text-primary mt-auto">
                  Find Offices <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
