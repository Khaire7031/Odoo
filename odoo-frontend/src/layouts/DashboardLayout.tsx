import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DollarSign } from "lucide-react";

const DashboardLayout = () => (
  <SidebarProvider>
    <div className="min-h-screen flex w-full">
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <header className="h-14 flex items-center border-b border-border px-4 bg-background/95 backdrop-blur-md sticky top-0 z-40">
          <SidebarTrigger className="mr-3" />
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-primary md:hidden" />
            <span className="text-sm font-medium text-muted-foreground md:hidden">ReimburseMe</span>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 bg-muted/30">
          <Outlet />
        </main>
        <footer className="border-t border-border py-3 px-4 text-center text-xs text-muted-foreground bg-background">
          © {new Date().getFullYear()} ReimburseMe Inc. All rights reserved.
        </footer>
      </div>
    </div>
  </SidebarProvider>
);

export default DashboardLayout;
