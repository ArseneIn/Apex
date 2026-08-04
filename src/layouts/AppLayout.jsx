import { useState, useCallback } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import Avatar from '../components/ui/Avatar';

const navItems = [
  { to: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { to: '/boards', icon: 'view_kanban', label: 'Boards' },
  { to: '/teams', icon: 'group', label: 'Teams' },
  { to: '/analytics', icon: 'analytics', label: 'Analytics' },
  { to: '/settings', icon: 'settings', label: 'Settings' },
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState('');

  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
  }, [logout, navigate]);

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center gap-2 px-2 mb-6">
        <div className="w-8 h-8 rounded-lg bg-[#2563eb] flex items-center justify-center text-white font-bold text-lg">
          A
        </div>
        <div>
          <div className="font-bold text-[#004ac6] text-[16px] leading-tight tracking-tight">Apex</div>
          <div className="text-[11px] text-[#505f76]">Enterprise Suite</div>
        </div>
      </div>

      {/* Create Task CTA */}
      <div className="px-2 mb-6">
        <button
          onClick={() => navigate('/boards')}
          className="w-full bg-[#2563eb] text-white text-sm font-semibold py-2 rounded-lg flex items-center justify-center gap-1.5 hover:bg-[#1d4ed8] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:ring-offset-2"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
          Create Task
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex-1 space-y-0.5" aria-label="Main navigation">
        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                isActive
                  ? 'bg-[#d0e1fb] text-[#004ac6] font-semibold'
                  : 'text-[#505f76] hover:bg-[#eaedff] hover:text-[#131b2e]'
              }`
            }
            onClick={() => setSidebarOpen(false)}
            aria-current={({ isActive }) => isActive ? 'page' : undefined}
          >
            {({ isActive }) => (
              <>
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: '20px',
                    fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                  }}
                >
                  {icon}
                </span>
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="mt-auto border-t border-[#E2E8F0] pt-4 space-y-0.5">
        <NavLink
          to="/settings"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#505f76] hover:bg-[#eaedff] transition-colors"
          onClick={() => setSidebarOpen(false)}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>help</span>
          Help
        </NavLink>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#505f76] hover:bg-[#eaedff] transition-colors"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>logout</span>
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-[#F1F5F9]">
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex flex-col fixed left-0 top-0 h-full w-60 bg-white border-r border-[#E2E8F0] z-50 py-4 px-2"
        aria-label="Sidebar navigation"
      >
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}
      <aside
        className={`fixed left-0 top-0 h-full w-60 bg-white border-r border-[#E2E8F0] z-50 py-4 px-2 flex flex-col transition-transform duration-300 md:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Mobile sidebar navigation"
      >
        <SidebarContent />
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col md:ml-60 min-h-screen">
        {/* Top nav */}
        <header className="sticky top-0 z-40 bg-white border-b border-[#E2E8F0] shadow-sm h-16 flex items-center px-4 md:px-6 gap-4">
          {/* Mobile hamburger */}
          <button
            className="md:hidden text-[#505f76] hover:text-[#004ac6] p-1 rounded focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label="Toggle sidebar"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>

          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#737686] text-sm">search</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full pl-9 pr-4 py-2 bg-[#f2f3ff] border border-[#E2E8F0] rounded-lg text-sm text-[#131b2e] placeholder-[#737686] focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:bg-white transition-all"
                aria-label="Search"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 ml-auto">
            <button
              className="relative text-[#505f76] hover:text-[#004ac6] p-2 rounded-lg hover:bg-[#f2f3ff] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
              aria-label="Notifications"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#EF4444] rounded-full" aria-hidden="true" />
            </button>
            <button
              className="hidden sm:flex text-[#505f76] hover:text-[#004ac6] p-2 rounded-lg hover:bg-[#f2f3ff] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
              aria-label="Apps"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>apps</span>
            </button>

            <div className="hidden sm:block h-6 w-px bg-[#E2E8F0] mx-1" />

            <button className="hidden sm:flex items-center gap-1 text-sm text-[#505f76] hover:text-[#004ac6] px-2 py-1 rounded-lg hover:bg-[#f2f3ff] transition-colors">
              <span className="font-medium">Workspace Switcher</span>
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>expand_more</span>
            </button>

            <button
              onClick={() => navigate('/settings')}
              className="focus:outline-none focus:ring-2 focus:ring-[#2563eb] rounded-full"
              aria-label="User profile"
            >
              <Avatar name={user?.username || user?.email || 'User'} size="sm" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-4 md:px-8 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
