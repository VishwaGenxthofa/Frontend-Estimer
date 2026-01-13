// steps/DirectStep.tsx
import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../redux/store';

interface Props {
  directCosts: any[];
  setDirectCosts: React.Dispatch<React.SetStateAction<any[]>>;
  calculateDirectTotal: (cost: any) => number;
  totals: any;
}

const DirectStep: React.FC<Props> = ({ directCosts, setDirectCosts, calculateDirectTotal, totals }) => {
  const { costTypes } = useSelector((state: RootState) => state.estimate);

  const handleTypeChange = (index: number, costTypeId: string) => {
    const updated = [...directCosts];
    updated[index].costTypeId = costTypeId;
    const type = costTypes.find((ct: any) => ct.costTypeId === parseInt(costTypeId));
    updated[index].costName = type?.costTypeName || '';
    setDirectCosts(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-xl">Direct Costs</h3>
        <button
          onClick={() => setDirectCosts([...directCosts, { costTypeId: 1, costName: '', quantityOrHours: '', rateOrCost: '', monthsUsed: 1, notes: '' }])}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      {directCosts.map((d: any, i: number) => {
        const ct = costTypes.find((c: any) => c.costTypeId === parseInt(d.costTypeId));

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
              {costTypes
                .filter((ct: any) => ct.isActive && [1, 2, 3].includes(ct.costTypeId))
                .map((ct: any) => (
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
                  onChange={(e) => {
                    const u = [...directCosts];
                    u[i].quantityOrHours = e.target.value;
                    setDirectCosts(u);
                  }}
                  placeholder="Quantity"
                  className="px-3 py-2 border rounded-lg"
                />
              )}
              {ct?.requiresRate && (
                <input
                  type="number"
                  value={d.rateOrCost}
                  onChange={(e) => {
                    const u = [...directCosts];
                    u[i].rateOrCost = e.target.value;
                    setDirectCosts(u);
                  }}
                  placeholder="Rate"
                  className="px-3 py-2 border rounded-lg"
                />
              )}
              {ct?.requiresMonths && (
                <input
                  type="number"
                  value={d.monthsUsed}
                  onChange={(e) => {
                    const u = [...directCosts];
                    u[i].monthsUsed = e.target.value;
                    setDirectCosts(u);
                  }}
                  placeholder="Months"
                  className="px-3 py-2 border rounded-lg"
                />
              )}
            </div>

            <input
              type="text"
              value={d.notes}
              onChange={(e) => {
                const u = [...directCosts];
                u[i].notes = e.target.value;
                setDirectCosts(u);
              }}
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
          Total Direct Cost: ₹{totals.totalDirectCost.toLocaleString('en-IN')}
        </p>
      </div>
    </div>
  );
};

export default DirectStep;