import { useState } from "react";
import { 
  useAdminGetQueue, 
  useAdminGetStats, 
  useAdminUpdateAppointmentStatus,
  useListOffices
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";
import { format } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { 
  Users, CheckCircle2, AlertCircle, Clock, 
  ChevronRight, PlayCircle, XCircle 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { statusColors } from "@/lib/utils";

export default function AdminDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // For demo, we just pick the first office or let admin select
  const { data: offices } = useListOffices();
  const defaultOfficeId = offices?.[0]?.id;
  
  const [selectedOfficeId, setSelectedOfficeId] = useState<number | undefined>();
  const activeOfficeId = selectedOfficeId || defaultOfficeId;

  const { data: queue, isLoading: isLoadingQueue } = useAdminGetQueue(
    activeOfficeId!, 
    { date: format(new Date(), 'yyyy-MM-dd') },
    { query: { enabled: !!activeOfficeId, refetchInterval: 10000 } }
  );

  const { data: stats, isLoading: isLoadingStats } = useAdminGetStats(
    { officeId: activeOfficeId, date: format(new Date(), 'yyyy-MM-dd') },
    { query: { enabled: !!activeOfficeId } }
  );

  const updateMutation = useAdminUpdateAppointmentStatus({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [`/api/admin`] });
        queryClient.invalidateQueries({ queryKey: [`/api/queues`] });
      }
    }
  });

  const handleStatusUpdate = (appointmentId: number, status: 'called' | 'in_progress' | 'completed' | 'no_show') => {
    if (!activeOfficeId) return;
    updateMutation.mutate(
      { officeId: activeOfficeId, appointmentId, data: { status } },
      { 
        onSuccess: () => toast({ title: `Status updated to ${status}` }),
        onError: () => toast({ title: "Failed to update status", variant: "destructive" })
      }
    );
  };

  const handleCallNext = () => {
    // Find first pending or confirmed
    const nextApt = queue?.find(a => a.status === 'pending' || a.status === 'confirmed');
    if (nextApt) {
      handleStatusUpdate(nextApt.id, 'called');
    } else {
      toast({ title: "No waiting patients in queue" });
    }
  };

  if (!offices) return <div className="p-20 text-center"><Spinner /></div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col">
        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-1">Staff Portal</h2>
          <p className="text-xs uppercase tracking-wider text-slate-500">Dashboard</p>
        </div>
        
        <div className="px-4 mb-6">
          <label className="text-xs font-semibold uppercase text-slate-500 mb-2 block">Select Office</label>
          <select 
            className="w-full bg-slate-800 border-none rounded-lg p-3 text-white text-sm focus:ring-2 focus:ring-primary outline-none"
            value={activeOfficeId || ""}
            onChange={e => setSelectedOfficeId(Number(e.target.value))}
          >
            {offices.map(o => (
              <option key={o.id} value={o.id}>{o.name}</option>
            ))}
          </select>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <a href="#" className="flex items-center gap-3 px-4 py-3 bg-primary text-white rounded-lg font-medium">
            <Users className="w-4 h-4" /> Queue Management
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 rounded-lg transition-colors">
            <Clock className="w-4 h-4" /> History
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Today's Operations</h1>
            <p className="text-slate-500">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
          </div>
          <button 
            onClick={handleCallNext}
            disabled={updateMutation.isPending}
            className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 shadow-lg shadow-primary/20 flex items-center gap-2 transition-transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <PlayCircle className="w-5 h-5" /> Call Next Patient
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Booked", value: stats?.totalToday || 0, icon: Users, color: "text-blue-600" },
            { label: "Waiting Now", value: stats?.waitingNow || 0, icon: Clock, color: "text-amber-600" },
            { label: "Completed", value: stats?.completedToday || 0, icon: CheckCircle2, color: "text-green-600" },
            { label: "No Shows", value: stats?.noShowToday || 0, icon: AlertCircle, color: "text-red-600" },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className={`p-3 rounded-xl bg-slate-50 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-xs font-semibold uppercase text-slate-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Queue List */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col h-[600px]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg text-slate-900">Live Queue</h3>
              <span className="text-xs font-medium bg-primary/10 text-primary px-3 py-1 rounded-full animate-pulse">Auto-updating</span>
            </div>
            
            <div className="flex-1 overflow-auto p-2">
              {isLoadingQueue ? (
                <div className="h-full flex items-center justify-center"><Spinner /></div>
              ) : queue?.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-400">No appointments today.</div>
              ) : (
                <div className="space-y-2">
                  {queue?.map(apt => (
                    <div key={apt.id} className="p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className="w-16 text-center">
                          <p className="text-xs text-slate-400 font-mono mb-1">{apt.time.substring(0,5)}</p>
                          <p className="font-bold font-mono text-slate-900">{apt.ticketNumber}</p>
                        </div>
                        <div className="w-px h-10 bg-slate-200"></div>
                        <div>
                          <p className="font-semibold text-slate-900">{apt.citizenName}</p>
                          <p className="text-sm text-slate-500">{apt.serviceName}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <span className={`px-2 py-1 rounded-md text-xs font-semibold border ${statusColors[apt.status]}`}>
                          {apt.status.replace('_', ' ').toUpperCase()}
                        </span>
                        
                        {/* Actions based on status */}
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {(apt.status === 'pending' || apt.status === 'confirmed') && (
                            <button onClick={() => handleStatusUpdate(apt.id, 'called')} className="p-2 bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-lg tooltip-trigger" title="Call">
                              <PlayCircle className="w-4 h-4" />
                            </button>
                          )}
                          {apt.status === 'called' && (
                            <button onClick={() => handleStatusUpdate(apt.id, 'in_progress')} className="p-2 bg-teal-100 text-teal-700 hover:bg-teal-200 rounded-lg" title="Start Serving">
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          )}
                          {apt.status === 'in_progress' && (
                            <button onClick={() => handleStatusUpdate(apt.id, 'completed')} className="p-2 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg" title="Mark Done">
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          )}
                          {(apt.status === 'called' || apt.status === 'in_progress') && (
                            <button onClick={() => handleStatusUpdate(apt.id, 'no_show')} className="p-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg" title="No Show">
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Charts / Insights */}
          <div className="space-y-8">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-6">Appointments by Hour</h3>
              <div className="h-64">
                {stats?.appointmentsByHour && stats.appointmentsByHour.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.appointmentsByHour}>
                      <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                      <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                      <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-400 text-sm">No data yet</div>
                )}
              </div>
            </div>

            <div className="bg-slate-900 rounded-3xl p-6 shadow-lg text-white">
              <h3 className="font-bold mb-2">System Status</h3>
              <p className="text-slate-400 text-sm mb-6">All systems operational.</p>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                  <span className="text-slate-300">Avg. processing time</span>
                  <span className="font-bold">12 mins</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                  <span className="text-slate-300">Peak hour today</span>
                  <span className="font-bold">{stats?.peakHour || '--:--'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
