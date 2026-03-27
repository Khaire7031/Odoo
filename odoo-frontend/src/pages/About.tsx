const About = () => (
  <div className="pt-24 pb-16">
    <div className="container max-w-2xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 animate-fade-in">About Odoo</h1>
      <div className="space-y-4 text-muted-foreground animate-slide-up">
        <p>
          Odoo is a modern, production-ready React boilerplate designed for hackathons and rapid prototyping.
        </p>
        <p>
          It comes with a clean folder structure, authentication flow, centralized API layer with Axios,
          protected routing, and a beautiful responsive UI — all ready to go.
        </p>
        <h2 className="text-xl font-semibold text-foreground pt-4">Tech Stack</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>React 18 + TypeScript</li>
          <li>Tailwind CSS + shadcn/ui</li>
          <li>React Router DOM v6</li>
          <li>Axios with interceptors</li>
          <li>Vitest + React Testing Library</li>
        </ul>
      </div>
    </div>
  </div>
);

export default About;
