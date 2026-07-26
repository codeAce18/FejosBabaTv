'use client';
import { forwardRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { programApi, getErrorMessage } from '@/lib/api';
import { Button, Input, Card } from '@/components/ui';
import { CheckCircle } from '@phosphor-icons/react';

const HEARD_VIA_OPTIONS = ['Facebook', 'Instagram', 'WhatsApp', 'YouTube', 'Friend', 'Church'] as const;

const schema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  preferredName: z.string().optional(),
  gender: z.string().min(1, 'Select gender'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  phone: z.string().min(7, 'Valid phone number required'),
  email: z.string().email('Valid email required'),
  address: z.string().min(5, 'Address is required'),
  state: z.string().min(2, 'State is required'),
  lga: z.string().min(2, 'LGA is required'),
  occupation: z.string().min(2, 'Occupation is required'),
  church: z.string().optional(),
  bornAgain: z.enum(['yes', 'no'], { message: 'Required' }),
  yearsFollowingChrist: z.string().optional(),
  baptizedWater: z.enum(['yes', 'no', '']).optional(),
  baptizedHolySpirit: z.enum(['yes', 'no', '']).optional(),
  premFan: z.enum(['yes', 'no'], { message: 'Required' }),
  knownFejosDuration: z.string().optional(),
  whyRegister: z.string().min(10, 'Please share at least 10 characters'),
  expectations: z.string().min(10, 'Please share at least 10 characters'),
  heardVia: z.array(z.string()).min(1, 'Select at least one option'),
  emergencyContact: z.string().min(5, 'Emergency contact is required'),
  medicalInfo: z.string().optional(),
  accommodation: z.string().optional(),
  mediaConsent: z.boolean(),
  additionalInfo: z.string().optional(),
  agreedToRules: z.literal(true, { message: 'You must agree to the rules' }),
});

type FormData = z.infer<typeof schema>;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="space-y-4">
      <h2 className="font-display text-lg font-semibold text-white border-b border-cinema-border pb-3">{title}</h2>
      {children}
    </Card>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-ink-secondary mb-1.5">{children}</label>;
}

