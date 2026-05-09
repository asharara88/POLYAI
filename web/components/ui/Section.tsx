import { ReactNode } from "react";

type SectionProps = {
  title?: ReactNode;
  meta?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  id?: string;
  className?: string;
};

export function Section({
  title,
  meta,
  description,
  action,
  children,
  id,
  className = "",
}: SectionProps) {
  return (
    <section id={id} className={["space-y-3 scroll-mt-20", className].join(" ")}>
      {(title || meta || action) && (
        <div className="flex items-baseline justify-between gap-3 flex-wrap">
          <div className="min-w-0">
            {title && <h2 className="text-title font-semibold tracking-tight">{title}</h2>}
            {description && (
              <p className="text-body-sm text-ink-500 mt-0.5">{description}</p>
            )}
          </div>
          <div className="flex items-center gap-3 text-body-xs text-ink-500 dark:text-ink-400">
            {meta}
            {action}
          </div>
        </div>
      )}
      <div>{children}</div>
    </section>
  );
}

export function SectionHeader({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "danger" | "warning" | "success";
}) {
  const tones: Record<string, string> = {
    default: "text-ink-700 dark:text-ink-200",
    danger: "text-danger-600 dark:text-danger-400",
    warning: "text-warning-600 dark:text-warning-400",
    success: "text-success-600 dark:text-success-400",
  };
  return (
    <h3
      className={[
        "text-body-sm font-semibold tracking-tight mb-3",
        tones[tone],
      ].join(" ")}
    >
      {children}
    </h3>
  );
}
