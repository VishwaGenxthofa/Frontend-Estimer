// steps/DirectStep.tsx
import React, { useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useDispatch, useSelector } from "react-redux";
import { fetchCostTypes } from "../../../redux/costTypeSlice";
import type { RootState, AppDispatch } from "../../../redux/store";

interface Props {
  directCosts: any[];
  setDirectCosts: React.Dispatch<React.SetStateAction<any[]>>;
  totals: { totalDirectCost: number };
}

const DirectStep: React.FC<Props> = ({ directCosts, setDirectCosts, totals }) => {
  const dispatch = useDispatch<AppDispatch>();
  const costTypes = useSelector((state: RootState) => state.costTypes.costTypes);

  useEffect(() => {
    dispatch(fetchCostTypes());
  }, [dispatch]);

  // Update cost type
  const handleTypeChange = (index: number, costTypeId: string) => {
    const updated = [...directCosts];
    updated[index].costTypeId = costTypeId;

    const type = costTypes.find((ct: any) => ct.costTypeId === costTypeId || ct.costTypeId === Number(costTypeId));
    updated[index].costName = type?.costTypeName || '';
    updated[index].requiresQuantity = type?.requiresQuantity ?? false;
    updated[index].requiresRate = type?.requiresRate ?? false;
    updated[index].requiresMonths = type?.requiresMonths ?? false;

    setDirectCosts(updated);
  };

  // Update any field
  const handleFieldChange = (index: number, field: string, value: any) => {
    const updated = [...directCosts];

    // Convert numeric fields to numbers
    if (['quantityOrHours', 'rateOrCost', 'monthsUsed'].includes(field)) {
      updated[index][field] = Number(value) || 0;
    } else {
      updated[index][field] = value;
    }

    setDirectCosts(updated);
  };

  // Calculate individual total
  const calculateDirectTotal = (d: any) => {
    const qty = Number(d.quantityOrHours || 0);
    const rate = Number(d.rateOrCost || 0);
    const months = Number(d.monthsUsed || 1);
    return qty * rate * months;
  };

  // Calculate grand total
  const totalDirectCost = directCosts.reduce((sum, d) => sum + calculateDirectTotal(d), 0);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-xl">Direct Costs</h3>
        <button
          onClick={() => setDirectCosts([
            ...directCosts,
            { costTypeId: '', costName: '', quantityOrHours: 0, rateOrCost: 0, monthsUsed: 1, notes: '' }
          ])}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      {directCosts.map((d: any, i: number) => {
        const ct = costTypes.find((c: any) => c.costTypeId === d.costTypeId || c.costTypeId === Number(d.costTypeId));
        return (
          <div key={i} className="p-4 bg-slate-50 rounded-lg border">
            <div className="flex justify-between mb-3">
              <span className="font-semibold">Direct Cost #{i + 1}</span>
              {directCosts.length > 1 && (
                <button
                  onClick={() => setDirectCosts(directCosts.filter((_, idx) => idx !== i))}
                  className="text-red-600 hover:bg-red-50 p-1 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <select
              value={d.costTypeId}
              onChange={(e) => handleTypeChange(i, e.target.value)}
              className="w-full px-3 py-2 border rounded-lg mb-3"
            >
              <option value="">Select Direct Cost Type</option>
              {costTypes
                .filter(ct => ct.isActive && (ct.category === 'directCosts'))
                .map(ct => (
                  <option key={ct.costTypeId} value={ct.costTypeId}>
                    {ct.costTypeName}
                  </option>
                ))}
            </select>

            <div className="grid grid-cols-3 gap-3 mb-3">
              {ct?.requiresQuantity && (
                <input
                  type="number"
                  value={d.quantityOrHours}
                  onChange={(e) => handleFieldChange(i, 'quantityOrHours', e.target.value)}
                  placeholder="Quantity"
                  className="px-3 py-2 border rounded-lg"
                />
              )}
              {ct?.requiresRate && (
                <input
                  type="number"
                  value={d.rateOrCost}
                  onChange={(e) => handleFieldChange(i, 'rateOrCost', e.target.value)}
                  placeholder="Rate"
                  className="px-3 py-2 border rounded-lg"
                />
              )}
              {ct?.requiresMonths && (
                <input
                  type="number"
                  value={d.monthsUsed}
                  onChange={(e) => handleFieldChange(i, 'monthsUsed', e.target.value)}
                  placeholder="Months"
                  className="px-3 py-2 border rounded-lg"
                />
              )}
            </div>

            <input
              type="text"
              value={d.notes}
              onChange={(e) => handleFieldChange(i, 'notes', e.target.value)}
              placeholder="Notes"
              className="w-full px-3 py-2 border rounded-lg mb-3"
            />

            <div className="text-right font-semibold">
              Total: ₹{calculateDirectTotal(d).toLocaleString('en-IN')}
            </div>
          </div>
        );
      })}

      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="font-bold text-blue-900 text-lg">
          Total Direct Cost: ₹{totalDirectCost.toLocaleString('en-IN')}
        </p>
      </div>
    </div>
  );
};

export default DirectStep;
