// src/components/clients/ClientsTab.tsx
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import AddClientModal from './AddClientModal';
import type { Client } from '../../types/Index';

interface ClientsTabProps {
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
}

const ClientsTab: React.FC<ClientsTabProps> = ({ clients, setClients }) => {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Clients</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Client</span>
        </button>
      </div>

      {clients.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow">
          <p className="text-gray-500 text-lg">No clients added yet.</p>
          <p className="text-gray-400 mt-2">Start by adding your first client.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Address
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {clients.map((client) => (
                <tr key={client.client_id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{client.client_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{client.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{client.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600 max-w-xs truncate">{client.address}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAddModal && (
        <AddClientModal
          onClose={() => setShowAddModal(false)}
          clients={clients}
          setClients={setClients}
        />
      )}
    </div>
  );
};

export default ClientsTab;