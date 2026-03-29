import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { type Expense, type ApprovalStep, type CompanyConfig } from "@/data/types";

interface ExpenseContextType {
  expenses: Expense[];
  addExpense: (expense: Expense) => void;
  processApproval: (expenseId: string, approverId: string, action: "approve" | "reject", comment: string, config: CompanyConfig) => void;
  deleteExpense: (expenseId: string, rawId?: number) => void;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider = ({ children }: { children: ReactNode }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const fetchExpenses = useCallback(async () => {
    const userId = localStorage.getItem("userId");
    const companyId = localStorage.getItem("companyId");
    const role = localStorage.getItem("auth_role");
    
    if (!userId || !companyId || !role) return;
    
    const url = role === "admin" || role === "manager" 
      ? `http://localhost:8081/api/expenses/company?companyId=${companyId}`
      : `http://localhost:8081/api/expenses/my?userId=${userId}`;
      
    try {
      const res = await fetch(url);
      const data = await res.json();
      setExpenses(data);
    } catch(e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const addExpense = useCallback(async (expense: Expense) => {
    const userId = localStorage.getItem("userId");
    try {
      await fetch("http://localhost:8081/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId,
          amount: expense.amount,
          currency: expense.currency,
          convertedAmount: expense.convertedAmount,
          baseCurrency: expense.baseCurrency,
          category: expense.category,
          description: expense.description,
          date: expense.date
        })
      });
      fetchExpenses();
    } catch(e) { console.error(e) }
  }, [fetchExpenses]);

  const deleteExpense = useCallback(async (expenseId: string, rawId?: number) => {
    try {
      await fetch(`http://localhost:8081/api/expenses/${rawId || expenseId}`, {
        method: "DELETE",
      });
      fetchExpenses();
    } catch(e) { console.error(e); }
  }, [fetchExpenses]);

  const processApproval = useCallback(async (expenseId: string, approverId: string, action: "approve" | "reject", comment: string, config: CompanyConfig) => {
    const exp = expenses.find(e => e.id === expenseId);
    const authApproverId = localStorage.getItem("userId") || approverId;
    if (!exp) return;
     
    try {
       await fetch(`http://localhost:8081/api/approvals/${exp.rawId || expenseId}/action`, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ action, comment, approverId: Number(authApproverId) })
       });
       fetchExpenses();
    } catch(e) { console.error(e); }
  }, [expenses, fetchExpenses]);

  return (
    <ExpenseContext.Provider value={{ expenses, addExpense, processApproval, deleteExpense }}>
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => {
  const ctx = useContext(ExpenseContext);
  if (!ctx) throw new Error("useExpenses must be used within ExpenseProvider");
  return ctx;
};
