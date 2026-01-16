// src/features/ui/uiSlice.ts
import { createSlice,type  PayloadAction } from '@reduxjs/toolkit';
import type { Estimate } from '../types/Index';

interface UIState {
  currentView: 'dashboard' | 'settings';
  selectedEstimate: Estimate | null;
  showCreateModal: boolean;
  showDetailModal: boolean;
  showCostTypeModal: boolean;
  showTaxModal: boolean;
  selectedCostType: any | null;
  selectedTax: any | null;
  settingsTab: 'costTypes' | 'taxConfigs';
}

const initialState: UIState = {
  currentView: 'dashboard',
  selectedEstimate: null,
  showCreateModal: false,
  showDetailModal: false,
  showCostTypeModal: false,
  showTaxModal: false,
  selectedCostType: null,
  selectedTax: null,
  settingsTab: 'costTypes',
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setView: (state, action: PayloadAction<'dashboard' | 'settings'>) => {
      state.currentView = action.payload;
    },
    setSelectedEstimate: (state, action: PayloadAction<Estimate | null>) => {
      state.selectedEstimate = action.payload;
    },
    toggleCreateModal: (state, action: PayloadAction<boolean | undefined>) => {
      state.showCreateModal = action.payload ?? !state.showCreateModal;
    },
    toggleDetailModal: (state, action: PayloadAction<boolean | undefined>) => {
      state.showDetailModal = action.payload ?? !state.showDetailModal;
    },
    toggleCostTypeModal: (state, action: PayloadAction<boolean | undefined>) => {
      state.showCostTypeModal = action.payload ?? !state.showCostTypeModal;
    },
    toggleTaxModal: (state, action: PayloadAction<boolean | undefined>) => {
      state.showTaxModal = action.payload ?? !state.showTaxModal;
    },
    setSelectedCostType: (state, action: PayloadAction<any | null>) => {
      state.selectedCostType = action.payload;
    },
    setSelectedTax: (state, action: PayloadAction<any | null>) => {
      state.selectedTax = action.payload;
    },
    setSettingsTab: (state, action: PayloadAction<'costTypes' | 'taxConfigs'>) => {
      state.settingsTab = action.payload;
    },
  },
});

export const {
  setView,
  setSelectedEstimate,
  toggleCreateModal,
  toggleDetailModal,
  toggleCostTypeModal,
  toggleTaxModal,
  setSelectedCostType,
  setSelectedTax,
  setSettingsTab,
} = uiSlice.actions;

export default uiSlice.reducer;