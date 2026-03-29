import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Expenses from "@/pages/Expenses";

const renderExpenses = () =>
  render(
    <AuthProvider>
      <BrowserRouter>
        <Expenses />
      </BrowserRouter>
    </AuthProvider>
  );

describe("Expenses Page", () => {
  it("renders expense history table", () => {
    renderExpenses();
    expect(screen.getByText("Expense History")).toBeInTheDocument();
    expect(screen.getByText("EXP-001")).toBeInTheDocument();
  });

  it("has a new expense button", () => {
    renderExpenses();
    expect(screen.getByRole("button", { name: /new expense/i })).toBeInTheDocument();
  });

  it("shows status badges", () => {
    renderExpenses();
    const pendingBadges = screen.getAllByText("pending");
    expect(pendingBadges.length).toBeGreaterThan(0);
  });
});
