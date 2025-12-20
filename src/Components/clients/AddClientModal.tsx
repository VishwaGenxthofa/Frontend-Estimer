// src/components/clients/AddClientModal.tsx
import React, { useState } from 'react';
import Modal from '../common/Modal';
import type { Client } from '../../types/Index';
import { useDispatch } from 'react-redux';
import { createClient } from '../../redux/slices/clientSlice';
import type { AppDispatch } from '../../redux/slices/store';
// interface AddClientModalProps {
//   onClose: () => void;
//   clients: Client[];
//   setClients: React.Dispatch<React.SetStateAction<Client[]>>;
// }

const AddClientModal: React.FC<{onClose:()=>void }> = ({ onClose }) => {
  const dispatch=useDispatch<AppDispatch>();
  const [form, setForm] = useState({
    clientName: '',
    email: '',
    phone: '',
    address: '',
  });

  const handleSubmit = async () => {
  // Validation
  if (!form.clientName|| !form.email) {
    alert('Client Name and Email are required!');
    return;
  }

  try {
    // Dispatch Redux asyncThunk
    await dispatch(createClient(form)).unwrap();

    // Close modal after success
    onClose();
  } catch (err) {
    console.error(err);
    alert('Failed to add client');
  }
};


  return (
    <Modal onClose={onClose} title="Add New Client">
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Client Name *</label>
          <input
            placeholder="e.g., Acme Corporation"
            value={form.clientName}
            onChange={(e) => setForm({ ...form, clientName: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
          <input
            type="email"
            placeholder="client@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            placeholder="+91 98765 43210"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <textarea
            rows={3}
            placeholder="Full address..."
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium transition"
          >
            Add Client
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddClientModal;