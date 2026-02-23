import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, LogIn, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { authApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  // Login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Register state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regRole, setRegRole] = useState("patient");
  const [regAge, setRegAge] = useState("");
  const [regPhone, setRegPhone] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userData = await authApi.login(email, password);
      login(userData);
      toast.success(`Welcome back, ${userData.name}!`);
    } catch (err: any) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userData = await authApi.register({
        name: regName,
        email: regEmail,
        password: regPassword,
        role: regRole,
        age: regAge ? parseInt(regAge) : undefined,
        phone: regPhone || undefined,
      });
      login(userData);
      toast.success(`Account created! Welcome, ${userData.name}!`);
    } catch (err: any) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6 animate-fade-in">
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto">
            <Heart className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">MedSchedule</h1>
          <p className="text-sm text-muted-foreground">Healthcare Appointment Coordinator</p>
        </div>

        <Card className="glass-card">
          <CardHeader className="pb-4">
            <div className="flex gap-2">
              <Button
                variant={isLogin ? "default" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => setIsLogin(true)}
              >
                <LogIn className="w-4 h-4 mr-1" /> Login
              </Button>
              <Button
                variant={!isLogin ? "default" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => setIsLogin(false)}
              >
                <UserPlus className="w-4 h-4 mr-1" /> Register
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLogin ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-name">Full Name</Label>
                  <Input id="reg-name" placeholder="Your name" value={regName} onChange={(e) => setRegName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-email">Email</Label>
                  <Input id="reg-email" type="email" placeholder="Your email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password">Password</Label>
                  <Input id="reg-password" type="password" placeholder="Create password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Select value={regRole} onValueChange={setRegRole}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="patient">Patient</SelectItem>
                        <SelectItem value="doctor">Doctor</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-age">Age</Label>
                    <Input id="reg-age" type="number" placeholder="Age" value={regAge} onChange={(e) => setRegAge(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-phone">Phone (optional)</Label>
                  <Input id="reg-phone" placeholder="Phone number" value={regPhone} onChange={(e) => setRegPhone(e.target.value)} />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Demo credentials */}
        <Card className="glass-card border-primary/20">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-accent-foreground mb-2">🔑 Demo Credentials</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p><span className="font-medium">Admin:</span> admin@medschedule.com / admin123</p>
              <p><span className="font-medium">Doctor:</span> sarah@doctor.com / doctor123</p>
              <p><span className="font-medium">Patient:</span> john@patient.com / patient123</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
