// src/pages/EstimationMainPage.tsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../../redux/store';

import { setView } from '../../redux/uiSlice'; // Make sure this import is correct
import { fetchCostTypes } from '../../redux/costTypeSlice';
import { fetchTaxConfigs } from '../../redux/taxConfigs';

import Dashboard from '../../Components/estimates/comp/Dashboard';
import SettingsPageContent from './SettingsPage'; // We'll create this

import DetailModal from '../../Components/estimates/comp/DetailModal';
import CreateEstimateModal from '../../Components/estimates/comp/CreateEstimateModal';
import CostTypeModal from '../../Components/estimates/comp/costTypes/CostTypeModal';
import TaxConfigModal from '../../Components/estimates/comp/taxConfigs/TaxConfigModal';

const EstimationMainPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const currentView = useSelector((state: RootState) => state.ui.currentView);

  useEffect(() => {
    dispatch(fetchCostTypes());
    dispatch(fetchTaxConfigs());
  }, [dispatch]);

  return (
    <>
      {currentView === 'dashboard' ? <Dashboard /> : <SettingsPageContent />}

      {/* Global Modals */}
      <DetailModal />
      <CreateEstimateModal />
      <CostTypeModal />
      <TaxConfigModal />
    </>
  );
};

export default EstimationMainPage;