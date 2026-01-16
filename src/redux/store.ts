import { configureStore } from '@reduxjs/toolkit';
import clientReducer from './clientSlice';
import projectStatusReducer from './projectStatusSlice';
import projectReducer from './projectSlice';
import teamMemberReducer from './teamMemberSlice';
import milestoneReducer from './milestoneSlice';
import employeesReducer from './employeesSlice';
import estimateReducer from './estimateSlice';
import estimationStatusReducer from "./estimationStatus"
import estimationTaxconfigReducer from "./taxConfigs"
import costTypeReducer from "./costTypeSlice"
import uiReducer from './uiSlice';
export const store = configureStore({
  reducer: {
    clients: clientReducer,
    projectStatus: projectStatusReducer,
     project: projectReducer,
     teamMember: teamMemberReducer,
       milestone: milestoneReducer,
       employees: employeesReducer,
        estimate: estimateReducer,
        estimatestatus: estimationStatusReducer,
        estimatestaxconfig:estimationTaxconfigReducer,
        costTypes: costTypeReducer,
        ui: uiReducer,

  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
