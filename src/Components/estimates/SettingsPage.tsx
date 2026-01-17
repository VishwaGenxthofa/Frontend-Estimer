// src/pages/SettingsPage.tsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState,AppDispatch } from '../../redux/store';
import { setView, setSettingsTab } from '../../redux/uiSlice';
import { fetchCostTypes } from '../../redux/costTypeSlice';
import CostTypeTable from '../../Components/estimates/comp/costTypes/CostTypeTable';
import CostTypeModal from '../../Components/estimates/comp/costTypes/CostTypeModal';
import TaxConfigTable from '../../Components/estimates/comp/taxConfigs/TaxConfigTable';
import TaxConfigModal from '../../Components/estimates/comp/taxConfigs/TaxConfigModal';
import { X } from 'lucide-react';
import { CoolMode } from '../ui/cool-mode';

const SettingsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { settingsTab, showCostTypeModal, showTaxModal } = useSelector((state: RootState) => state.ui);
  const { loading, error } = useSelector((state: RootState) => state.costTypes);

  useEffect(() => {
    dispatch(fetchCostTypes());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="">
        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <CoolMode>
            <button
              onClick={() => dispatch(setView('dashboard'))}
              className="p-3 hover:bg-white rounded-xl shadow-sm transition"
            >
              <X className="w-6 h-6 text-slate-600" />
            </button> </CoolMode>
            <div>
              <h1 className="text-4xl font-bold text-slate-800">Settings</h1>
              <p className="text-slate-600 mt-2">Manage cost types and tax configurations</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-10 border-b border-slate-200">
          <CoolMode>
          <button
            onClick={() => dispatch(setSettingsTab('costTypes'))}
            className={`px-8 py-4 font-semibold text-lg border-b-4 transition ${
              settingsTab === 'costTypes'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-800'
            }`}
          >
            Cost Types
          </button></CoolMode>
          <CoolMode>
          <button
            onClick={() => dispatch(setSettingsTab('taxConfigs'))}
            className={`px-8 py-4 font-semibold text-lg border-b-4 transition ${
              settingsTab === 'taxConfigs'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-800'
            }`}
          >
            Tax Configurations
          </button></CoolMode>
        </div>

        {/* Content */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-4 text-slate-600">Loading settings...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-8">
            <p className="font-medium">Error: {error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {settingsTab === 'costTypes' && <CostTypeTable />}
            {settingsTab === 'taxConfigs' && <TaxConfigTable />}
          </>
        )}

        {/* Modals */}
        {showCostTypeModal && <CostTypeModal />}
        {showTaxModal && <TaxConfigModal />}
      </div>
    </div>
  );
};

export default SettingsPage;