import React from "react";
import { twMerge } from "tailwind-merge";

type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;

  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;

  type?: "button" | "submit" | "reset";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const base =
  "rounded-lg font-medium transition-all duration-200 focus:outline-none flex items-center justify-center";

const variants = {
  primary: "bg-primary text-white hover:opacity-90",
  /* Light green bg: dark text for contrast (was white-on-b2, hard to see) */
  secondary: "bg-secondary text-b1 hover:opacity-90",
  outline: "border border-border text-foreground hover:bg-muted/30",
  ghost: "text-foreground hover:bg-muted/30",
};

const sizes = {
  sm: "px-3 py-1 text-sm",
  md: "px-4 py-2",
  lg: "px-6 py-3 text-lg",
};

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  loading,
  disabled,
  fullWidth,
  className = "",
  type = "button",
  onClick, // ✅ FIX: destructured here
  ...props
}) => {
  const buttonClassName = twMerge(
    base,
    variants[variant],
    sizes[size],
    fullWidth ? "w-full" : "",
    disabled ? "opacity-50 cursor-not-allowed" : "",
    "active:scale-95",
    className
  );

  return (
    <button
      type={type}
      onClick={(e) => onClick?.(e)} // ✅ now works
      disabled={disabled || loading}
      className={buttonClassName}
      {...props}
    >
      {loading ? "Loading..." : children}
    </button>
  );
};

export default Button;