const SelectField = forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; error?: string }
>(({ label, error, className, children, ...props }, ref) => (
  <div>
    <FieldLabel>{label}</FieldLabel>
    <select
      ref={ref}
      {...props}
      className={`w-full bg-cinema-surface border border-cinema-border rounded-lg text-white focus:outline-none focus:border-brand-orange px-4 py-2.5 text-sm ${error ? 'border-red-500' : ''} ${className ?? ''}`}
    >
      {children}
    </select>
    {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
  </div>
));
SelectField.displayName = 'SelectField';

const TextAreaField = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; error?: string }
>(({ label, error, className, ...props }, ref) => (
  <div>
    <FieldLabel>{label}</FieldLabel>
    <textarea
      ref={ref}
      {...props}
      className={`w-full bg-cinema-surface border border-cinema-border rounded-lg text-white placeholder:text-ink-muted focus:outline-none focus:border-brand-orange px-4 py-2.5 text-sm resize-none ${error ? 'border-red-500' : ''} ${className ?? ''}`}
    />
    {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
  </div>
));
TextAreaField.displayName = 'TextAreaField';

export default function ProgramRegistrationForm() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      heardVia: [],
      mediaConsent: false,
      agreedToRules: false,
    },
  });

  const heardVia = watch('heardVia') || [];

  const toggleHeardVia = (option: string) => {
    const next = heardVia.includes(option)
      ? heardVia.filter((v) => v !== option)
      : [...heardVia, option];
    setValue('heardVia', next, { shouldValidate: true });
  };

  const onInvalid = () => {
    toast.error('Please complete all required fields and agree to the program rules.');
  };

  const onSubmit = async (data: FormData) => {
    try {
      await programApi.register({
        ...data,
        bornAgain: data.bornAgain === 'yes',
        premFan: data.premFan === 'yes',
        baptizedWater: data.baptizedWater === 'yes' ? true : data.baptizedWater === 'no' ? false : undefined,
        baptizedHolySpirit: data.baptizedHolySpirit === 'yes' ? true : data.baptizedHolySpirit === 'no' ? false : undefined,
        preferredName: data.preferredName || undefined,
        church: data.church || undefined,
        yearsFollowingChrist: data.yearsFollowingChrist || undefined,
        knownFejosDuration: data.knownFejosDuration || undefined,
        medicalInfo: data.medicalInfo || undefined,
        accommodation: data.accommodation || undefined,
        additionalInfo: data.additionalInfo || undefined,
      });
      setSubmitted(true);
      toast.success('Registration submitted successfully!');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-16">
        <CheckCircle size={64} weight="fill" className="text-brand-orange mx-auto mb-4" />
        <h2 className="font-display text-2xl font-bold text-white mb-2">Registration Received</h2>
        <p className="text-ink-secondary max-w-md mx-auto">
          Thank you for registering. Our team will contact you with further details about the program.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-8">
      <Section title="Personal Information">
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Full Name" {...register('fullName')} error={errors.fullName?.message} />
          <Input label="Preferred Name (Optional)" {...register('preferredName')} />
          <SelectField label="Gender" {...register('gender')} error={errors.gender?.message}>
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </SelectField>
          <Input label="Date of Birth / Age" type="date" {...register('dateOfBirth')} error={errors.dateOfBirth?.message} />
          <Input label="Phone Number (WhatsApp)" {...register('phone')} error={errors.phone?.message} />
          <Input label="Email Address" type="email" {...register('email')} error={errors.email?.message} />
          <div className="sm:col-span-2">
            <Input label="Residential Address" {...register('address')} error={errors.address?.message} />
          </div>
          <Input label="State of Residence" {...register('state')} error={errors.state?.message} />
          <Input label="Local Government Area (LGA)" {...register('lga')} error={errors.lga?.message} />
          <Input label="Occupation / Profession" {...register('occupation')} error={errors.occupation?.message} />
          <Input label="Name of Church (if applicable)" {...register('church')} />
        </div>
      </Section>

      <Section title="Spiritual Information">
        <div className="grid sm:grid-cols-2 gap-4">
          <SelectField label="Are you born again?" {...register('bornAgain')} error={errors.bornAgain?.message}>
            <option value="">Select</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </SelectField>
          <Input label="How long have you been following Christ?" {...register('yearsFollowingChrist')} />
          <SelectField label="Have you been baptized in water?" {...register('baptizedWater')}>
            <option value="">Select</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </SelectField>
          <SelectField label="Are you baptized in the Holy Spirit?" {...register('baptizedHolySpirit')}>
            <option value="">Select</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </SelectField>
        </div>
      </Section>

      <Section title="Ministry Information">
        <div className="grid sm:grid-cols-2 gap-4">
          <SelectField label="Are you a fan of PREM Films Productions?" {...register('premFan')} error={errors.premFan?.message}>
            <option value="">Select</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </SelectField>
          <Input label="If yes, how long have you known Fejosbaba?" {...register('knownFejosDuration')} />
        </div>
      </Section>

      <Section title="Event Information">
        <TextAreaField label="Why are you registering for this event?" rows={4} {...register('whyRegister')} error={errors.whyRegister?.message} />
        <TextAreaField label="What are your expectations for this conference?" rows={4} {...register('expectations')} error={errors.expectations?.message} />
        <div>
          <FieldLabel>How did you hear about this event?</FieldLabel>
          <div className="flex flex-wrap gap-2 mt-2">
            {HEARD_VIA_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => toggleHeardVia(opt)}
                className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
                  heardVia.includes(opt)
                    ? 'bg-brand-orange border-brand-orange text-white'
                    : 'border-cinema-border text-ink-secondary hover:text-white'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
          {errors.heardVia && <p className="text-red-400 text-xs mt-1">{errors.heardVia.message}</p>}
        </div>
      </Section>

      <Section title="Medical & Additional Information">
        <Input label="Emergency Contact" {...register('emergencyContact')} error={errors.emergencyContact?.message} />
        <TextAreaField label="Medical Information" rows={3} {...register('medicalInfo')} />
        <TextAreaField label="Accommodation / Reservations" rows={2} {...register('accommodation')} />
        <TextAreaField label="Additional Information" rows={3} {...register('additionalInfo')} />
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" {...register('mediaConsent')} className="mt-1 accent-brand-orange" />
          <span className="text-sm text-ink-secondary">I consent to photos and videos taken during the program being used for ministry promotion.</span>
        </label>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            {...register('agreedToRules')}
            className="mt-1 accent-brand-orange"
          />
          <span className="text-sm text-ink-secondary">I agree to abide by all rules and regulations of this program.</span>
        </label>
        {errors.agreedToRules && <p className="text-red-400 text-xs">{errors.agreedToRules.message}</p>}
      </Section>

      <Button type="submit" loading={isSubmitting} className="w-full sm:w-auto px-10">
        Submit Registration
      </Button>
    </form>
  );
}
