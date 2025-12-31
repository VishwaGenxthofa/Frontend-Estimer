import { configureStore } from '@reduxjs/toolkit';
import clientReducer from './clientSlice';
import projectStatusReducer from './projectStatusSlice';
import projectReducer from './projectSlice';
import teamMemberReducer from './teamMemberSlice';
import milestoneReducer from './milestoneSlice';
export const store = configureStore({
  reducer: {
    clients: clientReducer,
    projectStatus: projectStatusReducer,
     project: projectReducer,
     teamMember: teamMemberReducer,
       milestone: milestoneReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
