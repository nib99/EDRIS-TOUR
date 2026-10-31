import { cn } from "@/lib/cn";

export function BrandLogo({ className, alt = "" }: { className?: string; alt?: string }) {
  return (
    <span className={cn("inline-grid shrink-0 overflow-hidden rounded-full bg-white shadow-panel", className)}>
      <img src="/brand/edris-logo.jpg" alt={alt} className="size-full scale-125 object-cover" />
    </span>
  );
}
