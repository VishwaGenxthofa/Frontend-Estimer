import React, { useState } from "react";
import { X, Check } from "lucide-react";
import { Steps, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../../redux/store";
import {
  createEstimate,
  fetchEstimates,
  toggleCreateModal,
} from "../../../redux/estimateSlice";
import { useEstimationCalculations } from "../../../hooks/useEstimationCalculations";

import BasicStep from "../steps/BasicStep";
import LaborStep from "../steps/LaborStep";
import DirectStep from "../steps/DirectStep";
import IndirectStep from "../steps/IndirectStep";
import AdditionalSummaryStep from "../steps/AdditionalSummaryStep";

const CreateEstimateModal: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { showCreateModal } = useSelector((state: RootState) => state.estimate);

  const { calculateDirectTotal, calculateTotals } =
    useEstimationCalculations();

  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    projectName: "",
    versionNumber: 1,
    clientRemarks: "",
    profitPercentage: 20,
    taxId: 1,
  });

  const [laborCosts, setLaborCosts] = useState<any[]>([
    { employeeId: "", notes: "", estimatedHours: "", hourlyRate: "" },
  ]);

  const [directCosts, setDirectCosts] = useState<any[]>([
    {
      costTypeId: 1,
      costName: "",
      quantityOrHours: "",
      rateOrCost: "",
      monthsUsed: 1,
      notes: "",
    },
  ]);

  const [indirectCosts, setIndirectCosts] = useState<any[]>([
    { costTypeId: 4, costName: "", costAmount: "", notes: "" },
  ]);

  const [additionalCosts, setAdditionalCosts] = useState<any[]>([
    { costTypeId: 7, costName: "", costAmount: "", notes: "" },
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

  const handleSubmit = async () => {
    try {
      await dispatch(
        createEstimate({
          ...formData,
          laborCosts,
          directCosts,
          indirectCosts,
          additionalCosts,
        })
      ).unwrap();
      dispatch(fetchEstimates());
      closeModal();
    } catch (err) {
      console.error("Create estimate failed", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[95vh] flex flex-col">

        {/* Header */}
        <div className="p-6 border-b flex justify-between">
          <div>
            <h2 className="text-2xl font-bold">Create New Estimate</h2>
            <p className="text-slate-500">Step {step} of 5</p>
          </div>
          <button onClick={closeModal}>
            <X />
          </button>
        </div>

        {/* Ant Design Steps */}
        <div className="px-6 pt-4">
          <Steps
            current={step - 1}
            onChange={(current) => setStep(current + 1)}
            items={[
              { title: "Basic" },
              { title: "Labor" },
              { title: "Direct" },
              { title: "Indirect" },
              { title: "Summary" },
            ]}
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 1 && (
            <BasicStep formData={formData} setFormData={setFormData} />
          )}
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
          <Button disabled={step === 1} onClick={() => setStep(step - 1)}>
            Previous
          </Button>

          {step < 5 ? (
            <Button type="primary" onClick={() => setStep(step + 1)}>
              Next
            </Button>
          ) : (
            <Button
              type="primary"
              danger
              icon={<Check />}
              onClick={handleSubmit}
            >
              Create Estimate
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateEstimateModal;
