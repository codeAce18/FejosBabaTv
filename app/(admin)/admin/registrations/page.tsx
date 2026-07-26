'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash, ClipboardText, MagnifyingGlass, DownloadSimple } from '@phosphor-icons/react';
import { adminApi, getErrorMessage } from '@/lib/api';
import { Button, Input, Card, Spinner, EmptyState } from '@/components/ui';
import { formatDate } from '@/lib/utils';
import type { ProgramRegistration } from '@/lib/types';
import toast from 'react-hot-toast';

export default function AdminRegistrationsPage() {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-registrations'],
    queryFn: () => adminApi.getRegistrations(),
  });

  const registrations: ProgramRegistration[] = data?.data?.data || [];

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteRegistration(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-registrations'] });
      toast.success('Registration deleted');
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const filtered = registrations.filter(
    (r) =>
      r.fullName.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      r.phone.includes(search)
  );

  const exportCsv = () => {
    if (!filtered.length) return;
    const headers = ['Name', 'Email', 'Phone', 'State', 'LGA', 'Registered'];
    const rows = filtered.map((r) =>
      [r.fullName, r.email, r.phone, r.state, r.lga, formatDate(r.createdAt)]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `program-registrations-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">Program Registrations</h2>
          <p className="text-ink-secondary text-sm mt-0.5">{registrations.length} submissions</p>
        </div>
        <Button variant="secondary" onClick={exportCsv} disabled={!filtered.length}>
          <DownloadSimple size={16} /> Export CSV
        </Button>
      </div>

      <Input
        placeholder="Search by name, email, or phone..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        leftIcon={<MagnifyingGlass size={16} />}
        className="max-w-md"
      />

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size={32} /></div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={<ClipboardText size={28} />} title="No registrations yet" description="Submissions from the upcoming program form will appear here" />
      ) : (
        <div className="space-y-3">
          {filtered.map((reg) => (
            <Card key={reg.id} className="overflow-hidden">
              <button
                type="button"
                onClick={() => setExpanded(expanded === reg.id ? null : reg.id)}
                className="w-full flex items-center justify-between gap-4 text-left"
              >
                <div>
                  <h3 className="font-semibold text-white">{reg.fullName}</h3>
                  <p className="text-ink-muted text-sm">{reg.email} · {reg.phone}</p>
                  <p className="text-ink-muted text-xs mt-1">{reg.state}, {reg.lga} · {formatDate(reg.createdAt)}</p>
                </div>
                <span className="text-ink-muted text-xs shrink-0">{expanded === reg.id ? 'Hide' : 'View'}</span>
              </button>

              {expanded === reg.id && (
                <div className="mt-4 pt-4 border-t border-cinema-border grid sm:grid-cols-2 gap-3 text-sm">
                  <Detail label="Preferred Name" value={reg.preferredName} />
                  <Detail label="Gender" value={reg.gender} />
                  <Detail label="Date of Birth" value={reg.dateOfBirth} />
                  <Detail label="Occupation" value={reg.occupation} />
                  <Detail label="Church" value={reg.church} />
                  <Detail label="Born Again" value={reg.bornAgain ? 'Yes' : 'No'} />
                  <Detail label="Years Following Christ" value={reg.yearsFollowingChrist} />
                  <Detail label="Baptized (Water)" value={reg.baptizedWater == null ? '—' : reg.baptizedWater ? 'Yes' : 'No'} />
                  <Detail label="Baptized (Holy Spirit)" value={reg.baptizedHolySpirit == null ? '—' : reg.baptizedHolySpirit ? 'Yes' : 'No'} />
                  <Detail label="PREM Fan" value={reg.premFan ? 'Yes' : 'No'} />
                  <Detail label="Known Fejosbaba" value={reg.knownFejosDuration} />
                  <Detail label="Heard Via" value={(reg.heardVia || []).join(', ')} />
                  <Detail label="Emergency Contact" value={reg.emergencyContact} />
                  <Detail label="Address" value={reg.address} className="sm:col-span-2" />
                  <Detail label="Why Register" value={reg.whyRegister} className="sm:col-span-2" />
                  <Detail label="Expectations" value={reg.expectations} className="sm:col-span-2" />
                  <Detail label="Medical Info" value={reg.medicalInfo} className="sm:col-span-2" />
                  <Detail label="Accommodation" value={reg.accommodation} className="sm:col-span-2" />
                  <Detail label="Additional Info" value={reg.additionalInfo} className="sm:col-span-2" />
                  <Detail label="Media Consent" value={reg.mediaConsent ? 'Yes' : 'No'} />
                  <div className="sm:col-span-2 flex justify-end pt-2">
                    <button
                      onClick={() => {
                        if (confirm(`Delete registration for ${reg.fullName}?`)) {
                          deleteMutation.mutate(reg.id);
                        }
                      }}
                      className="flex items-center gap-1.5 text-red-400 hover:text-red-300 text-sm"
                    >
                      <Trash size={14} /> Delete
                    </button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function Detail({ label, value, className = '' }: { label: string; value?: string | null; className?: string }) {
  if (!value) return null;
  return (
    <div className={className}>
      <p className="text-ink-muted text-xs uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-ink-secondary">{value}</p>
    </div>
  );
}
