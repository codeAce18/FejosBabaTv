'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authApi, getErrorMessage } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Button, Input } from '@/components/ui';
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
      const { user, token } = res.data.data as { user: any; token: string };
      setAuth(user, token);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);

      // Redirect based on role
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
    <div className="w-full max-w-md">
      {/* Card */}
      <div className="bg-cinema-surface border border-cinema-border rounded-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center mx-auto mb-4">
            <Lock size={24} className="text-brand-orange" />
          </div>
          <h1 className="font-display text-2xl font-bold text-white">Welcome Back</h1>
          <p className="text-ink-secondary text-sm mt-1">Login to your FejosBaba account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="your@email.com"
            leftIcon={<Mail size={16} />}
            error={errors.email?.message}
            {...register('email')}
          />

          <div>
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
                className="absolute right-3 top-9 text-ink-muted hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <Button type="submit" loading={isLoading} size="lg" className="w-full mt-2">
            Login
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 border-t border-cinema-border" />
          <span className="text-ink-muted text-xs">OR</span>
          <div className="flex-1 border-t border-cinema-border" />
        </div>

        {/* Register options */}
        <div className="space-y-3">
          <Link
            href="/register/premium"
            className="flex items-center justify-between w-full p-3 rounded-xl border border-brand-orange/30 bg-brand-orange/5 hover:bg-brand-orange/10 transition-all group"
          >
            <div>
              <p className="text-white text-sm font-semibold">New here? Get Premium</p>
              <p className="text-ink-muted text-xs">Watch full movies from ₦2,000/month</p>
            </div>
            <span className="text-brand-orange group-hover:translate-x-1 transition-transform">→</span>
          </Link>

          <Link
            href="/register/student"
            className="flex items-center justify-between w-full p-3 rounded-xl border border-cinema-border hover:border-brand-navy/50 bg-cinema-elevated hover:bg-brand-navy/10 transition-all group"
          >
            <div>
              <p className="text-white text-sm font-semibold">Film Academy Student?</p>
              <p className="text-ink-muted text-xs">Register with your admission number</p>
            </div>
            <span className="text-ink-secondary group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>

      <p className="text-center text-ink-muted text-xs mt-6">
        <Link href="/" className="hover:text-white transition-colors">← Back to movies</Link>
      </p>
    </div>
  );
}