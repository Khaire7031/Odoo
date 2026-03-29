import { Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border bg-secondary/30">
    <div className="container py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 font-bold text-lg mb-3">
            <Zap className="h-5 w-5 text-primary" />
            <span>AppStarter</span>
          </div>
          <p className="text-sm text-muted-foreground max-w-xs">
            A modern, production-ready React starter template built for speed and scalability.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-3">Quick Links</h4>
          <div className="flex flex-col gap-2">
            {[
              { to: "/", label: "Home" },
              { to: "/about", label: "About" },
              { to: "/login", label: "Login" },
            ].map((link) => (
              <Link key={link.to} to={link.to} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-3">Contact</h4>
          <p className="text-sm text-muted-foreground">hello@appstarter.dev</p>
        </div>
      </div>
      <div className="mt-8 pt-6 border-t border-border text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} AppStarter. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
