import { Badge } from "@/components/ui/badge";
import type { ExpenseStatus } from "@/data/types";

interface StatusBadgeProps {
  status: ExpenseStatus;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const variants: Record<ExpenseStatus, string> = {
    draft: "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-100",
    waiting: "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100",
    approved: "bg-green-100 text-green-800 border-green-200 hover:bg-green-100",
    auto_approved: "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100",
    rejected: "bg-red-100 text-red-800 border-red-200 hover:bg-red-100",
  };

  const labels: Record<ExpenseStatus, string> = {
    draft: "Draft",
    waiting: "Waiting for Approval",
    approved: "Approved",
    auto_approved: "Auto-Approved",
    rejected: "Rejected",
  };

  return (
    <Badge variant="outline" className={variants[status]}>
      {labels[status]}
    </Badge>
  );
};

export default StatusBadge;
