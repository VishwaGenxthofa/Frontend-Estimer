// steps/IndirectStep.tsx
import React, { useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useDispatch, useSelector } from "react-redux";
import { fetchCostTypes } from "../../../redux/costTypeSlice";
import type { RootState, AppDispatch } from "../../../redux/store";

interface Props {
  indirectCosts: any[];
  setIndirectCosts: React.Dispatch<React.SetStateAction<any[]>>;
  totals: any;
}

const IndirectStep: React.FC<Props> = ({ indirectCosts, setIndirectCosts, totals }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { costTypes } = useSelector((state: RootState) => state.costTypes);

  useEffect(() => {
    dispatch(fetchCostTypes());
  }, [dispatch]);

  const handleTypeChange = (index: number, costTypeId: string) => {
    const updated = [...indirectCosts];
    updated[index].costTypeId = costTypeId;
    const type = costTypes.find((ct: any) => ct.costTypeId === parseInt(costTypeId));
    updated[index].costName = type?.costTypeName || '';
    setIndirectCosts(updated);
  };

  // Filter active indirect cost types
  const activeIndirectTypes = costTypes.filter(
    (ct: any) => ct.isActive && ['indirect', 'indirectCosts'].includes(ct.category)
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-xl">Indirect Costs</h3>
        <button
          onClick={() =>
            setIndirectCosts([...indirectCosts, { costTypeId: '', costName: '', costAmount: '', notes: '' }])
          }
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      {indirectCosts.map((ic: any, i: number) => (
        <div key={i} className="p-4 bg-slate-50 rounded-lg border">
          <div className="flex justify-between mb-3">
            <span className="font-semibold">Indirect Cost #{i + 1}</span>
            {indirectCosts.length > 1 && (
              <button
                onClick={() => setIndirectCosts(indirectCosts.filter((_, idx) => idx !== i))}
                className="text-red-600 hover:bg-red-50 p-1 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          <select
            value={ic.costTypeId}
            onChange={(e) => handleTypeChange(i, e.target.value)}
            className="w-full px-3 py-2 border rounded-lg mb-3"
          >
            <option value="">Select Indirect Cost Type</option>
            {activeIndirectTypes.map((ct: any) => (
              <option key={ct.costTypeId} value={ct.costTypeId}>
                {ct.costTypeName}
              </option>
            ))}
          </select>

          <input
            type="number"
            value={ic.costAmount}
            onChange={(e) => {
              const u = [...indirectCosts];
              u[i].costAmount = e.target.value;
              setIndirectCosts(u);
            }}
            placeholder="Amount"
            className="w-full px-3 py-2 border rounded-lg mb-3"
          />

          <input
            type="text"
            value={ic.notes}
            onChange={(e) => {
              const u = [...indirectCosts];
              u[i].notes = e.target.value;
              setIndirectCosts(u);
            }}
            placeholder="Notes"
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
      ))}

      <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
        <p className="font-bold text-purple-900 text-lg">
          Total Indirect Cost: ₹{totals.totalIndirectCost.toLocaleString('en-IN')}
        </p>
      </div>
    </div>
  );
};

export default IndirectStep;
