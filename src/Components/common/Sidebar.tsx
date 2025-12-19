// src/components/common/Sidebar.tsx
import React from 'react';
import { BarChart3, Users, Briefcase, FileText, DollarSign } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdmin: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isAdmin }) => {
  const adminTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'estimates', label: 'Estimates', icon: FileText },
    { id: 'invoices', label: 'Invoices', icon: DollarSign },
  ];

  const clientTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'projects', label: 'My Projects', icon: Briefcase },
    { id: 'estimates', label: 'Estimates', icon: FileText },
    { id: 'invoices', label: 'Invoices', icon: DollarSign },
  ];

  const tabs = isAdmin ? adminTabs : clientTabs;

  return (
    <aside className="w-16 md:w-64 bg-gradient-to-br from-blue-400 via-emerald-300 to-teal-200 border-r border-gray-200 min-h-screen">
  <nav className="p-3 md:p-6 space-y-2">
    {tabs.map((tab) => {
      const Icon = tab.icon;
      const isActive = activeTab === tab.id;

      return (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`w-full flex items-center md:justify-start justify-center gap-4 px-3 md:px-5 py-3 rounded-xl transition-all ${
            isActive
              ? 'bg-blue-50 text-blue-600 font-semibold shadow-sm'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Icon className="w-6 h-6" />
          <span className="hidden md:inline font-medium">
            {tab.label}
          </span>
        </button>
      );
    })}
  </nav>
</aside>

  );
};

export default Sidebar;