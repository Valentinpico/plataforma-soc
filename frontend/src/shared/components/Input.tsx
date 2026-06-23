import type { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className = "", id, ...props }: Props) {
  return (
    <label className="block">
      {label && <span className="mb-1 block text-xs font-medium text-muted">{label}</span>}
      <input
        id={id}
        {...props}
        className={`w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-token outline-none transition focus:border-accent ${className}`}
      />
    </label>
  );
}
