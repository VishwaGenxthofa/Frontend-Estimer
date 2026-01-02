import React, { useEffect, useState } from 'react';
import Modal from '../common/Modal';
import { useDispatch } from 'react-redux';
import { createClient, updateClient } from '../../redux/clientSlice';
import type { AppDispatch } from '../../redux/store';
import type { Client } from '../../types/Index';
import { Switch } from 'antd';
import toast from 'react-hot-toast';
import { Country, State, City } from 'country-state-city';

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

/* ===================== DIAL CODES ===================== */
const DIAL_CODES: { [key: string]: string } = {
  IN: '+91',
  US: '+1',
  GB: '+44',
  CN: '+86',
  CA: '+1',
  AU: '+61',
  DE: '+49',
  FR: '+33',
  JP: '+81',
  SG: '+65',
  MY: '+60',
  TH: '+66',
  ID: '+62',
  PH: '+63',
  VN: '+84',
  AE: '+971',
  SA: '+966',
  BR: '+55',
  MX: '+52',
  ES: '+34',
  IT: '+39',
  NL: '+31',
  BE: '+32',
  CH: '+41',
  SE: '+46',
  NO: '+47',
  DK: '+45',
  PL: '+48',
  RU: '+7',
  ZA: '+27',
  NZ: '+64',
  IE: '+353',
  PK: '+92',
  BD: '+880',
  LK: '+94',
  NP: '+977',
};

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
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('');
  const [availableStates, setAvailableStates] = useState<any[]>([]);
  const [availableCities, setAvailableCities] = useState<any[]>([]);

  // Get all countries
  const allCountries = Country.getAllCountries();

  /* ===================== EDIT MODE ===================== */
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

      // Find country and set states
      const country = allCountries.find((c) => c.name === editingClient.country);
      if (country) {
        setSelectedCountryCode(country.isoCode);
        const states = State.getStatesOfCountry(country.isoCode);
        setAvailableStates(states);

        // Load cities if state exists
        const state = states.find((s) => s.name === editingClient.stateProvince);
        if (state) {
          const cities = City.getCitiesOfState(country.isoCode, state.isoCode);
          setAvailableCities(cities);
        }
      }
    }
  }, [editingClient]);

  /* ===================== VALIDATION ===================== */
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

  /* ===================== HANDLE COUNTRY CHANGE ===================== */
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const countryCode = e.target.value;
    const country = allCountries.find((c) => c.isoCode === countryCode);

    if (country) {
      setForm({
        ...form,
        country: country.name,
        phone: '',
        stateProvince: '',
        city: '',
      });
      setErrors({ ...errors, country: '', phone: '', stateProvince: '', city: '' });
      setSelectedCountryCode(countryCode);

      // Load states for selected country
      const states = State.getStatesOfCountry(countryCode);
      setAvailableStates(states);
      setAvailableCities([]); // Reset cities
    }
  };

  /* ===================== HANDLE STATE CHANGE ===================== */
  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const stateName = e.target.value;
    setForm({ ...form, stateProvince: stateName, city: '' });
    setErrors({ ...errors, stateProvince: '', city: '' });

    // Load cities for selected state
    const state = availableStates.find((s) => s.name === stateName);
    if (state) {
      const cities = City.getCitiesOfState(selectedCountryCode, state.isoCode);
      setAvailableCities(cities);
    }
  };

  /* ===================== HANDLE PHONE CHANGE ===================== */
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setForm({ ...form, phone: value });
    setErrors({ ...errors, phone: '' });
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
      if (err?.errors) {
        const backendErrors: Errors = {};

        Object.keys(err.errors).forEach((key) => {
          const frontendKey = key.charAt(0).toLowerCase() + key.slice(1);
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

  /* ===================== UI ===================== */
  return (
    <Modal onClose={onClose} title={editingClient ? 'Edit Client' : 'Add New Client'}>
      <div className="space-y-5 overflow-hidden">
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
            <p className="text-sm text-red-500 mt-1">{errors.companyContactPerson}</p>
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
          {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
        </div>

        {/* COUNTRY */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Country <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedCountryCode}
            onChange={handleCountryChange}
            className={`w-full px-4 py-2 rounded-lg border bg-white ${
              errors.country ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select Country</option>
            {allCountries.map((country) => (
              <option key={country.isoCode} value={country.isoCode}>
                {country.flag} {country.name} ({DIAL_CODES[country.isoCode] || country.phonecode})
              </option>
            ))}
          </select>
          {errors.country && <p className="text-sm text-red-500 mt-1">{errors.country}</p>}
        </div>

        {/* PHONE */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Phone <span className="text-red-500">*</span>
          </label>
          {form.country && selectedCountryCode ? (
            <>
              <div
                className={`flex items-center w-full rounded-lg border ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                {/* Flag and Dial Code */}
                <div className="flex items-center gap-2 px-3 py-2.5 bg-white border-r border-gray-300">
                  <span className="text-2xl leading-none">
                    {allCountries.find((c) => c.isoCode === selectedCountryCode)?.flag}
                  </span>
                  <span className="text-gray-700 font-medium whitespace-nowrap text-sm">
                    {selectedCountryCode}
                  </span>
                  <span className="text-gray-700 font-medium whitespace-nowrap">
                    {DIAL_CODES[selectedCountryCode] ||
                      allCountries.find((c) => c.isoCode === selectedCountryCode)?.phonecode}
                  </span>
                </div>

                {/* Phone Input */}
                <input
                  type="tel"
                  value={form.phone}
                  onChange={handlePhoneChange}
                  placeholder="Enter phone number"
                  className="flex-1 px-3 py-2.5 outline-none rounded-r-lg"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Enter only digits</p>
            </>
          ) : (
            <div className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-500">
              Please select a country first
            </div>
          )}
          {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
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
          <label className="block text-sm font-medium mb-1">Address Line 2</label>
          <input
            value={form.addressLine2}
            onChange={(e) => setForm({ ...form, addressLine2: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300"
          />
        </div>

        {/* STATE & CITY */}
        <div className="flex w-full gap-4 justify-between">
          {/* STATE DROPDOWN */}
          <div className="w-full">
            <label className="block text-sm font-medium mb-1">
              State / Province <span className="text-red-500">*</span>
            </label>
            <select
              value={form.stateProvince}
              onChange={handleStateChange}
              disabled={!selectedCountryCode}
              className={`w-full px-4 py-2 rounded-lg border bg-white ${
                errors.stateProvince ? 'border-red-500' : 'border-gray-300'
              } ${!selectedCountryCode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
            >
              <option value="">
                {selectedCountryCode ? 'Select State' : 'Select Country First'}
              </option>
              {availableStates.map((state) => (
                <option key={state.isoCode} value={state.name}>
                  {state.name}
                </option>
              ))}
            </select>
            {errors.stateProvince && (
              <p className="text-sm text-red-500 mt-1">{errors.stateProvince}</p>
            )}
          </div>

          {/* CITY DROPDOWN */}
          <div className="w-full">
            <label className="block text-sm font-medium mb-1">
              City <span className="text-red-500">*</span>
            </label>
            <select
              value={form.city}
              onChange={(e) => {
                setForm({ ...form, city: e.target.value });
                setErrors({ ...errors, city: '' });
              }}
              disabled={!form.stateProvince}
              className={`w-full px-4 py-2 rounded-lg border bg-white ${
                errors.city ? 'border-red-500' : 'border-gray-300'
              } ${!form.stateProvince ? 'bg-gray-50 cursor-not-allowed' : ''}`}
            >
              <option value="">
                {form.stateProvince ? 'Select City' : 'Select State First'}
              </option>
              {availableCities.map((city) => (
                <option key={city.name} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
            {errors.city && <p className="text-sm text-red-500 mt-1">{errors.city}</p>}
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
          <button onClick={onClose} className="flex-1 bg-gray-200 py-3 rounded-lg hover:bg-gray-300">
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddClientModal;