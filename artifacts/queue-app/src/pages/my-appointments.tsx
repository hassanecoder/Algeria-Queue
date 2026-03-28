import { useState } from "react";
import { Link } from "wouter";
import { useListAppointments, useCancelAppointment } from "@workspace/api-client-react";
import { Spinner } from "@/components/ui/spinner";
import { Search, CalendarX2, Ticket, MapPin, Calendar, Clock, AlertTriangle } from "lucide-react";
import { formatDate, formatTime, statusColors, statusLabels } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function MyAppointments() {
  const [phone, setPhone] = useState("");
  const [searchedPhone, setSearchedPhone] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: appointments, isLoading, isError } = useListAppointments(
    { phone: searchedPhone },
    { query: { enabled: !!searchedPhone } }
  );

  const cancelMutation = useCancelAppointment({
    mutation: {
      onSuccess: () => {
        toast({ title: "Appointment cancelled." });
        queryClient.invalidateQueries({ queryKey: [`/api/appointments`] });
      }
    }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 8) return toast({ title: "Please enter a valid phone number", variant: "destructive" });
    setSearchedPhone(phone);
  };

  const handleCancel = (id: number) => {
    if (confirm("Are you sure you want to cancel this appointment?")) {
      cancelMutation.mutate({ appointmentId: id });
    }
  };

  return (
    <div className="min-h-screen bg-muted/10 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-foreground mb-2">My Appointments</h1>
        <p className="text-muted-foreground mb-8">Manage your scheduled visits and check queue status.</p>

        {/* Search Form */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-border mb-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input 
                type="tel" 
                placeholder="Enter your phone number (e.g. 0555123456)"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-border focus:border-primary outline-none transition-colors bg-background"
              />
            </div>
            <button 
              type="submit"
              className="px-8 py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all shadow-md"
            >
              Find Appointments
            </button>
          </form>
        </div>

        {/* Results */}
        {isLoading && <div className="py-12 flex justify-center"><Spinner className="w-8 h-8" /></div>}
        
        {isError && (
          <div className="bg-red-50 text-red-600 p-6 rounded-2xl flex items-center gap-3">
            <AlertTriangle className="w-5 h-5" /> Could not load appointments.
          </div>
        )}

        {appointments && appointments.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-border">
            <CalendarX2 className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground">No appointments found</h3>
            <p className="text-muted-foreground mt-2">We couldn't find any active appointments for this number.</p>
          </div>
        )}

        {appointments && appointments.length > 0 && (
          <div className="space-y-4">
            {appointments.map(apt => (
              <div key={apt.id} className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-border flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow">
                
                {/* Left: Status & Ticket */}
                <div className="md:w-1/3 flex flex-col justify-between border-b md:border-b-0 md:border-r border-border pb-6 md:pb-0 md:pr-6">
                  <div>
                    <div className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border mb-4 ${statusColors[apt.status]}`}>
                      {statusLabels[apt.status]}
                    </div>
                    <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Ticket Number</p>
                    <p className="text-3xl font-black text-foreground font-mono flex items-center gap-2">
                      <Ticket className="w-6 h-6 text-primary" /> {apt.ticketNumber}
                    </p>
                  </div>
                  
                  {(apt.status === 'pending' || apt.status === 'confirmed') && (
                    <div className="mt-6 bg-primary/5 rounded-xl p-4">
                      <p className="text-xs font-semibold text-primary uppercase">Est. Wait</p>
                      <p className="text-2xl font-bold text-foreground">{apt.estimatedWaitMinutes} mins</p>
                      <p className="text-xs text-muted-foreground mt-1">Position in queue: <span className="font-bold">{apt.queuePosition}</span></p>
                    </div>
                  )}
                </div>

                {/* Right: Details */}
                <div className="flex-1 flex flex-col">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-1">{apt.serviceName}</h3>
                    <p className="text-primary font-medium flex items-center gap-1 mb-6">
                      <MapPin className="w-4 h-4" /> {apt.officeName}
                    </p>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground flex items-center gap-1 mb-1"><Calendar className="w-4 h-4"/> Date</p>
                        <p className="font-semibold">{formatDate(apt.date)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground flex items-center gap-1 mb-1"><Clock className="w-4 h-4"/> Time</p>
                        <p className="font-semibold">{formatTime(apt.time)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-border flex flex-wrap gap-3">
                    <Link 
                      href={`/queue/${apt.officeId}`}
                      className="px-4 py-2 bg-primary/10 text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors text-sm"
                    >
                      Track Office Queue
                    </Link>
                    {(apt.status === 'pending' || apt.status === 'confirmed') && (
                      <button 
                        onClick={() => handleCancel(apt.id)}
                        disabled={cancelMutation.isPending}
                        className="px-4 py-2 text-destructive font-semibold hover:bg-destructive/10 rounded-lg transition-colors text-sm ml-auto"
                      >
                        Cancel Appointment
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
  );
}
