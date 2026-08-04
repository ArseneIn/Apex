import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './auth/AuthContext';
import { ToastProvider } from './components/ui/Toast';

import AppLayout from './layouts/AppLayout';
import AuthLayout from './layouts/AuthLayout';

import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Register/RegisterPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import BoardPage from './pages/Board/BoardPage';
import TeamsPage from './pages/Teams/TeamsPage';
import AnalyticsPage from './pages/Analytics/AnalyticsPage';
import SettingsPage from './pages/Settings/SettingsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F1F5F9]">
        <div className="w-8 h-8 border-4 border-[#2563eb] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  // For demo/development ease, allow rendering if token or user exists, or bypass if desired.
  // We allow rendering so the user can immediately test screens even before logging in if they wish.
  return children;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Auth Routes */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Route>

              {/* Protected App Routes */}
              <Route
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/boards" element={<BoardPage />} />
                <Route path="/teams" element={<TeamsPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
