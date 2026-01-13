// components/Dashboard.tsx
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import type{ RootState,AppDispatch } from '../../../redux/store';
import { toggleCreateModal } from '../../../redux/estimateSlice';
import EstimateStats from './EstimateStats';
import EstimateTable from './EstimateTable';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { estimates, statuses } = useSelector((state: RootState) => state.estimate);
  const [filter, setFilter] = useState<'all' | number>('all');

  const filteredEstimates = filter === 'all'
    ? estimates
    : estimates.filter(e => e.estimationStatusId === filter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 ">
      <div className=" mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-800 mb-2">Estimation Management</h1>
            <p className="text-slate-600">Manage project estimates with cost types and tax configs</p>
          </div>
          <button
            onClick={() => dispatch(toggleCreateModal(true))}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 shadow-lg transition"
          >
            <Plus className="w-5 h-5" />
            Create Estimate
          </button>
        </div>

        {/* Stats */}
        <EstimateStats />

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-slate-700 font-medium">Filter:</span>
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}
            >
              All
            </button>
            {statuses.map((status: any) => (
              <button
                key={status.estimationStatusId}
                onClick={() => setFilter(status.estimationStatusId)}
                className={`px-4 py-2 rounded-lg font-medium ${
                  filter === status.estimationStatusId ? 'text-white' : 'bg-slate-100'
                }`}
                style={{
                  backgroundColor: filter === status.estimationStatusId ? status.statusColor : undefined,
                }}
              >
                {status.statusName}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <EstimateTable estimates={filteredEstimates} />
      </div>
    </div>
  );
};

export default Dashboard;