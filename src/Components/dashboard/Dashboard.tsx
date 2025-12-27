// src/components/dashboard/Dashboard.tsx
import React from 'react';
import type { Project, Estimate, Invoice } from '../../types/Index';
import {
  FolderKanban,
  FileClock,
  FileCheck,
  FileText,
  IndianRupee,
  CheckCircle
} from 'lucide-react';
import users from '../../assets/social-media.gif'
import briefcase from '../../assets/briefcase.gif'
import file from '../../assets/document.gif'
import receipt from '../../assets/fee-receipt.gif'
import indianrupee from '../../assets/balpaid.gif'
import paidinvoices from '../../assets/paid-invoices.gif'
interface DashboardProps {
  isAdmin: boolean;
  projects: Project[];
  estimates: Estimate[];
  invoices: Invoice[];
}
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/slices/store';
const Dashboard: React.FC<DashboardProps> = ({
  isAdmin,
  projects,
  estimates,
  invoices,
}) => {
  const totalProjects = projects.length;
  const pendingEstimates = estimates.filter(e => e.status === 'Pending').length;
  // const approvedEstimates = estimates.filter(e => e.status === 'Approved').length;
  const totalInvoices = invoices.length;
  const paidInvoices = invoices.filter(i => i.status === 'Paid').length;
  const unpaidBalance = invoices.reduce((sum, i) => sum + i.balance, 0);
const clientCount = useSelector((state: RootState) => state.clients.clients.length);
const project=useSelector((state:RootState)=> state.project.projects.length);
console.log('Length:', projects.length);

  const stats = isAdmin
    ? [
        {
          label: 'Total Projects',
          value: project,
          color: 'green',
          icon: FolderKanban,
          border: "border-green-500",
         iconBg: "bg-green-100",
         iconColor: "text-green-600",
         gif:briefcase
        },
        {
          label: 'Pending Estimates',
          value: pendingEstimates,
          color: 'yellow',
          icon: FileClock,
          border: "border-yellow-500",
         iconBg: "bg-yellow-100",
         iconColor: "text-yellow-600",
          gif:file
        },
        {
          label: 'Total Clients',
          value: clientCount,
          color: 'blue',
          icon: FileCheck,
          border: "border-blue-500",
      iconBg: "bg-blue-200",
      iconColor: "text-blue-600",
      gif:users
        },
        {
          label: 'Total Invoices',
          value: totalInvoices,
          color: 'purple',
          icon: FileText,
           border: "border-purple-500",
           iconBg: "bg-purple-100",
          iconColor: "text-purple-600",
           gif:receipt
        },
        {
          label: 'Paid Invoices',
          value: paidInvoices,
          color: 'pink',
          icon: CheckCircle,
          border: "border-pink-500",
          iconBg: "bg-pink-100",
          iconColor: "text-pink-600",
           gif:paidinvoices
        },
        {
          label: 'Outstanding Balance',
          value: `₹${unpaidBalance.toLocaleString()}`,
          color: 'red',
          icon: IndianRupee,
           border: "border-red-500",
          iconBg: "bg-red-100",
          iconColor: "text-red-600",
           gif:indianrupee
        },
      ]
    : [
        {
          label: 'My Projects',
          value: totalProjects,
          color: 'green',
          icon: FolderKanban,
          border: "border-green-500",
         iconBg: "bg-green-100",
         iconColor: "text-green-600",
         gif:briefcase
        },
        {
          label: 'Pending Estimates',
          value: pendingEstimates,
          color: 'yellow',
          icon: FileClock,
          border: "border-yellow-500",
         iconBg: "bg-yellow-100",
         iconColor: "text-yellow-600",
          gif:file
        },
        {
          label: 'Total Invoices',
          value: totalInvoices,
          color: 'purple',
          icon: FileText,
           border: "border-purple-500",
           iconBg: "bg-purple-100",
          iconColor: "text-purple-600",
           gif:receipt
        },
        {
          label: 'Outstanding Amount',
          value: `₹${unpaidBalance.toLocaleString()}`,
          color: 'red',
          icon: IndianRupee,
          border: "border-red-500",
          iconBg: "bg-red-100",
          iconColor: "text-red-600",
            gif:indianrupee
        },
      ];

  const getColorClasses = (color: string) => {
    const map: Record<string, string> = {
      blue: 'border-blue-500 text-blue-600 bg-blue-50 bg-gradient-to-br from-blue-400  to-blue-300' ,
      yellow: 'border-yellow-500 text-yellow-600 bg-yellow-50  bg-gradient-to-br from-yellow-400  to-yellow-300',
      green: 'border-green-500 text-green-600 bg-green-50 bg-gradient-to-br from-green-400  to-green-300',
      purple: 'border-purple-500 text-purple-600 bg-purple-50 bg-gradient-to-br from-purple-400  to-purple-300',
      pink: 'border-pink-500 text-pink-600 bg-pink-50 bg-gradient-to-br from-pink-400  to-pink-300',
      red: 'border-red-500 text-red-600 bg-red-50 bg-gradient-to-br from-red-400  to-red-300',
    };
    return map[color];
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h2>

      <div
        className={`grid grid-cols-1 md:grid-cols-2 ${
          stats.length === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
        } gap-6`}
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <div
              key={index}
              className={`relative bg-white rounded-xl shadow-md p-6 border-l-4 border-r-4 transition hover:scale-105 ${getColorClasses(
                stat.color
              )}`}
            >
               <img
          src={stat.gif}
          alt=""
          className="absolute right-3 top-1/2 -translate-y-1/2 w-16 h-16 opacity-80 pointer-events-none"
        />
              {/* Icon */}
              <div
                className={`w-12 h-12 flex items-center justify-center m-2  rounded-xl ${stat.iconBg}`}
              >
                <Icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>

              {/* Content */}
              <h2 className="text-sm font-medium m-0 uppercase tracking-wide text-black">
                {stat.label}
              </h2>
              <p className="text-3xl font-bold  text-gray-800">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      {/* <div className="mt-12">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Welcome back!
        </h3>
        <p className="text-gray-600">
          {isAdmin
            ? 'Manage projects, estimates, and invoices from the sidebar.'
            : 'View your projects, estimates, and invoices.'}
        </p>
      </div> */}
    </div>
  );
};
export default Dashboard;
