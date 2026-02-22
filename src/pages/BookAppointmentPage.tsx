import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MOCK_DOCTORS, TIME_SLOTS, type Priority } from "@/lib/mockData";
import { CalendarPlus, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function BookAppointmentPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success("Appointment booked! Priority scheduling applied.");
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Book Appointment</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Priority-based scheduling ensures urgent cases get the earliest slots.
        </p>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <CalendarPlus className="w-4 h-4 text-primary" />
            New Appointment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Patient Name</Label>
                <Input id="name" placeholder="Full name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input id="age" type="number" placeholder="Age" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Doctor</Label>
              <Select required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a doctor" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_DOCTORS.map((doc) => (
                    <SelectItem key={doc.id} value={doc.id}>
                      {doc.name} — {doc.specialization}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Preferred Date</Label>
                <Input id="date" type="date" required />
              </div>
              <div className="space-y-2">
                <Label>Time Slot</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_SLOTS.map((slot) => (
                      <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Priority Level</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="emergency">🔴 Emergency — Immediate attention</SelectItem>
                  <SelectItem value="high">🟠 High — Senior citizen / urgent</SelectItem>
                  <SelectItem value="medium">🟡 Medium — Follow-up required</SelectItem>
                  <SelectItem value="normal">🟢 Normal — Routine visit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Visit</Label>
              <Textarea id="reason" placeholder="Brief description of symptoms or reason..." />
            </div>

            <Button type="submit" className="w-full" disabled={submitted}>
              {submitted ? (
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Appointment Booked
                </span>
              ) : (
                "Book Appointment"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="glass-card border-primary/20 bg-accent/30">
        <CardContent className="p-4">
          <p className="text-xs font-medium text-accent-foreground">
            ⚡ Smart Scheduling Active
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Emergency patients are automatically assigned the earliest available slot. The system prevents double bookings and balances doctor workload.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
