'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Crown, UserX } from 'lucide-react';
import { adminApi, getErrorMessage } from '@/lib/api';
import { Button, Card, Badge, Spinner, EmptyState } from '@/components/ui';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function AdminPremiumPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-premium'],
    queryFn: () => adminApi.getPremiumUsers(),
  });

  const revokeMutation = useMutation({
    mutationFn: (id: string) => adminApi.revokePremium(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-premium'] });
      toast.success('Premium access revoked');
    },
    onError: e => toast.error(getErrorMessage(e)),
  });

  const users = data?.data?.data || [];
  const active = users.filter((u: any) => u.premiumSubscription?.isActive);
  const expired = users.filter((u: any) => !u.premiumSubscription?.isActive);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="font-display text-2xl font-bold text-white">Premium Users</h2>
        <p className="text-ink-secondary text-sm mt-0.5">{active.length} active · {expired.length} expired</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size={32} /></div>
      ) : users.length === 0 ? (
        <EmptyState icon={<Crown size={28} />} title="No premium users yet" description="Users will appear here after subscribing" />
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cinema-border">
                {['User', 'Email', 'Plan', 'Expires', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-ink-muted uppercase tracking-wider px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-cinema-border">
              {users.map((user: any) => {
                const sub = user.premiumSubscription;
                const isActive = sub?.isActive;
                const isExpired = sub && new Date() > new Date(sub.endDate);
                return (
                  <tr key={user.id} className="hover:bg-cinema-elevated transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-orange/20 border border-brand-orange/30 flex items-center justify-center">
                          <Crown size={12} className="text-brand-orange" />
                        </div>
                        <p className="text-white text-sm font-medium">{user.name}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-ink-secondary">{user.email}</td>
                    <td className="px-5 py-3">
                      <Badge variant="orange" className="capitalize">{sub?.plan || '—'}</Badge>
                    </td>
                    <td className="px-5 py-3 text-xs text-ink-muted">
                      {sub ? formatDate(sub.endDate) : '—'}
                    </td>
                    <td className="px-5 py-3">
                      {isActive && !isExpired ? (
                        <Badge variant="green">Active</Badge>
                      ) : (
                        <Badge variant="red">Expired</Badge>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      {isActive && (
                        <Button variant="danger" size="sm"
                          onClick={() => confirm(`Revoke ${user.name}'s premium access?`) && revokeMutation.mutate(user.id)}>
                          <UserX size={13} /> Revoke
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}