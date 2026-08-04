import { ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const PRIORITY_DATA = [
  { name: 'High', value: 4, color: '#EF4444' },
  { name: 'Medium', value: 8, color: '#2563eb' },
  { name: 'Low', value: 3, color: '#10B981' },
];

const TREND_DATA = [
  { week: 'W1', Completed: 12, Velocity: 14 },
  { week: 'W2', Completed: 18, Velocity: 16 },
  { week: 'W3', Completed: 15, Velocity: 15 },
  { week: 'W4', Completed: 24, Velocity: 20 },
];

export default function AnalyticsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#131b2e] tracking-tight">Analytics & Insights</h1>
        <p className="text-sm text-[#505f76] mt-1">Visualize team performance, priority distribution, and velocity.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority Distribution */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm">
          <h2 className="text-base font-semibold text-[#131b2e] mb-4">Task Priority Distribution</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={PRIORITY_DATA}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {PRIORITY_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-2">
            {PRIORITY_DATA.map((item) => (
              <div key={item.name} className="flex items-center gap-2 text-xs text-[#505f76]">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span>{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Velocity Trend */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm">
          <h2 className="text-base font-semibold text-[#131b2e] mb-4">Sprint Velocity Trend</h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={TREND_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f2f3ff" />
              <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#737686' }} />
              <YAxis tick={{ fontSize: 12, fill: '#737686' }} />
              <Tooltip />
              <Line type="monotone" dataKey="Completed" stroke="#004ac6" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="Velocity" stroke="#10B981" strokeWidth={2} strokeDasharray="4 4" />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-2">
            <div className="flex items-center gap-2 text-xs text-[#505f76]">
              <span className="w-3 h-3 rounded-full bg-[#004ac6]" />
              <span>Completed Tasks</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#505f76]">
              <span className="w-3 h-3 rounded-full bg-[#10B981]" />
              <span>Target Velocity</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
