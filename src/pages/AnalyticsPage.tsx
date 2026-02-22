import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_APPOINTMENTS, MOCK_DOCTORS } from "@/lib/mockData";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const priorityData = [
  { name: "Emergency", value: MOCK_APPOINTMENTS.filter(a => a.priority === 'emergency').length, color: "hsl(0, 72%, 51%)" },
  { name: "High", value: MOCK_APPOINTMENTS.filter(a => a.priority === 'high').length, color: "hsl(25, 95%, 53%)" },
  { name: "Medium", value: MOCK_APPOINTMENTS.filter(a => a.priority === 'medium').length, color: "hsl(45, 93%, 47%)" },
  { name: "Normal", value: MOCK_APPOINTMENTS.filter(a => a.priority === 'normal').length, color: "hsl(142, 71%, 45%)" },
];

const doctorLoadData = MOCK_DOCTORS.map(doc => ({
  name: doc.name.replace('Dr. ', ''),
  appointments: MOCK_APPOINTMENTS.filter(a => a.doctorId === doc.id).length,
}));

const weeklyData = [
  { day: "Mon", appointments: 18 },
  { day: "Tue", appointments: 22 },
  { day: "Wed", appointments: 15 },
  { day: "Thu", appointments: 28 },
  { day: "Fri", appointments: 24 },
  { day: "Sat", appointments: 10 },
  { day: "Sun", appointments: 8 },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">Appointment trends, workload distribution, and priority breakdown</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Weekly Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 15%, 89%)" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="appointments" fill="hsl(174, 62%, 38%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Priority Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-card lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Doctor Workload</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={doctorLoadData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 15%, 89%)" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="appointments" fill="hsl(174, 62%, 38%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
