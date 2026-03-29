import { useState, useEffect, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCompany } from "@/contexts/CompanyContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, Globe, Building2 } from "lucide-react";

interface CountryOption {
  name: string;
  currencyCode: string;
  currencyName: string;
}

const Signup = () => {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [detectedCurrency, setDetectedCurrency] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { setCompanyInfo } = useCompany();
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name,currencies")
      .then((r) => r.json())
      .then((data: any[]) => {
        const parsed: CountryOption[] = data
          .filter((c: any) => c.currencies && Object.keys(c.currencies).length > 0)
          .map((c: any) => {
            const code = Object.keys(c.currencies)[0];
            return {
              name: c.name.common,
              currencyCode: code,
              currencyName: c.currencies[code].name,
            };
          })
          .sort((a: CountryOption, b: CountryOption) => a.name.localeCompare(b.name));
        setCountries(parsed);
      })
      .catch(() => {
        setCountries([
          { name: "United States", currencyCode: "USD", currencyName: "US Dollar" },
          { name: "India", currencyCode: "INR", currencyName: "Indian Rupee" },
          { name: "United Kingdom", currencyCode: "GBP", currencyName: "Pound Sterling" },
          { name: "Australia", currencyCode: "AUD", currencyName: "Australian Dollar" },
        ]);
      })
      .finally(() => setLoadingCountries(false));
  }, []);

  const handleCountryChange = (countryName: string) => {
    setSelectedCountry(countryName);
    const found = countries.find((c) => c.name === countryName);
    setDetectedCurrency(found?.currencyCode || "");
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Name is required";
    if (!company.trim()) errs.company = "Company name is required";
    if (!selectedCountry) errs.country = "Country is required";
    if (!email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Invalid email";
    if (!password.trim()) errs.password = "Password is required";
    else if (password.length < 6) errs.password = "Min 6 characters";
    return errs;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      setCompanyInfo(company, selectedCountry, detectedCurrency);
      login(email, "demo-token-" + String(Date.now()), null, "admin", name);
      navigate("/dashboard");
    } catch {
      setErrors({ general: "Signup failed." });
    } finally {
      setLoading(false);
    }
  };

  const selectedCountryData = countries.find((c) => c.name === selectedCountry);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-muted/30">
      <div className="w-full max-w-md animate-slide-up">
        <div className="flex flex-col items-center mb-8">
          <div className="h-12 w-12 rounded-xl hero-gradient flex items-center justify-center mb-4">
            <DollarSign className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-sm text-muted-foreground mt-1">Set up your company on ReimburseMe</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-card p-6 rounded-xl border border-border shadow-sm">
          {errors.general && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">{errors.general}</div>}

          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">
              <Building2 className="inline h-3.5 w-3.5 mr-1" />
              Company Name *
            </Label>
            <Input id="company" placeholder="Acme Corp" value={company} onChange={(e) => setCompany(e.target.value)} />
            {errors.company && <p className="text-xs text-destructive">{errors.company}</p>}
          </div>

          <div className="space-y-2">
            <Label>
              <Globe className="inline h-3.5 w-3.5 mr-1" />
              Country *
            </Label>
            <Select value={selectedCountry} onValueChange={handleCountryChange} disabled={loadingCountries}>
              <SelectTrigger>
                <SelectValue placeholder={loadingCountries ? "Loading countries..." : "Select your country"} />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {countries.map((c) => (
                  <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.country && <p className="text-xs text-destructive">{errors.country}</p>}
          </div>

          {selectedCountryData && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 space-y-1">
              <p className="text-sm font-medium text-primary flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5" />
                Base Currency Detected
              </p>
              <p className="text-sm">
                <span className="font-semibold">{selectedCountryData.currencyCode}</span>
                <span className="text-muted-foreground ml-1.5">— {selectedCountryData.currencyName}</span>
              </p>
              <p className="text-xs text-muted-foreground">All expenses will be converted to {selectedCountryData.currencyCode}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input id="email" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
            {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
