import React, { useState } from 'react';
import Modal from '../common/Modal';
import type { Project } from '../../types/Index';

interface CreateInvoiceModalProps {
  onClose: () => void;
  invoices: any[];
  setInvoices: React.Dispatch<React.SetStateAction<any[]>>;
  projects: Project[];
  milestones: any[];
  clients: any[];
}

const CreateInvoiceModal: React.FC<CreateInvoiceModalProps> = ({
  onClose,
  invoices,
  setInvoices,
  projects,
  milestones,
  clients,
}) => {
  const [form, setForm] = useState({
    project_id: '',
    milestone_id: '',
    invoice_date: new Date().toISOString().split('T')[0],
    amount: '',
    tax: 18,
  });

  const selectedProject = projects.find(p => p.project_id === parseInt(form.project_id));

  const handleSubmit = () => {
    if (!form.project_id || !form.amount || !form.invoice_date) {
      alert('Please fill all required fields');
      return;
    }

    const amount = parseFloat(form.amount);
    const taxAmt = (amount * form.tax) / 100;
    const total = amount + taxAmt;

    const invDate = new Date(form.invoice_date);
    invDate.setDate(invDate.getDate() + (selectedProject?.payment_terms || 30));
    const dueDate = invDate.toISOString().split('T')[0];

    setInvoices(prev => [...prev, {
      invoice_id: prev.length + 1,
      invoice_number: `INV-${Date.now().toString().slice(-6)}`,
      project_id: parseInt(form.project_id),
      milestone_id: form.milestone_id ? parseInt(form.milestone_id) : null,
      is_advance: form.milestone_id === 'advance',
      client_id: selectedProject?.client_id || '',
      invoice_date: form.invoice_date,
      due_date: dueDate,
      amount,
      tax_rate: form.tax,
      tax_amount: taxAmt,
      total_amount: total,
      paid_amount: 0,
      balance: total,
      status: 'Unpaid'
    }]);

    onClose();
  };

  return (
    <Modal onClose={onClose} title="Create Invoice">
      <div className="space-y-5">
        <select
          value={form.project_id}
          onChange={(e) => setForm({ ...form, project_id: e.target.value, milestone_id: '' })}
          className="w-full px-4 py-2 border rounded-lg"
        >
          <option value="">Select Project *</option>
          {projects.map(p => (
            <option key={p.project_id} value={p.project_id}>{p.project_name} ({p.project_code})</option>
          ))}
        </select>

        {selectedProject && (
          <>
            <div className="bg-blue-50 p-4 rounded">
              <p className="text-sm font-medium">Payment Terms: {selectedProject.payment_terms} days</p>
              <p className="text-xs text-gray-600">Due date will be auto-calculated</p>
            </div>

            <select
              value={form.milestone_id}
              onChange={(e) => setForm({ ...form, milestone_id: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="">Select Type *</option>
              <option value="advance">Advance Payment</option>
              {milestones
                .filter(m => m.project_id === selectedProject.project_id)
                .map(m => (
                  <option key={m.milestone_id} value={m.milestone_id}>
                    {m.milestone_name} – ₹{m.milestone_amount}
                  </option>
                ))}
            </select>
          </>
        )}

        <input
          type="date"
          value={form.invoice_date}
          onChange={(e) => setForm({ ...form, invoice_date: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg"
        />

        <input
          type="number"
          placeholder="Amount *"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg"
        />

        <input
          type="number"
          placeholder="Tax %"
          value={form.tax}
          onChange={(e) => setForm({ ...form, tax: Number(e.target.value) })}
          className="w-full px-4 py-2 border rounded-lg"
        />

        {form.amount && (
          <div className="bg-gray-100 p-4 rounded-lg space-y-2">
            <div className="flex justify-between"><span>Amount:</span><span>₹{parseFloat(form.amount).toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Tax ({form.tax}%):</span><span>₹{((parseFloat(form.amount) * form.tax) / 100).toFixed(2)}</span></div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total:</span>
              <span>₹{(parseFloat(form.amount) + (parseFloat(form.amount) * form.tax) / 100).toFixed(2)}</span>
            </div>
          </div>
        )}

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium"
        >
          Create Invoice
        </button>
      </div>
    </Modal>
  );
};

export default CreateInvoiceModal;