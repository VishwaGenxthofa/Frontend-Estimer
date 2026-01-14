// components/EstimateTable.tsx
import React, { useEffect } from "react";
import { Eye, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../../redux/store";
import {
  setSelectedEstimate,
  toggleDetailModal,
  deleteEstimate,
  updateEstimate,
  fetchEstimates,
} from "../../../redux/estimateSlice";
import type { Estimate } from "../../../types/Index";
import { fetchEstimationStatuses } from "../../../redux/estimationStatus";
import { fetchTaxConfigs } from "../../../redux/taxConfigs";

/**
 * Helper to safely format currency
 */
const formatCurrency = (value?: number) => {
  return Number(value || 0).toLocaleString("en-IN");
};

const EstimateTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {estimates} = useSelector(
    (state: RootState) => state.estimate
  );
  const {taxconfig} = useSelector(
    (state: RootState) => state.estimatestaxconfig
  );
  const { statuses } = useSelector(
    (state: RootState) => state.estimatestatus
  );
  useEffect(() => {
    dispatch(fetchEstimates());
    dispatch(fetchEstimationStatuses());
    dispatch(fetchTaxConfigs())
  }, [dispatch]);

  const handleStatusChange = (estimateId: number, statusId: number) => {
    dispatch(updateEstimate({ estimateId, statusId }));
  };

  const handleView = (estimate: Estimate) => {
    dispatch(setSelectedEstimate(estimate));
    dispatch(toggleDetailModal(true));
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Delete this estimate?")) {
      dispatch(deleteEstimate(id));
    }
  };

  return (
    <div className=" rounded-xl shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Project
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Version
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Tax
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">
                Amount
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {estimates.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-8 text-center text-slate-500"
                >
                  No estimates found
                </td>
              </tr>
            )}

            {estimates.map((est) => {
              const status = statuses.find(
                (s) => s.estimationStatusId === est.estimationStatusId
              );

              const tax = taxconfig.find(
                (t) => t.taxConfigId === est.taxId
              );
              
              return (
                <tr
                  key={est.estimationId}
                  className="hover:bg-slate-50 transition"
                >
                  {/* Project */}
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-800">
                      {est.projectName}
                    </p>
                    <p className="text-sm text-slate-500">
                      {est.clientRemarks || "-"}
                    </p>
                  </td>

                  {/* Version */}
                  <td className="px-6 py-4">v{est.versionNumber}</td>

                  {/* Status */}
                  <td className="px-6 py-4">
                      <p
                        className="px-3 py-1 rounded-full text-sm font-medium text-white inline-block"
                        style={{
                          backgroundColor: est?.statusColor || "#64748b",
                        }}
                      >
                        {est?.statusName || "Unknown"}
                      </p>
                    </td>


                  {/* Tax */}
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600">
                      {est?.taxName || "No Tax"} (
                      {Number(est.taxPercentage || 0)}%)
                    </span>
                  </td>

                  {/* Amount */}
                  <td className="px-6 py-4 text-right font-semibold">
                    ₹{formatCurrency(est.finalAmount)}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleView(est)}
                        className="p-2 hover:bg-blue-50 rounded-lg transition"
                      >
                        <Eye className="w-5 h-5 text-blue-600" />
                      </button>

                      <button
                        onClick={() => handleDelete(est.estimationId)}
                        className="p-2 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 className="w-5 h-5 text-red-600" />
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
  );
};

export default EstimateTable;
