import type { Member } from "../data/team";

function initials(name: string): string {
  const words = name.replace(/\[|\]/g, "").split(" ").filter((w) => !w.includes("."));
  return words.slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
}

export function TeamCard({ member }: { member: Member }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-surface p-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent-muted font-display text-lg text-accent">
        {initials(member.name)}
      </div>
      <div>
        <p className="font-medium text-token">{member.name}</p>
        <p className="text-sm text-accent">{member.role}</p>
        <p className="text-xs text-muted">{member.org}</p>
      </div>
    </div>
  );
}
