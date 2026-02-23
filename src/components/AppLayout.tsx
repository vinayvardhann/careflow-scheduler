import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarPlus,
  CalendarDays,
  Users,
  BarChart3,
  Heart,
  Sun,
  Moon,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/ThemeProvider";

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/book", label: "Book Appointment", icon: CalendarPlus },
  { path: "/schedule", label: "Schedule", icon: CalendarDays },
  { path: "/doctors", label: "Doctors", icon: Users },
  { path: "/analytics", label: "Analytics", icon: BarChart3 },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  const themeOptions = [
    { value: "light" as const, icon: Sun, label: "Light" },
    { value: "dark" as const, icon: Moon, label: "Dark" },
    { value: "eye-comfort" as const, icon: Eye, label: "Eye Comfort" },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col border-r border-sidebar-border shrink-0">
        <div className="p-6 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-sidebar-primary flex items-center justify-center">
            <Heart className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-sidebar-primary-foreground">MedSchedule</h1>
            <p className="text-xs text-sidebar-foreground/60">Healthcare Coordinator</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-2 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 mb-2">
          <p className="text-xs font-medium text-sidebar-foreground/50 px-3 mb-2">Theme</p>
          <div className="flex gap-1">
            {themeOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setTheme(opt.value)}
                className={cn(
                  "flex-1 flex flex-col items-center gap-1 py-2 rounded-lg text-xs transition-colors",
                  theme === opt.value
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <opt.icon className="w-4 h-4" />
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 mx-3 mb-4 rounded-lg bg-sidebar-accent">
          <p className="text-xs font-medium text-sidebar-accent-foreground">Priority Queue Active</p>
          <p className="text-xs text-sidebar-foreground/50 mt-1">3 emergency cases in queue</p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
