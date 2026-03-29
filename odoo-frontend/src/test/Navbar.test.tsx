import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/contexts/AuthContext";

const renderNavbar = () =>
  render(
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
      </AuthProvider>
    </BrowserRouter>
  );

describe("Navbar", () => {
  it("renders the logo text", () => {
    renderNavbar();
    expect(screen.getByText("AppStarter")).toBeInTheDocument();
  });

  it("renders nav links", () => {
    renderNavbar();
    expect(screen.getAllByText("Home").length).toBeGreaterThan(0);
    expect(screen.getAllByText("About").length).toBeGreaterThan(0);
  });

  it("shows login button when unauthenticated", () => {
    renderNavbar();
    expect(screen.getAllByText("Login").length).toBeGreaterThan(0);
  });
});
