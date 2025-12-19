import React from 'react';
import Modal from '../common/Modal';
import type { Invoice, Project, Client } from '../../types/Index';

interface InvoiceDetailsModalProps {
  invoice: Invoice;
  payments: any[];
  projects: Project[];
  clients: Client[];
  milestones: any[];
  onClose: () => void;
}

const InvoiceDetailsModal: React.FC<InvoiceDetailsModalProps> = ({
  invoice,
  payments,
  projects,
  clients,
  milestones,
  onClose,
}) => {
  const project = projects.find(p => p.project_id === invoice.project_id);
  const client = clients.find(c => c.client_id === parseInt(invoice.client_id));
  const milestone = milestones.find(m => m.milestone_id === invoice.milestone_id);

  return (
    <Modal onClose={onClose} title={`Invoice Details – ${invoice.invoice_number}`} wide>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h4 className="font-semibold mb-3">Invoice Information</h4>
          <div className="space-y-2 text-sm">
            <p><span className="text-gray-600">Invoice Date:</span> {invoice.invoice_date}</p>
            <p><span className="text-gray-600">Due Date:</span> {invoice.due_date}</p>
            <p><span className="text-gray-600">Status:</span>
              <span className={`ml-2 px-3 py-1 text-xs rounded-full ${
                invoice.status === 'Paid' ? 'bg-green-100 text-green-700' :
                invoice.status === 'Partially Paid' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {invoice.status}
              </span>
            </p>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Client</h4>
          <div className="space-y-1 text-sm">
            <p className="font-medium">{client?.client_name}</p>
            <p className="text-gray-600">{client?.email}</p>
            <p className="text-gray-600">{client?.phone}</p>
            <p className="text-gray-600">{client?.address}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-gray-100 p-6 rounded-lg">
        <h4 className="font-semibold mb-4">Amount Breakdown</h4>
        <div className="space-y-3 text-lg">
          <div className="flex justify-between"><span>Subtotal:</span><span>₹{invoice.amount.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Tax ({invoice.tax_rate}%):</span><span>₹{invoice.tax_amount.toFixed(2)}</span></div>
          <div className="flex justify-between font-bold text-xl border-t-2 pt-3">
            <span>Total Amount:</span><span className="text-blue-600">₹{invoice.total_amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-green-600"><span>Paid:</span><span className="font-semibold">₹{invoice.paid_amount.toFixed(2)}</span></div>
          <div className="flex justify-between text-red-600 font-bold text-xl border-t pt-3">
            <span>Balance Due:</span><span>₹{invoice.balance.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {payments.length > 0 && (
        <div className="mt-8">
          <h4 className="font-semibold mb-4">Payment History</h4>
          <div className="space-y-3">
            {payments.map(p => (
              <div key={p.payment_id} className="bg-green-50 p-4 rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-semibold">₹{p.amount.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">{p.payment_date} • {p.payment_mode}</p>
                </div>
                <p className="text-sm text-gray-600">Ref: {p.reference || '—'}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </Modal>
  );
};

export default InvoiceDetailsModal;