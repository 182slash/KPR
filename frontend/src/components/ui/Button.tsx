import { forwardRef } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  href?: string;
  external?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-accent text-white border border-accent hover:bg-accent-mid hover:border-accent-mid shadow-glow-sm hover:shadow-glow',
  outline:
    'bg-transparent text-text-primary border border-accent/40 hover:border-accent hover:bg-accent/10',
  ghost:
    'bg-transparent text-text-muted border border-transparent hover:text-text-primary hover:bg-bg-elevated',
  danger:
    'bg-error text-white border border-error hover:bg-error-bright hover:border-error-bright',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'h-8 px-4 text-xs gap-1.5',
  md: 'h-10 px-5 text-sm gap-2',
  lg: 'h-12 px-7 text-base gap-2.5',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      href,
      external,
      leftIcon,
      rightIcon,
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClass = cn(
      'inline-flex items-center justify-center font-heading font-semibold uppercase tracking-wider rounded-card transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-mid focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base disabled:pointer-events-none disabled:opacity-40 shrink-0',
      variants[variant],
      sizes[size],
      className
    );

    const content = (
      <>
        {isLoading ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          leftIcon && <span>{leftIcon}</span>
        )}
        {children}
        {!isLoading && rightIcon && <span>{rightIcon}</span>}
      </>
    );

    if (href) {
      const linkProps = external
        ? { target: '_blank', rel: 'noopener noreferrer' }
        : {};
      return (
        <Link href={href} className={baseClass} {...linkProps}>
          {content}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        className={baseClass}
        disabled={disabled || isLoading}
        {...props}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = 'Button';
