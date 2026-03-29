import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { type Expense, type ApprovalStep, type CompanyConfig } from "@/data/mockData";
import expenseService from "@/services/expenseService";

interface ExpenseContextType {
  expenses: Expense[];
  addExpense: (expense: Expense) => void;
  processApproval: (expenseId: string, approverId: string, action: "approve" | "reject", comment: string, config: CompanyConfig) => void;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

function evaluateApprovalRules(steps: ApprovalStep[], config: CompanyConfig, approverId: string): { autoApprove: boolean; reason: string } {
  const rule = config.approvalRule;
  const approvedCount = steps.filter((s) => s.status === "approved").length;
  const totalSteps = steps.length;
  const pct = totalSteps > 0 ? (approvedCount / totalSteps) * 100 : 0;

  if (rule.type === "percentage" && rule.minPercentage) {
    if (pct >= rule.minPercentage) {
      return { autoApprove: true, reason: `Auto-approved: ${Math.round(pct)}% approval threshold reached (${approvedCount}/${totalSteps} approvers)` };
    }
  }

  if (rule.type === "specific_approver" && rule.specificApproverId) {
    const specificStep = steps.find((s) => s.approverId === rule.specificApproverId);
    if (specificStep?.status === "approved") {
      return { autoApprove: true, reason: `Auto-approved: ${rule.specificApproverName || "Specific approver"} approved` };
    }
  }

  if (rule.type === "hybrid") {
    if (rule.minPercentage && pct >= rule.minPercentage) {
      return { autoApprove: true, reason: `Auto-approved: ${Math.round(pct)}% approval threshold reached (${approvedCount}/${totalSteps} approvers)` };
    }
    if (rule.specificApproverId) {
      const specificStep = steps.find((s) => s.approverId === rule.specificApproverId);
      if (specificStep?.status === "approved") {
        return { autoApprove: true, reason: `Auto-approved: ${rule.specificApproverName || "Specific approver"} approved` };
      }
    }
  }

  return { autoApprove: false, reason: "" };
}

export const ExpenseProvider = ({ children }: { children: ReactNode }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    expenseService.getAll(123).then((mockExpenses) => {
      setExpenses(mockExpenses);
    });
  }, []);

  const addExpense = useCallback((expense: Expense) => {
    setExpenses((prev) => [expense, ...prev]);
  }, []);

  const processApproval = useCallback((expenseId: string, approverId: string, action: "approve" | "reject", comment: string, config: CompanyConfig) => {
    setExpenses((prev) =>
      prev.map((exp) => {
        if (exp.id !== expenseId) return exp;

        const updatedSteps = exp.approvalSteps.map((step) => {
          if (step.approverId === approverId && step.status === "pending") {
            return { ...step, status: action === "approve" ? "approved" as const : "rejected" as const, comment: comment || undefined, actionDate: new Date().toISOString().split("T")[0] };
          }
          return step;
        });

        if (action === "reject") {
          // Mark all subsequent waiting steps as skipped
          const rejectedIdx = updatedSteps.findIndex((s) => s.approverId === approverId);
          const finalSteps = updatedSteps.map((s, i) => i > rejectedIdx && s.status === "waiting" ? { ...s, status: "skipped" as const } : s);
          return { ...exp, status: "rejected" as const, approvalSteps: finalSteps };
        }

        // Check auto-approval rules
        const { autoApprove, reason } = evaluateApprovalRules(updatedSteps, config, approverId);

        if (autoApprove) {
          const finalSteps = updatedSteps.map((s) => s.status === "waiting" ? { ...s, status: "skipped" as const } : s);
          return { ...exp, status: "auto_approved" as const, approvalSteps: finalSteps, autoApproveReason: reason };
        }

        // Activate next waiting step
        const nextWaiting = updatedSteps.findIndex((s) => s.status === "waiting");
        if (nextWaiting !== -1) {
          updatedSteps[nextWaiting] = { ...updatedSteps[nextWaiting], status: "pending" };
          return { ...exp, approvalSteps: updatedSteps };
        }

        // All steps done
        const allApproved = updatedSteps.every((s) => s.status === "approved" || s.status === "skipped");
        return { ...exp, status: allApproved ? "approved" as const : "rejected" as const, approvalSteps: updatedSteps };
      })
    );
  }, []);

  return (
    <ExpenseContext.Provider value={{ expenses, addExpense, processApproval }}>
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => {
  const ctx = useContext(ExpenseContext);
  if (!ctx) throw new Error("useExpenses must be used within ExpenseProvider");
  return ctx;
};
