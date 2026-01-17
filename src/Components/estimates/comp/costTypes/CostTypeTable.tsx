import React from "react";
import { Table, Tag, Button } from "antd";
import { Edit2, Trash2, Check, X, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../../../redux/store";
import {
  deleteCostType
} from "../../../../redux/costTypeSlice";
import {
  setSelectedCostType,
  toggleCostTypeModal,
  setSettingsTab
} from "../../../../redux/uiSlice";

const CostTypeTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const costTypes = useSelector((state: RootState) => state.costTypes.costTypes);

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "direct":
      case "directCosts":
        return { label: "Direct Cost", color: "blue" };
      case "indirect":
      case "indirectCosts":
        return { label: "Indirect Cost", color: "purple" };
      case "additional":
      case "additionalCosts":
        return { label: "Additional Cost", color: "orange" };
      default:
        return { label: "Unknown", color: "default" };
    }
  };

  const handleEdit = (ct: any) => {
    dispatch(setSelectedCostType(ct));
    dispatch(toggleCostTypeModal(true));
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this cost type?")) {
      dispatch(deleteCostType(id));
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "costTypeId",
      key: "costTypeId",
    },
    {
      title: "Name",
      dataIndex: "costTypeName",
      key: "costTypeName",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category: string) => {
        const badge = getCategoryBadge(category);
        return <Tag color={badge.color}>{badge.label}</Tag>;
      },
      filters: [
        { text: "Direct Cost", value: "direct" },
        { text: "Indirect Cost", value: "indirect" },
        { text: "Additional Cost", value: "additional" },
      ],
      onFilter: (value: string, record: any) =>
        record.category.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Qty",
      dataIndex: "requiresQuantity",
      key: "requiresQuantity",
      align: "center" as const,
      render: (val: boolean) => val ? <Check className="text-green-600" /> : <X className="text-slate-400" />,
    },
    {
      title: "Rate",
      dataIndex: "requiresRate",
      key: "requiresRate",
      align: "center" as const,
      render: (val: boolean) => val ? <Check className="text-green-600" /> : <X className="text-slate-400" />,
    },
    {
      title: "Months",
      dataIndex: "requiresMonths",
      key: "requiresMonths",
      align: "center" as const,
      render: (val: boolean) => val ? <Check className="text-green-600" /> : <X className="text-slate-400" />,
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
      render: (val: boolean) => (
        <Tag color={val ? "green" : "default"}>
          {val ? "Active" : "Inactive"}
        </Tag>
      ),
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
            onClick={() => handleDelete(record.costTypeId)}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="mb-6 flex justify-end">
        <Button
          type="primary"
          icon={<Plus />}
          onClick={() => {
            dispatch(setSelectedCostType(null));
            dispatch(toggleCostTypeModal(true));
            dispatch(setSettingsTab("costTypes"));
          }}
        >
          Add Cost Type
        </Button>
      </div>
      <Table
        rowKey="costTypeId"
        dataSource={costTypes}
        columns={columns}
        pagination={{ pageSize: 10 }}
         scroll={{ x: 700 }}
      />
    </>
  );
};

export default CostTypeTable;
