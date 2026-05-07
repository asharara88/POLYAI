import { ReactNode } from "react";

const SPACE: Record<string, string> = {
  "0": "space-y-0",
  "1": "space-y-1",
  "2": "space-y-2",
  "3": "space-y-3",
  "4": "space-y-4",
  "5": "space-y-5",
  "6": "space-y-6",
  "8": "space-y-8",
  "10": "space-y-10",
  "12": "space-y-12",
};

const GAP: Record<string, string> = {
  "0": "gap-0",
  "1": "gap-1",
  "2": "gap-2",
  "3": "gap-3",
  "4": "gap-4",
  "5": "gap-5",
  "6": "gap-6",
  "8": "gap-8",
};

type StackProps = {
  children: ReactNode;
  gap?: keyof typeof SPACE;
  className?: string;
  as?: "div" | "ul" | "ol";
};

export function Stack({ children, gap = "4", className = "", as: Tag = "div" }: StackProps) {
  return <Tag className={[SPACE[gap] ?? "space-y-4", className].join(" ")}>{children}</Tag>;
}

type ClusterProps = {
  children: ReactNode;
  gap?: keyof typeof GAP;
  align?: "start" | "center" | "end" | "baseline";
  justify?: "start" | "center" | "end" | "between";
  wrap?: boolean;
  className?: string;
};

const ALIGN: Record<string, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  baseline: "items-baseline",
};

const JUSTIFY: Record<string, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
};

export function Cluster({
  children,
  gap = "3",
  align = "center",
  justify = "start",
  wrap = true,
  className = "",
}: ClusterProps) {
  return (
    <div
      className={[
        "flex",
        wrap ? "flex-wrap" : "",
        ALIGN[align],
        JUSTIFY[justify],
        GAP[gap] ?? "gap-3",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
