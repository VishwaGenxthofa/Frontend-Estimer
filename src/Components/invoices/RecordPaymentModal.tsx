import React, { useState } from 'react';
import Modal from '../common/Modal';

interface RecordPaymentModalProps {
  invoiceId: number;
  invoices: any[];
  setInvoices: React.Dispatch<React.SetStateAction<any[]>>;
  payments: any[];
  setPayments: React.Dispatch<React.SetStateAction<any[]>>;
  milestones: any[];
  setMilestones: React.Dispatch<React.SetStateAction<any[]>>;
  onClose: () => void;
}

const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({
  invoiceId,
  invoices,
  setInvoices,
  payments,
  setPayments,
  milestones,
  setMilestones,
  onClose,
}) => {
  const invoice = invoices.find(i => i.invoice_id === invoiceId);
  const [form, setForm] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    mode: '',
    reference: '',
  });

  const handleSubmit = () => {
    const amount = parseFloat(form.amount);
    if (!amount || amount <= 0 || !form.mode) return alert('Invalid payment details');

    const newPaid = (invoice.paid_amount || 0) + amount;
    const newBalance = invoice.total_amount - newPaid;
    const newStatus = newBalance <= 0 ? 'Paid' : newBalance < invoice.total_amount ? 'Partially Paid' : 'Unpaid';

    setPayments(prev => [...prev, {
      payment_id: prev.length + 1,
      invoice_id: invoiceId,
      amount,
      payment_date: form.date,
      payment_mode: form.mode,
      reference: form.reference,
    }]);

    setInvoices(prev => prev.map(i =>
      i.invoice_id === invoiceId
        ? { ...i, paid_amount: newPaid, balance: newBalance, status: newStatus }
        : i
    ));

    // Auto-complete milestone if fully paid
    if (newBalance <= 0 && invoice.milestone_id) {
      setMilestones(prev => prev.map(m =>
        m.milestone_id === invoice.milestone_id ? { ...m, status: 'Completed' } : m
      ));
    }

    onClose();
  };

  return (
    <Modal onClose={onClose} title="Record Payment">
      <div className="space-y-5">
        <p className="text-sm text-gray-600">Invoice: {invoice?.invoice_number} – Balance: ₹{invoice?.balance.toFixed(2)}</p>

        <input
          type="number"
          placeholder="Payment Amount *"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg"
        />

        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg"
        />

        <select
          value={form.mode}
          onChange={(e) => setForm({ ...form, mode: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg"
        >
          <option value="">Select Payment Mode *</option>
          <option>Bank Transfer</option>
          <option>UPI</option>
          <option>Credit Card</option>
          <option>Cash</option>
          <option>Cheque</option>
        </select>

        <input
          placeholder="Reference / Transaction ID"
          value={form.reference}
          onChange={(e) => setForm({ ...form, reference: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg"
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-medium"
        >
          Record Payment
        </button>
      </div>
    </Modal>
  );
};

export default RecordPaymentModal;