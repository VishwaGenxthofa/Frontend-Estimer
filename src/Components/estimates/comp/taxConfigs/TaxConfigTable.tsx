import React from "react";
import { Table, Tag, Button } from "antd";
import { Edit2, Trash2, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../../../redux/store";
import {
  deleteTaxConfig
} from "../../../../redux/taxConfigs";
import {
  setSelectedTax,
  toggleTaxModal,
  setSettingsTab
} from "../../../../redux/uiSlice";
import toast, { Toaster } from "react-hot-toast";

const TaxConfigTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const taxConfigs = useSelector((state: RootState) => state.estimatestaxconfig.taxConfigs);

  const handleEdit = (tax: any) => {
    dispatch(setSelectedTax(tax));
    dispatch(toggleTaxModal(true));
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this tax configuration?")) {
      dispatch(deleteTaxConfig(id));
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "taxConfigId",
      key: "taxConfigId",
      render: (id: number) => <span className="font-mono text-slate-600">{id}</span>,
    },
    {
      title: "Tax Name",
      dataIndex: "taxName",
      key: "taxName",
      render: (name: string) => <span className="font-semibold text-slate-800">{name}</span>,
    },
    {
      title: "Tax Rate (%)",
      dataIndex: "taxRate",
      key: "taxRate",
      align: "center" as const,
      render: (rate: number) => <span className="text-lg font-bold text-blue-600">{rate.toFixed(2)}%</span>,
      sorter: (a: any, b: any) => a.taxRate - b.taxRate,
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      align: "center" as const,
      filters: [
        { text: "Active", value: true },
        { text: "Inactive", value: false },
      ],
      onFilter: (value: boolean, record: any) => record.isActive === value,
      render: (isActive: boolean) => (
        <Tag color={isActive ? "green" : "default"}>
          {isActive ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Example (on ₹100K)",
      key: "example",
      align: "center" as const,
      render: (_: any, record: any) =>
        `₹${(100000 * (record.taxRate / 100)).toLocaleString("en-IN")}`,
    },
    {
      title: "Actions",
      key: "actions",
      align: "right" as const,
      render: (_: any, record: any) => (
        <div className="flex gap-2">
          <Button
            type="text"
            icon={<Edit2 className="text-blue-600" />}
            onClick={() => handleEdit(record)}
          />
          <Button
            type="text"
            icon={<Trash2 className="text-red-600" />}
            onClick={() => handleDelete(record.taxConfigId)}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <Toaster position="top-right" />
      <div className="mb-6 flex justify-end">
        <Button
          type="primary"
          icon={<Plus />}
          onClick={() => {
            dispatch(setSelectedTax(null));
            dispatch(toggleTaxModal(true));
            dispatch(setSettingsTab("taxConfigs"));
          }}
        >
          Add Tax Config
        </Button>
      </div>

      <Table
        rowKey="taxConfigId"
        dataSource={taxConfigs}
        columns={columns}
        pagination={{ pageSize: 10 }}
         scroll={{ x: 700 }}
      />
    </>
  );
};

export default TaxConfigTable;
