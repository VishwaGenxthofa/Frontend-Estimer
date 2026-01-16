// src/features/costTypes/components/CostTypeModal.tsx
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../../../redux/store';
import { addCostType, updateCostType } from '../../../../redux/costTypeSlice';
import { toggleCostTypeModal, setSelectedCostType } from '../../../../redux/uiSlice';
import toast from 'react-hot-toast';
import { X, Check } from 'lucide-react';

const CostTypeModal = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { showCostTypeModal, selectedCostType } = useSelector((state: RootState) => state.ui);
  const { loading } = useSelector((state: RootState) => state.costTypes);

  const [formData, setFormData] = useState({

    costTypeName: '',
    description: '',
    category: 'directCosts' as 'directCosts' | 'indirectCosts' | 'additionalCosts',
    isActive: true,
    requiresQuantity: false,
    requiresRate: false,
    requiresMonths: false,
  });

  useEffect(() => {
    if (selectedCostType) {
      setFormData({
        costTypeName: selectedCostType.costTypeName || '',
        description: selectedCostType.description || '',
        category: selectedCostType.category || 'direct',
        isActive: selectedCostType.isActive ?? true,
        requiresQuantity: selectedCostType.requiresQuantity ?? false,
        requiresRate: selectedCostType.requiresRate ?? false,
        requiresMonths: selectedCostType.requiresMonths ?? false,
      });
    } else {
      setFormData({
        costTypeName: '',
        description: '',
        category: 'directCosts',
        isActive: true,
        requiresQuantity: false,
        requiresRate: false,
        requiresMonths: false,
      });
    }
  }, [selectedCostType, showCostTypeModal]);

  if (!showCostTypeModal) return null;

  const handleSubmit = async () => {
    if (!formData.costTypeName.trim()) {
      toast.error('Cost Type Name is required!');
      return;
    }

    const payload = {
      costTypeName: formData.costTypeName.trim(),
      description: formData.description,
      category: formData.category,
      isActive: formData.isActive,
      requiresQuantity: formData.requiresQuantity,
      requiresRate: formData.requiresRate,
      requiresMonths: formData.requiresMonths,
    };

    const action = selectedCostType
      ? updateCostType({ ...payload, costTypeId: selectedCostType.costTypeId })
      : addCostType(payload); 

    const toastId = toast.loading(selectedCostType ? 'Updating...' : 'Creating...');

    try {
      await dispatch(action).unwrap();
      toast.success(selectedCostType ? 'Updated successfully!' : 'Created successfully!');
      closeModal();
    } catch (err: any) {
      toast.error(err || 'Failed to save');
    } finally {
      toast.dismiss(toastId);
    }
  };

  const closeModal = () => {
    dispatch(toggleCostTypeModal(false));
    dispatch(setSelectedCostType(null));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex justify-between items-center sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">
              {selectedCostType ? 'Edit Cost Type' : 'Add New Cost Type'}
            </h2>
            <p className="text-slate-600 mt-1">Configure how this cost type will be used in estimates</p>
          </div>
          <button onClick={closeModal} className="p-3 hover:bg-slate-100 rounded-xl transition">
            <X className="w-6 h-6 text-slate-600" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-8 space-y-7">
          {/* Cost Type Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Cost Type Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.costTypeName}
              onChange={(e) => setFormData({ ...formData, costTypeName: e.target.value })}
              className="w-full px-5 py-3.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition"
              placeholder="e.g., Cloud Services, Training, Travel"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as 'directCosts' | 'indirectCosts' | 'additionalCosts' })}
              className="w-full px-5 py-3.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition"
            >
             <option value="directCosts">Direct Cost</option>
             <option value="indirectCosts">Indirect Cost</option>
             <option value="additionalCosts">Additional Cost</option>
            </select>
            <p className="text-xs text-slate-500 mt-2">
              {formData.category === 'directCosts' && 'Tangible costs directly tied to project delivery (e.g., cloud, licenses)'}
              {formData.category === 'indirectCosts' && 'Overhead costs (e.g., PM, admin, QA)'}
              {formData.category === 'additionalCosts' && 'Extra expenses (e.g., travel, contingency)'}
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Description (Optional)</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-5 py-3.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition resize-none"
              placeholder="Brief description for internal reference..."
            />
          </div>

          {/* Field Requirements */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-7 border border-blue-200">
            <h3 className="font-bold text-blue-900 mb-5 text-xl">Required Fields in Estimate Form</h3>
            <p className="text-sm text-blue-700 mb-6">Select which fields users must fill when adding this cost type</p>

            <div className="space-y-5">
              <label className="flex items-center gap-5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.requiresQuantity}
                  onChange={(e) => setFormData({ ...formData, requiresQuantity: e.target.checked })}
                  className="w-6 h-6 text-blue-600 rounded focus:ring-blue-500"
                />
                <div>
                  <span className="font-semibold text-slate-800">Quantity / Hours</span>
                  <p className="text-sm text-slate-600">User must enter number of units or hours</p>
                </div>
              </label>

              <label className="flex items-center gap-5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.requiresRate}
                  onChange={(e) => setFormData({ ...formData, requiresRate: e.target.checked })}
                  className="w-6 h-6 text-blue-600 rounded focus:ring-blue-500"
                />
                <div>
                  <span className="font-semibold text-slate-800">Rate / Unit Cost</span>
                  <p className="text-sm text-slate-600">User must enter cost per unit</p>
                </div>
              </label>

              <label className="flex items-center gap-5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.requiresMonths}
                  onChange={(e) => setFormData({ ...formData, requiresMonths: e.target.checked })}
                  className="w-6 h-6 text-blue-600 rounded focus:ring-blue-500"
                />
                <div>
                  <span className="font-semibold text-slate-800">Duration (Months)</span>
                  <p className="text-sm text-slate-600">User must specify how many months this cost applies</p>
                </div>
              </label>
            </div>
          </div>

          {/* Active Toggle */}
          <div className="flex items-center gap-5">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-6 h-6 text-green-600 rounded focus:ring-green-500"
            />
            <span className="font-semibold text-slate-800 text-lg">Active (Visible in estimates)</span>
          </div>

          {/* Form Preview */}
          <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl p-7 border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-5 text-xl">Form Preview</h3>
            <p className="text-sm text-slate-600 mb-6">This is how the cost entry form will look when using this type:</p>

            <div className="space-y-4 bg-white rounded-xl p-6 border border-slate-200 shadow-inner">
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="font-medium text-slate-700">Cost Name (always required)</span>
              </div>

              {formData.requiresQuantity && (
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="font-medium text-slate-700">Quantity / Hours</span>
                </div>
              )}

              {formData.requiresRate && (
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="font-medium text-slate-700">Rate / Cost per Unit</span>
                </div>
              )}

              {formData.requiresMonths && (
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="font-medium text-slate-700">Months Used</span>
                </div>
              )}

              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="font-medium text-slate-700">Notes (optional)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 flex justify-end gap-4 bg-slate-50 rounded-b-2xl">
          <button
            onClick={closeModal}
            className="px-8 py-3.5 border border-slate-300 rounded-xl font-medium hover:bg-slate-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-3.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 shadow-lg transition transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : selectedCostType ? 'Update Cost Type' : 'Create Cost Type'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CostTypeModal;