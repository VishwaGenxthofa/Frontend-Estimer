// components/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { Plus, Settings } from 'lucide-react'; // Added Settings icon
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../../../redux/store';
import { toggleCreateModal } from '../../../redux/estimateSlice';
import { setView } from '../../../redux/uiSlice'; // Import setView to switch to settings
import EstimateStats from './EstimateStats';
import EstimateTable from './EstimateTable';
import { fetchEstimationStatuses } from '../../../redux/estimationStatus';
import { AuroraText } from '../../ui/aurora-text';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  const { estimates } = useSelector((state: RootState) => state.estimate);
  const { statuses, loading: statusesLoading } = useSelector(
    (state: RootState) => state.estimatestatus
  );

  const [filter, setFilter] = useState<'all' | number>('all');

  const filteredEstimates = filter === 'all'
    ? estimates
    : estimates.filter((e: any) => e.estimationStatusId === filter);

  useEffect(() => {
    if (statuses.length === 0) {
      dispatch(fetchEstimationStatuses());
    }
  }, [dispatch, statuses.length]);

  return (
    <div className="min-h-screen ">
      <div className=" px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-800"><AuroraText> Estimation </AuroraText> Management</h2>
            <p className="text-base text-slate-600 mt-3">Manage project estimates with cost types and tax configurations</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            {/* Settings Button */}
            <button
              onClick={() => dispatch(setView('settings'))}
              className="flex items-center gap-3 px-4 py-2 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-800 shadow-xl transition transform hover:scale-105"
            >
              <Settings className="w-6 h-6" />
              Settings
            </button>

            {/* Create Estimate Button */}
            <button
              onClick={() => dispatch(toggleCreateModal(true))}
              className="flex items-center gap-3 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 shadow-xl transition transform hover:scale-105"
            >
              <Plus className="w-6 h-6" />
              Create Estimate
            </button>
          </div>
        </div>

        {/* Stats */}
        <EstimateStats />
        {/* Table */}
        <EstimateTable estimates={filteredEstimates} />
      </div>
    </div>
  );
};

export default Dashboard;