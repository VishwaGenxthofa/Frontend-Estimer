// src/features/costTypes/components/CostTypeTable.tsx
import { useSelector, useDispatch } from 'react-redux';
import  type{ RootState,AppDispatch } from '../../../../redux/store';
import { deleteCostType } from '../../../../redux/costTypeSlice';
import { setSelectedCostType, toggleCostTypeModal, setSettingsTab } from '../../../../redux/uiSlice';
import { Edit2, Trash2, Check, X, Plus } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
const CostTypeTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const costTypes = useSelector((state: RootState) => state.costTypes.costTypes);

const getCategoryBadge = (category: string) => {
  switch (category) {
    case "direct":
    case "directCosts":
      return {
        label: "Direct Cost",
        color: "bg-blue-100 text-blue-700",
      };

    case "indirect":
    case "indirectCosts":
      return {
        label: "Indirect Cost",
        color: "bg-purple-100 text-purple-700",
      };

    case "additional":
    case "additionalCosts":
      return {
        label: "Additional Cost",
        color: "bg-amber-100 text-amber-700",
      };

    default:
      return {
        label: "Unknown",
        color: "bg-slate-100 text-slate-600",
      };
  }
};



  const handleEdit = (costType: any) => {
    dispatch(setSelectedCostType(costType));
    dispatch(toggleCostTypeModal(true));
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this cost type?')) {
      dispatch(deleteCostType(id));
    }
  };

  return (
    <>
    <Toaster position="top-right" />
      <div className="mb-6 flex justify-end">
        <button
          onClick={() => {
            dispatch(setSelectedCostType(null));
            dispatch(toggleCostTypeModal(true));
            dispatch(setSettingsTab('costTypes'));
          }}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Add Cost Type
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border  overflow-hidden">
        <div className="p-6 border-b bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800">Cost Types</h2>
          <p className="text-sm text-slate-600 mt-1">Configure cost types for estimates</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Category</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Description</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">Qty</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">Rate</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">Months</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">Status</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {costTypes.map((ct) => {
                const badge = getCategoryBadge(ct.category);
                return (
                  <tr key={ct.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-slate-600 font-mono text-sm">{ct.costTypeId}</td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-800">{ct.costTypeName}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-sm">{ct.description}</td>
                    <td className="px-6 py-4 text-center">
                      {ct.requiresQuantity ? <Check className="w-5 h-5 text-green-600 mx-auto" /> : <X className="w-5 h-5 text-slate-300 mx-auto" />}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {ct.requiresRate ? <Check className="w-5 h-5 text-green-600 mx-auto" /> : <X className="w-5 h-5 text-slate-300 mx-auto" />}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {ct.requiresMonths ? <Check className="w-5 h-5 text-green-600 mx-auto" /> : <X className="w-5 h-5 text-slate-300 mx-auto" />}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${ct.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                        {ct.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(ct)} className="p-2 hover:bg-blue-50 rounded-lg" title="Edit">
                          <Edit2 className="w-4 h-4 text-blue-600" />
                        </button>
                        <button onClick={() => handleDelete(ct.costTypeId)} className="p-2 hover:bg-red-50 rounded-lg" title="Delete">
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default CostTypeTable;