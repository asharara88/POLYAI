import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "success" | "warning";
type Size = "sm" | "md" | "lg";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  fullWidth?: boolean;
};

const VARIANT: Record<Variant, string> = {
  primary:
    "bg-accent text-white hover:bg-accent-600 focus-visible:ring-accent shadow-card-hover",
  secondary:
    "bg-ink-100 text-ink-800 hover:bg-ink-200 dark:bg-ink-800 dark:text-ink-100 dark:hover:bg-ink-700 focus-visible:ring-ink-400",
  ghost:
    "bg-transparent text-ink-700 hover:bg-ink-100 dark:text-ink-200 dark:hover:bg-ink-800 focus-visible:ring-ink-300",
  danger:
    "bg-danger-600 text-white hover:bg-danger-700 focus-visible:ring-danger-500 shadow-card-hover",
  success:
    "bg-success-600 text-white hover:bg-success-700 focus-visible:ring-success-500 shadow-card-hover",
  warning:
    "bg-warning-600 text-white hover:bg-warning-700 focus-visible:ring-warning-500 shadow-card-hover",
};

const SIZE: Record<Size, string> = {
  sm: "text-body-xs px-2.5 py-1.5 rounded-md",
  md: "text-body-sm px-3.5 py-2 rounded-md",
  lg: "text-body px-4 py-2.5 rounded-md",
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  {
    variant = "primary",
    size = "md",
    loading = false,
    startIcon,
    endIcon,
    fullWidth = false,
    disabled,
    className = "",
    children,
    ...rest
  },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={[
        "inline-flex items-center justify-center gap-1.5 font-medium",
        "transition-colors transition-shadow duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-ink-950",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        VARIANT[variant],
        SIZE[size],
        fullWidth ? "w-full" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {loading ? (
        <span className="inline-block w-3 h-3 rounded-full border-2 border-current border-t-transparent animate-spin" />
      ) : (
        startIcon
      )}
      {children}
      {!loading && endIcon}
    </button>
  );
});
