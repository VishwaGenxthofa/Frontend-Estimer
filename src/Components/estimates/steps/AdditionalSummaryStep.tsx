// steps/AdditionalSummaryStep.tsx
import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../redux/store';

interface Props {
  additionalCosts: any[];
  setAdditionalCosts: React.Dispatch<React.SetStateAction<any[]>>;
  formData: any;
  totals: any;
}

const AdditionalSummaryStep: React.FC<Props> = ({ additionalCosts, setAdditionalCosts, formData, totals }) => {
  const { costTypes, taxConfigs } = useSelector((state: RootState) => state.estimate);
  const selectedTax = taxConfigs.find((t: any) => t.taxConfigId === parseInt(formData.taxId));

  const handleTypeChange = (index: number, costTypeId: string) => {
    const updated = [...additionalCosts];
    updated[index].costTypeId = costTypeId;
    const type = costTypes.find((ct: any) => ct.costTypeId === parseInt(costTypeId));
    updated[index].costName = type?.costTypeName || '';
    setAdditionalCosts(updated);
  };

  return (
    <div className="space-y-6">
      {/* Additional Costs */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-xl">Additional Costs</h3>
          <button
            onClick={() => setAdditionalCosts([...additionalCosts, { costTypeId: 7, costName: '', costAmount: '', notes: '' }])}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>

        {additionalCosts.map((ac: any, i: number) => (
          <div key={i} className="p-4 bg-slate-50 rounded-lg border mb-4">
            <div className="flex justify-between mb-3">
              <span className="font-semibold">Additional Cost #{i + 1}</span>
              {additionalCosts.length > 1 && (
                <button
                  onClick={() => setAdditionalCosts(additionalCosts.filter((_, idx) => idx !== i))}
                  className="text-red-600 hover:bg-red-50 p-1 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <select
              value={ac.costTypeId}
              onChange={(e) => handleTypeChange(i, e.target.value)}
              className="w-full px-3 py-2 border rounded-lg mb-3"
            >
              {costTypes
                .filter((ct: any) => ct.isActive && [7, 8, 9].includes(ct.costTypeId))
                .map((ct: any) => (
                  <option key={ct.costTypeId} value={ct.costTypeId}>
                    {ct.costTypeName}
                  </option>
                ))}
            </select>

            <input
              type="number"
              value={ac.costAmount}
              onChange={(e) => {
                const u = [...additionalCosts];
                u[i].costAmount = e.target.value;
                setAdditionalCosts(u);
              }}
              placeholder="Amount"
              className="w-full px-3 py-2 border rounded-lg mb-3"
            />

            <input
              type="text"
              value={ac.notes}
              onChange={(e) => {
                const u = [...additionalCosts];
                u[i].notes = e.target.value;
                setAdditionalCosts(u);
              }}
              placeholder="Notes"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        ))}

        <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
          <p className="font-bold text-amber-900 text-lg">
            Total Additional Cost: ₹{totals.totalAdditionalCost.toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {/* Final Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-200">
        <h3 className="text-2xl font-bold text-blue-900 mb-6">Final Summary</h3>
        <div className="space-y-3 text-lg">
          <div className="flex justify-between"><span>Labor</span><span className="font-semibold">₹{totals.totalLaborCost.toLocaleString('en-IN')}</span></div>
          <div className="flex justify-between"><span>Direct</span><span className="font-semibold">₹{totals.totalDirectCost.toLocaleString('en-IN')}</span></div>
          <div className="flex justify-between"><span>Indirect</span><span className="font-semibold">₹{totals.totalIndirectCost.toLocaleString('en-IN')}</span></div>
          <div className="flex justify-between"><span>Additional</span><span className="font-semibold">₹{totals.totalAdditionalCost.toLocaleString('en-IN')}</span></div>
          <div className="border-t-2 border-blue-300 pt-3 flex justify-between font-medium">
            <span>Subtotal</span>
            <span>₹{totals.subTotal.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between"><span>Profit ({formData.profitPercentage}%)</span><span className="font-semibold">₹{totals.profitAmount.toLocaleString('en-IN')}</span></div>
          <div className="flex justify-between"><span>{selectedTax?.taxName} ({totals.taxPercentage}%)</span><span className="font-semibold">₹{totals.taxAmount.toLocaleString('en-IN')}</span></div>
          <div className="border-t-2 border-blue-400 pt-3 flex justify-between text-2xl font-bold text-blue-900">
            <span>Final Amount</span>
            <span>₹{totals.finalAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdditionalSummaryStep;