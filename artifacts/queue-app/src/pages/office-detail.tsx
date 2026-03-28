import { useParams, Link } from "wouter";
import { useGetOffice, useGetQueueStatus } from "@workspace/api-client-react";
import { Spinner } from "@/components/ui/spinner";
import { MapPin, Phone, Clock, CalendarDays, ActivitySquare, ArrowRight, FileText } from "lucide-react";

export default function OfficeDetail() {
  const { id } = useParams();
  const officeId = Number(id);

  const { data: office, isLoading: isLoadingOffice } = useGetOffice(officeId);
  const { data: queueStatus } = useGetQueueStatus(officeId, { query: { refetchInterval: 10000 } });

  if (isLoadingOffice) {
    return <div className="min-h-screen flex items-center justify-center"><Spinner className="w-12 h-12" /></div>;
  }

  if (!office) {
    return <div className="text-center py-20 text-2xl font-bold text-muted-foreground">Office not found</div>;
  }

  return (
    <div className="bg-muted/20 min-h-screen pb-20">
      {/* Header Banner */}
      <div className="bg-foreground text-white pt-16 pb-32">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/80 text-sm font-medium mb-4">
            {office.categoryName} • {office.wilayaName}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{office.name}</h1>
          <h2 className="text-2xl text-white/60 font-arabic">{office.nameAr}</h2>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl -mt-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-border">
              <h3 className="text-xl font-bold mb-6">Office Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Address</p>
                    <p className="text-sm text-muted-foreground">{office.address}, {office.commune}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Working Hours</p>
                    <p className="text-sm text-muted-foreground">{office.openTime.substring(0,5)} - {office.closeTime.substring(0,5)}</p>
                    <p className="text-xs text-muted-foreground mt-1">{office.workingDays.join(', ')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Contact</p>
                    <p className="text-sm text-muted-foreground">{office.phone}</p>
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-border">
                <p className="text-muted-foreground text-sm leading-relaxed">{office.description}</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-border">
              <h3 className="text-xl font-bold mb-6">Services Offered</h3>
              <div className="space-y-4">
                {office.services.map(service => (
                  <div key={service.id} className="p-4 rounded-2xl border border-border/60 hover:border-primary/30 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-foreground">{service.nameFr}</h4>
                        <p className="text-sm text-muted-foreground font-arabic">{service.nameAr}</p>
                      </div>
                      <span className="text-xs font-medium px-2 py-1 bg-muted rounded-md whitespace-nowrap">
                        ~{service.duration} mins
                      </span>
                    </div>
                    {service.requiredDocuments.length > 0 && (
                      <div className="mt-4">
                        <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                          <FileText className="w-3 h-3" /> Required Documents
                        </p>
                        <ul className="list-disc list-inside text-sm text-muted-foreground pl-4 space-y-1">
                          {service.requiredDocuments.map((doc, idx) => (
                            <li key={idx}>{doc}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar / Action Panel */}
          <div className="space-y-6">
            {/* Action Card */}
            <div className="bg-primary rounded-3xl p-8 text-primary-foreground shadow-xl">
              <h3 className="text-2xl font-bold mb-2">Book Appointment</h3>
              <p className="text-primary-foreground/80 text-sm mb-8">Secure your slot and skip the line.</p>
              <Link 
                href={`/book/${office.id}`}
                className="w-full py-4 bg-white text-primary rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white/90 hover:scale-[1.02] transition-all"
              >
                Start Booking <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Live Queue Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-border">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold flex items-center gap-2 text-foreground">
                  <ActivitySquare className="w-5 h-5 text-accent" /> Live Queue
                </h3>
                {queueStatus?.isOpen ? (
                  <span className="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Open
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded-full">Closed</span>
                )}
              </div>

              {queueStatus ? (
                <div className="space-y-6 text-center">
                  <div className="py-6 px-4 bg-muted/50 rounded-2xl">
                    <p className="text-sm font-medium text-muted-foreground mb-1 uppercase tracking-wider">Now Serving</p>
                    <p className="text-4xl font-black text-foreground tracking-tight">{queueStatus.currentTicket || "---"}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border border-border rounded-2xl">
                      <p className="text-2xl font-bold text-foreground">{queueStatus.waitingCount}</p>
                      <p className="text-xs text-muted-foreground uppercase mt-1">Waiting</p>
                    </div>
                    <div className="p-4 border border-border rounded-2xl">
                      <p className="text-2xl font-bold text-foreground">{queueStatus.averageWaitMinutes}m</p>
                      <p className="text-xs text-muted-foreground uppercase mt-1">Est. Wait</p>
                    </div>
                  </div>

                  <Link 
                    href={`/queue/${office.id}`}
                    className="block w-full py-3 text-sm font-semibold text-primary border-2 border-primary/20 rounded-xl hover:bg-primary/5 transition-colors"
                  >
                    View Full Tracker
                  </Link>
                </div>
              ) : (
                <div className="py-12 flex justify-center"><Spinner /></div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
