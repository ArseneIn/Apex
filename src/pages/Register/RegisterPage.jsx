import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { registerUser } from '../../api/endpoints';
import Button from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';

export default function RegisterPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      await registerUser({
        username: data.username,
        email: data.email,
        password: data.password,
        re_password: data.confirmPassword,
      });
      toast({ type: 'success', title: 'Account created!', message: 'Please sign in.' });
      navigate('/login');
    } catch (err) {
      const errors = err?.response?.data;
      const msg = errors
        ? Object.values(errors).flat().join(' ')
        : 'Registration failed. Try again.';
      toast({ type: 'error', title: 'Registration failed', message: msg });
    }
  };

  const inputCls = (fieldError) =>
    `w-full px-3 py-2.5 border rounded-lg text-sm text-[#131b2e] bg-white placeholder-[#737686] focus:outline-none focus:ring-2 focus:ring-[#2563eb] transition-all ${
      fieldError ? 'border-[#EF4444]' : 'border-[#E2E8F0]'
    }`;

  return (
    <>
      <h2 className="text-xl font-bold text-[#131b2e] mb-1">Create your account</h2>
      <p className="text-sm text-[#505f76] mb-6">Join Apex to manage your projects</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="username" className="block text-xs font-semibold text-[#434655] mb-1">Username</label>
            <input id="username" className={inputCls(errors.username)} placeholder="johndoe"
              {...register('username', { required: 'Required', minLength: { value: 3, message: 'Min 3 chars' } })} />
            {errors.username && <p className="text-[11px] text-[#EF4444] mt-1">{errors.username.message}</p>}
          </div>
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-[#434655] mb-1">Email</label>
            <input id="email" type="email" className={inputCls(errors.email)} placeholder="john@co.com"
              {...register('email', {
                required: 'Required',
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' }
              })} />
            {errors.email && <p className="text-[11px] text-[#EF4444] mt-1">{errors.email.message}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="reg-password" className="block text-xs font-semibold text-[#434655] mb-1">Password</label>
          <div className="relative">
            <input id="reg-password" type={showPassword ? 'text' : 'password'} className={inputCls(errors.password)}
              placeholder="Min 8 characters"
              {...register('password', { required: 'Required', minLength: { value: 8, message: 'At least 8 characters' } })} />
            <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737686]"
              onClick={() => setShowPassword(v => !v)} aria-label="Toggle password">
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                {showPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
          {errors.password && <p className="text-[11px] text-[#EF4444] mt-1">{errors.password.message}</p>}
        </div>

        <div>
          <label htmlFor="confirm-password" className="block text-xs font-semibold text-[#434655] mb-1">Confirm Password</label>
          <input id="confirm-password" type="password" className={inputCls(errors.confirmPassword)}
            placeholder="Repeat your password"
            {...register('confirmPassword', {
              required: 'Required',
              validate: (v) => v === password || 'Passwords do not match',
            })} />
          {errors.confirmPassword && <p className="text-[11px] text-[#EF4444] mt-1">{errors.confirmPassword.message}</p>}
        </div>

        <div>
          <label className="flex items-start gap-2 text-sm text-[#505f76] cursor-pointer">
            <input type="checkbox" required className="mt-0.5 rounded border-[#E2E8F0] text-[#2563eb]" />
            <span>I agree to the <button type="button" className="text-[#2563eb] hover:underline">Terms of Service</button> and <button type="button" className="text-[#2563eb] hover:underline">Privacy Policy</button></span>
          </label>
        </div>

        <Button type="submit" loading={isSubmitting} className="w-full" size="lg">
          Create Account
        </Button>
      </form>

      <p className="text-center text-sm text-[#505f76] mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-[#2563eb] font-semibold hover:underline">Sign in</Link>
      </p>
    </>
  );
}
