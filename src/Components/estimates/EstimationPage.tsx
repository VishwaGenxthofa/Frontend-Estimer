// pages/EstimationPage.tsx
import React from 'react';
import Dashboard from './comp/Dashboard';
import DetailModal from './comp/DetailModal';
import CreateEstimateModal from './comp/CreateEstimateModal';
import type { Estimate, Project, Client } from '../../types/Index';
interface EstimationPageProps {
  estimates: Estimate[];
    setEstimates: React.Dispatch<React.SetStateAction<Estimate[]>>;
    projects: Project[];
    clients: Client[];
    teamMembers: any[]; // From App state
    milestones: any[];
    isAdmin: boolean;
}
const EstimationPage: React.FC<EstimationPageProps> = ({

}) => {
  return (
    <>
      <Dashboard />
      <DetailModal />
      <CreateEstimateModal />
    </>
  );
};

export default EstimationPage;