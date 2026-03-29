import type { UserRole } from "@/contexts/AuthContext";

export type ExpenseStatus = "draft" | "waiting" | "approved" | "rejected" | "auto_approved";

export interface ApprovalStep {
  stepNumber: number;
  approverRole: string;
  approverName: string;
  approverId: string;
  status: "pending" | "approved" | "rejected" | "waiting" | "skipped";
  comment?: string;
  actionDate?: string;
}

export interface Expense {
  id: string;
  rawId?: number;
  employeeName: string;
  employeeEmail: string;
  amount: number;
  currency: string;
  convertedAmount?: number;
  baseCurrency?: string;
  category: string;
  description: string;
  date: string;
  status: ExpenseStatus;
  receipt?: string;
  approvalSteps: ApprovalStep[];
  autoApproveReason?: string;
}

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  managerId?: string;
  managerName?: string;
  createdAt: string;
}

export interface ApprovalSequenceStep {
  stepNumber: number;
  role: string;
  approverId: string;
  approverName: string;
}

export type ApprovalRuleType = "percentage" | "specific_approver" | "hybrid";

export interface ApprovalRule {
  type: ApprovalRuleType;
  minPercentage?: number;
  specificApproverId?: string;
  specificApproverName?: string;
}

export interface CompanyConfig {
  companyName: string;
  country: string;
  baseCurrency: string;
  approvalSequence: ApprovalSequenceStep[];
  approvalRule: ApprovalRule;
}

export const expenseCategories = ["Travel", "Meals", "Equipment", "Office Supplies", "Software", "Training", "Other"];
export const currencies = ["USD", "EUR", "GBP", "INR", "CAD", "AUD", "JPY", "CHF", "SGD", "AED"];
