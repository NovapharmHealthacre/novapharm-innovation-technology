import type { ReactNode } from "react";

export function Reveal({
  children,
  className = "",
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "li";
}) {
  const Element = as;
  return <Element className={className}>{children}</Element>;
}
