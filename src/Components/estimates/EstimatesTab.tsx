import React, { useState } from 'react';
import { Plus, Eye, Check, XCircle, RefreshCw } from 'lucide-react';
import CreateEstimateModal from './CreateEstimateModal';
import EstimateDetailsModal from './EstimateDetailsModal';
import type { Estimate, Project, Client } from '../../types/Index';

interface EstimatesTabProps {
  estimates: Estimate[];
  setEstimates: React.Dispatch<React.SetStateAction<Estimate[]>>;
  projects: Project[];
  clients: Client[];
  teamMembers: any[]; // From App state
  milestones: any[];
  isAdmin: boolean;
}

const EstimatesTab: React.FC<EstimatesTabProps> = ({
  estimates,
  setEstimates,
  projects,
  clients,
  teamMembers,
  milestones,
  isAdmin,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewEstimate, setViewEstimate] = useState<Estimate | null>(null);

  const handleApprove = (id: number) => {
    setEstimates(estimates.map(e => e.estimation_id === id ? { ...e, status: 'Approved' } : e));
  };

  const handleReject = (id: number) => {
    setEstimates(estimates.map(e => e.estimation_id === id ? { ...e, status: 'Rejected' } : e));
  };

  const handleChangeRequest = (id: number) => {
    const comment = window.prompt('Enter your change request comment:');
    if (comment?.trim()) {
      setEstimates(estimates.map(e =>
        e.estimation_id === id
          ? { ...e, status: 'Change Requested', change_comment: comment.trim() }
          : e
      ));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Estimates</h2>
        {isAdmin && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            <span>Create Estimate</span>
          </button>
        )}
      </div>

      <div className="space-y-6">
        {estimates.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No estimates created yet</p>
          </div>
        ) : (
          estimates.map((est) => {
            const proj = projects.find(p => p.projectId === est.project_id);
            const client = clients.find(c => c.clientId === parseInt(proj?.clientId || ''));

            return (
              <div key={est.estimation_id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{proj?.projectName || 'Unknown Project'}</h3>
                    <p className="text-sm text-gray-600">Client: {client?.companyName || 'N/A'}</p>
                    <p className="text-xs text-gray-500">Version {est.version}</p>
                    {est.change_comment && (
                      <div className="mt-3 bg-orange-50 border-l-4 border-orange-500 p-3 rounded">
                        <p className="text-sm font-semibold text-orange-800">Change Request:</p>
                        <p className="text-sm text-orange-700">{est.change_comment}</p>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 text-xs rounded-full ${
                      est.status === 'Approved' ? 'bg-green-100 text-green-700' :
                      est.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                      est.status === 'Change Requested' ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {est.status}
                    </span>
                    <p className="text-2xl font-bold mt-2">₹{est.final.toFixed(2)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="bg-purple-50 p-3 rounded text-center">
                    <p className="text-xs text-gray-600">Labor</p>
                    <p className="text-lg font-semibold">₹{est.laborCost.toFixed(2)}</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded text-center">
                    <p className="text-xs text-gray-600">Direct</p>
                    <p className="text-lg font-semibold">₹{est.dc.toFixed(2)}</p>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded text-center">
                    <p className="text-xs text-gray-600">Indirect</p>
                    <p className="text-lg font-semibold">₹{est.ic.toFixed(2)}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded text-center">
                    <p className="text-xs text-gray-600">Additional</p>
                    <p className="text-lg font-semibold">₹{est.ac.toFixed(2)}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setViewEstimate(est)}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-100 py-2 rounded hover:bg-gray-200"
                  >
                    <Eye className="w-4 h-4" /> View Details
                  </button>
                  {!isAdmin && est.status === 'Pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(est.estimation_id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-2 rounded hover:bg-green-700"
                      >
                        <Check className="w-4 h-4" /> Approve
                      </button>
                      <button
                        onClick={() => handleReject(est.estimation_id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-2 rounded hover:bg-red-700"
                      >
                        <XCircle className="w-4 h-4" /> Reject
                      </button>
                      <button
                        onClick={() => handleChangeRequest(est.estimation_id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-orange-600 text-white py-2 rounded hover:bg-orange-700"
                      >
                        <RefreshCw className="w-4 h-4" /> Change Request
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {showCreateModal && (
        <CreateEstimateModal
          onClose={() => setShowCreateModal(false)}
          estimates={estimates}
          setEstimates={setEstimates}
          projects={projects}
          clients={clients}
          teamMembers={teamMembers}
          milestones={milestones}
        />
      )}

      {viewEstimate && (
        <EstimateDetailsModal
          estimate={viewEstimate}
          onClose={() => setViewEstimate(null)}
        />
      )}
    </div>
  );
};

export default EstimatesTab;