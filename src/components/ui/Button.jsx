const variants = {
  primary:
    'bg-[#2563eb] text-white hover:bg-[#1d4ed8] focus:ring-[#2563eb] border-transparent',
  secondary:
    'bg-white text-[#475569] hover:bg-[#f2f3ff] focus:ring-[#c3c6d7] border border-[#E2E8F0]',
  danger:
    'bg-[#EF4444] text-white hover:bg-[#dc2626] focus:ring-[#EF4444] border-transparent',
  ghost:
    'bg-transparent text-[#505f76] hover:bg-[#eaedff] focus:ring-[#c3c6d7] border-transparent',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-md gap-1.5',
  md: 'px-4 py-2 text-sm rounded-lg gap-2',
  lg: 'px-5 py-2.5 text-sm rounded-lg gap-2',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  className = '',
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center font-semibold
        transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon ? (
        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
          {icon}
        </span>
      ) : null}
      {children}
    </button>
  );
}
