// components/CreateEstimateModal.tsx
import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Check } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import type{ RootState } from '../../../redux/store';
// import { toggleCreateModal, addEstimate } from '../../../redux/estimateSlice';
import { useEstimationCalculations } from '../../../hooks/useEstimationCalculations';
import { toggleCreateModal } from '../../../redux/estimateSlice';
import BasicStep from '../steps/BasicStep';
import LaborStep from '../steps/LaborStep';
import DirectStep from '../steps/DirectStep';
import IndirectStep from '../steps/IndirectStep';
import AdditionalSummaryStep from '../steps/AdditionalSummaryStep';
import Modal from '../../common/Modal';
interface AddEstmationModalProps {
  onClose: () => void;
 
}


const CreateEstimateModal: React.FC<AddEstmationModalProps> = ({
onClose,
}) => {
  const dispatch = useDispatch();
  const { showCreateModal, estimates, laborCosts: globalLaborCosts } = useSelector(
    (state: RootState) => state.estimate
  );
  const { calculateDirectTotal, calculateTotals } = useEstimationCalculations();

  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    projectName: '',
    versionNumber: 1.0,
    clientRemarks: '',
    profitPercentage: 20,
    taxId: 1,
  });


  const [laborCosts, setLaborCosts] = useState<any[]>([
    { employeeId: '', notes: '', estimatedHours: '', hourlyRate: '' },
  ]);
  const [directCosts, setDirectCosts] = useState<any[]>([
    { costTypeId: 1, costName: '', quantityOrHours: '', rateOrCost: '', monthsUsed: 1, notes: '' },
  ]);
  const [indirectCosts, setIndirectCosts] = useState<any[]>([
    { costTypeId: 4, costName: '', costAmount: '', notes: '' },
  ]);
  const [additionalCosts, setAdditionalCosts] = useState<any[]>([
    { costTypeId: 7, costName: '', costAmount: '', notes: '' },
  ]);

  // Real-time totals
  const totals = calculateTotals(
    laborCosts,
    directCosts,
    indirectCosts,
    additionalCosts,
    formData.profitPercentage,
    formData.taxId
  );

  useEffect(() => {
    // Optional: recalculate on any change
  }, [laborCosts, directCosts, indirectCosts, additionalCosts, formData]);

  if (!showCreateModal) return null;

  const closeModal = () => {
   dispatch(toggleCreateModal(false));
    setStep(1);
    setFormData({
      projectName: '',
      versionNumber: 1.0,
      clientRemarks: '',
      profitPercentage: 20,
      taxId: 1,
    });
    setLaborCosts([{ employeeId: '', notes: '', estimatedHours: '', hourlyRate: '' }]);
    setDirectCosts([{ costTypeId: 1, costName: '', quantityOrHours: '', rateOrCost: '', monthsUsed: 1, notes: '' }]);
    setIndirectCosts([{ costTypeId: 4, costName: '', costAmount: '', notes: '' }]);
    setAdditionalCosts([{ costTypeId: 7, costName: '', costAmount: '', notes: '' }]);
  };

  const handleSubmit = () => {
    const newId = Math.max(...estimates.map((e: any) => e.estimateId), 0) + 1;

    const newLaborCosts = laborCosts
      .filter((l) => l.employeeId && l.estimatedHours && l.hourlyRate)
      .map((l, i) => ({
        estimateLaborCostId: globalLaborCosts.length + i + 1,
        estimationId: newId,
        employeeId: parseInt(l.employeeId),
        notes: l.notes,
        estimatedHours: parseFloat(l.estimatedHours),
        hourlyRate: parseFloat(l.hourlyRate),
        totalCost: parseFloat(l.estimatedHours) * parseFloat(l.hourlyRate),
      }));

    const newDirectCosts = directCosts
      .filter((d) => d.costTypeId && d.quantityOrHours && d.rateOrCost)
      .map((d, i) => ({
        estimateDirectCostId: globalLaborCosts.length + newLaborCosts.length + i + 1, // simple ID
        estimationId: newId,
        costTypeId: parseInt(d.costTypeId),
        costName: d.costName,
        quantityOrHours: parseFloat(d.quantityOrHours),
        rateOrCost: parseFloat(d.rateOrCost),
        monthsUsed: parseFloat(d.monthsUsed) || 1,
        totalCost: calculateDirectTotal(d),
        notes: d.notes,
      }));

    const newIndirectCosts = indirectCosts
      .filter((i) => i.costTypeId && i.costAmount)
      .map((ic, i) => ({
        estimateIndirectCostId: 1000 + i, // placeholder
        estimationId: newId,
        costTypeId: parseInt(ic.costTypeId),
        costName: ic.costName,
        costAmount: parseFloat(ic.costAmount),
        notes: ic.notes,
      }));

    const newAdditionalCosts = additionalCosts
      .filter((a) => a.costTypeId && a.costAmount)
      .map((ac, i) => ({
        estimateAdditionalCostId: 2000 + i,
        estimationId: newId,
        costTypeId: parseInt(ac.costTypeId),
        costName: ac.costName,
        costAmount: parseFloat(ac.costAmount),
        notes: ac.notes,
      }));

    dispatch(
      addEstimate({
        estimate: {
          estimateId: newId,
          projectId: newId,
          projectName: formData.projectName,
          versionNumber: parseFloat(formData.versionNumber.toString()),
          estimationStatusId: 1, // Draft
          clientRemarks: formData.clientRemarks,
          profitPercentage: parseFloat(formData.profitPercentage.toString()),
          taxId: parseInt(formData.taxId.toString()),
          taxPercentage: totals.taxPercentage,
          createdAt: new Date().toISOString(),
          totalLaborCost: totals.totalLaborCost,
          totalDirectCost: totals.totalDirectCost,
          totalIndirectCost: totals.totalIndirectCost,
          totalAdditionalCost: totals.totalAdditionalCost,
          subTotal: totals.subTotal,
          profitAmount: totals.profitAmount,
          taxAmount: totals.taxAmount,
          finalAmount: totals.finalAmount,
        },
        laborCosts: newLaborCosts,
        directCosts: newDirectCosts,
        indirectCosts: newIndirectCosts,
        additionalCosts: newAdditionalCosts,
      })
    );

    closeModal();
  };

  const steps = ['Basic', 'Labor', 'Direct', 'Indirect', 'Additional & Summary'];

  return (
    <>
    
    <div className="fixed  inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Create New Estimate</h2>
            <p className="text-slate-600">Step {step} of 5</p>
          </div>
          <button
            onClick={closeModal}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Step Navigation */}
        <div className="flex gap-2 px-6 pt-4 overflow-x-auto pb-2">
          {steps.map((label, i) => (
            <button
              key={i}
              onClick={() => setStep(i + 1)}
              className={`px-5 py-2 rounded-lg font-medium whitespace-nowrap transition ${
                step === i + 1
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 1 && <BasicStep formData={formData} setFormData={setFormData} />}
          {step === 2 && (
            <LaborStep
              laborCosts={laborCosts}
              setLaborCosts={setLaborCosts}
              totals={totals}
            />
          )}
          {step === 3 && (
            <DirectStep
              directCosts={directCosts}
              setDirectCosts={setDirectCosts}
              calculateDirectTotal={calculateDirectTotal}
              totals={totals}
            />
          )}
          {step === 4 && (
            <IndirectStep
              indirectCosts={indirectCosts}
              setIndirectCosts={setIndirectCosts}
              totals={totals}
            />
          )}
          {step === 5 && (
            <AdditionalSummaryStep
              additionalCosts={additionalCosts}
              setAdditionalCosts={setAdditionalCosts}
              formData={formData}
              totals={totals}
            />
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t flex justify-between">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              step === 1
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
            }`}
          >
            Previous
          </button>

          {step < 5 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition flex items-center gap-2"
            >
              <Check className="w-5 h-5" />
              Create Estimate
            </button>
          )}
        </div>
      </div>
    </div>
    
</>
  );
};

export default CreateEstimateModal;