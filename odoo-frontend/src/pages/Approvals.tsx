import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import StatusBadge from "@/components/StatusBadge";
import { useExpenses } from "@/contexts/ExpenseContext";
import { useCompany } from "@/contexts/CompanyContext";
import { type Expense } from "@/data/mockData";
import { CheckCircle, XCircle, MessageSquare, ArrowRight, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Approvals = () => {
  const { expenses, processApproval } = useExpenses();
  const { config } = useCompany();
  const [commentModal, setCommentModal] = useState<{ open: boolean; expenseId: string; action: "approve" | "reject" }>({
    open: false, expenseId: "", action: "approve",
  });
  const [comment, setComment] = useState("");
  const [detailExpense, setDetailExpense] = useState<Expense | null>(null);
  const { toast } = useToast();

  // Show expenses that are waiting and have a pending step
  const pendingExpenses = expenses.filter((e) =>
    e.status === "waiting" && e.approvalSteps.some((s) => s.status === "pending")
  );

  const handleAction = () => {
    // Find the current pending approver for this expense
    const exp = expenses.find((e) => e.id === commentModal.expenseId);
    const pendingStep = exp?.approvalSteps.find((s) => s.status === "pending");
    if (!pendingStep) return;

    processApproval(commentModal.expenseId, pendingStep.approverId, commentModal.action, comment, config);

    toast({
      title: commentModal.action === "approve" ? "Expense Approved" : "Expense Rejected",
      description: `${commentModal.expenseId} has been ${commentModal.action === "approve" ? "approved" : "rejected"} by ${pendingStep.approverRole}.`,
    });
    setCommentModal({ open: false, expenseId: "", action: "approve" });
    setComment("");
  };

  const openModal = (id: string, action: "approve" | "reject") => {
    setCommentModal({ open: true, expenseId: id, action });
    setComment("");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Approvals</h1>
        <p className="text-muted-foreground">Review and manage expense requests through the approval flow</p>
      </div>

      {/* Approval Flow Overview */}
      <Card>
        <CardContent className="py-4">
          <p className="text-xs font-medium text-muted-foreground mb-3">Company Approval Sequence</p>
          <div className="flex items-center gap-2 text-sm flex-wrap">
            <div className="flex items-center gap-1">
              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">📝</div>
              <span className="text-muted-foreground">Submitted</span>
            </div>
            {config.approvalSequence.map((step, i) => (
              <div key={i} className="flex items-center gap-1">
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground">{step.stepNumber}</div>
                <span className="font-medium">{step.role}</span>
                <span className="text-xs text-muted-foreground">({step.approverName})</span>
              </div>
            ))}
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <span className="text-green-600 font-medium">✅ Done</span>
          </div>

          {/* Rule explanation */}
          <div className="mt-3 bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground flex items-start gap-2">
            <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
            <div>
              <strong>Active Rule ({config.approvalRule.type}):</strong>{" "}
              {config.approvalRule.type === "percentage" && `Expense auto-approves when ${config.approvalRule.minPercentage}% of approvers approve.`}
              {config.approvalRule.type === "specific_approver" && `Expense auto-approves when ${config.approvalRule.specificApproverName} approves.`}
              {config.approvalRule.type === "hybrid" && `Expense auto-approves when either ${config.approvalRule.minPercentage}% of approvers approve OR ${config.approvalRule.specificApproverName} approves.`}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pending Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Pending Requests <span className="text-sm font-normal text-muted-foreground ml-2">({pendingExpenses.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingExpenses.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>All caught up! No pending approvals.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Current Step</TableHead>
                  <TableHead>Progress</TableHead>
                  {/* <TableHead className="text-right">Actions</TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingExpenses.map((exp) => {
                  const currentStep = exp.approvalSteps.find((s) => s.status === "pending");
                  const completedSteps = exp.approvalSteps.filter((s) => s.status === "approved").length;
                  return (
                    <TableRow key={exp.id}>
                      <TableCell className="font-mono text-xs">{exp.id}</TableCell>
                      <TableCell>{exp.employeeName}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{exp.description}</TableCell>
                      <TableCell>
                        <div>
                          <span className="font-semibold">{exp.currency} {exp.amount.toFixed(2)}</span>
                          {exp.convertedAmount && exp.baseCurrency && (
                            <p className="text-xs text-muted-foreground">≈ {exp.baseCurrency} {exp.convertedAmount.toFixed(2)}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                          Step {currentStep?.stepNumber}: {currentStep?.approverRole}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-0.5">
                          {exp.approvalSteps.map((s, i) => (
                            <div key={i} className={`h-2 w-6 rounded-full ${s.status === "approved" ? "bg-green-500" :
                              s.status === "pending" ? "bg-yellow-500 animate-pulse" :
                                "bg-muted"
                              }`} />
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{completedSteps}/{exp.approvalSteps.length}</p>
                      </TableCell>
                      {/* <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          <Button size="sm" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50" onClick={() => openModal(exp.id, "approve")}>
                            <CheckCircle className="h-3 w-3 mr-1" /> Approve
                          </Button>
                          <Button size="sm" variant="outline" className="text-destructive border-red-200 hover:bg-red-50" onClick={() => openModal(exp.id, "reject")}>
                            <XCircle className="h-3 w-3 mr-1" /> Reject
                          </Button>
                        </div>
                      </TableCell> */}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* All Expenses */}
      <Card>
        <CardHeader><CardTitle className="text-lg">All Expenses</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((exp) => (
                <TableRow key={exp.id}>
                  <TableCell className="font-mono text-xs">{exp.id}</TableCell>
                  <TableCell>{exp.employeeName}</TableCell>
                  <TableCell>{exp.description}</TableCell>
                  <TableCell className="font-semibold">{exp.currency} {exp.amount.toFixed(2)}</TableCell>
                  <TableCell><StatusBadge status={exp.status} /></TableCell>
                  <TableCell>
                    <Button size="sm" variant="ghost" onClick={() => setDetailExpense(exp)}>View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Modal with Timeline */}
      <Dialog open={!!detailExpense} onOpenChange={(o) => !o && setDetailExpense(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Expense {detailExpense?.id}</DialogTitle>
          </DialogHeader>
          {detailExpense && (
            <div className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Employee:</span><p className="font-medium">{detailExpense.employeeName}</p></div>
                <div><span className="text-muted-foreground">Category:</span><p className="font-medium">{detailExpense.category}</p></div>
                <div>
                  <span className="text-muted-foreground">Amount:</span>
                  <p className="font-medium">{detailExpense.currency} {detailExpense.amount.toFixed(2)}</p>
                  {detailExpense.convertedAmount && detailExpense.baseCurrency && (
                    <p className="text-xs text-blue-600">≈ {detailExpense.baseCurrency} {detailExpense.convertedAmount.toFixed(2)}</p>
                  )}
                </div>
                <div><span className="text-muted-foreground">Status:</span><div className="mt-0.5"><StatusBadge status={detailExpense.status} /></div></div>
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
                          }`}>{step.stepNumber}</div>
                        {i < detailExpense.approvalSteps.length - 1 && (
                          <div className={`w-0.5 h-8 ${step.status === "approved" ? "bg-green-300" :
                            step.status === "rejected" ? "bg-red-300" : "bg-muted"
                            }`} />
                        )}
                      </div>
                      <div className="pb-4">
                        <p className="text-sm font-medium">{step.approverRole} — {step.approverName}</p>
                        <p className={`text-xs capitalize ${step.status === "approved" ? "text-green-600" :
                          step.status === "rejected" ? "text-red-600" :
                            step.status === "pending" ? "text-yellow-600" : "text-muted-foreground"
                          }`}>
                          {step.status === "pending" ? "⏳ Awaiting action" :
                            step.status === "waiting" ? "⏸ Waiting" :
                              step.status === "skipped" ? "⏭ Skipped" :
                                step.status === "approved" ? `✅ Approved${step.actionDate ? ` on ${step.actionDate}` : ""}` :
                                  `❌ Rejected${step.actionDate ? ` on ${step.actionDate}` : ""}`}
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

      {/* Comment Modal */}
      <Dialog open={commentModal.open} onOpenChange={(o) => setCommentModal({ ...commentModal, open: o })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              {commentModal.action === "approve" ? "Approve" : "Reject"} Expense
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <p className="text-sm text-muted-foreground">
              You are about to <strong>{commentModal.action}</strong> expense <strong>{commentModal.expenseId}</strong>.
            </p>
            {commentModal.action === "approve" && config.approvalRule.type !== "percentage" && (
              <div className="bg-blue-50 border border-blue-200 rounded p-2 text-xs text-blue-700">
                💡 If approval rules are satisfied, remaining steps may be auto-skipped.
              </div>
            )}
            <Textarea placeholder="Add a comment (optional)..." value={comment} onChange={(e) => setComment(e.target.value)} />
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setCommentModal({ ...commentModal, open: false })}>Cancel</Button>
              <Button
                className={`flex-1 ${commentModal.action === "reject" ? "bg-destructive hover:bg-destructive/90" : ""}`}
                onClick={handleAction}
              >
                {commentModal.action === "approve" ? "Approve" : "Reject"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Approvals;
