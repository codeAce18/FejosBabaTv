'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Envelope, Lock, Eye, EyeSlash, SignIn, Crown, GraduationCap } from '@phosphor-icons/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authApi, getErrorMessage } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Button, Input } from '@/components/ui';
import { AuthShell } from '@/components/layouts/AuthShell';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});
type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const res = await authApi.login(data);
      const { user, token } = res.data.data as { user: { name: string; role: string }; token: string };
      setAuth(user as Parameters<typeof setAuth>[0], token);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      if (user.role === 'ADMIN') router.push('/admin/dashboard');
      else if (user.role === 'STUDENT') router.push('/student/dashboard');
      else router.push('/');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to continue watching and managing your account." badge="Member login">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="your@email.com"
          leftIcon={<Envelope size={16} />}
          error={errors.email?.message}
          {...register('email')}
        />
        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Your password"
            leftIcon={<Lock size={16} />}
            error={errors.password?.message}
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-ink-muted hover:text-white"
          >
            {showPassword ? <EyeSlash size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <Button type="submit" loading={isLoading} size="lg" className="w-full mt-2">
          <SignIn size={18} weight="bold" /> Sign in
        </Button>
      </form>

      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-cinema-border" />
        <span className="text-ink-muted text-xs uppercase tracking-wider">New here?</span>
        <div className="flex-1 h-px bg-cinema-border" />
      </div>

      <div className="space-y-3">
        <Link
          href="/register/premium"
          className="flex items-center gap-3 p-3.5 rounded-lg border border-brand-orange/30 bg-brand-orange/5 hover:bg-brand-orange/10 transition-all group"
        >
          <Crown size={20} className="text-brand-orange shrink-0" weight="fill" />
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold">Get Premium</p>
            <p className="text-ink-muted text-xs">Full movies from ₦2,000/month</p>
          </div>
          <span className="text-brand-orange group-hover:translate-x-0.5 transition-transform">→</span>
        </Link>
        <Link
          href="/register/student"
          className="flex items-center gap-3 p-3.5 rounded-lg border border-cinema-border hover:border-brand-navy/50 bg-cinema-elevated/50 transition-all group"
        >
          <GraduationCap size={20} className="text-blue-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold">Film Academy Student</p>
            <p className="text-ink-muted text-xs">Register with admission number</p>
          </div>
          <span className="text-ink-secondary group-hover:translate-x-0.5 transition-transform">→</span>
        </Link>
      </div>
    </AuthShell>
  );
}
