import React from 'react';

const Modal: React.FC<{
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  wide?: boolean;
}> = ({ onClose, title, children, wide }) => (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
  <div
    className={`bg-white rounded-lg shadow-xl w-full
      ${wide ? 'max-w-6xl' : 'max-w-2xl'}
      max-h-[90vh] overflow-hidden`}
  >
    {/* HEADER (STICKY) */}
    <div className="sticky top-0 z-10 bg-white px-6 py-4
                    flex justify-between items-center border-b">
      <h3 className="text-xl font-bold">{title}</h3>
      <button
        onClick={onClose}
        className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
      >
        ×
      </button>
    </div>

    {/* BODY (SCROLL HERE ONLY) */}
    <div className="overflow-y-auto px-6 py-4
                    max-h-[calc(90vh-72px)]">
      {children}
    </div>
  </div>
</div>

);

export default Modal;