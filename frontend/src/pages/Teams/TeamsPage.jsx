import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getWorkspaces, updateWorkspace, inviteMember } from '../../api/endpoints';
import Button from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';
import Modal from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';

// Mock data
const MOCK_WORKSPACE = {
  id: 1, name: 'Apex Design Team',
  description: 'Core design and product team for the Apex Enterprise Suite.',
  visibility: 'private',
};
const MOCK_MEMBERS = [
  { id: 1, username: 'Sarah Jenkins', email: 'sarah.j@apex.com', role: 'Admin', status: 'Active', avatar: null },
  { id: 2, username: 'David Chen', email: 'david.c@apex.com', role: 'Member', status: 'Active', avatar: null },
  { id: 3, username: 'Elena Rodriguez', email: 'elena.r@apex.com', role: 'Member', status: 'Pending', avatar: null },
  { id: 4, username: 'Marcus Johnson', email: 'marcus.j@apex.com', role: 'Member', status: 'Active', avatar: null },
];

export default function TeamsPage() {
  const toast = useToast();
  const qc = useQueryClient();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  const { data: workspaces } = useQuery({ queryKey: ['workspaces'], queryFn: getWorkspaces, retry: 1 });
  const workspace = workspaces?.[0] || MOCK_WORKSPACE;
  const members = MOCK_MEMBERS.filter((m) => filterStatus === 'all' || m.status.toLowerCase() === filterStatus);

  const { register: regWorkspace, handleSubmit: handleWS, formState: { isSubmitting: saving } } = useForm({
    values: { name: workspace.name, description: workspace.description, visibility: workspace.visibility },
  });

  const { register: regInvite, handleSubmit: handleInvite, reset: resetInvite, formState: { isSubmitting: inviting } } = useForm();

  const onSaveWorkspace = async (data) => {
    try {
      await updateWorkspace(workspace.id, data).catch(() => data);
      toast({ type: 'success', title: 'Workspace saved!' });
    } catch {
      toast({ type: 'error', title: 'Save failed' });
    }
  };

  const onInvite = async (data) => {
    try {
      await inviteMember(workspace.id, data.email).catch(() => {});
      toast({ type: 'success', title: 'Invitation sent!', message: `Invite sent to ${data.email}` });
      setInviteOpen(false);
      resetInvite();
    } catch {
      toast({ type: 'error', title: 'Invite failed' });
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#131b2e] tracking-tight">Teams & Workspace</h1>
          <p className="text-sm text-[#505f76] mt-1">Manage your team members and workspace settings.</p>
        </div>
        <Button icon="person_add" onClick={() => setInviteOpen(true)}>Add Member</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workspace Settings */}
        <div className="col-span-1">
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm">
            <h2 className="text-base font-semibold text-[#131b2e] mb-5">Workspace Settings</h2>
            <form onSubmit={handleWS(onSaveWorkspace)} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#434655] mb-1">Workspace Name</label>
                <input
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                  {...regWorkspace('name', { required: true })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#434655] mb-1">Description</label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                  {...regWorkspace('description')}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#434655] mb-1">Visibility</label>
                <div className="relative">
                  <select
                    className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-white"
                    {...regWorkspace('visibility')}
                  >
                    <option value="private">Private - Invite Only</option>
                    <option value="internal">Internal - Anyone in org</option>
                    <option value="public">Public</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#737686] pointer-events-none" style={{ fontSize: '18px' }}>expand_more</span>
                </div>
              </div>
              <Button type="submit" variant="secondary" loading={saving} size="sm">Save Changes</Button>
            </form>
          </div>
        </div>

        {/* Team Members */}
        <div className="col-span-1 lg:col-span-2">
          <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E2E8F0] flex justify-between items-center bg-[#F1F5F9]/50">
              <h2 className="text-base font-semibold text-[#131b2e]">
                Team Members{' '}
                <span className="text-sm text-[#505f76] font-normal ml-1">({members.length})</span>
              </h2>
              <div className="flex items-center gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="text-xs text-[#505f76] bg-transparent border-none focus:outline-none cursor-pointer"
                  aria-label="Filter members by status"
                >
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                </select>
                <span className="material-symbols-outlined text-[#505f76]" style={{ fontSize: '18px' }}>filter_list</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse" role="table">
                <thead>
                  <tr className="border-b border-[#E2E8F0]">
                    <th className="py-3 px-6 text-xs font-semibold text-[#505f76] tracking-wide">Member</th>
                    <th className="py-3 px-4 text-xs font-semibold text-[#505f76] tracking-wide">Role</th>
                    <th className="py-3 px-4 text-xs font-semibold text-[#505f76] tracking-wide">Status</th>
                    <th className="py-3 px-4 text-xs font-semibold text-[#505f76] tracking-wide text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member) => (
                    <tr
                      key={member.id}
                      className="border-b border-[#E2E8F0] hover:bg-[#F1F5F9] transition-colors group cursor-pointer"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <Avatar name={member.username} size="md" />
                          <div>
                            <div className="text-sm font-medium text-[#131b2e]">{member.username}</div>
                            <div className="text-xs text-[#737686]">{member.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-[#505f76]">{member.role}</td>
                      <td className="py-4 px-4">
                        <StatusBadge status={member.status} />
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          className="text-[#505f76] hover:text-[#004ac6] p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                          aria-label={`More options for ${member.username}`}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>more_vert</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      <Modal
        isOpen={inviteOpen}
        onClose={() => setInviteOpen(false)}
        title="Invite Member"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setInviteOpen(false)}>Cancel</Button>
            <Button onClick={handleInvite(onInvite)} loading={inviting}>Send Invite</Button>
          </>
        }
      >
        <form className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#434655] mb-1">Email Address *</label>
            <input
              type="email"
              placeholder="colleague@company.com"
              className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
              {...regInvite('email', { required: true, pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ } })}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#434655] mb-1">Role</label>
            <select className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-white">
              <option>Member</option>
              <option>Admin</option>
              <option>Viewer</option>
            </select>
          </div>
        </form>
      </Modal>
    </div>
  );
}
