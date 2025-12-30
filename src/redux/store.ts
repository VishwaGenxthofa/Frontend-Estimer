import { configureStore } from '@reduxjs/toolkit';
import clientReducer from './clientSlice';
import projectStatusReducer from './projectStatusSlice';
import projectReducer from './projectSlice';
import teamMemberReducer from './teamMemberSlice';
export const store = configureStore({
  reducer: {
    clients: clientReducer,
    projectStatus: projectStatusReducer,
     project: projectReducer,
     teamMember: teamMemberReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
