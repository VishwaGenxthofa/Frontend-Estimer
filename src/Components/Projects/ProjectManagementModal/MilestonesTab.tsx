import React, { useState } from 'react';
import { Plus, Trash2, FileText } from 'lucide-react';
import type { Milestone, Project } from '../../../types';

interface MilestonesTabProps {
  project: Project;
  milestones: Milestone[];
  setMilestones: React.Dispatch<React.SetStateAction<Milestone[]>>;
}

const MilestonesTab: React.FC<MilestonesTabProps> = ({ project, milestones, setMilestones }) => {
  const [showAddMilestone, setShowAddMilestone] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    percentage: '',
    amount: '',
    date: '',
  });

  const projMilestones = milestones.filter((m) => m.project_id === project.project_id);

  const handleAdd = () => {
    if (!form.name || !form.percentage || !form.amount || !form.date) {
      alert('Please fill all required fields');
      return;
    }

    setMilestones([
      ...milestones,
      {
        milestone_id: Math.max(...milestones.map((m) => m.milestone_id), 0) + 1,
        project_id: project.project_id,
        milestone_name: form.name,
        description: form.description,
        payment_percentage: Number(form.percentage),
        milestone_amount: Number(form.amount),
        planned_date: form.date,
        status: 'Pending',
      },
    ]);

    setShowAddMilestone(false);
    setForm({ name: '', description: '', percentage: '', amount: '', date: '' });
  };

  const removeMilestone = (id: number) => {
    if (confirm('Remove this milestone?')) {
      setMilestones(milestones.filter((m) => m.milestone_id !== id));
    }
  };

  return (
    <div>
      <button
        onClick={() => setShowAddMilestone(true)}
        className="mb-4 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        <Plus className="w-4 h-4" /> Add Milestone
      </button>

      {showAddMilestone && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h4 className="font-semibold mb-3">Add Milestone</h4>
          <div className="space-y-3">
            <input
              placeholder="Milestone Name *"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border rounded-lg"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="number"
                placeholder="Payment % *"
                value={form.percentage}
                onChange={(e) => setForm({ ...form, percentage: e.target.value })}
                className="px-3 py-2 border rounded-lg"
              />
              <input
                type="number"
                placeholder="Amount (₹) *"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="px-3 py-2 border rounded-lg"
              />
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="px-3 py-2 border rounded-lg"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={handleAdd} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Add
            </button>
            <button onClick={() => setShowAddMilestone(false)} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {projMilestones.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <FileText className="w-16 h-16 mx-auto mb-3 opacity-50" />
            <p>No milestones added yet</p>
          </div>
        ) : (
          projMilestones.map((ms) => (
            <div key={ms.milestone_id} className="bg-white border rounded-lg p-5 shadow-sm">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-semibold">{ms.milestone_name}</h4>
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${
                        ms.status === 'Completed'
                          ? 'bg-green-100 text-green-700'
                          : ms.status === 'In Progress'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {ms.status}
                    </span>
                  </div>
                  {ms.description && <p className="text-sm text-gray-600 mb-3">{ms.description}</p>}
                  <div className="grid grid-cols-3 gap-6 text-sm">
                    <div>
                      <p className="text-gray-600">Payment %</p>
                      <p className="font-semibold">{ms.payment_percentage}%</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Amount</p>
                      <p className="font-semibold">₹{ms.milestone_amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Planned Date</p>
                      <p className="font-semibold">{ms.planned_date}</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeMilestone(ms.milestone_id)}
                  className="text-red-600 hover:bg-red-50 p-2 rounded"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MilestonesTab;