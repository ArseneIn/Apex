import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import Button from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { username: '', password: '' } });

  const onSubmit = async (data) => {
    try {
      await login(data);
      toast({ type: 'success', title: 'Welcome back!', message: 'Logged in successfully.' });
      navigate('/dashboard');
    } catch (err) {
      const msg = err?.response?.data?.detail || 'Invalid credentials. Please try again.';
      toast({ type: 'error', title: 'Login failed', message: msg });
    }
  };

  return (
    <>
      <h2 className="text-xl font-bold text-[#131b2e] mb-1">Sign in to Apex</h2>
      <p className="text-sm text-[#505f76] mb-6">Enter your credentials to continue</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {/* Username */}
        <div>
          <label htmlFor="username" className="block text-xs font-semibold text-[#434655] mb-1">
            Username or Email
          </label>
          <input
            id="username"
            type="text"
            autoComplete="username"
            className={`w-full px-3 py-2.5 border rounded-lg text-sm text-[#131b2e] bg-white placeholder-[#737686] focus:outline-none focus:ring-2 focus:ring-[#2563eb] transition-all ${
              errors.username ? 'border-[#EF4444]' : 'border-[#E2E8F0]'
            }`}
            placeholder="Enter your username"
            {...register('username', { required: 'Username is required' })}
          />
          {errors.username && (
            <p className="text-[11px] text-[#EF4444] mt-1">{errors.username.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-xs font-semibold text-[#434655] mb-1">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              className={`w-full px-3 py-2.5 pr-10 border rounded-lg text-sm text-[#131b2e] bg-white placeholder-[#737686] focus:outline-none focus:ring-2 focus:ring-[#2563eb] transition-all ${
                errors.password ? 'border-[#EF4444]' : 'border-[#E2E8F0]'
              }`}
              placeholder="Enter your password"
              {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'At least 6 characters' } })}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737686] hover:text-[#505f76]"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                {showPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
          {errors.password && (
            <p className="text-[11px] text-[#EF4444] mt-1">{errors.password.message}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-[#505f76] cursor-pointer">
            <input type="checkbox" className="rounded border-[#E2E8F0] text-[#2563eb]" />
            Remember me
          </label>
          <button type="button" className="text-sm text-[#2563eb] hover:underline">
            Forgot password?
          </button>
        </div>

        <Button type="submit" loading={isSubmitting} className="w-full" size="lg">
          Sign In
        </Button>
      </form>

      <p className="text-center text-sm text-[#505f76] mt-6">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="text-[#2563eb] font-semibold hover:underline">
          Create account
        </Link>
      </p>

      {/* Demo hint */}
      <div className="mt-4 p-3 bg-[#eaedff] rounded-lg">
        <p className="text-xs text-[#434655] text-center">
          <span className="font-semibold">Demo:</span> Use your registered credentials
        </p>
      </div>
    </>
  );
}
