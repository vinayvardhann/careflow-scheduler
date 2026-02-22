import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_APPOINTMENTS, MOCK_STATS, MOCK_DOCTORS } from "@/lib/mockData";
import { PriorityBadge, StatusBadge } from "@/components/Badges";
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";

const statCards = [
  { label: "Today's Appointments", value: MOCK_STATS.todayAppointments, icon: CalendarDays, trend: "+3 from yesterday" },
  { label: "Avg Wait Time", value: `${MOCK_STATS.avgWaitTime} min`, icon: Clock, trend: "-2 min from last week" },
  { label: "Completion Rate", value: `${MOCK_STATS.completionRate}%`, icon: CheckCircle2, trend: "+1.2% this month" },
  { label: "Urgent Cases", value: 3, icon: AlertTriangle, trend: "2 assigned, 1 queued" },
];

export default function DashboardPage() {
  const todayAppointments = MOCK_APPOINTMENTS.filter(a => a.date === '2026-02-22');

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Sunday, February 22, 2026 — Overview of today's schedule
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label} className="glass-card">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <stat.icon className="w-5 h-5 text-primary" />
                <TrendingUp className="w-3.5 h-3.5 text-status-completed" />
              </div>
              <p className="text-2xl font-bold mt-3">{stat.value}</p>
              <p className="text-xs text-muted-foreground font-medium mt-0.5">{stat.label}</p>
              <p className="text-xs text-muted-foreground/70 mt-2">{stat.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's appointments */}
        <Card className="lg:col-span-2 glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Today's Appointments</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {todayAppointments.map((appt) => (
                <div key={appt.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-muted/40 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                      {appt.patientName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{appt.patientName}</p>
                      <p className="text-xs text-muted-foreground">{appt.doctorName} · {appt.startTime}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <PriorityBadge priority={appt.priority} />
                    <StatusBadge status={appt.status} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Doctor workload */}
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Doctor Workload</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {MOCK_DOCTORS.map((doc) => {
              const count = MOCK_APPOINTMENTS.filter(a => a.doctorId === doc.id && a.date === '2026-02-22').length;
              const load = (count / 6) * 100;
              return (
                <div key={doc.id} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                        {doc.avatar}
                      </div>
                      <div>
                        <p className="text-xs font-medium">{doc.name}</p>
                        <p className="text-[10px] text-muted-foreground">{doc.specialization}</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">{count}/6</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <div
                      className="bg-primary rounded-full h-1.5 transition-all"
                      style={{ width: `${Math.min(load, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
