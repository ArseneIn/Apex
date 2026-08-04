import { useQuery } from '@tanstack/react-query';
import { getDashboardStats, getRecentActivity } from '../../api/endpoints';
import { StatCardSkeleton, ActivitySkeleton } from '../../components/ui/Skeleton';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

// Mock data fallback for demo
const MOCK_STATS = {
  total_tasks: 124,
  completed_tasks: 82,
  in_progress_tasks: 32,
  overdue_tasks: 10,
  total_change: 12,
  completed_change: 5,
  in_progress_change: 0,
  overdue_change: -2,
};

const MOCK_ACTIVITY = [
  { id: 1, user: 'Sarah Jenkins', action: 'updated task status to', highlight: 'Done', task: 'Implement new authentication flow for mobile app', timestamp: '10 mins ago', color: '#004ac6' },
  { id: 2, user: 'John Doe', action: 'assigned a task to', highlight: 'You', task: 'Review Q3 Marketing Strategy Draft', timestamp: '2 hours ago', color: '#c3c6d7' },
  { id: 3, user: 'Emily Chen', action: 'added a comment', highlight: '', task: null, comment: '"I think we need to adjust the padding on the hero section before launch."', timestamp: 'Yesterday at 4:30 PM', color: '#F59E0B' },
  { id: 4, user: 'System', action: 'created daily backup', highlight: '', task: null, timestamp: 'Yesterday at 1:00 AM', color: '#c3c6d7' },
];

const MOCK_CHART = [
  { day: 'Mon', Completed: 55, Added: 35 },
  { day: 'Tue', Completed: 78, Added: 50 },
  { day: 'Wed', Completed: 40, Added: 28 },
  { day: 'Thu', Completed: 90, Added: 68 },
  { day: 'Fri', Completed: 72, Added: 44 },
];

function StatCard({ icon, label, value, change, iconBg, iconColor }) {
  const isPositive = change > 0;
  const isNeutral = change === 0;
  const changeColor = isNeutral ? 'text-[#505f76] bg-[#eaedff]' : isPositive ? 'text-[#10B981] bg-green-50' : 'text-[#EF4444] bg-red-50';

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:border-[#2563eb] hover:shadow-[0_4px_12px_rgba(37,99,235,0.1)] transition-all duration-200 cursor-pointer group">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center ${iconColor} transition-colors`}>
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>{icon}</span>
        </div>
        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${changeColor}`}>
          <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>
            {isNeutral ? 'remove' : isPositive ? 'trending_up' : 'trending_down'}
          </span>
          {isNeutral ? '0%' : `${isPositive ? '+' : ''}${change}%`}
        </span>
      </div>
      <p className="text-xs font-semibold text-[#434655] tracking-wide mb-1">{label}</p>
      <p className="text-3xl font-bold text-[#131b2e]">{value}</p>
    </div>
  );
}

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStats,
    retry: 1,
    staleTime: 30_000,
  });

  const { data: activity, isLoading: activityLoading } = useQuery({
    queryKey: ['recent-activity'],
    queryFn: getRecentActivity,
    retry: 1,
    staleTime: 30_000,
  });

  const s = stats || MOCK_STATS;
  const acts = activity || MOCK_ACTIVITY;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page header */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#131b2e] tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-[#505f76] mt-1">Track your team&apos;s progress and recent activity.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 text-sm text-[#131b2e] bg-white border border-[#E2E8F0] px-3 py-2 rounded-lg hover:bg-[#f2f3ff] transition-colors">
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>filter_list</span>
            Filter
          </button>
          <button className="flex items-center gap-1.5 text-sm text-[#131b2e] bg-white border border-[#E2E8F0] px-3 py-2 rounded-lg hover:bg-[#f2f3ff] transition-colors">
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>calendar_today</span>
            This Week
          </button>
        </div>
      </header>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsLoading ? (
          [...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard icon="task" label="Total Tasks" value={s.total_tasks} change={s.total_change}
              iconBg="bg-[#f2f3ff]" iconColor="text-[#004ac6]" />
            <StatCard icon="check_circle" label="Completed" value={s.completed_tasks} change={s.completed_change}
              iconBg="bg-green-50" iconColor="text-[#10B981]" />
            <StatCard icon="pending" label="In Progress" value={s.in_progress_tasks} change={s.in_progress_change}
              iconBg="bg-amber-50" iconColor="text-[#F59E0B]" />
            <StatCard icon="error" label="Overdue" value={s.overdue_tasks} change={s.overdue_change}
              iconBg="bg-red-50" iconColor="text-[#EF4444]" />
          </>
        )}
      </div>

      {/* Chart + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-[#131b2e]">Task Completion Trends</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#004ac6] block" />
                <span className="text-xs text-[#505f76]">Completed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#c3c6d7] block" />
                <span className="text-xs text-[#505f76]">Added</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={MOCK_CHART} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f2f3ff" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#737686' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#737686' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px' }}
                cursor={{ fill: '#f2f3ff' }}
              />
              <Bar dataKey="Completed" fill="#004ac6" radius={[4, 4, 0, 0]} maxBarSize={24} />
              <Bar dataKey="Added" fill="#c3c6d7" radius={[4, 4, 0, 0]} maxBarSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-[#131b2e]">Recent Activity</h2>
            <button className="text-sm text-[#2563eb] font-medium hover:underline">View All</button>
          </div>

          {activityLoading ? (
            <ActivitySkeleton />
          ) : (
            <div className="flex-1 overflow-y-auto space-y-6 pr-1">
              {acts.map((item, idx) => (
                <div key={item.id} className="relative pl-6">
                  {/* Timeline line */}
                  {idx < acts.length - 1 && (
                    <div className="absolute left-[9px] top-6 bottom-[-24px] w-px bg-[#E2E8F0]" />
                  )}
                  {/* Timeline dot */}
                  <div
                    className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full ring-2 ring-white border"
                    style={{ backgroundColor: item.color, borderColor: item.color }}
                  />
                  <div>
                    <p className="text-sm text-[#131b2e] leading-relaxed">
                      <span className="font-semibold">{item.user}</span>{' '}
                      <span className="text-[#434655]">{item.action}</span>{' '}
                      {item.highlight && (
                        <span className="font-medium text-[#10B981]">{item.highlight}</span>
                      )}
                    </p>
                    {item.task && (
                      <p className="text-xs text-[#505f76] mt-0.5 line-clamp-1">{item.task}</p>
                    )}
                    {item.comment && (
                      <div className="bg-[#F1F5F9] border border-[#E2E8F0] rounded-lg p-2.5 mt-1.5 mb-1">
                        <p className="text-xs text-[#434655]">{item.comment}</p>
                      </div>
                    )}
                    <span className="text-[11px] text-[#737686] mt-1 block">{item.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
