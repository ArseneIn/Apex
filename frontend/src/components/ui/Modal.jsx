import { useEffect, useRef } from 'react';

export default function Modal({ isOpen, onClose, title, children, footer, size = 'md' }) {
  const overlayRef = useRef(null);
  const firstFocusRef = useRef(null);

  const sizeMap = {
    sm: 'max-w-sm',
    md: 'max-w-xl',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.activeElement;
    firstFocusRef.current?.focus();
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      prev?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] modal-backdrop flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div
        className={`relative bg-white rounded-xl shadow-2xl w-full ${sizeMap[size]} flex flex-col max-h-[90vh]`}
        style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.18)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] shrink-0">
          <h2 className="text-lg font-semibold text-[#131b2e]">{title}</h2>
          <button
            ref={firstFocusRef}
            onClick={onClose}
            className="text-[#737686] hover:text-[#131b2e] transition-colors rounded-lg p-1 focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#E2E8F0] shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
