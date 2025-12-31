import React, { useEffect, useState } from 'react';
import Modal from '../common/Modal';
import { useDispatch } from 'react-redux';
import { createClient, updateClient } from '../../redux/clientSlice';
import type { AppDispatch } from '../../redux/store';
import type { Client } from '../../types/Index';
import { Switch } from 'antd';
import toast from 'react-hot-toast';
import ReactCountryFlag from "react-country-flag";

/* ===================== TYPES ===================== */
interface Errors {
  companyName?: string;
  companyContactPerson?: string;
  email?: string;
  phone?: string;
  addressLine1?: string;
  city?: string;
  stateProvince?: string;
  postalCode?: string;
  country?: string;
}

interface AddClientModalProps {
  onClose: () => void;
  editingClient?: Client | null;
  refreshClients: () => void;
}

/* ===================== COUNTRY DATA ===================== */
const COUNTRIES = [
  { name: 'India', code: 'IN', dialCode: '+91', placeholder: '9876543210' },
  { name: 'USA', code: 'US', dialCode: '+1', placeholder: '2025551234' },
  { name: 'United Kingdom', code: 'GB', dialCode: '+44', placeholder: '7912345678' },
  { name: 'China', code: 'CN', dialCode: '+86', placeholder: '13812345678' },
  { name: 'Canada', code: 'CA', dialCode: '+1', placeholder: '4165551234' },
  { name: 'Australia', code: 'AU', dialCode: '+61', placeholder: '412345678' },
  { name: 'Germany', code: 'DE', dialCode: '+49', placeholder: '15112345678' },
  { name: 'France', code: 'FR', dialCode: '+33', placeholder: '612345678' },
  { name: 'Japan', code: 'JP', dialCode: '+81', placeholder: '9012345678' },
  { name: 'Singapore', code: 'SG', dialCode: '+65', placeholder: '81234567' },
  { name: 'Malaysia', code: 'MY', dialCode: '+60', placeholder: '123456789' },
  { name: 'Thailand', code: 'TH', dialCode: '+66', placeholder: '812345678' },
  { name: 'Indonesia', code: 'ID', dialCode: '+62', placeholder: '812345678' },
  { name: 'Philippines', code: 'PH', dialCode: '+63', placeholder: '9123456789' },
  { name: 'Vietnam', code: 'VN', dialCode: '+84', placeholder: '912345678' },
  { name: 'United Arab Emirates', code: 'AE', dialCode: '+971', placeholder: '501234567' },
  { name: 'Saudi Arabia', code: 'SA', dialCode: '+966', placeholder: '501234567' },
  { name: 'Brazil', code: 'BR', dialCode: '+55', placeholder: '11912345678' },
  { name: 'Mexico', code: 'MX', dialCode: '+52', placeholder: '5512345678' },
  { name: 'Spain', code: 'ES', dialCode: '+34', placeholder: '612345678' },
  { name: 'Italy', code: 'IT', dialCode: '+39', placeholder: '3123456789' },
  { name: 'Netherlands', code: 'NL', dialCode: '+31', placeholder: '612345678' },
  { name: 'Belgium', code: 'BE', dialCode: '+32', placeholder: '470123456' },
  { name: 'Switzerland', code: 'CH', dialCode: '+41', placeholder: '781234567' },
  { name: 'Sweden', code: 'SE', dialCode: '+46', placeholder: '701234567' },
  { name: 'Norway', code: 'NO', dialCode: '+47', placeholder: '41234567' },
  { name: 'Denmark', code: 'DK', dialCode: '+45', placeholder: '20123456' },
  { name: 'Poland', code: 'PL', dialCode: '+48', placeholder: '512345678' },
  { name: 'Russia', code: 'RU', dialCode: '+7', placeholder: '9123456789' },
  { name: 'South Africa', code: 'ZA', dialCode: '+27', placeholder: '821234567' },
  { name: 'New Zealand', code: 'NZ', dialCode: '+64', placeholder: '211234567' },
  { name: 'Ireland', code: 'IE', dialCode: '+353', placeholder: '851234567' },
  { name: 'Pakistan', code: 'PK', dialCode: '+92', placeholder: '3001234567' },
  { name: 'Bangladesh', code: 'BD', dialCode: '+880', placeholder: '1712345678' },
  { name: 'Sri Lanka', code: 'LK', dialCode: '+94', placeholder: '712345678' },
  { name: 'Nepal', code: 'NP', dialCode: '+977', placeholder: '9841234567' },
].sort((a, b) => a.name.localeCompare(b.name));

