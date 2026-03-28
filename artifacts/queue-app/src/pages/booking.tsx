import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { 
  useGetOffice, 
  useGetAvailableSlots, 
  useCreateAppointment 
} from "@workspace/api-client-react";
import { Spinner } from "@/components/ui/spinner";
import { ChevronRight, Calendar, User, CheckCircle2, ArrowLeft } from "lucide-react";
import { format, addDays } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function Booking() {
  const { officeId: id } = useParams();
  const officeId = Number(id);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: office, isLoading: isLoadingOffice } = useGetOffice(officeId);
  const createMutation = useCreateAppointment();

  const [step, setStep] = useState(1);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  
  // Date default to tomorrow
  const [selectedDate, setSelectedDate] = useState<string>(format(addDays(new Date(), 1), 'yyyy-MM-dd'));
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    citizenName: "",
    citizenPhone: "",
    citizenNationalId: "",
  });

  const { data: slots, isLoading: isLoadingSlots } = useGetAvailableSlots(
    officeId, 
    { date: selectedDate, serviceId: selectedServiceId || undefined },
    { query: { enabled: step === 2 && !!selectedServiceId } }
  );

  const handleNext = () => {
    if (step === 1 && !selectedServiceId) return toast({ title: "Select a service", variant: "destructive" });
    if (step === 2 && !selectedTime) return toast({ title: "Select a time slot", variant: "destructive" });
    setStep(s => s + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedServiceId || !selectedTime) return;

    try {
      const result = await createMutation.mutateAsync({
        data: {
          officeId,
          serviceId: selectedServiceId,
          date: selectedDate,
          time: selectedTime,
          ...formData
        }
      });
      
      toast({ title: "Appointment booked successfully!", variant: "default" });
      setStep(4); // Success step
    } catch (err: any) {
      toast({ 
        title: "Booking failed", 
        description: err.message || "An error occurred", 
        variant: "destructive" 
      });
    }
  };

  if (isLoadingOffice) return <div className="min-h-screen flex items-center justify-center"><Spinner className="w-10 h-10" /></div>;
  if (!office) return <div>Office not found</div>;

  return (
    <div className="bg-muted/10 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        
        {/* Progress Bar */}
        {step < 4 && (
          <div className="mb-12">
            <button 
              onClick={() => step > 1 ? setStep(s => s - 1) : history.back()} 
              className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </button>
            <div className="flex items-center justify-between mb-4">
              {[1, 2, 3].map(s => (
                <div key={s} className="flex flex-col items-center relative z-10">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300",
                    step >= s ? "bg-primary text-white shadow-md" : "bg-muted text-muted-foreground"
                  )}>
                    {s}
                  </div>
                  <span className="text-xs font-medium mt-2 absolute -bottom-6 whitespace-nowrap text-muted-foreground">
                    {s === 1 ? "Service" : s === 2 ? "Date & Time" : "Details"}
                  </span>
                </div>
              ))}
              {/* Connecting lines */}
              <div className="absolute left-0 right-0 top-5 h-1 bg-muted -z-0 rounded-full mx-8">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${(step - 1) * 50}%` }}
                />
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-lg border border-border overflow-hidden">
          {/* STEP 1: SERVICE */}
          {step === 1 && (
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-2">Select Service</h2>
              <p className="text-muted-foreground mb-8">What do you need help with at {office.name}?</p>
              
              <div className="space-y-3">
                {office.services.map(service => (
                  <button
                    key={service.id}
                    onClick={() => setSelectedServiceId(service.id)}
                    className={cn(
                      "w-full text-left p-6 rounded-2xl border-2 transition-all duration-200 group flex items-center justify-between",
                      selectedServiceId === service.id 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:border-primary/40 hover:bg-muted/50"
                    )}
                  >
                    <div>
                      <h3 className="font-semibold text-foreground text-lg group-hover:text-primary transition-colors">{service.nameFr}</h3>
                      <p className="text-sm font-arabic text-muted-foreground">{service.nameAr}</p>
                    </div>
                    <div className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                      selectedServiceId === service.id ? "border-primary" : "border-muted-foreground/30"
                    )}>
                      {selectedServiceId === service.id && <div className="w-3 h-3 bg-primary rounded-full" />}
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-border flex justify-end">
                <button 
                  onClick={handleNext}
                  disabled={!selectedServiceId}
                  className="px-8 py-3 bg-primary text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 hover:shadow-md transition-all"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: DATE & TIME */}
          {step === 2 && (
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-2">Choose Date & Time</h2>
              <p className="text-muted-foreground mb-8">Select when you would like to visit.</p>

              <div className="mb-8">
                <label className="block text-sm font-semibold mb-2">Select Date</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <input 
                    type="date" 
                    value={selectedDate}
                    min={format(new Date(), 'yyyy-MM-dd')}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      setSelectedTime(null); // reset time on date change
                    }}
                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none text-lg font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-3">Available Slots</label>
                {isLoadingSlots ? (
                  <div className="py-8 flex justify-center"><Spinner /></div>
                ) : !slots?.length ? (
                  <div className="py-8 text-center bg-muted rounded-xl text-muted-foreground">
                    No slots available for this date. Please select another.
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {slots.map(slot => (
                      <button
                        key={slot.time}
                        disabled={!slot.available}
                        onClick={() => setSelectedTime(slot.time)}
                        className={cn(
                          "py-3 rounded-xl text-center font-medium border-2 transition-all",
                          !slot.available && "opacity-40 bg-muted cursor-not-allowed border-transparent",
                          slot.available && selectedTime === slot.time && "border-primary bg-primary text-white shadow-md",
                          slot.available && selectedTime !== slot.time && "border-border hover:border-primary/40 hover:bg-primary/5 text-foreground"
                        )}
                      >
                        {slot.time.substring(0,5)}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-12 pt-6 border-t border-border flex justify-between">
                <button 
                  onClick={() => setStep(1)}
                  className="px-6 py-3 text-muted-foreground font-semibold hover:text-foreground"
                >
                  Back
                </button>
                <button 
                  onClick={handleNext}
                  disabled={!selectedTime}
                  className="px-8 py-3 bg-primary text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 hover:shadow-md transition-all"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: DETAILS */}
          {step === 3 && (
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-2">Your Information</h2>
              <p className="text-muted-foreground mb-8">Please provide your details to confirm the booking.</p>

              <form id="booking-form" onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-foreground">Full Name (Nom & Prénom)</label>
                  <input 
                    required
                    type="text"
                    value={formData.citizenName}
                    onChange={e => setFormData({...formData, citizenName: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-primary outline-none transition-colors"
                    placeholder="e.g. Ahmed Benali"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2 text-foreground">Phone Number (Numéro de téléphone)</label>
                  <input 
                    required
                    type="tel"
                    value={formData.citizenPhone}
                    onChange={e => setFormData({...formData, citizenPhone: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-primary outline-none transition-colors"
                    placeholder="e.g. 0555 12 34 56"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-foreground">National ID Number (NIN / رقم التعريف الوطني)</label>
                  <input 
                    required
                    type="text"
                    value={formData.citizenNationalId}
                    onChange={e => setFormData({...formData, citizenNationalId: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-primary outline-none transition-colors"
                    placeholder="18 digit number"
                  />
                </div>
              </form>

              <div className="mt-12 pt-6 border-t border-border flex justify-between">
                <button 
                  onClick={() => setStep(2)}
                  className="px-6 py-3 text-muted-foreground font-semibold hover:text-foreground"
                >
                  Back
                </button>
                <button 
                  type="submit"
                  form="booking-form"
                  disabled={createMutation.isPending}
                  className="px-8 py-3 bg-primary text-white rounded-xl font-semibold disabled:opacity-50 hover:bg-primary/90 hover:shadow-md transition-all flex items-center gap-2"
                >
                  {createMutation.isPending ? <Spinner className="w-5 h-5 text-white" /> : "Confirm Booking"}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: SUCCESS */}
          {step === 4 && (
            <div className="p-12 text-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-4">Booking Confirmed!</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Your appointment at <span className="font-semibold text-foreground">{office.name}</span> has been successfully scheduled.
              </p>
              
              <div className="bg-muted/40 border border-border p-6 rounded-2xl max-w-sm mx-auto mb-8">
                <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">Your Ticket Number</p>
                <p className="text-4xl font-black text-primary font-mono">{createMutation.data?.ticketNumber}</p>
                <div className="mt-4 pt-4 border-t border-border/50 text-sm flex justify-between">
                  <span className="text-muted-foreground">Date & Time:</span>
                  <span className="font-semibold">{createMutation.data?.date} at {createMutation.data?.time.substring(0,5)}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link 
                  href={`/queue/${office.id}`}
                  className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                >
                  Track Live Queue
                </Link>
                <Link 
                  href="/"
                  className="px-6 py-3 bg-secondary text-secondary-foreground rounded-xl font-semibold hover:bg-secondary/80 transition-colors"
                >
                  Return Home
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
