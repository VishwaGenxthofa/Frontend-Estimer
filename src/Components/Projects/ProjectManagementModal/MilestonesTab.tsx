import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Trash2, FileText } from 'lucide-react';
import type { Project, Milestone } from '../../../types/Index';
import type { AppDispatch, RootState } from '../../../redux/store';
import {
  fetchMilestonesByProject,
  createMilestone,
  deleteMilestone,
} from '../../../redux/milestoneSlice';
import { toast } from 'react-hot-toast';

interface MilestonesTabProps {
  project: Project;
}

const MilestonesTab: React.FC<MilestonesTabProps> = ({ project }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { milestones, loading } = useSelector((state: RootState) => state.milestone);

  const [showAddMilestone, setShowAddMilestone] = useState(false);
  const [form, setForm] = useState({
    MilestoneName: '',
    Description: '',
    PaymentPercentage: '',
    MilestoneAmount: '',
    MilestoneStatusId: 1,
    DueDate: '',
  });

  const projectId = project.projectId;

  /* ================= FETCH MILESTONES ================= */
  useEffect(() => {
     if (!projectId) return;
      dispatch(fetchMilestonesByProject(Number(projectId)));
    
  }, [dispatch, projectId]);

  const projMilestones = milestones.filter((m) => m.ProjectId === projectId);

  /* ================= ADD MILESTONE ================= */
  const handleAdd = async () => {
    if (
      !form.MilestoneName ||
      !form.PaymentPercentage ||
      !form.MilestoneAmount ||
      !form.DueDate
    ) {
      toast.error('Please fill all required fields');
      return;
    }
   if (!projectId) {
         toast.error('Project not selected');
         return;
       }
    try {
      await dispatch(
        createMilestone({
          ProjectId: project.projectId,
          MilestoneName: form.MilestoneName,
          Description: form.Description,
          PaymentPercentage: Number(form.PaymentPercentage),
          MilestoneAmount: Number(form.MilestoneAmount),
          DueDate: form.DueDate,
          MilestoneStatusId: Number(form.MilestoneStatusId),
          status: 'Pending',
        })
      ).unwrap();

      toast.success('Milestone added successfully 🎉');
      dispatch(fetchMilestonesByProject(projectId));

      setShowAddMilestone(false);
      setForm({
        MilestoneName: '',
        Description: '',
        PaymentPercentage: '',
        MilestoneAmount: '',
        MilestoneStatusId: 1,
        DueDate: '',
      });
    } catch (err: any) {
      toast.error(err?.message || 'Failed to add milestone');
    }
  };

  /* ================= DELETE MILESTONE ================= */
  const removeMilestone = async (id: number) => {
    if (!projectId) return;

    if (confirm('Remove this milestone?')) {
      try {
        await dispatch(deleteMilestone(id)).unwrap();
        toast.success('Milestone removed');
        dispatch(fetchMilestonesByProject(projectId));
      } catch {
        toast.error('Failed to remove milestone');
      }
    }
  };

  return (
    <div>
      {/* ADD BUTTON */}
      <button
        onClick={() => setShowAddMilestone(true)}
        className="mb-4 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        <Plus className="w-4 h-4" /> Add Milestone
      </button>

      {/* ADD FORM */}
      {showAddMilestone && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h4 className="font-semibold mb-3">Add Milestone</h4>
          <div className="space-y-3">
            <input
              placeholder="Milestone Name *"
              value={form.MilestoneName}
              onChange={(e) => setForm({ ...form, MilestoneName: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
            <textarea
              placeholder="Description"
              value={form.Description}
              onChange={(e) => setForm({ ...form, Description: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border rounded-lg"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="number"
                placeholder="Payment % *"
                value={form.PaymentPercentage}
                onChange={(e) => setForm({ ...form, PaymentPercentage: e.target.value })}
                className="px-3 py-2 border rounded-lg"
              />
              <input
                type="number"
                placeholder="Amount (₹) *"
                value={form.MilestoneAmount}
                onChange={(e) => setForm({ ...form, MilestoneAmount: e.target.value })}
                className="px-3 py-2 border rounded-lg"
              />
              <input
                type="date"
                value={form.DueDate}
                onChange={(e) => setForm({ ...form, DueDate: e.target.value })}
                className="px-3 py-2 border rounded-lg"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleAdd}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Add
            </button>
            <button
              onClick={() => setShowAddMilestone(false)}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* MILESTONE LIST */}
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : projMilestones.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <FileText className="w-16 h-16 mx-auto mb-3 opacity-50" />
          <p>No milestones added yet</p>
        </div>
      ) : (
        projMilestones.map((ms) => (
          <div
            key={ms.ProjectMilestoneId}
            className="bg-white border rounded-lg p-5 shadow-sm mb-3"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="text-lg font-semibold">{ms.MilestoneName}</h4>
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
                {ms.Description && (
                  <p className="text-sm text-gray-600 mb-3">{ms.Description}</p>
                )}
                <div className="grid grid-cols-3 gap-6 text-sm">
                  <div>
                    <p className="text-gray-600">Payment %</p>
                    <p className="font-semibold">{ms.PaymentPercentage}%</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Amount</p>
                    <p className="font-semibold">₹{ms.MilestoneAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Planned Date</p>
                    <p className="font-semibold">{ms.DueDate}</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => removeMilestone(ms.ProjectMilestoneId)}
                className="text-red-600 hover:bg-red-50 p-2 rounded"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MilestonesTab;
