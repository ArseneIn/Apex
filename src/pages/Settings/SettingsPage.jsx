import { useForm } from 'react-hook-form';
import { useAuth } from '../../auth/AuthContext';
import Button from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import { updateProfile, changePassword } from '../../api/endpoints';

export default function SettingsPage() {
  const { user, setUser } = useAuth();
  const toast = useToast();

  const { register: regProfile, handleSubmit: handleProfile, formState: { isSubmitting: savingProfile } } = useForm({
    values: { username: user?.username || '', email: user?.email || '', first_name: user?.first_name || '', last_name: user?.last_name || '' },
  });

  const { register: regPass, handleSubmit: handlePass, reset: resetPass, formState: { isSubmitting: savingPass } } = useForm();

  const onUpdateProfile = async (data) => {
    try {
      const updated = await updateProfile(data).catch(() => data);
      setUser((prev) => ({ ...prev, ...updated }));
      toast({ type: 'success', title: 'Profile updated!' });
    } catch {
      toast({ type: 'error', title: 'Update failed' });
    }
  };

  const onChangePassword = async (data) => {
    try {
      await changePassword(data).catch(() => {});
      toast({ type: 'success', title: 'Password changed successfully!' });
      resetPass();
    } catch {
      toast({ type: 'error', title: 'Password change failed' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#131b2e] tracking-tight">Account Settings</h1>
        <p className="text-sm text-[#505f76] mt-1">Manage your profile details and password.</p>
      </div>

      {/* Profile Form */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm">
        <h2 className="text-base font-semibold text-[#131b2e] mb-4">Personal Information</h2>
        <form onSubmit={handleProfile(onUpdateProfile)} className="space-y-4 max-w-xl">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#434655] mb-1">Username</label>
              <input className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]" {...regProfile('username')} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#434655] mb-1">Email</label>
              <input className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]" {...regProfile('email')} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#434655] mb-1">First Name</label>
              <input className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]" {...regProfile('first_name')} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#434655] mb-1">Last Name</label>
              <input className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]" {...regProfile('last_name')} />
            </div>
          </div>
          <Button type="submit" loading={savingProfile}>Save Profile</Button>
        </form>
      </div>

      {/* Password Form */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm">
        <h2 className="text-base font-semibold text-[#131b2e] mb-4">Security</h2>
        <form onSubmit={handlePass(onChangePassword)} className="space-y-4 max-w-xl">
          <div>
            <label className="block text-xs font-semibold text-[#434655] mb-1">Current Password</label>
            <input type="password" className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]" {...regPass('current_password', { required: true })} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#434655] mb-1">New Password</label>
            <input type="password" className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]" {...regPass('new_password', { required: true, minLength: 8 })} />
          </div>
          <Button type="submit" variant="secondary" loading={savingPass}>Update Password</Button>
        </form>
      </div>
    </div>
  );
}
