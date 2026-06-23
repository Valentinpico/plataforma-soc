interface Props {
  title: string;
  items: string[];
}

export function ResourceList({ title, items }: Props) {
  return (
    <section>
      <h3 className="mb-2 font-display text-base text-token">
        {title} <span className="text-muted">({items.length})</span>
      </h3>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="rounded-md bg-surface px-3 py-1.5 text-sm text-token">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
