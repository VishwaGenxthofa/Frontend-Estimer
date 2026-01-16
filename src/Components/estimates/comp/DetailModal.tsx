// src/components/DetailModal.tsx
import React from 'react';
import { X, Check } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../../redux/store';
import { toggleDetailModal } from '../../../redux/estimateSlice';

const DetailModal: React.FC = () => {
  const dispatch = useDispatch();
  const { 
    selectedEstimate, 
    showDetailModal, 
    laborCosts, 
    directCosts, 
    indirectCosts, 
    additionalCosts, 
    employees,
    statuses, 
    taxConfigs,
    costTypes, 
  } = useSelector((state: RootState) => state.estimate);

  // Fixed selectors for statuses and tax configs
  // const statuses = useSelector((state: RootState) => state.estimatestatus?.statuses || []);
  // const taxConfigs = useSelector((state: RootState) => state.estimatestaxconfig?.taxConfigs || []);

  if (!showDetailModal || !selectedEstimate) return null;

  const est = selectedEstimate;

  // Filter costs
  const laborForEst = laborCosts.filter((l: any) => l.estimationId === est.estimationId);
  const directForEst = directCosts.filter((d: any) => d.estimationId === est.estimationId);
  const indirectForEst = indirectCosts.filter((i: any) => i.estimationId === est.estimationId);
  const additionalForEst = additionalCosts.filter((a: any) => a.estimationId === est.estimationId);

  const status = statuses.find((s: any) => s.estimationStatusId === est.estimationStatusId);
  const tax = taxConfigs.find((t: any) => t.taxConfigId === est.taxId);
console.log(status)
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex justify-between items-center z-10">
          <div>
            <h2 className="text-4xl font-bold text-slate-800">{est.projectName}</h2>
            <div className="flex items-center gap-6 mt-3">
              <p className="text-xl text-slate-600">Version {est.versionNumber ?? '1.0'}</p>
              <span 
                className="px-4 py-2 rounded-full text-white font-semibold"
                style={{ backgroundColor: status?.statusColor || '#94a3b8' }}
              >
                {status?.statusName || 'Unknown Status'}
              </span>
            </div>
          </div>
          <button
            onClick={() => dispatch(toggleDetailModal(false))}
            className="p-3 hover:bg-slate-100 rounded-xl transition"
          >
            <X className="w-7 h-7 text-slate-600" />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-10">
          {/* Summary Cards */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
            <h3 className="text-2xl font-bold text-blue-900 mb-6">Estimate Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <p className="text-sm text-blue-700 font-medium">Subtotal</p>
                <p className="text-3xl font-bold text-blue-900 mt-2">
                  ₹{(est.subTotal ?? 0).toLocaleString('en-IN')}
                </p>
              </div>
              <div>
                <p className="text-sm text-blue-700 font-medium">Profit ({est.profitPercentage ?? 0}%)</p>
                <p className="text-3xl font-bold text-green-700 mt-2">
                  ₹{(est.profitAmount ?? 0).toLocaleString('en-IN')}
                </p>
              </div>
              <div>
                <p className="text-sm text-blue-700 font-medium">
                  {tax?.taxName || 'Tax'} ({est.taxPercentage ?? 0}%)
                </p>
                <p className="text-3xl font-bold text-amber-700 mt-2">
                  ₹{(est.taxAmount ?? 0).toLocaleString('en-IN')}
                </p>
              </div>
              <div>
                <p className="text-sm text-blue-700 font-medium">Final Amount</p>
                <p className="text-4xl font-bold text-indigo-900 mt-2">
                  ₹{(est.finalAmount ?? 0).toLocaleString('en-IN')}
                </p>
              </div>
            </div>
            {est.clientRemarks && (
              <div className="mt-8">
                <p className="text-sm text-blue-700 font-medium">Client Remarks</p>
                <p className="text-lg text-slate-800 mt-2 italic">"{est.clientRemarks}"</p>
              </div>
            )}
          </div>

          {/* Cost Breakdown Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200">
              <h4 className="font-bold text-emerald-900 text-lg">Labor Cost</h4>
              <p className="text-3xl font-bold text-emerald-700 mt-3">
                ₹{(est.totalLaborCost ?? 0).toLocaleString('en-IN')}
              </p>
            </div>
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
              <h4 className="font-bold text-blue-900 text-lg">Direct Cost</h4>
              <p className="text-3xl font-bold text-blue-700 mt-3">
                ₹{(est.totalDirectCost ?? 0).toLocaleString('en-IN')}
              </p>
            </div>
            <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200">
              <h4 className="font-bold text-purple-900 text-lg">Indirect Cost</h4>
              <p className="text-3xl font-bold text-purple-700 mt-3">
                ₹{(est.totalIndirectCost ?? 0).toLocaleString('en-IN')}
              </p>
            </div>
            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
              <h4 className="font-bold text-amber-900 text-lg">Additional Cost</h4>
              <p className="text-3xl font-bold text-amber-700 mt-3">
                ₹{(est.totalAdditionalCost ?? 0).toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          {/* Labor Costs Table */}
          {laborForEst.length > 0 && (
            <div>
              <h3 className="text-2xl font-bold text-slate-800 mb-5">Labor Costs</h3>
              <div className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200">
                <table className="w-full">
                  <thead className="bg-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Employee</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Role</th>
                      <th className="px-6 py-4 text-center text-sm font-bold text-slate-700">Hours</th>
                      <th className="px-6 py-4 text-center text-sm font-bold text-slate-700">Rate</th>
                      <th className="px-6 py-4 text-right text-sm font-bold text-slate-700">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {laborForEst.map((l: any) => {
                      const emp = employees.find((e: any) => e.employeeId === l.employeeId);
                      return (
                        <tr key={l.estimateLaborCostId || Math.random()} className="hover:bg-white">
                          <td className="px-6 py-4 font-medium">{emp?.employeeName || 'Unknown'}</td>
                          <td className="px-6 py-4 text-slate-600">{l.notes || emp?.designation || '-'}</td>
                          <td className="px-6 py-4 text-center">{l.estimatedHours || l.quantityOrHours || 0}h</td>
                          <td className="px-6 py-4 text-center">₹{(l.hourlyRate || l.rateOrCost || 0).toLocaleString('en-IN')}</td>
                          <td className="px-6 py-4 text-right font-bold">
                            ₹{(l.totalCost ?? 0).toLocaleString('en-IN')}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Direct Costs Table */}
          {directForEst.length > 0 && (
            <div>
              <h3 className="text-2xl font-bold text-slate-800 mb-5">Direct Costs</h3>
              <div className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200">
                <table className="w-full">
                  <thead className="bg-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Item</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Type</th>
                      <th className="px-6 py-4 text-center text-sm font-bold text-slate-700">Qty</th>
                      <th className="px-6 py-4 text-center text-sm font-bold text-slate-700">Rate</th>
                      <th className="px-6 py-4 text-center text-sm font-bold text-slate-700">Months</th>
                      <th className="px-6 py-4 text-right text-sm font-bold text-slate-700">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {directForEst.map((d: any) => {
                      const ct = costTypes.find((c: any) => c.costTypeId === d.costTypeId);
                      return (
                        <tr key={d.estimateDirectCostId || Math.random()} className="hover:bg-white">
                          <td className="px-6 py-4 font-medium">{d.costName}</td>
                          <td className="px-6 py-4 text-slate-600">{ct?.costTypeName || 'Unknown'}</td>
                          <td className="px-6 py-4 text-center">{d.quantityOrHours ?? 0}</td>
                          <td className="px-6 py-4 text-center">₹{(d.rateOrCost ?? 0).toLocaleString('en-IN')}</td>
                          <td className="px-6 py-4 text-center">{d.monthsUsed || '-'}</td>
                          <td className="px-6 py-4 text-right font-bold">
                            ₹{(d.totalCost ?? 0).toLocaleString('en-IN')}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Indirect & Additional Costs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {indirectForEst.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-slate-800 mb-5">Indirect Costs</h3>
                <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200 space-y-4">
                  {indirectForEst.map((i: any) => {
                    const ct = costTypes.find((c: any) => c.costTypeId === i.costTypeId);
                    return (
                      <div key={i.estimateIndirectCostId || Math.random()} className="flex justify-between items-center py-3 border-b border-purple-100 last:border-0">
                        <div>
                          <p className="font-semibold text-purple-900">{i.costName}</p>
                          <p className="text-sm text-purple-700">{ct?.costTypeName} — {i.notes || ''}</p>
                        </div>
                        <p className="text-xl font-bold text-purple-800">
                          ₹{(i.costAmount ?? 0).toLocaleString('en-IN')}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {additionalForEst.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-slate-800 mb-5">Additional Costs</h3>
                <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200 space-y-4">
                  {additionalForEst.map((a: any) => {
                    const ct = costTypes.find((c: any) => c.costTypeId === a.costTypeId);
                    return (
                      <div key={a.estimateAdditionalCostId || Math.random()} className="flex justify-between items-center py-3 border-b border-amber-100 last:border-0">
                        <div>
                          <p className="font-semibold text-amber-900">{a.costName}</p>
                          <p className="text-sm text-amber-700">{ct?.costTypeName} — {a.notes || ''}</p>
                        </div>
                        <p className="text-xl font-bold text-amber-800">
                          ₹{(a.costAmount ?? 0).toLocaleString('en-IN')}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;