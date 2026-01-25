import { forwardRef, type ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-gray-900 text-white hover:bg-gray-800 active:bg-gray-950 shadow-sm",
  secondary:
    "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 active:bg-gray-100",
  ghost:
    "text-gray-600 hover:text-gray-900 hover:bg-gray-100 active:bg-gray-200",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "secondary", className = "", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`
          inline-flex items-center justify-center gap-2
          px-4 py-2.5 rounded-xl font-medium text-sm
          transition-all duration-200 ease-out
          focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variantStyles[variant]}
          ${className}
        `}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
