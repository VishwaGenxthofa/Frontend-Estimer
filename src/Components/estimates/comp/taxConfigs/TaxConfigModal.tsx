// src/features/taxConfigs/components/TaxConfigModal.tsx
import { useEffect } from "react";
import { Modal, Form, Input, InputNumber, Switch, Button, Card } from "antd";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../../../redux/store";
import { addTaxConfig, updateTaxConfig } from "../../../../redux/taxConfigs";
import { toggleTaxModal, setSelectedTax } from "../../../../redux/uiSlice";
import toast from "react-hot-toast";

const TaxConfigModal = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [form] = Form.useForm();

  const { showTaxModal, selectedTax } = useSelector(
    (state: RootState) => state.ui
  );
  const { loading } = useSelector(
    (state: RootState) => state.estimatestaxconfig
  );

  useEffect(() => {
    if (selectedTax) {
      form.setFieldsValue({
        taxName: selectedTax.taxName,
        taxRate: selectedTax.taxRate,
        isActive: selectedTax.isActive,
      });
    } else {
      form.resetFields();
    }
  }, [selectedTax, showTaxModal]);

  const closeModal = () => {
    dispatch(toggleTaxModal(false));
    dispatch(setSelectedTax(null));
    form.resetFields();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        taxName: values.taxName.trim(),
        taxRate: values.taxRate,
        isActive: values.isActive,
      };

      const action = selectedTax
        ? updateTaxConfig({
            ...payload,
            taxConfigId: selectedTax.taxConfigId,
          })
        : addTaxConfig(payload);

      const toastId = toast.loading(
        selectedTax ? "Updating tax configuration..." : "Creating tax configuration..."
      );

      await dispatch(action).unwrap();

      toast.success(
        selectedTax
          ? "Tax configuration updated successfully!"
          : "Tax configuration created successfully!"
      );

      toast.dismiss(toastId);
      closeModal();
    } catch (err: any) {
      toast.error(err?.message || "Failed to save tax configuration");
    }
  };

  return (
    <Modal
      open={showTaxModal}
      onCancel={closeModal}
      footer={null}
      width={560}
      destroyOnClose
      centered
      title={
        <div>
          <h2 className="text-xl font-bold">
            {selectedTax ? "Edit Tax Configuration" : "Add New Tax Configuration"}
          </h2>
          <p className="text-slate-500 text-sm">
            Define tax rates applied to estimates
          </p>
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ isActive: true }}
      >
        {/* Tax Name */}
        <Form.Item
          label="Tax Name"
          name="taxName"
          rules={[{ required: true, message: "Tax Name is required" }]}
        >
          <Input placeholder="e.g., GST, VAT, Sales Tax" />
        </Form.Item>

        {/* Tax Rate */}
        <Form.Item
          label="Tax Rate (%)"
          name="taxRate"
          rules={[
            { required: true, message: "Tax rate is required" },
            {
              type: "number",
              min: 0,
              max: 100,
              message: "Rate must be between 0 and 100",
            },
          ]}
        >
          <InputNumber
            min={0}
            max={100}
            step={0.01}
            className="w-full"
            style={{width:"100%"}}
            placeholder="18.00"
          />
        </Form.Item>

        {/* Active */}
        <Form.Item
          name="isActive"
          valuePropName="checked"
          className="mb-2"
        >
          <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
        </Form.Item>

        {/* Live Preview */}
        <Form.Item shouldUpdate>
          {() => {
            const rate = form.getFieldValue("taxRate") || 0;
            const name = form.getFieldValue("taxName") || "Tax Name";

            return (
              <Card
                size="small"
                title="Live Preview"
                className="bg-blue-50 border-blue-200"
              >
                <p className="text-sm">
                  {name} ({rate}%)
                </p>
                {rate > 0 && (
                  <p className="text-sm mt-1">
                    Example on ₹100,000:{" "}
                    <strong>
                      ₹{(100000 * (rate / 100)).toLocaleString("en-IN")}
                    </strong>
                  </p>
                )}
              </Card>
            );
          }}
        </Form.Item>

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-6">
          <Button onClick={closeModal}>Cancel</Button>
          <Button
            type="primary"
            loading={loading}
            onClick={handleSubmit}
          >
            {selectedTax ? "Update" : "Create"} Tax Config
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default TaxConfigModal;
