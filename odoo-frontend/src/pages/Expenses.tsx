import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import StatusBadge from "@/components/StatusBadge";
import { useExpenses } from "@/contexts/ExpenseContext";
import { useCompany } from "@/contexts/CompanyContext";
import { expenseCategories, currencies, type Expense } from "@/data/types";
import { Plus, Upload, Receipt, ArrowRight, RefreshCw, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const Expenses = () => {
  const { expenses, addExpense } = useExpenses();
  const { config } = useCompany();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ amount: "", currency: config.baseCurrency, category: "", description: "", date: "" });
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [converting, setConverting] = useState(false);
  const [detailExpense, setDetailExpense] = useState<Expense | null>(null);
  const { toast } = useToast();

  const myExpenses = expenses;

  const fetchConversion = async (amount: string, fromCurrency: string) => {
    if (!amount || !fromCurrency || fromCurrency === config.baseCurrency) {
      setConvertedAmount(null);
      return;
    }
    setConverting(true);
    try {
      const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
      const data = await res.json();
      const rate = data.rates?.[config.baseCurrency];
      if (rate) {
        setConvertedAmount(parseFloat(amount) * rate);
      }
    } catch {
      setConvertedAmount(null);
    } finally {
      setConverting(false);
    }
  };

  const handleCurrencyOrAmountChange = (newAmount: string, newCurrency: string) => {
    setForm((f) => ({ ...f, amount: newAmount, currency: newCurrency }));
    if (newAmount && newCurrency !== config.baseCurrency) {
      fetchConversion(newAmount, newCurrency);
    } else {
      setConvertedAmount(null);
    }
  };

  const handleSubmit = () => {
    if (!form.amount || !form.category || !form.description || !form.date) {
      toast({ title: "Validation Error", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }

    const newExpense: Expense = {
      id: "pending",
      employeeName: user?.name || "You",
      employeeEmail: user?.email || "",
      amount: parseFloat(form.amount),
      currency: form.currency,
      convertedAmount: convertedAmount ?? undefined,
      baseCurrency: form.currency !== config.baseCurrency ? config.baseCurrency : undefined,
      category: form.category,
      description: form.description,
      date: form.date,
      status: "waiting",
      approvalSteps: [],
    };
    addExpense(newExpense);
    setForm({ amount: "", currency: config.baseCurrency, category: "", description: "", date: "" });
    setConvertedAmount(null);
    setOpen(false);
    toast({ title: "Expense Submitted", description: "Your expense is now waiting for approval." });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Expenses</h1>
          <p className="text-muted-foreground">Submit and track your reimbursement requests</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" /> New Expense</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Submit New Expense</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Amount *</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={form.amount}
                    onChange={(e) => handleCurrencyOrAmountChange(e.target.value, form.currency)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select value={form.currency} onValueChange={(v) => handleCurrencyOrAmountChange(form.amount, v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{currencies.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>

              {form.currency !== config.baseCurrency && form.amount && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-1">
                  <div className="flex items-center gap-1.5 text-blue-700 text-sm font-medium">
                    <RefreshCw className={`h-3.5 w-3.5 ${converting ? "animate-spin" : ""}`} />
                    Currency Conversion
                  </div>
                  <p className="text-sm">
                    <span className="font-semibold">{form.amount} {form.currency}</span>
                    <span className="mx-1.5">→</span>
                    <span className="font-semibold">
                      {converting ? "..." : convertedAmount !== null ? `${convertedAmount.toFixed(2)} ${config.baseCurrency}` : "N/A"}
                    </span>
                  </p>
                  <p className="text-xs text-blue-600 flex items-center gap-1">
                    <Info className="h-3 w-3" />
                    Converted to company currency using real-time exchange rates
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label>Category *</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>{expenseCategories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Description *</Label>
                <Textarea placeholder="Describe the expense..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Date *</Label>
                <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Receipt (optional)</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Click to upload or drag & drop</p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG, PDF up to 10MB</p>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs font-medium text-muted-foreground mb-2">Approval Flow Preview</p>
                <div className="flex items-center gap-1 flex-wrap text-xs">
                  <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">Draft</span>
                  {config.approvalSequence.map((s, i) => (
                    <span key={i} className="flex items-center gap-1">
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      <span className="bg-muted px-2 py-0.5 rounded-full">{s.role}</span>
                    </span>
                  ))}
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Approved</span>
                </div>
              </div>

              <Button className="w-full" onClick={handleSubmit}>Submit Expense</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg"><Receipt className="h-5 w-5" /> Expense History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myExpenses.map((exp) => (
                <TableRow key={exp.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setDetailExpense(exp)}>
                  <TableCell className="font-mono text-xs">{exp.id}</TableCell>
                  <TableCell>{exp.description}</TableCell>
                  <TableCell>{exp.category}</TableCell>
                  <TableCell>
                    <div>
                      <span className="font-semibold">{exp.currency} {exp.amount.toFixed(2)}</span>
                      {exp.convertedAmount && exp.baseCurrency && (
                        <p className="text-xs text-muted-foreground">≈ {exp.baseCurrency} {exp.convertedAmount.toFixed(2)}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{exp.date}</TableCell>
                  <TableCell><StatusBadge status={exp.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!detailExpense} onOpenChange={(o) => !o && setDetailExpense(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Expense {detailExpense?.id}</DialogTitle>
          </DialogHeader>
          {detailExpense && (
            <div className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Description:</span> <p className="font-medium">{detailExpense.description}</p></div>
                <div><span className="text-muted-foreground">Category:</span> <p className="font-medium">{detailExpense.category}</p></div>
                <div>
                  <span className="text-muted-foreground">Amount:</span>
                  <p className="font-medium">{detailExpense.currency} {detailExpense.amount.toFixed(2)}</p>
                  {detailExpense.convertedAmount && detailExpense.baseCurrency && (
                    <p className="text-xs text-blue-600">≈ {detailExpense.baseCurrency} {detailExpense.convertedAmount.toFixed(2)}</p>
                  )}
                </div>
                <div><span className="text-muted-foreground">Status:</span> <div className="mt-0.5"><StatusBadge status={detailExpense.status} /></div></div>
              </div>

              {detailExpense.autoApproveReason && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-sm text-emerald-700 font-medium">
                  ⚡ {detailExpense.autoApproveReason}
                </div>
              )}

              <div>
                <p className="text-sm font-medium mb-3">Approval Timeline</p>
                <div className="space-y-0">
                  {detailExpense.approvalSteps.map((step, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${step.status === "approved" ? "bg-green-500 text-white" :
                          step.status === "rejected" ? "bg-red-500 text-white" :
                            step.status === "pending" ? "bg-yellow-500 text-white animate-pulse" :
                              step.status === "skipped" ? "bg-gray-300 text-gray-500" :
                                "bg-muted text-muted-foreground"
                          }`}>
                          {step.stepNumber}
                        </div>
                        {i < detailExpense.approvalSteps.length - 1 && (
                          <div className={`w-0.5 h-8 ${step.status === "approved" ? "bg-green-300" :
                            step.status === "rejected" ? "bg-red-300" :
                              "bg-muted"
                            }`} />
                        )}
                      </div>
                      <div className="pb-4">
                        <p className="text-sm font-medium">{step.approverRole} — {step.approverName}</p>
                        <p className={`text-xs capitalize ${step.status === "approved" ? "text-green-600" :
                          step.status === "rejected" ? "text-red-600" :
                            step.status === "pending" ? "text-yellow-600" :
                              "text-muted-foreground"
                          }`}>
                          {step.status === "pending" ? "⏳ Awaiting action" :
                            step.status === "waiting" ? "⏸ Waiting" :
                              step.status === "skipped" ? "⏭ Skipped" :
                                step.status === "approved" ? `✅ Approved${step.actionDate ? ` on ${step.actionDate}` : ""}` :
                                  `❌ Rejected${step.actionDate ? ` on ${step.actionDate}` : ""}`
                          }
                        </p>
                        {step.comment && <p className="text-xs text-muted-foreground mt-0.5">"{step.comment}"</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Expenses;
