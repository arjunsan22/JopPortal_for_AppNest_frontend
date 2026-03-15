// src/components/admin/StatusBadge.jsx
export default function StatusBadge({ status }) {
  const statusConfig = {
    pending: {
      label: 'Pending',
      className: 'bg-yellow-100 text-yellow-700 border-yellow-200'
    },
    selected: {
      label: 'Selected',
      className: 'bg-green-100 text-green-700 border-green-200'
    },
    rejected: {
      label: 'Rejected',
      className: 'bg-red-100 text-red-700 border-red-200'
    }
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${config.className}`}
    >
      {config.label}
    </span>
  );
}