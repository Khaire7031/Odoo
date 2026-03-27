import { Loader2 } from "lucide-react";

interface LoaderProps {
  text?: string;
}

const Loader = ({ text = "Loading..." }: LoaderProps) => (
  <div className="flex flex-col items-center justify-center gap-3 py-20">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
    <p className="text-sm text-muted-foreground">{text}</p>
  </div>
);

export default Loader;
