// components/EstimateTable.tsx
import React, { useEffect } from "react";
import { Eye, Trash2 } from "lucide-react";
import { Table, Tag, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../../redux/store";
import {
  setSelectedEstimate,
  toggleDetailModal,
  deleteEstimate,
  updateEstimate,
  fetchEstimates,
} from "../../../redux/estimateSlice";
import { fetchEstimationStatuses } from "../../../redux/estimationStatus";
import { fetchTaxConfigs } from "../../../redux/taxConfigs";
import type { Estimate } from "../../../types/Index";

const formatCurrency = (value?: number) =>
  Number(value || 0).toLocaleString("en-IN");

const EstimateTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { estimates } = useSelector((state: RootState) => state.estimate);
  const { statuses } = useSelector((state: RootState) => state.estimatestatus);

  useEffect(() => {
    dispatch(fetchEstimates());
    dispatch(fetchEstimationStatuses());
    dispatch(fetchTaxConfigs());
  }, [dispatch]);

  const handleView = (estimate: Estimate) => {
    dispatch(setSelectedEstimate(estimate));
    dispatch(toggleDetailModal(true));
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Delete this estimate?")) {
      dispatch(deleteEstimate(id));
    }
  };

  // Ant Table columns
  const columns: ColumnsType<Estimate> = [
    {
      title: "Project",
      dataIndex: "projectName",
      key: "projectName",
      render: (_, record) => (
        <div>
          <p className="font-semibold">{record.projectName}</p>
          <p className="text-sm text-slate-500">{record.clientRemarks || "-"}</p>
        </div>
      ),
    },
    {
      title: "Version",
      dataIndex: "versionNumber",
      key: "versionNumber",
      render: (version) => `v${version}`,
    },
    {
      title: "Status",
      dataIndex: "statusName",
      key: "statusName",
      filters: statuses.map((s) => ({ text: s.statusName, value: s.estimationStatusId })),
      onFilter: (value, record) => record.estimationStatusId === value,
      render: (_, record) => (
        <Tag color={record.statusColor || "#64748b"}>{record.statusName || "Unknown"}</Tag>
      ),
    },
    {
      title: "Tax",
      dataIndex: "taxName",
      key: "taxName",
      render: (_, record) => (
        <span>
          {record.taxName || "No Tax"} ({record.taxPercentage || 0}%)
        </span>
      ),
    },
    {
      title: "Amount",
      dataIndex: "finalAmount",
      key: "finalAmount",
      align: "right",
      render: (amount) => `₹${formatCurrency(amount)}`,
      sorter: (a, b) => (a.finalAmount || 0) - (b.finalAmount || 0),
    },
    {
      title: "Actions",
      key: "actions",
      align: "right",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Button
            type="text"
            icon={<Eye className="text-blue-600" />}
            onClick={() => handleView(record)}
          />
          <Button
            type="text"
            icon={<Trash2 className="text-red-600" />}
            onClick={() => handleDelete(record.estimationId)}
          />
        </div>
      ),
    },
  ];

  return (
    <Table
      rowKey="estimationId"
      dataSource={estimates}
      columns={columns}
      pagination={{ pageSize: 10 }}
      scroll={{x:700}}
    />
  );
};

export default EstimateTable;
