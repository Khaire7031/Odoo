import { useAuth } from "@/contexts/AuthContext";
import { useExpenses } from "@/contexts/ExpenseContext";
import { useCompany } from "@/contexts/CompanyContext";
import { DollarSign, Clock, CheckCircle, XCircle, TrendingUp, Receipt, Zap, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatusBadge from "@/components/StatusBadge";

const Dashboard = () => {
  const { user } = useAuth();
  const { expenses } = useExpenses();
  const { config } = useCompany();

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const waiting = expenses.filter((e) => e.status === "waiting");
  const approved = expenses.filter((e) => e.status === "approved" || e.status === "auto_approved");
  const rejected = expenses.filter((e) => e.status === "rejected");

  const stats = [
    { label: "Total Expenses", value: `${config.baseCurrency} ${totalExpenses.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, icon: DollarSign, color: "text-primary" },
    { label: "Waiting Approval", value: waiting.length.toString(), icon: Clock, color: "text-yellow-600" },
    { label: "Approved", value: approved.length.toString(), icon: CheckCircle, color: "text-green-600" },
    { label: "Rejected", value: rejected.length.toString(), icon: XCircle, color: "text-destructive" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, {user?.name} — <span className="capitalize">{user?.role}</span>
        </p>
      </div>

      {/* Company Info */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="py-3 flex items-center gap-4 flex-wrap text-sm">
          <span className="flex items-center gap-1.5 font-medium"><Globe className="h-4 w-4 text-primary" />{config.companyName}</span>
          <span className="text-muted-foreground">|</span>
          <span className="text-muted-foreground">{config.country}</span>
          <span className="text-muted-foreground">|</span>
          <span className="font-medium">Base Currency: <span className="text-primary">{config.baseCurrency}</span></span>
          <span className="text-muted-foreground">|</span>
          <span className="flex items-center gap-1 text-muted-foreground">
            <Zap className="h-3.5 w-3.5" />
            Rule: <span className="capitalize font-medium text-foreground">{config.approvalRule.type.replace("_", " ")}</span>
          </span>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
              <s.icon className={`h-4 w-4 ${s.color}`} />
            </CardHeader>
            <CardContent><p className="text-2xl font-bold">{s.value}</p></CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Expenses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg"><Receipt className="h-5 w-5" /> Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {expenses.slice(0, 5).map((exp) => (
              <div key={exp.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium">{exp.description}</p>
                  <p className="text-xs text-muted-foreground">{exp.employeeName} · {exp.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{exp.currency} {exp.amount.toFixed(2)}</p>
                  <StatusBadge status={exp.status} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg"><TrendingUp className="h-5 w-5" /> Spending by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {["Travel", "Meals", "Equipment", "Software", "Office Supplies"].map((cat) => {
              const catTotal = expenses.filter((e) => e.category === cat).reduce((s, e) => s + e.amount, 0);
              const pct = totalExpenses > 0 ? (catTotal / totalExpenses) * 100 : 0;
              return (
                <div key={cat} className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>{cat}</span>
                    <span className="font-medium">{config.baseCurrency} {catTotal.toFixed(0)}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg">Approval Rate</CardTitle></CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="relative h-32 w-32">
              <svg className="h-32 w-32 -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="hsl(var(--muted))" strokeWidth="12" />
                <circle cx="60" cy="60" r="52" fill="none" stroke="hsl(var(--primary))" strokeWidth="12"
                  strokeDasharray={`${(approved.length / Math.max(expenses.length, 1)) * 327} 327`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">{Math.round((approved.length / Math.max(expenses.length, 1)) * 100)}%</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-3">{approved.length} of {expenses.length} approved</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
