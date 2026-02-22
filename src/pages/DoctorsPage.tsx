import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_DOCTORS, MOCK_APPOINTMENTS } from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";

export default function DoctorsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Doctors</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage doctors and their availability</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MOCK_DOCTORS.map((doctor) => {
          const appts = MOCK_APPOINTMENTS.filter(a => a.doctorId === doctor.id);
          const todayAppts = appts.filter(a => a.date === '2026-02-22');
          const completed = appts.filter(a => a.status === 'completed').length;

          return (
            <Card key={doctor.id} className="glass-card hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                    {doctor.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{doctor.name}</p>
                    <Badge variant="secondary" className="text-[10px] mt-0.5">{doctor.specialization}</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-muted/50 rounded-lg p-2.5">
                    <p className="text-lg font-bold">{todayAppts.length}</p>
                    <p className="text-[10px] text-muted-foreground">Today</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-2.5">
                    <p className="text-lg font-bold">{doctor.avgConsultationTime}m</p>
                    <p className="text-[10px] text-muted-foreground">Avg Time</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-2.5">
                    <p className="text-lg font-bold">{completed}</p>
                    <p className="text-[10px] text-muted-foreground">Done</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
