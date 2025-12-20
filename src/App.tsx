
import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './Components/common/Header';
import Sidebar from './Components/common/Sidebar';
import LoginScreen from './Components/common/Loginscreen';
import Dashboard from './Components/dashboard/Dashboard';
import ClientsTab from './Components/clients/ClientsTab';
import ProjectsTab from './Components/Projects/ProjectsTabs';
import EstimatesTab from './Components/estimates/EstimatesTab';
import InvoicesTab from './Components/invoices/InvoicesTab';
import type {
  User,
  Client,
  Project,
  TeamMember,
  Milestone,
  Estimate,
  Invoice,
  Payment,
} from './types/Index';
import useLocalStorage from './hooks/useLocalStorage';
import LoginPage from './Components/Auth/LoginPage';
const App: React.FC = () => {
  const [user, setUser] = useLocalStorage<User | null>('user', null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [clients, setClients] = useLocalStorage<Client[]>('clients', []);
  const [projects, setProjects] = useLocalStorage<Project[]>('projects', []);
  const [teamMembers, setTeamMembers] = useLocalStorage<TeamMember[]>('teamMembers', []);
  const [milestones, setMilestones] = useLocalStorage<Milestone[]>('milestones', []);
  const [estimates, setEstimates] = useLocalStorage<Estimate[]>('estimates', []);
  const [invoices, setInvoices] = useLocalStorage<Invoice[]>('invoices', []);
  const [payments, setPayments] = useLocalStorage<Payment[]>('payments', []);
  const isAdmin = user?.role === 'Admin';
  return (
    <Routes>
   
      <Route
        path="/login"
        element={
          user ? <Navigate to="/dashboard" replace /> : <LoginScreen onLogin={setUser} />
        }
      />
      <Route
        path="/dashboard"
        element={
          !user ? (
            <Navigate to="/login" replace />
          ) : (
            <div className="h-screen bg-gray-50 overflow-hidden">
              {/* Header */}
              <div className="fixed top- left-0 right-0 z-50">
                <Header user={user} onLogout={() => setUser(null)} />
              </div>

              {/* Layout */}
              <div className="flex pt-16 h-full">
                <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] z-40">
                  <Sidebar
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    isAdmin={isAdmin}
                  />
                </div>

                <main className="ml-16 md:ml-64 flex-1 p-6 m-4 md:m-6 overflow-y-auto h-[calc(100vh-4rem)]">
                  {activeTab === 'dashboard' && (
                    <Dashboard
                      isAdmin={isAdmin}
                      projects={projects}
                      estimates={estimates}
                      invoices={invoices}
                    />
                  )}

                  {activeTab === 'clients' && isAdmin && (
                    <ClientsTab clients={clients} setClients={setClients} />
                  )}

                  {activeTab === 'projects' && (
                    <ProjectsTab
                      projects={projects}
                      setProjects={setProjects}
                      clients={clients}
                      isAdmin={isAdmin}
                      teamMembers={teamMembers}
                      setTeamMembers={setTeamMembers}
                      milestones={milestones}
                      setMilestones={setMilestones}
                    />
                  )}

                  {activeTab === 'estimates' && (
                    <EstimatesTab
                      estimates={estimates}
                      setEstimates={setEstimates}
                      projects={projects}
                      clients={clients}
                      teamMembers={teamMembers}
                      milestones={milestones}
                      isAdmin={isAdmin}
                    />
                  )}

                  {activeTab === 'invoices' && (
                    <InvoicesTab
                      invoices={invoices}
                      setInvoices={setInvoices}
                      payments={payments}
                      setPayments={setPayments}
                      projects={projects}
                      clients={clients}
                      milestones={milestones}
                      setMilestones={setMilestones}
                      isAdmin={isAdmin}
                    />
                  )}
                </main>
              </div>
            </div>
          )
        }
      />

     
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;
