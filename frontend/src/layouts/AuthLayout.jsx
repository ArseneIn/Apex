import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eaedff] via-[#f2f3ff] to-[#faf8ff] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#2563eb] flex items-center justify-center text-white font-bold text-2xl mx-auto mb-3 shadow-lg">
            A
          </div>
          <h1 className="text-2xl font-bold text-[#004ac6] tracking-tight">Apex</h1>
          <p className="text-sm text-[#505f76] mt-1">Enterprise Project Suite</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-[#E2E8F0] p-8">
          <Outlet />
        </div>

        <p className="text-center text-xs text-[#737686] mt-6">
          © 2024 Apex Enterprise Suite. All rights reserved.
        </p>
      </div>
    </div>
  );
}
