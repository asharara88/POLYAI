import { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
  padded?: boolean;
  interactive?: boolean;
  as?: "div" | "article" | "section";
};

export function Card({
  children,
  className = "",
  padded = true,
  interactive = false,
  as: Component = "div",
}: CardProps) {
  return (
    <Component
      className={[
        "rounded-card border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 shadow-card",
        padded ? "p-5" : "",
        interactive
          ? "transition-shadow hover:shadow-card-hover focus-within:shadow-card-hover"
          : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </Component>
  );
}

export function CardHeader({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "px-5 py-4 border-b border-ink-100 dark:border-ink-800 bg-ink-50/40 dark:bg-ink-950/40 rounded-t-card",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

export function CardBody({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={["px-5 py-4", className].join(" ")}>{children}</div>;
}
