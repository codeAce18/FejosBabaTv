import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const formatNumber = (num: number): string => {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const gradeColor = (grade: string): string => {
  const colors: Record<string, string> = {
    A: 'text-green-400',
    B: 'text-blue-400',
    C: 'text-yellow-400',
    D: 'text-orange-400',
    F: 'text-red-400',
  };
  return colors[grade] ?? 'text-ink-secondary';
};

export const planPrice = (plan: 'monthly' | 'yearly'): number => {
  return plan === 'monthly' ? 2000 : 20000; // in NGN kobo for Paystack (*100)
};

export const planPriceDisplay = (plan: 'monthly' | 'yearly'): string => {
  return plan === 'monthly' ? '₦2,000/month' : '₦20,000/year';
};