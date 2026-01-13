// components/EstimateStats.tsx
import React from 'react';
import { FileText, DollarSign, Check, TrendingUp } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../redux/store';

const EstimateStats: React.FC = () => {
  const { estimates } = useSelector((state: RootState) => state.estimate);

  const totalValue = estimates.reduce((sum, e) => sum + e.finalAmount, 0);
  const approvedCount = estimates.filter(e => e.estimationStatusId === 3).length;
  const pendingCount = estimates.filter(e => e.estimationStatusId === 2).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-xl shadow-sm p-6 border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-600 text-sm font-medium">Total Estimates</p>
            <p className="text-3xl font-bold text-slate-800 mt-2">{estimates.length}</p>
          </div>
          <div className="bg-blue-100 p-3 rounded-lg">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-600 text-sm font-medium">Total Value</p>
            <p className="text-3xl font-bold text-slate-800 mt-2">₹{(totalValue / 100000).toFixed(1)}L</p>
          </div>
          <div className="bg-green-100 p-3 rounded-lg">
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-600 text-sm font-medium">Approved</p>
            <p className="text-3xl font-bold text-slate-800 mt-2">{approvedCount}</p>
          </div>
          <div className="bg-emerald-100 p-3 rounded-lg">
            <Check className="w-6 h-6 text-emerald-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-600 text-sm font-medium">Pending</p>
            <p className="text-3xl font-bold text-slate-800 mt-2">{pendingCount}</p>
          </div>
          <div className="bg-amber-100 p-3 rounded-lg">
            <TrendingUp className="w-6 h-6 text-amber-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstimateStats;