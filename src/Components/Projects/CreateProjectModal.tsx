import React, { useState } from 'react';
import Modal from '../common/Modal';
import type { Project, Client } from '../../types/Index';
import { Plus,Check } from 'lucide-react';
interface CreateProjectModalProps {
  onClose: () => void;
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  clients: Client[];
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  onClose,
  projects,
  setProjects,
  clients,
}) => {
  const [showAddStatus, setShowAddStatus] = useState(false);
  const [form, setForm] = useState({
    project_name: '',
    project_code: '',
    client_id: '',
    projectManagerId: '',
    projectStatusId: '',
    start_date: '',
    end_date: '',
    payment_terms: 30,
  });

  const handleSubmit = () => {
    if (!form.project_name || !form.project_code || !form.client_id) {
      alert('Please fill in all required fields');
      return;
    }

    setProjects([
      ...projects,
      {
        project_id: Math.max(...projects.map(p => p.project_id), 0) + 1,
        ...form,
        client_id: form.client_id.toString(),
        status: 'Planning',
      },
    ]);

    onClose();
    setForm({
      project_name: '',
      project_code: '',
      client_id: '',
      projectManagerId: '',
    projectStatusId: '',
      start_date: '',
      end_date: '',
      payment_terms: 30,
    });
  };
const [newStatus, setNewStatus] = useState({
    statusName: '',
    description: '',
    displayOrder: '',
    statusColor: '#3b82f6'
  });

  // Mock data
  // const [clients] = useState([
  //   { id: 1, name: 'Acme Corp' },
  //   { id: 2, name: 'Tech Solutions' },
  //   { id: 3, name: 'Global Industries' }
  // ]);

  const [projectManagers] = useState([
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Mike Johnson' }
  ]);

  const [projectStatuses, setProjectStatuses] = useState([
    { id: 1, statusName: 'Planning', statusColor: '#3b82f6' },
    { id: 2, statusName: 'In Progress', statusColor: '#f59e0b' },
    { id: 3, statusName: 'On Hold', statusColor: '#ef4444' },
    { id: 4, statusName: 'Completed', statusColor: '#10b981' }
  ]);

  const handleInputChange = (e:any) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleNewStatusChange = (e:any) => {
    const { name, value } = e.target;
    setNewStatus(prev => ({ ...prev, [name]: value }));
  };

  const handleAddStatus = () => {
    if (newStatus.statusName.trim()) {
      const newStatusObj = {
        id: projectStatuses.length + 1,
        statusName: newStatus.statusName,
        statusColor: newStatus.statusColor,
        description: newStatus.description,
        displayOrder: newStatus.displayOrder || projectStatuses.length + 1
      };
      
      setProjectStatuses(prev => [...prev, newStatusObj]);
      setForm(prev => ({ ...prev, projectStatusId: newStatusObj.id }));
      
      // Reset new status form
      setNewStatus({
        statusName: '',
        description: '',
        displayOrder: '',
        statusColor: '#3b82f6'
      });
      setShowAddStatus(false);
    }
  };

  return (
    <Modal onClose={onClose} title="Create New Project">
      <div className="space-y-4">
        <div>
        <label className="block text-sm font-medium mb-1">Project Name <span className="text-red-500">*</span></label>
        <input
          placeholder="Project Name"
          value={form.project_name}
          onChange={(e) => setForm({ ...form, project_name: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        </div>
        <div>
        <label className="block text-sm font-medium mb-1">Project Code <span className="text-red-500">*</span></label>
        <input
          placeholder="Project Code"
          value={form.project_code}
          onChange={(e) => setForm({ ...form, project_code: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        </div>
        <div>
        <label className="block text-sm font-medium mb-1">Select Client<span className="text-red-500">*</span></label>
        <select
          value={form.client_id}
          onChange={(e) => setForm({ ...form, client_id: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Client *</option>
          {clients.map((c) => (
            <option key={c.clientId} value={c.clientId}>
              {c.companyName}
            </option>
          ))}
        </select>
        </div>
          {/* Project Manager Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Manager <span className="text-red-500">*</span>
            </label>
            <select
              name="projectManagerId"
              value={form.projectManagerId}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Project Manager</option>
              {projectManagers.map(pm => (
                <option key={pm.id} value={pm.id}>{pm.name}</option>
              ))}
            </select>
          </div>


         {/* Project Status Selection with Add New */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Status <span className="text-red-500">*</span>
            </label>
            
            <div className="flex gap-2">
              <select
                name="projectStatusId"
                value={form.projectStatusId}
                onChange={handleInputChange}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Project Status</option>
                {projectStatuses.map(status => (
                  <option key={status.id} value={status.id}>
                    {status.statusName}
                  </option>
                ))}
              </select>
              
              <button
                type="button"
                onClick={() => setShowAddStatus(!showAddStatus)}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
              >
                <Plus size={18} />
                Add New
              </button>
            </div>

            {/* Add New Status Form */}
            {showAddStatus && (
              <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-3">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Add New Project Status</h3>
                
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Status Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="statusName"
                    value={newStatus.statusName}
                    onChange={handleNewStatusChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., Under Review"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={newStatus.description}
                    onChange={handleNewStatusChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Brief description of this status"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Display Order
                    </label>
                    <input
                      type="number"
                      name="displayOrder"
                      value={newStatus.displayOrder}
                      onChange={handleNewStatusChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Order"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Status Color
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        name="statusColor"
                        value={newStatus.statusColor}
                        onChange={handleNewStatusChange}
                        className="h-10 w-16 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={newStatus.statusColor}
                        onChange={(e) => setNewStatus(prev => ({ ...prev, statusColor: e.target.value }))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleAddStatus}
                    className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Check size={18} />
                    Add Status
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddStatus(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Display Selected Status with Color */}
            {form.projectStatusId && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-sm text-gray-600">Selected:</span>
                <span
                  className="px-3 py-1 rounded-full text-sm font-medium text-white"
                  style={{ backgroundColor: projectStatuses.find(s => s.id === parseInt(form.projectStatusId))?.statusColor }}
                >
                  {projectStatuses.find(s => s.id === parseInt(form.projectStatusId))?.statusName}
                </span>
              </div>
            )}
          </div>

         <div className='flex w-full gap-4'>
         <div className='w-full'>
        <label className="block text-sm font-medium mb-1">Start Date <span className="text-red-500">*</span></label>
        <input
          type="date"
          placeholder="Start Date"
          value={form.start_date}
          onChange={(e) => setForm({ ...form, start_date: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        </div>
        <div className='w-full'>
        <label className="block text-sm font-medium mb-1">End Date<span className="text-red-500">*</span></label>
        <input
          type="date"
          placeholder="Planned End Date"
          value={form.end_date}
          onChange={(e) => setForm({ ...form, end_date: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        </div>
        </div>
        <div>
        <label className="block text-sm font-medium mb-1">Payment Terms <span className="text-red-500">*</span></label>
        <input
          type="number"
          placeholder="Payment Terms (days)"
          value={form.payment_terms}
          onChange={(e) => setForm({ ...form, payment_terms: Number(e.target.value) || 30 })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium"
          >
            Create Project
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateProjectModal;