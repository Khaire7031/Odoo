import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockUsers, type UserRecord, type ApprovalSequenceStep, type ApprovalRuleType } from "@/data/mockData";
import { useCompany } from "@/contexts/CompanyContext";
import type { UserRole } from "@/contexts/AuthContext";
import { UserPlus, Users, Shield, Settings2, ArrowUp, ArrowDown, Trash2, Plus, Info, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const roleBadge = (role: UserRole) => {
  const v = { admin: "destructive", manager: "default", employee: "secondary" } as const;
  return <Badge variant={v[role]} className="capitalize">{role}</Badge>;
};

const Admin = () => {
  const [users, setUsers] = useState<UserRecord[]>(mockUsers);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "employee" as UserRole, managerId: "" });
  const { config, setApprovalSequence, setApprovalRule } = useCompany();
  const [sequence, setSequence] = useState<ApprovalSequenceStep[]>(config.approvalSequence);
  const [ruleType, setRuleType] = useState<ApprovalRuleType>(config.approvalRule.type);
  const [rulePct, setRulePct] = useState(String(config.approvalRule.minPercentage || 67));
  const [ruleApproverId, setRuleApproverId] = useState(config.approvalRule.specificApproverId || "");
  const [newStepRole, setNewStepRole] = useState("");
  const [newStepApproverId, setNewStepApproverId] = useState("");
  const { toast } = useToast();

  const managers = users.filter((u) => u.role === "manager" || u.role === "admin");

  const handleCreate = () => {
    if (!form.name || !form.email) {
      toast({ title: "Validation Error", description: "Name and email are required.", variant: "destructive" });
      return;
    }
    const manager = managers.find((m) => m.id === form.managerId);
    const newUser: UserRecord = {
      id: `USR-${String(users.length + 1).padStart(3, "0")}`,
      name: form.name, email: form.email, role: form.role,
      managerId: form.managerId || undefined, managerName: manager?.name,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setUsers([...users, newUser]);
    setForm({ name: "", email: "", role: "employee", managerId: "" });
    setOpen(false);
    toast({ title: "User Created", description: `${newUser.name} has been added as ${newUser.role}.` });
  };

  const moveStep = (idx: number, dir: -1 | 1) => {
    const newSeq = [...sequence];
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= newSeq.length) return;
    [newSeq[idx], newSeq[swapIdx]] = [newSeq[swapIdx], newSeq[idx]];
    newSeq.forEach((s, i) => (s.stepNumber = i + 1));
    setSequence(newSeq);
  };

  const removeStep = (idx: number) => {
    const newSeq = sequence.filter((_, i) => i !== idx);
    newSeq.forEach((s, i) => (s.stepNumber = i + 1));
    setSequence(newSeq);
  };

  const addStep = () => {
    if (!newStepRole || !newStepApproverId) return;
    const approver = users.find((u) => u.id === newStepApproverId);
    const newStep: ApprovalSequenceStep = {
      stepNumber: sequence.length + 1,
      role: newStepRole,
      approverId: newStepApproverId,
      approverName: approver?.name || "",
    };
    setSequence([...sequence, newStep]);
    setNewStepRole("");
    setNewStepApproverId("");
  };

  const saveSequence = () => {
    setApprovalSequence(sequence);
    toast({ title: "Approval Sequence Saved", description: `${sequence.length} steps configured.` });
  };

  const saveRule = () => {
    const approver = users.find((u) => u.id === ruleApproverId);
    setApprovalRule({
      type: ruleType,
      minPercentage: ruleType !== "specific_approver" ? parseInt(rulePct) : undefined,
      specificApproverId: ruleType !== "percentage" ? ruleApproverId : undefined,
      specificApproverName: ruleType !== "percentage" ? approver?.name : undefined,
    });
    toast({ title: "Approval Rule Saved", description: `Rule type: ${ruleType}` });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <p className="text-muted-foreground">Manage users, approval flow, and rules</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><UserPlus className="h-4 w-4 mr-2" /> Create User</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader><DialogTitle>Create New User</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label>Full Name *</Label>
                <Input placeholder="User Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input type="email" placeholder="user@reimburseme.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v as UserRole })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employee">Employee</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {form.role === "employee" && (
                <div className="space-y-2">
                  <Label>Assign Manager</Label>
                  <Select value={form.managerId} onValueChange={(v) => setForm({ ...form, managerId: v })}>
                    <SelectTrigger><SelectValue placeholder="Select manager" /></SelectTrigger>
                    <SelectContent>
                      {managers.map((m) => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <Button className="w-full" onClick={handleCreate}>Create User</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Users", value: users.length, icon: Users },
          { label: "Managers", value: users.filter((u) => u.role === "manager").length, icon: Shield },
          { label: "Employees", value: users.filter((u) => u.role === "employee").length, icon: UserPlus },
        ].map((s) => (
          <Card key={s.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
              <s.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent><p className="text-2xl font-bold">{s.value}</p></CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="sequence">Approval Sequence</TabsTrigger>
          <TabsTrigger value="rules">Approval Rules</TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader><CardTitle className="text-lg">All Users</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Manager</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-mono text-xs">{u.id}</TableCell>
                      <TableCell className="font-medium">{u.name}</TableCell>
                      <TableCell className="text-muted-foreground">{u.email}</TableCell>
                      <TableCell>{roleBadge(u.role)}</TableCell>
                      <TableCell className="text-muted-foreground">{u.managerName || "—"}</TableCell>
                      <TableCell className="text-muted-foreground">{u.createdAt}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Approval Sequence Tab */}
        <TabsContent value="sequence">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg"><Settings2 className="h-5 w-5" /> Approval Sequence</CardTitle>
              <CardDescription>Define the order of approvers. Expenses flow through each step sequentially.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {sequence.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No steps configured. Add steps below.</p>
              ) : (
                <div className="space-y-2">
                  {sequence.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-muted/50 rounded-lg p-3 border">
                      <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-sm font-bold text-primary-foreground shrink-0">
                        {step.stepNumber}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{step.role}</p>
                        <p className="text-xs text-muted-foreground">{step.approverName}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => moveStep(idx, -1)} disabled={idx === 0}>
                          <ArrowUp className="h-3.5 w-3.5" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => moveStep(idx, 1)} disabled={idx === sequence.length - 1}>
                          <ArrowDown className="h-3.5 w-3.5" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => removeStep(idx)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Step */}
              <div className="flex gap-2 items-end">
                <div className="space-y-1 flex-1">
                  <Label className="text-xs">Role Label</Label>
                  <Input placeholder="e.g. Finance" value={newStepRole} onChange={(e) => setNewStepRole(e.target.value)} />
                </div>
                <div className="space-y-1 flex-1">
                  <Label className="text-xs">Approver</Label>
                  <Select value={newStepApproverId} onValueChange={setNewStepApproverId}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {managers.map((m) => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={addStep} disabled={!newStepRole || !newStepApproverId}>
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>

              <Button className="w-full" onClick={saveSequence}>Save Sequence</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Approval Rules Tab */}
        <TabsContent value="rules">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg"><Zap className="h-5 w-5" /> Conditional Approval Rules</CardTitle>
              <CardDescription>Configure rules that can auto-approve expenses before completing all steps.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Rule Type</Label>
                <Select value={ruleType} onValueChange={(v) => setRuleType(v as ApprovalRuleType)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage-Based</SelectItem>
                    <SelectItem value="specific_approver">Specific Approver Override</SelectItem>
                    <SelectItem value="hybrid">Hybrid (Percentage OR Specific Approver)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Explanation */}
              <div className="bg-muted/50 rounded-lg p-3 text-xs space-y-2">
                <div className="flex items-start gap-2">
                  <Info className="h-3.5 w-3.5 mt-0.5 shrink-0 text-primary" />
                  <div>
                    {ruleType === "percentage" && (
                      <p>When the configured percentage of approvers approve the expense, it will be <strong>auto-approved</strong> and remaining steps will be skipped.</p>
                    )}
                    {ruleType === "specific_approver" && (
                      <p>When the specific approver (e.g., CFO) approves the expense, it will be <strong>immediately approved</strong> regardless of other steps.</p>
                    )}
                    {ruleType === "hybrid" && (
                      <p>The expense is auto-approved when <strong>either</strong> the percentage threshold is reached <strong>OR</strong> the specific approver approves — whichever comes first.</p>
                    )}
                  </div>
                </div>
              </div>

              {(ruleType === "percentage" || ruleType === "hybrid") && (
                <div className="space-y-2">
                  <Label>Minimum Approval Percentage (%)</Label>
                  <Input type="number" min="1" max="100" value={rulePct} onChange={(e) => setRulePct(e.target.value)} />
                  <p className="text-xs text-muted-foreground">
                    With {sequence.length} steps, {Math.ceil(sequence.length * parseInt(rulePct) / 100)} approvals needed
                  </p>
                </div>
              )}

              {(ruleType === "specific_approver" || ruleType === "hybrid") && (
                <div className="space-y-2">
                  <Label>Specific Approver</Label>
                  <Select value={ruleApproverId} onValueChange={setRuleApproverId}>
                    <SelectTrigger><SelectValue placeholder="Select approver" /></SelectTrigger>
                    <SelectContent>
                      {managers.map((m) => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Button className="w-full" onClick={saveRule}>Save Rule</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
