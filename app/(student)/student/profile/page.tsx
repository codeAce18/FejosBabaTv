'use client';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { User, Phone, MapPin, Hash, Building, GraduationCap, Save } from 'lucide-react';
import { studentApi, getErrorMessage } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Button, Input, Card, Badge } from '@/components/ui';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function StudentProfilePage() {
  const { user, setAuth } = useAuthStore();
  const profile = user?.studentProfile;

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: profile?.phone || '',
    address: profile?.address || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await studentApi.updateProfile(form);
      // Refresh user in store
      const meRes = await import('@/lib/api').then(m => m.authApi.getMe());
      if (meRes.data.data && user) {
        const token = localStorage.getItem('fejos_token') || '';
        setAuth(meRes.data.data as any, token);
      }
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h2 className="font-display text-2xl font-bold text-white">My Profile</h2>
        <p className="text-ink-secondary text-sm mt-0.5">View and update your personal information</p>
      </div>

      {/* Avatar & Info Card */}
      <Card className="flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-brand-navy/30 border border-brand-navy/50 flex items-center justify-center flex-shrink-0">
          <GraduationCap size={30} className="text-blue-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-xl font-bold text-white">{user?.name}</h3>
          <p className="text-ink-secondary text-sm">{user?.email}</p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <Badge variant="navy">{profile?.department}</Badge>
            <Badge variant="gray">{profile?.level} Level</Badge>
            <Badge variant="orange">Student</Badge>
          </div>
        </div>
      </Card>

      {/* Academic Info (Read-only) */}
      <Card>
        <h4 className="font-display text-sm font-semibold text-ink-secondary uppercase tracking-wider mb-4">
          Academic Information
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Admission Number', value: profile?.admissionNumber, icon: Hash },
            { label: 'Department', value: profile?.department, icon: Building },
            { label: 'Level', value: `${profile?.level} Level`, icon: GraduationCap },
            { label: 'Email', value: user?.email, icon: User },
            { label: 'Enrolled', value: user?.createdAt ? formatDate(user.createdAt) : '—', icon: GraduationCap },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex items-start gap-3 p-3 rounded-xl bg-cinema-elevated border border-cinema-border">
              <div className="w-8 h-8 rounded-lg bg-cinema-surface flex items-center justify-center flex-shrink-0">
                <Icon size={14} className="text-ink-secondary" />
              </div>
              <div>
                <p className="text-ink-muted text-xs">{label}</p>
                <p className="text-white text-sm font-medium mt-0.5">{value || '—'}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-ink-muted text-xs mt-3">
          * Academic information can only be changed by your administrator
        </p>
      </Card>

      {/* Editable Info */}
      <Card>
        <h4 className="font-display text-sm font-semibold text-ink-secondary uppercase tracking-wider mb-4">
          Personal Information
        </h4>
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Full Name"
            value={form.name}
            onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            leftIcon={<User size={16} />}
          />
          <Input
            label="Phone Number"
            type="tel"
            placeholder="08012345678"
            value={form.phone}
            onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
            leftIcon={<Phone size={16} />}
          />
          <div>
            <label className="block text-sm font-medium text-ink-secondary mb-1.5">
              <span className="flex items-center gap-1.5"><MapPin size={14} /> Address</span>
            </label>
            <textarea
              className="w-full bg-cinema-surface border border-cinema-border rounded-lg text-white placeholder:text-ink-muted focus:outline-none focus:border-brand-orange px-4 py-2.5 text-sm resize-none"
              rows={3}
              placeholder="Your home address..."
              value={form.address}
              onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
            />
          </div>
          <Button type="submit" loading={saving} size="md">
            <Save size={16} /> Save Changes
          </Button>
        </form>
      </Card>
    </div>
  );
}