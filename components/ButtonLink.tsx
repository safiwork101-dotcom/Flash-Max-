import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "ghost";
};

export function ButtonLink({
  href,
  children,
  className,
  variant = "primary",
}: ButtonLinkProps) {
  const variants = {
    primary:
      "bg-aqua text-night shadow-button hover:bg-mint focus-visible:outline-aqua",
    secondary:
      "border border-line bg-white/5 text-white hover:border-aqua/50 hover:bg-aqua/10 focus-visible:outline-aqua",
    ghost:
      "text-white/78 hover:bg-white/5 hover:text-white focus-visible:outline-aqua",
  };

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-5 text-sm font-extrabold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
        variants[variant],
        className,
      )}
    >
      {children}
    </Link>
  );
}
