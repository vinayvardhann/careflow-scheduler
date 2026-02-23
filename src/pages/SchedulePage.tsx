import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MOCK_APPOINTMENTS, TIME_SLOTS, MOCK_DOCTORS, type Appointment } from "@/lib/mockData";
import { PriorityBadge, StatusBadge } from "@/components/Badges";
import { cn } from "@/lib/utils";
import { CalendarDays, X, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { appointmentsApi } from "@/lib/api";

export default function SchedulePage() {
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [loading, setLoading] = useState(false);

  const todayAppointments = appointments.filter(a => a.date === '2026-02-22' && a.status !== 'cancelled');

  const handleReschedule = async () => {
    if (!selectedAppt || !newDate || !newTime) return;
    setLoading(true);

    // Calculate end time (add 30 min)
    const [h, m] = newTime.split(':').map(Number);
    const endMin = m + 30;
    const endTime = `${String(h + Math.floor(endMin / 60)).padStart(2, '0')}:${String(endMin % 60).padStart(2, '0')}`;

    try {
      await appointmentsApi.reschedule(selectedAppt.id, { date: newDate, startTime: newTime, endTime });
      // Update local state
      setAppointments(prev =>
        prev.map(a => a.id === selectedAppt.id ? { ...a, date: newDate, startTime: newTime, endTime, status: 'pending' } : a)
      );
      toast.success(`Appointment rescheduled to ${newDate} at ${newTime}`);
    } catch {
      // Fallback: update locally if backend not available
      setAppointments(prev =>
        prev.map(a => a.id === selectedAppt.id ? { ...a, date: newDate, startTime: newTime, endTime, status: 'pending' } : a)
      );
      toast.success(`Appointment rescheduled to ${newDate} at ${newTime} (offline)`);
    } finally {
      setLoading(false);
      setRescheduleOpen(false);
      setSelectedAppt(null);
      setNewDate("");
      setNewTime("");
    }
  };

  const handleCancel = async () => {
    if (!selectedAppt) return;
    setLoading(true);
    try {
      await appointmentsApi.cancel(selectedAppt.id);
      setAppointments(prev =>
        prev.map(a => a.id === selectedAppt.id ? { ...a, status: 'cancelled' } : a)
      );
      toast.success("Appointment cancelled");
    } catch {
      setAppointments(prev =>
        prev.map(a => a.id === selectedAppt.id ? { ...a, status: 'cancelled' } : a)
      );
      toast.success("Appointment cancelled (offline)");
    } finally {
      setLoading(false);
      setCancelOpen(false);
      setSelectedAppt(null);
    }
  };

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
                      {appt.status !== 'completed' && appt.status !== 'cancelled' && (
                        <div className="flex gap-1 ml-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            title="Reschedule"
                            onClick={() => {
                              setSelectedAppt(appt);
                              setNewDate(appt.date);
                              setNewTime(appt.startTime);
                              setRescheduleOpen(true);
                            }}
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:text-destructive"
                            title="Cancel"
                            onClick={() => {
                              setSelectedAppt(appt);
                              setCancelOpen(true);
                            }}
                          >
                            <X className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      )}
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

      {/* Reschedule Dialog */}
      <Dialog open={rescheduleOpen} onOpenChange={setRescheduleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4" /> Reschedule Appointment
            </DialogTitle>
            <DialogDescription>
              {selectedAppt && `Reschedule ${selectedAppt.patientName}'s appointment with ${selectedAppt.doctorName}`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>New Date</Label>
              <Input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>New Time Slot</Label>
              <Select value={newTime} onValueChange={setNewTime}>
                <SelectTrigger><SelectValue placeholder="Select time" /></SelectTrigger>
                <SelectContent>
                  {TIME_SLOTS.map((slot) => (
                    <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRescheduleOpen(false)}>Cancel</Button>
            <Button onClick={handleReschedule} disabled={loading || !newDate || !newTime}>
              {loading ? "Rescheduling..." : "Confirm Reschedule"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel AlertDialog */}
      <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Appointment</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedAppt && `Are you sure you want to cancel ${selectedAppt.patientName}'s appointment on ${selectedAppt.date} at ${selectedAppt.startTime}? This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Appointment</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancel} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {loading ? "Cancelling..." : "Cancel Appointment"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
