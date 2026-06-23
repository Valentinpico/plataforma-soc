import type { SelectHTMLAttributes } from "react";

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export function Select({ label, className = "", children, ...props }: Props) {
  return (
    <label className="block">
      {label && <span className="mb-1 block text-xs font-medium text-muted">{label}</span>}
      <select
        {...props}
        className={`w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-token outline-none transition focus:border-accent ${className}`}
      >
        {children}
      </select>
    </label>
  );
}
