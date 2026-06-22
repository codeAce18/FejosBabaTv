'use client';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { forwardRef } from 'react';

// ─── BUTTON ───
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, children, className, disabled, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
    const variants = {
      primary: 'bg-brand-orange hover:bg-brand-orange-light text-white hover:shadow-orange-glow-sm active:scale-95',
      secondary: 'bg-cinema-elevated hover:bg-cinema-muted text-white border border-cinema-border',
      ghost: 'bg-transparent hover:bg-cinema-surface text-ink-secondary hover:text-white',
      danger: 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20',
      outline: 'bg-transparent border border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white',
    };
    const sizes = {
      sm: 'text-xs px-3 py-1.5',
      md: 'text-sm px-4 py-2.5',
      lg: 'text-base px-6 py-3',
    };
    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 size={14} className="animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

// ─── INPUT ───
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, className, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-ink-secondary mb-1.5">{label}</label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted">{leftIcon}</div>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full bg-cinema-surface border border-cinema-border rounded-lg text-white placeholder:text-ink-muted',
            'focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/30 transition-all',
            'text-sm py-2.5',
            leftIcon ? 'pl-10 pr-4' : 'px-4',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  )
);
Input.displayName = 'Input';

// ─── SELECT ───
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className, ...props }, ref) => (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-ink-secondary mb-1.5">{label}</label>}
      <select
        ref={ref}
        className={cn(
          'w-full bg-cinema-surface border border-cinema-border rounded-lg text-white px-4 py-2.5 text-sm',
          'focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/30 transition-all',
          error && 'border-red-500',
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-cinema-surface">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  )
);
Select.displayName = 'Select';

// ─── BADGE ───
interface BadgeProps { children: React.ReactNode; variant?: 'orange' | 'navy' | 'green' | 'red' | 'gray'; className?: string }

export const Badge = ({ children, variant = 'gray', className }: BadgeProps) => {
  const variants = {
    orange: 'bg-brand-orange/15 text-brand-orange border-brand-orange/30',
    navy: 'bg-brand-navy/30 text-blue-300 border-brand-navy/50',
    green: 'bg-green-500/15 text-green-400 border-green-500/30',
    red: 'bg-red-500/15 text-red-400 border-red-500/30',
    gray: 'bg-cinema-elevated text-ink-secondary border-cinema-border',
  };
  return (
    <span className={cn('inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full border', variants[variant], className)}>
      {children}
    </span>
  );
};

// ─── SPINNER ───
export const Spinner = ({ size = 20, className }: { size?: number; className?: string }) => (
  <Loader2 size={size} className={cn('animate-spin text-brand-orange', className)} />
);

// ─── CARD ───
export const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn('bg-cinema-surface border border-cinema-border rounded-xl p-5', className)}>
    {children}
  </div>
);

// ─── STAT CARD ───
interface StatCardProps { label: string; value: string | number; icon: React.ReactNode; trend?: string }
export const StatCard = ({ label, value, icon, trend }: StatCardProps) => (
  <Card className="flex items-center gap-4">
    <div className="w-12 h-12 rounded-xl bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center text-brand-orange flex-shrink-0">
      {icon}
    </div>
    <div>
      <p className="text-ink-secondary text-xs font-medium uppercase tracking-wider">{label}</p>
      <p className="font-display text-2xl font-bold text-white mt-0.5">{value}</p>
      {trend && <p className="text-xs text-green-400 mt-0.5">{trend}</p>}
    </div>
  </Card>
);

// ─── EMPTY STATE ───
export const EmptyState = ({ icon, title, description }: { icon: React.ReactNode; title: string; description?: string }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-16 h-16 rounded-2xl bg-cinema-elevated border border-cinema-border flex items-center justify-center text-ink-muted mb-4">
      {icon}
    </div>
    <h3 className="font-display text-lg text-white mb-1">{title}</h3>
    {description && <p className="text-ink-secondary text-sm max-w-xs">{description}</p>}
  </div>
);

// ─── PAGE LOADER ───
export const PageLoader = () => (
  <div className="min-h-screen bg-cinema-black flex items-center justify-center">
    <div className="text-center space-y-4">
      <Spinner size={40} />
      <p className="text-ink-secondary text-sm">Loading...</p>
    </div>
  </div>
);