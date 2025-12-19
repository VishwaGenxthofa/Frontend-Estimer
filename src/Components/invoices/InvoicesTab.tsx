import React, { useState } from 'react';
import { Plus, Eye, Printer, DollarSign } from 'lucide-react';
import CreateInvoiceModal from './CreateInvoiceModal';
import RecordPaymentModal from './RecordPaymentModal';
import InvoiceDetailsModal from './InvoiceDetailsModal';
import type { Invoice, Project, Client, Payment } from '../../types/Index';

interface InvoicesTabProps {
  invoices: Invoice[];
  setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>;
  payments: Payment[];
  setPayments: React.Dispatch<React.SetStateAction<Payment[]>>;
  projects: Project[];
  clients: Client[];
  milestones: any[];
  setMilestones: React.Dispatch<React.SetStateAction<any[]>>;
  isAdmin: boolean;
}

const InvoicesTab: React.FC<InvoicesTabProps> = ({
  invoices,
  setInvoices,
  payments,
  setPayments,
  projects,
  clients,
  milestones,
  setMilestones,
  isAdmin,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState<number | null>(null);
  const [viewInvoice, setViewInvoice] = useState<Invoice | null>(null);

  const printInvoice = (inv: Invoice) => {
    // We'll move the full print logic to a shared utility later if needed
    // For now, reuse the same print function from original
    const proj = projects.find(p => p.project_id === inv.project_id);
    const client = clients.find(c => c.client_id === parseInt(inv.client_id));
    const milestone = milestones.find(m => m.milestone_id === inv.milestone_id);
    const invPayments = payments.filter(p => p.invoice_id === inv.invoice_id);

    const printWindow = window.open('', '', 'width=900,height=700');
    if (!printWindow) return;

    printWindow.document.write(`
      <html><head><title>Invoice ${inv.invoice_number}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; line-height: 1.6; }
        .header { text-align: center; border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
        .company { font-size: 28px; font-weight: bold; color: #2563eb; }
        .title { font-size: 24px; font-weight: bold; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #e5e7eb; padding: 12px; text-align: left; }
        th { background: #2563eb; color: white; }
        .total { background: #2563eb; color: white; font-weight: bold; }
        .text-right { text-align: right; }
        .paid { background: #dcfce7; color: #059669; }
        .balance { background: #fee2e2; color: #dc2626; }
        .footer { margin-top: 60px; text-align: center; padding-top: 20px; border-top: 2px solid #e5e7eb; }
      </style></head><body>
        <div class="header">
          <div class="company">GENXTHOFA TECHNOLOGIES</div>
          <div class="title">TAX INVOICE</div>
        </div>
        <div style="display:flex;justify-content:space-between;">
          <div><strong>Invoice #:</strong> ${inv.invoice_number}</div>
          <div><strong>Date:</strong> ${inv.invoice_date}</div>
        </div>
        <div style="display:flex;justify-content:space-between;margin-top:10px;">
          <div><strong>Due Date:</strong> ${inv.due_date}</div>
          <div><strong>Status:</strong> ${inv.status}</div>
        </div>
        <div style="margin:30px 0;"><strong>Bill To:</strong><br>
          ${client?.client_name}<br>${client?.email}<br>${client?.phone}<br>${client?.address}
        </div>
        <div style="margin-bottom:30px;"><strong>Project:</strong> ${proj?.project_name} (${proj?.project_code})
          ${milestone ? `<br><strong>Milestone:</strong> ${milestone.milestone_name}` : inv.is_advance ? '<br><strong>Advance Payment</strong>' : ''}
        </div>
        <table>
          <tr><th>Description</th><th class="text-right">Amount</th></tr>
          <tr><td>${inv.is_advance ? 'Advance Payment' : milestone ? milestone.milestone_name : 'Project Payment'}</td>
            <td class="text-right">₹${inv.amount.toFixed(2)}</td></tr>
          <tr><td>Tax (${inv.tax_rate}%)</td><td class="text-right">₹${inv.tax_amount.toFixed(2)}</td></tr>
          <tr class="total"><td>TOTAL</td><td class="text-right">₹${inv.total_amount.toFixed(2)}</td></tr>
          ${inv.paid_amount > 0 ? `<tr class="paid"><td>Amount Paid</td><td class="text-right">₹${inv.paid_amount.toFixed(2)}</td></tr>` : ''}
          ${inv.balance > 0 ? `<tr class="balance"><td>BALANCE DUE</td><td class="text-right">₹${inv.balance.toFixed(2)}</td></tr>` : ''}
        </table>
        ${invPayments.length > 0 ? `
        <div style="background:#f0fdf4;padding:15px;margin-top:30px;border-left:4px solid #10b981;">
          <strong>Payment History:</strong><br>
          ${invPayments.map(p => `₹${p.amount.toFixed(2)} - ${p.payment_date} - ${p.payment_mode} (Ref: ${p.reference})<br>`).join('')}
        </div>` : ''}
        <div class="footer">
          <strong style="font-size:20px;color:#2563eb;">Thank You For Your Business!</strong><br>
          GenXthofa Technologies
        </div>
      </body></html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 300);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Invoices</h2>
        {isAdmin && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            <span>Create Invoice</span>
          </button>
        )}
      </div>

      <div className="space-y-6">
        {invoices.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow">
            <DollarSign className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 text-lg">No invoices created yet</p>
          </div>
        ) : (
          invoices.map((inv) => {
            const proj = projects.find(p => p.project_id === inv.project_id);
            const client = clients.find(c => c.client_id === parseInt(inv.client_id));
            const milestone = milestones.find(m => m.milestone_id === inv.milestone_id);
            const invPayments = payments.filter(p => p.invoice_id === inv.invoice_id);

            return (
              <div key={inv.invoice_id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{inv.invoice_number}</h3>
                    <p className="text-sm text-gray-600">Project: {proj?.project_name}</p>
                    <p className="text-sm text-gray-600">Client: {client?.client_name}</p>
                    {inv.is_advance && <span className="inline-block mt-2 px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">Advance</span>}
                    {milestone && !inv.is_advance && <p className="text-xs text-gray-500 mt-1">Milestone: {milestone.milestone_name}</p>}
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 text-xs rounded-full ${
                      inv.status === 'Paid' ? 'bg-green-100 text-green-700' :
                      inv.status === 'Partially Paid' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {inv.status}
                    </span>
                    <p className="text-2xl font-bold mt-3">₹{inv.total_amount.toFixed(2)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded mb-5">
                  <div><p className="text-xs text-gray-600">Invoice Date</p><p className="font-medium">{inv.invoice_date}</p></div>
                  <div><p className="text-xs text-gray-600">Due Date</p><p className="font-medium">{inv.due_date}</p></div>
                  <div><p className="text-xs text-gray-600">Paid</p><p className="font-medium text-green-600">₹{inv.paid_amount.toFixed(2)}</p></div>
                  <div><p className="text-xs text-gray-600">Balance</p><p className="font-medium text-red-600">₹{inv.balance.toFixed(2)}</p></div>
                </div>

                {invPayments.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Recent Payments</p>
                    {invPayments.slice(-2).map(p => (
                      <div key={p.payment_id} className="text-xs bg-green-50 p-2 rounded mb-1">
                        ₹{p.amount.toFixed(2)} on {p.payment_date} via {p.payment_mode}
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setViewInvoice(inv)}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-700 py-2 rounded hover:bg-blue-100"
                  >
                    <Eye className="w-4 h-4" /> View
                  </button>
                  <button
                    onClick={() => printInvoice(inv)}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-100 py-2 rounded hover:bg-gray-200"
                  >
                    <Printer className="w-4 h-4" /> Print
                  </button>
                  {!isAdmin && inv.balance > 0 && (
                    <button
                      onClick={() => setShowPaymentModal(inv.invoice_id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-2 rounded hover:bg-green-700"
                    >
                      <DollarSign className="w-4 h-4" /> Pay Now
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {showCreateModal && (
        <CreateInvoiceModal
          onClose={() => setShowCreateModal(false)}
          invoices={invoices}
          setInvoices={setInvoices}
          projects={projects}
          milestones={milestones}
          clients={clients}
        />
      )}

      {showPaymentModal !== null && (
        <RecordPaymentModal
          invoiceId={showPaymentModal}
          invoices={invoices}
          setInvoices={setInvoices}
          payments={payments}
          setPayments={setPayments}
          milestones={milestones}
          setMilestones={setMilestones}
          onClose={() => setShowPaymentModal(null)}
        />
      )}

      {viewInvoice && (
        <InvoiceDetailsModal
          invoice={viewInvoice}
          payments={payments.filter(p => p.invoice_id === viewInvoice.invoice_id)}
          projects={projects}
          clients={clients}
          milestones={milestones}
          onClose={() => setViewInvoice(null)}
        />
      )}
    </div>
  );
};

export default InvoicesTab;