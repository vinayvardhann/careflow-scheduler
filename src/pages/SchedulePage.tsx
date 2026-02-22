import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_APPOINTMENTS, TIME_SLOTS, MOCK_DOCTORS } from "@/lib/mockData";
import { PriorityBadge, StatusBadge } from "@/components/Badges";
import { cn } from "@/lib/utils";

export default function SchedulePage() {
  const todayAppointments = MOCK_APPOINTMENTS.filter(a => a.date === '2026-02-22');

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Schedule</h1>
        <p className="text-muted-foreground text-sm mt-1">Today's appointment timeline across all doctors</p>
      </div>

      {/* Timeline view */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {MOCK_DOCTORS.map((doctor) => {
          const doctorAppts = todayAppointments.filter(a => a.doctorId === doctor.id);
          if (doctorAppts.length === 0) return null;

          return (
            <Card key={doctor.id} className="glass-card">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                    {doctor.avatar}
                  </div>
                  <div>
                    <CardTitle className="text-sm">{doctor.name}</CardTitle>
                    <p className="text-xs text-muted-foreground">{doctor.specialization} · {doctor.avgConsultationTime} min avg</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {doctorAppts.map((appt) => (
                  <div
                    key={appt.id}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg border transition-colors hover:bg-muted/40",
                      appt.priority === 'emergency' && "border-l-2 border-l-priority-emergency",
                      appt.priority === 'high' && "border-l-2 border-l-priority-high",
                      appt.priority === 'medium' && "border-l-2 border-l-priority-medium",
                      appt.priority === 'normal' && "border-l-2 border-l-priority-normal"
                    )}
                  >
                    <div>
                      <p className="text-sm font-medium">{appt.patientName}, {appt.patientAge}</p>
                      <p className="text-xs text-muted-foreground">{appt.startTime} – {appt.endTime} · {appt.reason}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <PriorityBadge priority={appt.priority} />
                      <StatusBadge status={appt.status} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Time slot grid */}
      <Card className="glass-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Slot Availability</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-8 gap-2">
            {TIME_SLOTS.map((slot) => {
              const booked = todayAppointments.some(a => a.startTime === slot);
              return (
                <div
                  key={slot}
                  className={cn(
                    "text-center py-2 rounded-md text-xs font-medium transition-colors",
                    booked
                      ? "bg-destructive/10 text-destructive line-through"
                      : "bg-status-completed/10 text-status-completed cursor-pointer hover:bg-status-completed/20"
                  )}
                >
                  {slot}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
