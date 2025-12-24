import React, { useEffect, useState } from 'react';
import Modal from '../common/Modal';
import { useDispatch } from 'react-redux';
import { createClient, updateClient } from '../../redux/slices/clientSlice';
import type { AppDispatch } from '../../redux/slices/store';
import type { Client } from '../../types/Index';
import { Switch } from 'antd';
import toast from 'react-hot-toast';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
/* ===================== TYPES ===================== */

interface Errors {
  companyName?: string;
  companyContactPerson?:string;
  email?: string;
  phone?: string;
  addressLine1?: string,
  city?: string,
  stateProvince?:string,
  postalCode?: string,
  country?: string,
  phoneRaw?:string,
}

interface AddClientModalProps {
  onClose: () => void;
  editingClient?: Client | null;
  refreshClients: () => void;
}

/* ===================== COMPONENT ===================== */

const AddClientModal: React.FC<AddClientModalProps> = ({
  onClose,
  editingClient,
  refreshClients,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const [form, setForm] = useState({
  companyName: '',
  companyContactPerson:'',
  email: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  stateProvince:'',
  postalCode: '',
  country: '',
  isActive: true,
  });

  const [errors, setErrors] = useState<Errors>({});

  /* ===================== EDIT MODE ===================== */

  useEffect(() => {
    if (editingClient) {
      setForm({
        companyName: editingClient.companyName,
        companyContactPerson:editingClient.companyContactPerson,
        email: editingClient.email,
        phone: editingClient.phone,
        addressLine1:editingClient.addressLine1,
        addressLine2:editingClient.addressLine2,
        city:editingClient.city,
        stateProvince: editingClient.stateProvince,
       postalCode:editingClient.postalCode,
        country:editingClient.country,
        isActive: editingClient.isActive,
      });
    }
  }, [editingClient]);

  

  const validate = (): boolean => {
    const newErrors: Errors = {};

    if (!form.companyName)
      newErrors.companyName = 'companyName  Name is required';
    else if (form.companyName.trim().length < 3)
      newErrors.companyName = 'Name must be at least 3 characters';

    if (!form.email.trim())
      newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = 'Invalid email format';

    if (!form.phone) {
  errors.phone = 'Phone number is required';
} else if (form.phone.length < 7) {
  errors.phone = 'Enter valid phone number';
}

    if (!form.addressLine1.trim())
      newErrors.addressLine1 = 'Address is required';
    if (!form.city) errors.city = 'City is required';
if (!form.stateProvince) errors.stateProvince = 'State is required';
if (!form.postalCode) errors.postalCode = 'Postal code is required';
if (!form.country) errors.country = 'Country is required';
 if (!form.companyContactPerson)newErrors.companyContactPerson='companyContactPerson is required'

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ===================== SUBMIT ===================== */

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      if (editingClient) {
        await dispatch(
          updateClient({ id: editingClient.clientId, data: form })
        ).unwrap();
        toast.success('Client updated successfully');
      } else {
        await dispatch(createClient(form)).unwrap();
        toast.success('Client added successfully');
      }

      refreshClients();
      onClose();
    } catch (err: any) {
      // ✅ ASP.NET backend validation errors
      if (err?.errors) {
        const backendErrors: Errors = {};

        Object.keys(err.errors).forEach((key) => {
          const frontendKey =
            key.charAt(0).toLowerCase() + key.slice(1); // ClientName → clientName

          const messages = err.errors[key];
          if (Array.isArray(messages) && messages.length > 0) {
            backendErrors[frontendKey as keyof Errors] = messages[0];
          }
        });

        setErrors(backendErrors);
        return;
      }

      toast.error(err?.message || 'Failed to save client');
    }
  };

  /* ===================== UI ===================== */

  return (
    <Modal onClose={onClose} title={editingClient ? 'Edit Client' : 'Add New Client'}>
      <div className="space-y-5">

        {/* CLIENT NAME */}
        <div>
          <label className="block text-sm font-medium mb-1">
            companyName <span className="text-red-500">*</span>
          </label>
          <input
            name="clientName"
            value={form.companyName}
            onChange={(e) => {
              setForm({ ...form, companyName: e.target.value });
              setErrors({ ...errors, companyName: '' });
            }}
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.companyName ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.companyName && (
            <p className="text-sm text-red-500 mt-1">{errors.companyName}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            companyContactPerson <span className="text-red-500">*</span>
          </label>
          <input
            name="clientName"
            value={form.companyContactPerson}
            onChange={(e) => {
              setForm({ ...form, companyContactPerson: e.target.value });
              setErrors({ ...errors, companyContactPerson: '' });
            }}
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.companyContactPerson ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.companyName && (
            <p className="text-sm text-red-500 mt-1">{errors.companyContactPerson}</p>
          )}
        </div>

        {/* EMAIL */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            value={form.email}
            onChange={(e) => {
              setForm({ ...form, email: e.target.value });
              setErrors({ ...errors, email: '' });
            }}
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email}</p>
          )}
        </div>

        {/* PHONE */}
            <div>
      <label className="block text-sm font-medium mb-1">
        Phone <span className="text-red-500">*</span>
      </label>

            <PhoneInput
          country="in"
          value={form.phone}
          onChange={(value, country) => {
            const digits = value.replace(/\D/g, '');

            let cleanPhone = digits;

            // remove India country code
            if (country?.countryCode === 'in' && digits.startsWith('91')) {
              cleanPhone = digits.slice(2);
            }

            setForm({
              ...form,
              phone: cleanPhone, // ✅ ONLY 10 digits
            });

            setErrors({ ...errors, phone: '' });
          }}
          enableSearch
          inputProps={{ required: true }}
          inputClass="!w-full !h-10"
          inputStyle={{
            width: '100%',
            borderRadius: '0.5rem',
            borderColor: errors.phone ? '#ef4444' : '#d1d5db',
          }}
        />



      {errors.phone && (
        <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
      )}
    </div>


        {/* ADDRESS  line1 */}
        <div>
          <label className="block text-sm font-medium mb-1">Addres Line1 <span className="text-red-500">*</span></label>
          <input
            
            value={form.addressLine1}
            onChange={(e) => {
              setForm({ ...form, addressLine1: e.target.value });
              setErrors({ ...errors, addressLine1: '' });
            }}
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.addressLine1 ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.addressLine1 && (
            <p className="text-sm text-red-500 mt-1">{errors.addressLine1}</p>
          )}
        </div>
         {/* ADDRESS line2 */}
        <div>
          <label className="block text-sm font-medium mb-1">Address Line2</label>
          <input
            
            value={form.addressLine2}
            onChange={(e) => {
              setForm({ ...form,addressLine2: e.target.value });
              setErrors({ ...errors, addressLine1: '' });
            }}
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.addressLine1 ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {/* {errors.address && (
            <p className="text-sm text-red-500 mt-1">{errors.address}</p>
          )} */}
          {/* city */}
        </div>
              <div>
        <label className="block text-sm font-medium mb-1">
          City <span className="text-red-500">*</span>
        </label>
        <input
          value={form.city}
          onChange={(e) => {
            setForm({ ...form, city: e.target.value });
            setErrors({ ...errors, city: '' });
          }}
          className={`w-full px-4 py-2 rounded-lg border ${
            errors.city ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.city && (
          <p className="text-sm text-red-500 mt-1">{errors.city}</p>
        )}
      </div>
      {/* state */}
      <div>
        <label className="block text-sm font-medium mb-1">
          State / Province <span className="text-red-500">*</span>
        </label>
        <input
          value={form.stateProvince}
          onChange={(e) => {
            setForm({ ...form, stateProvince: e.target.value });
            setErrors({ ...errors, stateProvince: '' });
          }}
          className={`w-full px-4 py-2 rounded-lg border ${
            errors.stateProvince ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.stateProvince && (
          <p className="text-sm text-red-500 mt-1">
            {errors.stateProvince}
          </p>
        )}
      </div>
            {/* postal code */}
              <div>
              <label className="block text-sm font-medium mb-1">
                Postal Code <span className="text-red-500">*</span>
              </label>
              <input
                value={form.postalCode}
                onChange={(e) => {
                  setForm({ ...form, postalCode: e.target.value });
                  setErrors({ ...errors, postalCode: '' });
                }}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.postalCode ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.postalCode && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.postalCode}
                </p>
              )}
            </div>
            {/* country */}
          <div>
        <label className="block text-sm font-medium mb-1">
          Country <span className="text-red-500">*</span>
        </label>

        <select
          value={form.country}
          onChange={(e) => {
            setForm({ ...form, country: e.target.value });
            setErrors({ ...errors, country: '' });
          }}
          className={`w-full px-4 py-2 rounded-lg border bg-white ${
            errors.country ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select Country</option>
          <option value="India">India</option>
          <option value="United States">United States</option>
          <option value="United Kingdom">United Kingdom</option>
          <option value="Australia">Australia</option>
          <option value="Canada">Canada</option>
        </select>

        {errors.country && (
          <p className="text-sm text-red-500 mt-1">
            {errors.country}
          </p>
        )}
      </div>

        {/* STATUS */}
        <div>
          <label className="block text-sm font-medium mb-2">Status</label>
          <Switch
            checked={form.isActive}
            onChange={(checked) => setForm({ ...form, isActive: checked })}
            checkedChildren="Active"
            unCheckedChildren="Inactive"
            style={{ backgroundColor: form.isActive ? 'green' : 'red' }}
          />
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
