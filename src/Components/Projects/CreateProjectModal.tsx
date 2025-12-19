import React, { useState } from 'react';
import Modal from '../common/Modal';
import type { Project, Client } from '../../types';

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
  const [form, setForm] = useState({
    project_name: '',
    project_code: '',
    client_id: '',
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
      start_date: '',
      end_date: '',
      payment_terms: 30,
    });
  };

  return (
    <Modal onClose={onClose} title="Create New Project">
      <div className="space-y-4">
        <input
          placeholder="Project Name *"
          value={form.project_name}
          onChange={(e) => setForm({ ...form, project_name: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          placeholder="Project Code *"
          value={form.project_code}
          onChange={(e) => setForm({ ...form, project_code: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={form.client_id}
          onChange={(e) => setForm({ ...form, client_id: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Client *</option>
          {clients.map((c) => (
            <option key={c.client_id} value={c.client_id}>
              {c.client_name}
            </option>
          ))}
        </select>
        <input
          type="date"
          placeholder="Start Date"
          value={form.start_date}
          onChange={(e) => setForm({ ...form, start_date: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="date"
          placeholder="Planned End Date"
          value={form.end_date}
          onChange={(e) => setForm({ ...form, end_date: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          placeholder="Payment Terms (days)"
          value={form.payment_terms}
          onChange={(e) => setForm({ ...form, payment_terms: Number(e.target.value) || 30 })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
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