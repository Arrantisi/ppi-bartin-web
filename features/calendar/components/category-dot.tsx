import type { Category } from "../types";

const categoryStyles: Record<Category, { bg: string }> = {
  beasiswa: { bg: "var(--accent-subtle)" },
  akademik: { bg: "var(--info-subtle)" },
  sosial: { bg: "var(--success-subtle)" },
  olahraga: { bg: "var(--warning-subtle)" },
  pengumuman: { bg: "var(--accent-subtle)" },
  kaderisasi: { bg: "var(--danger-subtle)" },
};

type Props = {
  category: Category;
};

export const CategoryDot = ({ category }: Props) => {
  const style = categoryStyles[category];
  return (
    <span
      className="block size-2 shrink-0 rounded-full"
      style={{ backgroundColor: style.bg }}
    />
  );
};
