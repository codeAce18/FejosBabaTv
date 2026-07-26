'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, Crown, Check, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { paymentApi, getErrorMessage } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Button, Input, Spinner } from '@/components/ui';
import { planPriceDisplay, planPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'At least 8 characters')
    .regex(/[A-Z]/, 'One uppercase letter required')
    .regex(/[0-9]/, 'One number required')
    .regex(/[^A-Za-z0-9]/, 'One special character required'),
  plan: z.enum(['monthly', 'yearly']),
});
type FormData = z.infer<typeof schema>;

const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '';

const BENEFITS = [
  'Full access to ALL movies and series',
  'HD & 4K streaming quality',
  'Download for offline viewing',
  'New movies added weekly',
  'No ads whatsoever',
  'Cancel anytime',
];

// Verification states shown to the user while we confirm with Paystack
type VerifyState = 'idle' | 'verifying' | 'failed';

export default function PremiumRegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [verifyState, setVerifyState] = useState<VerifyState>('idle');
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { plan: 'monthly' },
  });

  const selectedPlan = watch('plan');

  // ─── STEP 2: Verify with OUR backend (which re-verifies with Paystack) ───
  // This never trusts the popup's callback alone — the account is only
  // created after our server independently confirms payment succeeded.
  const verifyAndFinish = async (reference: string) => {
    setVerifyState('verifying');
    try {
      const res = await paymentApi.verify(reference);
      const { user, token } = res.data.data as { user: any; token: string };
      setAuth(user, token);
      toast.success('🎉 Payment confirmed! Welcome to Premium.');
      router.push('/');
    } catch (error) {
      setVerifyState('failed');
      toast.error(
        getErrorMessage(error) +
        ' — if you were charged, contact support with your payment reference: ' + reference
      );
    }
  };

  // ─── STEP 1: Initialize checkout on OUR backend, THEN open Paystack ───
  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      // Ask our backend to create a pending registration + get a reference.
      // No account exists yet — nothing is created until payment is confirmed.
      const initRes = await paymentApi.initialize(data);
      const { reference, amount } = initRes.data.data as { reference: string; amount: number };

      const PaystackPop = (window as any).PaystackPop;
      if (!PaystackPop) {
        toast.error('Payment system is still loading. Please try again in a moment.');
        setIsLoading(false);
        return;
      }

      const handler = PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email: data.email,
        amount, // already in kobo, calculated server-side — never trust a client-side amount
        currency: 'NGN',
        ref: reference, // use the reference OUR backend generated, not a random one
        callback: (response: { reference: string }) => {
          // IMPORTANT: this callback firing does NOT mean payment is confirmed.
          // It only means the popup believes it succeeded. We now ask our
          // OWN backend to independently verify with Paystack before doing
          // anything else (like creating the account).
          verifyAndFinish(response.reference);
        },
        onClose: () => {
          if (verifyState !== 'verifying') {
            toast.error('Payment window closed. No charge was made.');
          }
        },
      });

      handler.openIframe();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Verifying overlay — shown while we confirm with Paystack server-to-server ───
  if (verifyState === 'verifying') {
    return (
      <div className="w-full max-w-md text-center">
        <div className="bg-cinema-surface border border-cinema-border rounded-2xl p-10">
          <Spinner size={40} className="mx-auto mb-4" />
          <h2 className="font-display text-xl font-bold text-white mb-2">Confirming Your Payment</h2>
          <p className="text-ink-secondary text-sm">
            We&apos;re verifying your payment directly with Paystack. This takes just a few seconds — please don&apos;t close this window.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Paystack inline script */}
      <script src="https://js.paystack.co/v1/inline.js" async />

      <div className="w-full max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ─── LEFT: Benefits ─── */}
          <div className="bg-navy-gradient border border-brand-navy/50 rounded-xl p-8 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 film-grain opacity-25 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Crown size={20} className="text-brand-orange" />
                <span className="text-brand-orange text-sm font-semibold uppercase tracking-widest">Premium</span>
              </div>
              <h2 className="font-display text-3xl font-bold text-white mb-2">
                Unlimited Nigerian Entertainment
              </h2>
              <p className="text-ink-secondary text-sm mb-8">
                Join thousands of viewers watching the best of Nollywood.
              </p>

              <ul className="space-y-3">
                {BENEFITS.map((b) => (
                  <li key={b} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-brand-orange/20 border border-brand-orange/40 flex items-center justify-center flex-shrink-0">
                      <Check size={11} className="text-brand-orange" />
                    </div>
                    <span className="text-ink-secondary text-sm">{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3">
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                <p className="text-white font-bold text-lg">₦2,000</p>
                <p className="text-ink-muted text-xs">per month</p>
              </div>
              <div className="bg-brand-orange/10 border border-brand-orange/30 rounded-xl p-3 text-center">
                <p className="text-brand-orange font-bold text-lg">₦20,000</p>
                <p className="text-ink-muted text-xs">per year (save 17%)</p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-ink-muted text-xs">
              <ShieldCheck size={14} className="text-green-400" />
              Your account is only created after payment is independently confirmed.
            </div>
          </div>

          {/* ─── RIGHT: Form ─── */}
          <div className="bg-cinema-surface/90 backdrop-blur-sm border border-cinema-border rounded-xl p-8">
            <h3 className="font-display text-xl font-bold text-white mb-6">Create Your Account</h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink-secondary mb-2">Choose Plan</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['monthly', 'yearly'] as const).map((plan) => (
                    <label
                      key={plan}
                      className={`relative flex flex-col items-center p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedPlan === plan
                          ? 'border-brand-orange bg-brand-orange/10'
                          : 'border-cinema-border hover:border-cinema-muted'
                      }`}
                    >
                      <input type="radio" value={plan} {...register('plan')} className="sr-only" />
                      <span className="text-white font-semibold text-sm capitalize">{plan}</span>
                      <span className="text-brand-orange text-xs font-medium">{planPriceDisplay(plan)}</span>
                      {plan === 'yearly' && (
                        <span className="absolute -top-2 -right-2 bg-brand-orange text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
                          SAVE
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              <Input label="Full Name" type="text" placeholder="John Doe" leftIcon={<User size={16} />}
                error={errors.name?.message} {...register('name')} />

              <Input label="Email Address" type="email" placeholder="your@email.com" leftIcon={<Mail size={16} />}
                error={errors.email?.message} {...register('email')} />

              <div className="relative">
                <Input label="Password" type={showPassword ? 'text' : 'password'}
                  placeholder="Min 8 chars, 1 upper, 1 number, 1 symbol" leftIcon={<Lock size={16} />}
                  error={errors.password?.message} {...register('password')} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-ink-muted hover:text-white transition-colors">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <Button type="submit" loading={isLoading} size="lg" className="w-full mt-2">
                <Crown size={16} />
                Pay {planPriceDisplay(selectedPlan)} with Paystack
              </Button>

              <p className="text-ink-muted text-xs text-center flex items-center justify-center gap-1.5">
                <ShieldCheck size={12} className="text-green-400" />
                Secured by Paystack · Account created only after confirmed payment
              </p>
            </form>

            <p className="text-center text-ink-secondary text-sm mt-6">
              Already have an account?{' '}
              <Link href="/login" className="text-brand-orange hover:underline font-medium">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}