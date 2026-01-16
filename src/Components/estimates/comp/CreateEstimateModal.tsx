// components/CreateEstimateModal.tsx
import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../../../redux/store';
import { createEstimate, fetchEstimates, toggleCreateModal } 
  from '../../../redux/estimateSlice';
import { useEstimationCalculations } from '../../../hooks/useEstimationCalculations';

import BasicStep from '../steps/BasicStep';
import LaborStep from '../steps/LaborStep';
import DirectStep from '../steps/DirectStep';
import IndirectStep from '../steps/IndirectStep';
import AdditionalSummaryStep from '../steps/AdditionalSummaryStep';

const CreateEstimateModal: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { showCreateModal } = useSelector((state: RootState) => state.estimate);

  const { calculateDirectTotal, calculateTotals } = useEstimationCalculations();

  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    projectName: '',
    versionNumber: 1,
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

  const totals = calculateTotals(
    laborCosts,
    directCosts,
    indirectCosts,
    additionalCosts,
    formData.profitPercentage,
    formData.taxId
  );

  if (!showCreateModal) return null;

  const closeModal = () => {
    dispatch(toggleCreateModal(false));
    setStep(1);
  };

  // ✅ FIXED SUBMIT
  const handleSubmit = async () => {
    const payload = {
      projectName: formData.projectName,
      versionNumber: formData.versionNumber,
      clientRemarks: formData.clientRemarks,
      profitPercentage: formData.profitPercentage,
      taxId: formData.taxId,

      laborCosts: laborCosts
        .filter(l => l.employeeId && l.estimatedHours && l.hourlyRate)
        .map(l => ({
          employeeId: Number(l.employeeId),
          estimatedHours: Number(l.estimatedHours),
          hourlyRate: Number(l.hourlyRate),
          notes: l.notes,
        })),

      directCosts: directCosts
        .filter(d => d.quantityOrHours && d.rateOrCost)
        .map(d => ({
          costTypeId: Number(d.costTypeId),
          costName: d.costName,
          quantityOrHours: Number(d.quantityOrHours),
          rateOrCost: Number(d.rateOrCost),
          monthsUsed: Number(d.monthsUsed) || 1,
          notes: d.notes,
        })),

      indirectCosts: indirectCosts
        .filter(i => i.costAmount)
        .map(i => ({
          costTypeId: Number(i.costTypeId),
          costName: i.costName,
          costAmount: Number(i.costAmount),
          notes: i.notes,
        })),

      additionalCosts: additionalCosts
        .filter(a => a.costAmount)
        .map(a => ({
          costTypeId: Number(a.costTypeId),
          costName: a.costName,
          costAmount: Number(a.costAmount),
          notes: a.notes,
        })),
    };

    try {
      await dispatch(createEstimate(payload)).unwrap();
      dispatch(fetchEstimates());
      closeModal();
    } catch (err) {
      console.error('Create estimate failed', err);
    }
  };

  const steps = ['Basic', 'Labor', 'Direct', 'Indirect', 'Additional & Summary'];

  return (
    <div className=" fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[95vh] flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b flex justify-between">
          <div>
            <h2 className="text-2xl font-bold">Create New Estimate</h2>
            <p>Step {step} of 5</p>
          </div>
          <button onClick={closeModal}>
            <X />
          </button>
        </div>

        {/* Steps */}
        <div className="flex gap-2 px-6 pt-4 ">
          {steps.map((s, i) => (
            <button
              key={i}
              onClick={() => setStep(i + 1)}
              className={step === i + 1 ? 'bg-blue-600 text-white px-4 py-2 rounded' : 'px-4 py-2 bg-green-200 rounded'}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1   overflow-y-auto p-6">
          {step === 1 && <BasicStep formData={formData} setFormData={setFormData} />}
          {step === 2 && <LaborStep laborCosts={laborCosts} setLaborCosts={setLaborCosts} totals={totals} />}
          {step === 3 && <DirectStep directCosts={directCosts} setDirectCosts={setDirectCosts} calculateDirectTotal={calculateDirectTotal} totals={totals} />}
          {step === 4 && <IndirectStep indirectCosts={indirectCosts} setIndirectCosts={setIndirectCosts} totals={totals} />}
          {step === 5 && <AdditionalSummaryStep additionalCosts={additionalCosts} setAdditionalCosts={setAdditionalCosts} formData={formData} totals={totals} />}
        </div>

        {/* Footer */}
        <div className="p-6  border-t flex justify-between">
          <button disabled={step === 1} onClick={() => setStep(step - 1)}>
            Previous
          </button>

          {step < 5 ? (
            <button onClick={() => setStep(step + 1)}>Next</button>
          ) : (
            <button onClick={handleSubmit} className="bg-green-600 text-white px-6 py-2 rounded">
              <Check /> Create Estimate
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateEstimateModal;