/* ===================== COMPONENT ===================== */
const AddClientModal: React.FC<AddClientModalProps> = ({
  onClose,
  editingClient,
  refreshClients,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const [form, setForm] = useState({
    companyName: '',
    companyContactPerson: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    stateProvince: '',
    postalCode: '',
    country: '',
    isActive: true,
  });

  const [errors, setErrors] = useState<Errors>({});
  const [selectedCountry, setSelectedCountry] = useState<typeof COUNTRIES[0] | null>(null);

  useEffect(() => {
    if (editingClient) {
      setForm({
        companyName: editingClient.companyName,
        companyContactPerson: editingClient.companyContactPerson,
        email: editingClient.email,
        phone: editingClient.phone,
        addressLine1: editingClient.addressLine1,
        addressLine2: editingClient.addressLine2,
        city: editingClient.city,
        stateProvince: editingClient.stateProvince,
        postalCode: editingClient.postalCode,
        country: editingClient.country,
        isActive: editingClient.isActive,
      });

      const country = COUNTRIES.find(
        (c) => c.name.toLowerCase() === editingClient.country.toLowerCase()
      );
      if (country) {
        setSelectedCountry(country);
      }
    }
  }, [editingClient]);

  const validate = (): boolean => {
    const newErrors: Errors = {};

    if (!form.companyName)
      newErrors.companyName = 'Company Name is required';
    else if (form.companyName.trim().length < 3)
      newErrors.companyName = 'Name must be at least 3 characters';

    if (!form.companyContactPerson)
      newErrors.companyContactPerson = 'Contact Person is required';

    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = 'Invalid email format';

    if (!form.country) newErrors.country = 'Country is required';

    if (!form.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (form.phone.length < 7) {
      newErrors.phone = 'Enter valid phone number';
    } else if (!/^\d+$/.test(form.phone)) {
      newErrors.phone = 'Phone number must contain only digits';
    }

    if (!form.addressLine1.trim())
      newErrors.addressLine1 = 'Address is required';
    if (!form.city) newErrors.city = 'City is required';
    if (!form.stateProvince) newErrors.stateProvince = 'State is required';
    if (!form.postalCode) newErrors.postalCode = 'Postal code is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const countryName = e.target.value;
    const country = COUNTRIES.find((c) => c.name === countryName);

    setForm({ ...form, country: countryName, phone: '' });
    setErrors({ ...errors, country: '', phone: '' });
    setSelectedCountry(country || null);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');

    setForm({
      ...form,
      phone: value,
    });

    setErrors({ ...errors, phone: '' });
  };

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
      if (err?.errors) {
        const backendErrors: Errors = {};

        Object.keys(err.errors).forEach((key) => {
          const frontendKey =
            key.charAt(0).toLowerCase() + key.slice(1);

          const messages = err.errors[key];
          if (Array.isArray(messages) && messages.length > 0) {
            backendErrors[frontendKey as keyof Errors] = messages[0];
          }
        });

        setErrors(backendErrors);
        toast.error('Please fix validation errors');
        return;
      }

      toast.error(err?.message || 'Failed to save client');
    }
  };

  return (
    <Modal
      onClose={onClose}
      title={editingClient ? 'Edit Client' : 'Add New Client'}
    >
      <div className="space-y-5">
        {/* COMPANY NAME */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Company Name <span className="text-red-500">*</span>
          </label>
          <input
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

        {/* COMPANY CONTACT PERSON */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Contact Person <span className="text-red-500">*</span>
          </label>
          <input
            value={form.companyContactPerson}
            onChange={(e) => {
              setForm({ ...form, companyContactPerson: e.target.value });
              setErrors({ ...errors, companyContactPerson: '' });
            }}
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.companyContactPerson ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.companyContactPerson && (
            <p className="text-sm text-red-500 mt-1">
              {errors.companyContactPerson}
            </p>
          )}
        </div>

        {/* EMAIL */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
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

        {/* COUNTRY */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Country <span className="text-red-500">*</span>
          </label>
          <select
            value={form.country}
            onChange={handleCountryChange}
            className={`w-full px-4 py-2 rounded-lg border bg-white ${
              errors.country ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select Country</option>
            {COUNTRIES.map((country) => (
              <option key={country.code} value={country.name}>
                {country.name} ({country.dialCode})
              </option>
            ))}
          </select>
          {errors.country && (
            <p className="text-sm text-red-500 mt-1">{errors.country}</p>
          )}
        </div>

        {/* PHONE - WITH FLAG ICON */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Phone <span className="text-red-500">*</span>
          </label>
          {form.country && selectedCountry ? (
            <>
              <div className={`flex items-center w-full rounded-lg border ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}>
                {/* Flag and Country Code Section */}
                <div className="flex items-center gap-2 px-3 py-2.5 bg-white border-r border-gray-300">
                  <ReactCountryFlag
                    countryCode={selectedCountry.code}
                    svg
                    style={{
                      width: '24px',
                      height: '24px',
                    }}
                    title={selectedCountry.name}
                  />
                  <span className="text-gray-700 font-medium whitespace-nowrap text-sm">
                    {selectedCountry.code}
                  </span>
                  <span className="text-gray-700 font-medium whitespace-nowrap">
                    {selectedCountry.dialCode}
                  </span>
                </div>

                {/* Phone Input */}
                <input
                  type="tel"
                  value={form.phone}
                  onChange={handlePhoneChange}
                  placeholder={selectedCountry.placeholder}
                  className="flex-1 px-3 py-2.5 outline-none rounded-r-lg"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Enter only digits (e.g., {selectedCountry.placeholder})
              </p>
            </>
          ) : (
            <div className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-500">
              Please select a country first
            </div>
          )}
          {errors.phone && (
            <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
          )}
        </div>

        {/* ADDRESS LINE 1 */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Address Line 1 <span className="text-red-500">*</span>
          </label>
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

        {/* ADDRESS LINE 2 */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Address Line 2
          </label>
          <input
            value={form.addressLine2}
            onChange={(e) => {
              setForm({ ...form, addressLine2: e.target.value });
            }}
            className="w-full px-4 py-2 rounded-lg border border-gray-300"
          />
        </div>

        {/* CITY & STATE */}
        <div className="flex w-full gap-4 justify-between">
          <div className="w-full">
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

          <div className="w-full">
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
        </div>

        {/* POSTAL CODE */}
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
            <p className="text-sm text-red-500 mt-1">{errors.postalCode}</p>
          )}
        </div>

        {/* STATUS */}
        <div>
          <label className="block text-sm font-medium mb-2">Status</label>
          <Switch
            checked={form.isActive}
            onChange={() => {
              if (editingClient) {
                setForm({ ...form, isActive: !form.isActive });
              }
            }}
            disabled={!editingClient}
            checkedChildren="Active"
            unCheckedChildren="Inactive"
            style={{
              backgroundColor: form.isActive ? 'green' : 'red',
              cursor: editingClient ? 'pointer' : 'not-allowed',
            }}
          />
        </div>

        {/* ACTIONS */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            {editingClient ? 'Update Client' : 'Add Client'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 py-3 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddClientModal;
 