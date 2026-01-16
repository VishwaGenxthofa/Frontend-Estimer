// src/features/taxConfigs/components/TaxConfigModal.tsx
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../../../redux/store';
import { addTaxConfig, updateTaxConfig } from '../../../../redux/taxConfigs'; // ← Correct slice import
import { toggleTaxModal, setSelectedTax } from '../../../../redux/uiSlice';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';

const TaxConfigModal = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { showTaxModal, selectedTax } = useSelector((state: RootState) => state.ui);
  const { loading } = useSelector((state: RootState) => state.estimatestaxconfig); // ← Fixed selector

  const [formData, setFormData] = useState({
    taxName: '',
    taxRate: '',
    isActive: true,
  });

  useEffect(() => {
    if (selectedTax) {
      setFormData({
        taxName: selectedTax.taxName || '',
        taxRate: selectedTax.taxRate?.toString() || '',
        isActive: selectedTax.isActive ?? true,
      });
    } else {
      setFormData({
        taxName: '',
        taxRate: '',
        isActive: true,
      });
    }
  }, [selectedTax, showTaxModal]);

  if (!showTaxModal) return null;

  const handleSubmit = async () => {
    // Validation
    if (!formData.taxName.trim()) {
      toast.error('Tax Name is required!');
      return;
    }

    const rate = parseFloat(formData.taxRate);
    if (isNaN(rate) || rate < 0 || rate > 100) {
      toast.error('Please enter a valid tax rate (0-100%)');
      return;
    }

    const payload = {
      taxName: formData.taxName.trim(),
      taxRate: rate,
      isActive: formData.isActive,
    };

    const action = selectedTax
      ? updateTaxConfig({ ...payload, taxConfigId: selectedTax.taxConfigId })
      : addTaxConfig(payload); // ← No manual ID — backend generates it

    const toastId = toast.loading(selectedTax ? 'Updating tax configuration...' : 'Creating tax configuration...');

    try {
      await dispatch(action).unwrap();
      toast.success(selectedTax ? 'Tax configuration updated successfully!' : 'Tax configuration created successfully!');
      closeModal();
    } catch (err: any) {
      toast.error(err || 'Failed to save tax configuration');
    } finally {
      toast.dismiss(toastId);
    }
  };

  const closeModal = () => {
    dispatch(toggleTaxModal(false));
    dispatch(setSelectedTax(null));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex justify-between items-center sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">
              {selectedTax ? 'Edit Tax Configuration' : 'Add New Tax Configuration'}
            </h2>
            <p className="text-slate-600 mt-1">Define tax rates applied to estimates</p>
          </div>
          <button onClick={closeModal} className="p-3 hover:bg-slate-100 rounded-xl transition">
            <X className="w-6 h-6 text-slate-600" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-8 space-y-6">
          {/* Tax Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Tax Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.taxName}
              onChange={(e) => setFormData({ ...formData, taxName: e.target.value })}
              className="w-full px-5 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition"
              placeholder="e.g., GST, VAT, Sales Tax"
            />
          </div>

          {/* Tax Rate */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Tax Rate (%) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={formData.taxRate}
              onChange={(e) => setFormData({ ...formData, taxRate: e.target.value })}
              className="w-full px-5 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition"
              placeholder="18.00"
            />
            <p className="text-xs text-slate-500 mt-2">Enter rate between 0 and 100%</p>
          </div>

          {/* Active Toggle */}
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-6 h-6 text-green-600 rounded focus:ring-green-500"
            />
            <span className="font-semibold text-slate-800">Active (Available for selection in estimates)</span>
          </div>

          {/* Live Preview */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
            <h3 className="font-bold text-blue-900 mb-4 text-lg">Live Preview</h3>
            <div className="space-y-3">
              <p className="text-sm text-blue-800">
                This tax will appear as:
                <span className="font-bold ml-2">
                  {formData.taxName || 'Tax Name'} ({formData.taxRate || '0.00'}%)
                </span>
              </p>
              {formData.taxRate && !isNaN(parseFloat(formData.taxRate)) && parseFloat(formData.taxRate) > 0 && (
                <p className="text-sm text-blue-800">
                  Example on ₹100,000 subtotal:
                  <span className="font-bold ml-2">
                    Tax = ₹{(100000 * (parseFloat(formData.taxRate) / 100)).toLocaleString('en-IN')}
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 flex justify-end gap-4 bg-slate-50 rounded-b-2xl">
          <button
            onClick={closeModal}
            className="px-8 py-3 border border-slate-300 rounded-xl font-medium hover:bg-slate-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 shadow-lg transition transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : selectedTax ? 'Update' : 'Create'} Tax Config
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaxConfigModal;