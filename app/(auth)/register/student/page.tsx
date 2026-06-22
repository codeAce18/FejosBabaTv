'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, BookOpen, Hash, Building, Eye, EyeOff, GraduationCap } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authApi, getErrorMessage } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Button, Input, Select } from '@/components/ui';
import toast from 'react-hot-toast';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string()
    .min(8, 'At least 8 characters')
    .regex(/[A-Z]/, 'One uppercase letter required')
    .regex(/[0-9]/, 'One number required')
    .regex(/[^A-Za-z0-9]/, 'One special character required'),
  admissionNumber: z.string().min(3, 'Enter your admission number'),
  department: z.string().min(2, 'Select your department'),
  level: z.string().min(1, 'Select your level'),
  phone: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

const DEPARTMENTS = [
  { value: '', label: 'Select Department' },
  { value: 'Film Production', label: 'Film Production' },
  { value: 'Cinematography', label: 'Cinematography' },
  { value: 'Film Editing', label: 'Film Editing' },
  { value: 'Screenwriting', label: 'Screenwriting' },
  { value: 'Directing', label: 'Directing' },
  { value: 'Sound Production', label: 'Sound Production' },
  { value: 'Acting', label: 'Acting' },
];

const LEVELS = [
  { value: '', label: 'Select Level' },
  { value: '100', label: '100 Level' },
  { value: '200', label: '200 Level' },
  { value: '300', label: '300 Level' },
  { value: '400', label: '400 Level' },
];

export default function StudentRegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const res = await authApi.registerStudent(data);
      const { user, token } = res.data.data as { user: any; token: string };
      setAuth(user, token);
      toast.success(`Welcome, ${user.name.split(' ')[0]}! Your portal is ready.`);
      router.push('/student/dashboard');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg">
      <div className="bg-cinema-surface border border-cinema-border rounded-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-brand-navy/30 border border-brand-navy/50 flex items-center justify-center mx-auto mb-4">
            <GraduationCap size={26} className="text-blue-400" />
          </div>
          <h1 className="font-display text-2xl font-bold text-white">Student Portal</h1>
          <p className="text-ink-secondary text-sm mt-1">
            Register with your FejosBaba Film Academy admission number
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            placeholder="Your full name"
            leftIcon={<User size={16} />}
            error={errors.name?.message}
            {...register('name')}
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="your@email.com"
            leftIcon={<Mail size={16} />}
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Admission Number"
            type="text"
            placeholder="e.g. FA/2024/001"
            leftIcon={<Hash size={16} />}
            error={errors.admissionNumber?.message}
            {...register('admissionNumber')}
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Department"
              options={DEPARTMENTS}
              error={errors.department?.message}
              {...register('department')}
            />
            <Select
              label="Level"
              options={LEVELS}
              error={errors.level?.message}
              {...register('level')}
            />
          </div>

          <Input
            label="Phone Number (optional)"
            type="tel"
            placeholder="08012345678"
            error={errors.phone?.message}
            {...register('phone')}
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Min 8 chars with uppercase, number, symbol"
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

          <div className="bg-cinema-elevated border border-cinema-border rounded-lg p-3 text-xs text-ink-secondary">
            <p className="font-medium text-white mb-1">📌 Important</p>
            <p>Your admission number must match the one registered with the academy admin. If you have issues, contact your admin.</p>
          </div>

          <Button type="submit" loading={isLoading} size="lg" className="w-full" variant="outline">
            <GraduationCap size={16} />
            Register Student Account
          </Button>
        </form>

        <p className="text-center text-ink-secondary text-sm mt-6">
          Already registered?{' '}
          <Link href="/login" className="text-brand-orange hover:underline font-medium">Login here</Link>
        </p>
      </div>
    </div>
  );
}