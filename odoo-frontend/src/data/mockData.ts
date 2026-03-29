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

// Default company config
export const defaultCompanyConfig: CompanyConfig = {
  companyName: "Acme Corp",
  country: "United States",
  baseCurrency: "USD",
  approvalSequence: [
    { stepNumber: 1, role: "Manager", approverId: "USR-002", approverName: "Sarah Manager" },
    { stepNumber: 2, role: "Finance", approverId: "USR-006", approverName: "Frank Finance" },
    { stepNumber: 3, role: "Director", approverId: "USR-007", approverName: "Diana Director" },
  ],
  approvalRule: { type: "hybrid", minPercentage: 67, specificApproverId: "USR-007", specificApproverName: "Diana Director" },
};

export const mockExpenses: Expense[] = [
  {
    id: "EXP-001", employeeName: "Alice Johnson", employeeEmail: "alice@company.com",
    amount: 245.50, currency: "USD", category: "Travel",
    description: "Flight to client meeting in NYC", date: "2026-03-15", status: "approved",
    approvalSteps: [
      { stepNumber: 1, approverRole: "Manager", approverName: "Sarah Manager", approverId: "USR-002", status: "approved", comment: "Looks good", actionDate: "2026-03-16" },
      { stepNumber: 2, approverRole: "Finance", approverName: "Frank Finance", approverId: "USR-006", status: "approved", actionDate: "2026-03-17" },
      { stepNumber: 3, approverRole: "Director", approverName: "Diana Director", approverId: "USR-007", status: "skipped" },
    ],
    autoApproveReason: "Auto-approved: 67% approval threshold reached (2/3 approvers)",
  },
  {
    id: "EXP-002", employeeName: "Bob Smith", employeeEmail: "bob@company.com",
    amount: 89.00, currency: "EUR", convertedAmount: 96.12, baseCurrency: "USD",
    category: "Meals", description: "Team lunch with stakeholders", date: "2026-03-20", status: "waiting",
    approvalSteps: [
      { stepNumber: 1, approverRole: "Manager", approverName: "Sarah Manager", approverId: "USR-002", status: "pending" },
      { stepNumber: 2, approverRole: "Finance", approverName: "Frank Finance", approverId: "USR-006", status: "waiting" },
      { stepNumber: 3, approverRole: "Director", approverName: "Diana Director", approverId: "USR-007", status: "waiting" },
    ],
  },
  {
    id: "EXP-003", employeeName: "Carol Davis", employeeEmail: "carol@company.com",
    amount: 1200.00, currency: "GBP", convertedAmount: 1524.00, baseCurrency: "USD",
    category: "Equipment", description: "Ergonomic office chair", date: "2026-03-18", status: "waiting",
    approvalSteps: [
      { stepNumber: 1, approverRole: "Manager", approverName: "Sarah Manager", approverId: "USR-002", status: "approved", actionDate: "2026-03-19" },
      { stepNumber: 2, approverRole: "Finance", approverName: "Frank Finance", approverId: "USR-006", status: "pending" },
      { stepNumber: 3, approverRole: "Director", approverName: "Diana Director", approverId: "USR-007", status: "waiting" },
    ],
  },
  {
    id: "EXP-004", employeeName: "Alice Johnson", employeeEmail: "alice@company.com",
    amount: 55.00, currency: "USD", category: "Office Supplies",
    description: "Printer ink and paper", date: "2026-03-22", status: "rejected",
    approvalSteps: [
      { stepNumber: 1, approverRole: "Manager", approverName: "Sarah Manager", approverId: "USR-002", status: "rejected", comment: "Use company procurement portal", actionDate: "2026-03-23" },
      { stepNumber: 2, approverRole: "Finance", approverName: "Frank Finance", approverId: "USR-006", status: "skipped" },
      { stepNumber: 3, approverRole: "Director", approverName: "Diana Director", approverId: "USR-007", status: "skipped" },
    ],
  },
  {
    id: "EXP-005", employeeName: "Dan Lee", employeeEmail: "dan@company.com",
    amount: 320.00, currency: "INR", convertedAmount: 3.84, baseCurrency: "USD",
    category: "Travel", description: "Local transport for conference", date: "2026-03-25", status: "waiting",
    approvalSteps: [
      { stepNumber: 1, approverRole: "Manager", approverName: "Sarah Manager", approverId: "USR-002", status: "pending" },
      { stepNumber: 2, approverRole: "Finance", approverName: "Frank Finance", approverId: "USR-006", status: "waiting" },
      { stepNumber: 3, approverRole: "Director", approverName: "Diana Director", approverId: "USR-007", status: "waiting" },
    ],
  },
  {
    id: "EXP-006", employeeName: "Eve Martinez", employeeEmail: "eve@company.com",
    amount: 150.00, currency: "USD", category: "Software",
    description: "Annual Figma subscription", date: "2026-03-10", status: "approved",
    approvalSteps: [
      { stepNumber: 1, approverRole: "Manager", approverName: "Sarah Manager", approverId: "USR-002", status: "approved", actionDate: "2026-03-11" },
      { stepNumber: 2, approverRole: "Finance", approverName: "Frank Finance", approverId: "USR-006", status: "approved", actionDate: "2026-03-12" },
      { stepNumber: 3, approverRole: "Director", approverName: "Diana Director", approverId: "USR-007", status: "approved", actionDate: "2026-03-13" },
    ],
  },
];

export const mockUsers: UserRecord[] = [
  { id: "USR-001", name: "Admin User", email: "admin@company.com", role: "admin", createdAt: "2026-01-01" },
  { id: "USR-002", name: "Sarah Manager", email: "sarah@company.com", role: "manager", createdAt: "2026-01-10" },
  { id: "USR-003", name: "Alice Johnson", email: "alice@company.com", role: "employee", managerId: "USR-002", managerName: "Sarah Manager", createdAt: "2026-02-01" },
  { id: "USR-004", name: "Bob Smith", email: "bob@company.com", role: "employee", managerId: "USR-002", managerName: "Sarah Manager", createdAt: "2026-02-15" },
  { id: "USR-005", name: "Carol Davis", email: "carol@company.com", role: "employee", managerId: "USR-002", managerName: "Sarah Manager", createdAt: "2026-03-01" },
  { id: "USR-006", name: "Frank Finance", email: "frank@company.com", role: "manager", createdAt: "2026-01-05" },
  { id: "USR-007", name: "Diana Director", email: "diana@company.com", role: "manager", createdAt: "2026-01-03" },
];

export const expenseCategories = ["Travel", "Meals", "Equipment", "Office Supplies", "Software", "Training", "Other"];
export const currencies = ["USD", "EUR", "GBP", "INR", "CAD", "AUD", "JPY", "CHF", "SGD", "AED"];
