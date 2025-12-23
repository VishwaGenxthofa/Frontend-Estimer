import React, { useEffect, useState } from 'react';
import Modal from '../common/Modal';
import { useDispatch } from 'react-redux';
import { createClient, updateClient } from '../../redux/slices/clientSlice';
import type { AppDispatch } from '../../redux/slices/store';
import type { Client } from '../../types/Index';
import { Switch } from 'antd';
import toast from 'react-hot-toast';

interface Errors {
  clientName?: string;
  email?: string;
  phone?: string;
  address?: string;
}

interface AddClientModalProps {
  onClose: () => void;
  editingClient?: Client | null;
  refreshClients: () => void;
}

const AddClientModal: React.FC<AddClientModalProps> = ({ onClose, editingClient, refreshClients }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [form, setForm] = useState({
    clientName: '',
    email: '',
    phone: '',
    address: '',
    isActive: true,
  });

  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    if (editingClient) {
      setForm({
        clientName: editingClient.clientName,
        email: editingClient.email,
        phone: editingClient.phone,
        address: editingClient.address ?? '',
        isActive: editingClient.isActive,
      });
    }
  }, [editingClient]);

  const validate = (): boolean => {
    const newErrors: Errors = {};

    // Client Name
    if (!form.clientName.trim()) newErrors.clientName = 'Client Name is required';
    else if (!/^[a-zA-Z\s]+$/.test(form.clientName)) newErrors.clientName = 'Client Name should contain only letters';
    else if (form.clientName.trim().length < 3) newErrors.clientName = 'Name must be at least 3 characters';

    // Email
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Invalid email format';

    // Phone
    if (!form.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^[0-9]{10}$/.test(form.phone)) newErrors.phone = 'Phone number must be exactly 10 digits';

    // Address
    if (!form.address.trim()) newErrors.address = 'Address cannot be empty or spaces only';
    else if (form.address.length < 5 || form.address.length > 250)
      newErrors.address = 'Address must be 5-250 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      if (editingClient) {
        await dispatch(updateClient({ id: editingClient.clientId, data: form })).unwrap();
        toast.success('Client updated successfully');
      } else {
        await dispatch(createClient(form)).unwrap();
        toast.success('Client added successfully');
      }

      refreshClients();
      onClose();
    } catch (err: any) {
      toast.error(err || 'Failed to save client');
    }
  };

  return (
    <Modal onClose={onClose} title={editingClient ? 'Edit Client' : 'Add New Client'}>
      <div className="space-y-5">
        {/* CLIENT NAME */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Client Name <span className="text-red-500">*</span>
          </label>
          <input
            value={form.clientName}
            onChange={(e) => setForm({ ...form, clientName: e.target.value })}
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.clientName ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.clientName && <p className="text-sm text-red-500 mt-1">{errors.clientName}</p>}
        </div>

        {/* EMAIL */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={`w-full px-4 py-2 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
        </div>

        {/* PHONE */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Phone <span className="text-red-500">*</span>
          </label>
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className={`w-full px-4 py-2 rounded-lg border ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
        </div>

        {/* ADDRESS */}
        <div>
          <label className="block text-sm font-medium mb-1">Address</label>
          <textarea
            rows={3}
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.address ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Full address..."
          />
          {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address}</p>}
        </div>

        {/* STATUS */}
        <div>
          <label className="block text-sm font-medium mb-2">Status</label>
          <div className="flex items-center gap-3">
            <Switch
              checked={form.isActive}
              onChange={(checked) => setForm({ ...form, isActive: checked })}
              checkedChildren="Active"
              unCheckedChildren="Inactive"
              className="mb-2"
              style={{ backgroundColor: form.isActive ? 'green' : 'red' }}
            />
          </div>
        </div>
        {/* ACTIONS */}
        <div className="flex gap-3 pt-4">
          <button onClick={handleSubmit} className="flex-1 bg-blue-600 text-white py-3 rounded-lg">
            {editingClient ? 'Update Client' : 'Add Client'}
          </button>
          <button onClick={onClose} className="flex-1 bg-gray-200 py-3 rounded-lg">
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};
export default AddClientModal;
