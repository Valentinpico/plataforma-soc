import type { ReactNode } from "react";

type Tone = "accent" | "success" | "warning" | "error" | "neutral";

const tones: Record<Tone, string> = {
  accent: "bg-accent-muted text-accent",
  success: "bg-success-bg text-success",
  warning: "bg-warning-bg text-warning",
  error: "bg-error-bg text-error",
  neutral: "bg-surface-2 text-muted",
};

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: Tone }) {
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}
