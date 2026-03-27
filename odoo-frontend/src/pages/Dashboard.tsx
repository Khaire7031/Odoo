import { useAuth } from "@/contexts/AuthContext";
import { BarChart3, Users, TrendingUp, Activity } from "lucide-react";

const stats = [
  { label: "Total Users", value: "2,847", icon: Users, change: "+12%" },
  { label: "Revenue", value: "$48.2K", icon: TrendingUp, change: "+8.1%" },
  { label: "Active Sessions", value: "1,024", icon: Activity, change: "+3.2%" },
  { label: "Conversion", value: "4.6%", icon: BarChart3, change: "+0.4%" },
];

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="pt-24 pb-16">
      <div className="container">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back, {user?.email}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up">
          {stats.map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-lg p-5 card-hover">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">{s.label}</span>
                <s.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-accent mt-1">{s.change} from last month</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
