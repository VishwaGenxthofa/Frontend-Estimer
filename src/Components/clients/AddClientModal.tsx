// src/components/clients/AddClientModal.tsx
import React, { useEffect, useState } from 'react';
import Modal from '../common/Modal';
import { useDispatch } from 'react-redux';
import { createClient, updateClient } from '../../redux/slices/clientSlice';
import type { AppDispatch } from '../../redux/slices/store';
import type { Client } from '../../types/Index';
import { Switch } from 'antd';
import toast from 'react-hot-toast';
interface Errors {
  clientId?:number;
  clientName?: string;
  email?: string;
  phone?: string;
  address?:string;
}

interface AddClientModalProps {
  onClose: () => void;
  editingClient?: Client | null;
  refreshClients: () => void;
}

const AddClientModal: React.FC<AddClientModalProps> = ({
  onClose,
  editingClient,
  refreshClients,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const [form, setForm] = useState({
    clientName: '',
    email: '',
    phone: '',
    address: '',
    isActive: true,
  });

  const [errors, setErrors] = useState<Errors>({});

  //  PREFILL DATA FOR EDIT
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

  //  VALIDATION
  const validate = (): boolean => {
    const newErrors: Errors = {};

    if (!form.clientName.trim()) {
      newErrors.clientName = 'Client name is required';
    } else if (form.clientName.length < 3) {
      newErrors.clientName = 'Name must be at least 3 characters';
    }

    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!form.phone.trim()) {
  newErrors.phone = 'Phone number is required';
} else if (!/^[0-9]{10}$/.test(form.phone)) {
  newErrors.phone = 'Enter valid 10-digit phone number';
}


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //  SUBMIT
  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      if (editingClient) {
        await dispatch(
          updateClient({
            id: editingClient.clientId,
            data: form,
          })
        ).unwrap();
         toast.success('Client updated successfully');
      } else {
        await dispatch(createClient(form)).unwrap();
         toast.success('Client added successfully');
      }

      refreshClients();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to save client');
    }
  };

  return (
    <Modal
      onClose={onClose}
      title={editingClient ? 'Edit Client' : 'Add New Client'}
    >
      <div className="space-y-5">

        {/* CLIENT NAME */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Client Name <span className="text-red-500">*</span>
          </label>
          <input
            value={form.clientName}
            onChange={(e) =>
              setForm({ ...form, clientName: e.target.value })
            }
            className={`w-full px-4 py-2 rounded-lg border
              ${errors.clientName ? 'border-red-500' : 'border-gray-300'}
            `}
          />
          {errors.clientName && (
            <p className="text-sm text-red-500 mt-1">{errors.clientName}</p>
          )}
        </div>
        
        {/* EMAIL */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={`w-full px-4 py-2 rounded-lg border
              ${errors.email ? 'border-red-500' : 'border-gray-300'}
            `}
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email}</p>
          )}
        </div>

        {/* PHONE */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Phone <span className="text-red-500">*</span></label>
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className={`w-full px-4 py-2 rounded-lg border
              ${errors.phone ? 'border-red-500' : 'border-gray-300'}
            `}
          />
          {errors.phone && (
            <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
          )}
        </div>
 {/* ADDRESS */} <div>
           <label className="block text-sm font-medium mb-1">Address</label> 
           <textarea rows={3} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
             placeholder="Full address..." /> 
             </div>
        {/* STATUS */}
              

<div>
  <label className="block text-sm font-medium mb-2">Status</label>
  <div className="flex items-center gap-3 ">
    <Switch
      checked={form.isActive}
      onChange={(checked) => setForm({ ...form, isActive: checked })}
      checkedChildren="Active"
      unCheckedChildren="Inactive"
      className="mb-2"
      style={{
        backgroundColor: form.isActive ? 'green' : 'red',
      }}
    />
  </div>
</div>



        {/* ACTIONS */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg"
          >
            {editingClient ? 'Update Client' : 'Add Client'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 py-3 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddClientModal;
