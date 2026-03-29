import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    ...(isAuthenticated ? [{ to: "/dashboard", label: "Dashboard" }] : []),
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "nav-scrolled" : "nav-transparent"
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <Zap className="h-5 w-5 text-primary" />
          <span className={scrolled ? "text-foreground" : "text-primary-foreground"}>AppStarter</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                scrolled ? "text-foreground" : "text-primary-foreground/80"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {isAuthenticated ? (
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <Button size="sm" asChild>
              <Link to="/login">Login</Link>
            </Button>
          )}
        </nav>

        <button
          className="md:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-background border-b border-border animate-fade-in">
          <nav className="container flex flex-col gap-2 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium py-2 text-foreground hover:text-primary"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <Button variant="outline" size="sm" onClick={handleLogout} className="w-fit">
                Logout
              </Button>
            ) : (
              <Button size="sm" asChild className="w-fit">
                <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
