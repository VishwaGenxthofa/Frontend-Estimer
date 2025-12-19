import React from 'react';
import Modal from '../common/Modal';
import type { Estimate } from '../../types/Index';

interface EstimateDetailsModalProps {
  estimate: Estimate;
  onClose: () => void;
}

const EstimateDetailsModal: React.FC<EstimateDetailsModalProps> = ({ estimate, onClose }) => {
  return (
    <Modal onClose={onClose} title="Estimate Details" wide>
      <div className="space-y-6">
        {/* Labor Costs */}
        <div className="bg-purple-50 p-5 rounded-lg">
          <h4 className="font-semibold mb-3">Labor Costs</h4>
          {estimate.laborCosts.map((lc: any, i: number) => (
            <div key={i} className="flex justify-between text-sm mb-2">
              <span>{lc.employee_name} ({lc.role})</span>
              <span>₹{(lc.hourly_rate * lc.estimated_hours).toFixed(2)}</span>
            </div>
          ))}
          <div className="font-bold border-t pt-2">Total: ₹{estimate.laborCost.toFixed(2)}</div>
        </div>

        {/* Direct, Indirect, Additional – similar blocks */}
        {/* ... (copy from original view modal) */}

        <div className="bg-gray-100 p-5 rounded-lg">
          <div className="space-y-2 text-lg">
            <div className="flex justify-between"><span>Subtotal:</span><span>₹{estimate.sub.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Profit ({estimate.profit}%):</span><span className="text-green-600">₹{estimate.profitAmt.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Tax ({estimate.tax}%):</span><span className="text-blue-600">₹{estimate.taxAmt.toFixed(2)}</span></div>
            <div className="flex justify-between font-bold text-2xl border-t-2 pt-3">
              <span>Final Amount:</span>
              <span className="text-blue-600">₹{estimate.final.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EstimateDetailsModal;