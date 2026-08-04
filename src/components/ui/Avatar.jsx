const sizeMap = {
  sm: 'w-7 h-7 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-11 h-11 text-base',
  xl: 'w-14 h-14 text-lg',
};

const colorMap = [
  'bg-blue-100 text-blue-700',
  'bg-green-100 text-green-700',
  'bg-purple-100 text-purple-700',
  'bg-amber-100 text-amber-700',
  'bg-pink-100 text-pink-700',
  'bg-cyan-100 text-cyan-700',
];

function getInitials(name = '') {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function getColor(name = '') {
  let hash = 0;
  for (let c of name) hash = c.charCodeAt(0) + hash * 31;
  return colorMap[Math.abs(hash) % colorMap.length];
}

export default function Avatar({ src, name = '', size = 'md', className = '', grayscale = false }) {
  return src ? (
    <img
      src={src}
      alt={name || 'User avatar'}
      className={`${sizeMap[size]} rounded-full object-cover border border-white ${grayscale ? 'grayscale opacity-70' : ''} ${className}`}
    />
  ) : (
    <div
      className={`${sizeMap[size]} rounded-full flex items-center justify-center font-semibold ${getColor(name)} ${className}`}
      aria-label={name}
      title={name}
    >
      {getInitials(name)}
    </div>
  );
}
