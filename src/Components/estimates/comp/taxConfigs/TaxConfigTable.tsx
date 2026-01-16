// src/features/taxConfigs/components/TaxConfigTable.tsx
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch, RootState } from '../../../../redux/store';
import { deleteTaxConfig } from '../../../../redux/taxConfigs';
import { setSelectedTax, toggleTaxModal, setSettingsTab } from '../../../../redux/uiSlice';
import { Edit2, Trash2, Plus } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
const TaxConfigTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const taxConfigs = useSelector((state: RootState) => state.estimatestaxconfig.taxConfigs);

  const handleEdit = (tax: any) => {
    dispatch(setSelectedTax(tax));
    dispatch(toggleTaxModal(true));
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this tax configuration?')) {
      dispatch(deleteTaxConfig(id));
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="mb-6 flex justify-end">
        <button
          onClick={() => {
            dispatch(setSelectedTax(null));
            dispatch(toggleTaxModal(true));
            dispatch(setSettingsTab('taxConfigs'));
          }}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Add Tax Config
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-6 border-b bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800">Tax Configurations</h2>
          <p className="text-sm text-slate-600 mt-1">Manage tax rates for estimates</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Tax Name</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">Tax Rate (%)</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">Status</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">Example (on ₹100K)</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {taxConfigs.map((tax) => (
                <tr key={tax.taxConfigId} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-slate-600 font-mono text-sm">{tax.taxConfigId}</td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-slate-800">{tax.taxName}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-lg font-bold text-blue-600">{tax.taxRate.toFixed(2)}%</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      tax.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {tax.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-slate-600">
                    ₹{(100000 * (tax.taxRate / 100)).toLocaleString('en-IN')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(tax)} className="p-2 hover:bg-blue-50 rounded-lg" title="Edit">
                        <Edit2 className="w-4 h-4 text-blue-600" />
                      </button>
                      <button onClick={() => handleDelete(tax.taxConfigId)} className="p-2 hover:bg-red-50 rounded-lg" title="Delete">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default TaxConfigTable;