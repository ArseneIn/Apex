const priorityConfig = {
  high: { label: 'HIGH', class: 'badge-high' },
  HIGH: { label: 'HIGH', class: 'badge-high' },
  medium: { label: 'MED', class: 'badge-medium' },
  MEDIUM: { label: 'MED', class: 'badge-medium' },
  MED: { label: 'MED', class: 'badge-medium' },
  low: { label: 'LOW', class: 'badge-low' },
  LOW: { label: 'LOW', class: 'badge-low' },
};

const statusConfig = {
  Active: 'bg-green-100 text-green-700',
  active: 'bg-green-100 text-green-700',
  Pending: 'bg-amber-100 text-amber-700',
  pending: 'bg-amber-100 text-amber-700',
  Inactive: 'bg-gray-100 text-gray-500',
  Done: 'bg-green-100 text-green-700',
  'In Progress': 'bg-blue-100 text-blue-700',
  'To Do': 'bg-gray-100 text-gray-600',
};

export function PriorityBadge({ priority }) {
  const config = priorityConfig[priority] || { label: priority, class: 'badge-low' };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider ${config.class}`}>
      {config.label}
    </span>
  );
}

export function StatusBadge({ status }) {
  const cls = statusConfig[status] || 'bg-gray-100 text-gray-600';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {status}
    </span>
  );
}
