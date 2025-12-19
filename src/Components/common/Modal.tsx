import React from 'react';

const Modal: React.FC<{
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  wide?: boolean;
}> = ({ onClose, title, children, wide }) => (
  <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
    <div className={`bg-white rounded-lg shadow-xl ${wide ? 'max-w-6xl' : 'max-w-2xl'} w-full my-8`}>
      <div className="p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 sticky top-0 bg-white pb-4 border-b">
          <h3 className="text-xl font-bold">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl font-bold">
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  </div>
);

export default Modal;