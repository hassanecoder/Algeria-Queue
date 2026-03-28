import { useParams, Link } from "wouter";
import { useGetOffice, useGetQueueStatus } from "@workspace/api-client-react";
import { Spinner } from "@/components/ui/spinner";
import { ActivitySquare, Users, Clock, ArrowLeft, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function QueueStatus() {
  const { officeId: id } = useParams();
  const officeId = Number(id);

  const { data: office } = useGetOffice(officeId);
  const { data: queue, isLoading, refetch, isFetching } = useGetQueueStatus(
    officeId, 
    { query: { refetchInterval: 5000 } } // Auto-refresh every 5s
  );

  if (isLoading && !queue) return <div className="min-h-screen flex items-center justify-center"><Spinner className="w-10 h-10" /></div>;

  return (
    <div className="min-h-screen bg-foreground text-white selection:bg-white/20">
      <div className="container mx-auto px-4 max-w-4xl py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <Link href={`/offices/${officeId}`} className="text-white/60 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Office
          </Link>
          <div className="text-right">
            <h1 className="text-xl font-bold">{office?.name || queue?.officeName}</h1>
            <div className="flex items-center justify-end gap-2 text-white/50 text-xs mt-1">
              <ActivitySquare className="w-3 h-3" /> Live Feed
              <button onClick={() => refetch()} className={`${isFetching ? 'animate-spin' : ''} ml-2 hover:text-white`}><RefreshCw className="w-3 h-3" /></button>
            </div>
          </div>
        </div>

        {/* Main Display */}
        <div className="bg-white/5 border border-white/10 rounded-[3rem] p-8 md:p-16 backdrop-blur-xl relative overflow-hidden text-center shadow-2xl mb-8">
          {/* Subtle glow effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/30 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative z-10">
            <p className="text-white/60 uppercase tracking-[0.2em] font-semibold mb-6">Currently Serving / جاري الخدمة الآن</p>
            
            <AnimatePresence mode="popLayout">
              <motion.div
                key={queue?.currentTicket}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.1, y: -20 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="text-6xl md:text-8xl lg:text-9xl font-black font-mono tracking-tighter text-white drop-shadow-lg"
              >
                {queue?.currentTicket || "----"}
              </motion.div>
            </AnimatePresence>
            
            <div className="mt-12 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 border border-white/20">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
              <span className="font-medium text-sm">Counter 1 / الشباك 1</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center">
            <Users className="w-6 h-6 text-primary mx-auto mb-3 opacity-80" />
            <p className="text-3xl font-bold mb-1">{queue?.waitingCount}</p>
            <p className="text-xs text-white/50 uppercase tracking-wider">Waiting / في الانتظار</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center">
            <Clock className="w-6 h-6 text-accent mx-auto mb-3 opacity-80" />
            <p className="text-3xl font-bold mb-1">{queue?.averageWaitMinutes}m</p>
            <p className="text-xs text-white/50 uppercase tracking-wider">Avg Wait / متوسط الانتظار</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center col-span-2 md:col-span-1">
            <ActivitySquare className="w-6 h-6 text-green-400 mx-auto mb-3 opacity-80" />
            <p className="text-3xl font-bold mb-1">{queue?.completedToday}</p>
            <p className="text-xs text-white/50 uppercase tracking-wider">Served Today / اكتمل اليوم</p>
          </div>
        </div>
      </div>
    </div>
  );
}
