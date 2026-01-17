// src/features/costTypes/components/CostTypeModal.tsx
import { useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Checkbox,
  Switch,
  Divider,
  Space,
} from "antd";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../../../redux/store";
import { addCostType, updateCostType } from "../../../../redux/costTypeSlice";
import {
  toggleCostTypeModal,
  setSelectedCostType,
} from "../../../../redux/uiSlice";
import toast from "react-hot-toast";

const { TextArea } = Input;

const CostTypeModal = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [form] = Form.useForm();

  const { showCostTypeModal, selectedCostType } = useSelector(
    (state: RootState) => state.ui
  );
  const { loading } = useSelector(
    (state: RootState) => state.costTypes
  );

  /* -------------------- Prefill -------------------- */
  useEffect(() => {
    if (selectedCostType) {
      form.setFieldsValue({
        costTypeName: selectedCostType.costTypeName,
        description: selectedCostType.description,
        category: selectedCostType.category,
        isActive: selectedCostType.isActive,
        requiresQuantity: selectedCostType.requiresQuantity,
        requiresRate: selectedCostType.requiresRate,
        requiresMonths: selectedCostType.requiresMonths,
      });
    } else {
      form.resetFields();
    }
  }, [selectedCostType, showCostTypeModal]);

  /* -------------------- Close -------------------- */
  const closeModal = () => {
    dispatch(toggleCostTypeModal(false));
    dispatch(setSelectedCostType(null));
    form.resetFields();
  };

  /* -------------------- Submit -------------------- */
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const action = selectedCostType
        ? updateCostType({
            ...values,
            costTypeId: selectedCostType.costTypeId,
          })
        : addCostType(values);

      const toastId = toast.loading(
        selectedCostType ? "Updating..." : "Creating..."
      );

      await dispatch(action).unwrap();

      toast.success(
        selectedCostType
          ? "Updated successfully!"
          : "Created successfully!"
      );

      toast.dismiss(toastId);
      closeModal();
    } catch (err: any) {
      toast.error(err?.message || "Failed to save");
    }
  };

  return (
    <Modal
      open={showCostTypeModal}
      onCancel={closeModal}
      onOk={handleSubmit}
      confirmLoading={loading}
      width={760}
      okText={selectedCostType ? "Update Cost Type" : "Create Cost Type"}
      title={
        selectedCostType ? "Edit Cost Type" : "Add New Cost Type"
      }
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          category: "directCosts",
          isActive: true,
          requiresQuantity: false,
          requiresRate: false,
          requiresMonths: false,
        }}
      >
        {/* Cost Type Name */}
        <Form.Item
          label="Cost Type Name"
          name="costTypeName"
          rules={[{ required: true, message: "Cost Type Name is required" }]}
        >
          <Input placeholder="Cloud Services, Training, Travel" />
        </Form.Item>

        {/* Category */}
        <Form.Item label="Category" name="category">
          <Select>
            <Select.Option value="directCosts">
              Direct Costs
            </Select.Option>
            <Select.Option value="indirectCosts">
              Indirect Costs
            </Select.Option>
            <Select.Option value="additionalCosts">
              Additional Costs
            </Select.Option>
          </Select>
        </Form.Item>

        {/* Description */}
        <Form.Item label="Description" name="description">
          <TextArea
            rows={3}
            placeholder="Brief internal description..."
          />
        </Form.Item>

        <Divider />

        {/* Required Fields */}
        <Form.Item label="Required Fields in Estimate">
          <Space direction="vertical" size="middle">
            <Form.Item
              name="requiresQuantity"
              valuePropName="checked"
              noStyle
            >
              <Checkbox>Quantity / Hours</Checkbox>
            </Form.Item>

            <Form.Item
              name="requiresRate"
              valuePropName="checked"
              noStyle
            >
              <Checkbox>Rate / Unit Cost</Checkbox>
            </Form.Item>

            <Form.Item
              name="requiresMonths"
              valuePropName="checked"
              noStyle
            >
              <Checkbox>Duration (Months)</Checkbox>
            </Form.Item>
          </Space>
        </Form.Item>

        <Divider />

        {/* Active */}
        <Form.Item
          label="Active"
          name="isActive"
          valuePropName="checked"
        >
          <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CostTypeModal;
