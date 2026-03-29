import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code2, Shield, Zap } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Built on Vite for instant HMR and blazing fast builds.",
  },
  {
    icon: Shield,
    title: "Auth Ready",
    description: "Protected routes and authentication flow out of the box.",
  },
  {
    icon: Code2,
    title: "Clean Architecture",
    description: "Scalable folder structure with proper separation of concerns.",
  },
];

const Home = () => (
  <div>
    <section className="hero-gradient relative overflow-hidden">
      <div className="container relative z-10 flex flex-col items-center justify-center text-center py-32 md:py-44 gap-6">
        <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground animate-slide-up max-w-3xl leading-tight">
          Build Faster. Ship Sooner.
        </h1>
        <p className="text-lg md:text-xl text-primary-foreground/80 max-w-xl animate-slide-up" style={{ animationDelay: "0.1s" }}>
          A production-ready React starter template with routing, auth, API layer, and beautiful UI — all wired up.
        </p>
        <div className="flex gap-3 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/login">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
            <Link to="/about">Learn More</Link>
          </Button>
        </div>
      </div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-foreground/5 rounded-full" />
      <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-primary-foreground/5 rounded-full" />
    </section>

    <section className="container py-20 md:py-28">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Everything You Need</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {features.map((f) => (
          <div key={f.title} className="bg-card border border-border rounded-lg p-6 card-hover">
            <f.icon className="h-10 w-10 text-primary mb-4" />
            <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
            <p className="text-sm text-muted-foreground">{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  </div>
);

export default Home;
