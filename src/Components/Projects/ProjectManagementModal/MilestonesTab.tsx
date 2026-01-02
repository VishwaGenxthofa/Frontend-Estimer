import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Trash2, FileText } from 'lucide-react';
import type { Project, Milestone } from '../../../types/Index';
import type { AppDispatch, RootState } from '../../../redux/store';
import {
  fetchMilestones,
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
    milestoneName: '',
    description: '',
    paymentPercentage: '',
    mileStoneStatusName:'',
    milestoneAmount: '',
    milestoneStatusId: 1,
    dueDate: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
 
  const projectId = project.projectId;
 
  /* ================= FETCH MILESTONES FOR THIS PROJECT ================= */
  useEffect(() => {
    if (!projectId) return;
   
    const loadMilestones = async () => {
      try {
        console.log('🔄 Fetching milestones for project:', projectId);
       
        // ✅ Try project-specific endpoint first
        try {
          await dispatch(fetchMilestonesByProject(Number(projectId))).unwrap();
          console.log('✅ Fetched using project-specific endpoint');
        } catch (err) {
          console.warn('⚠️ Project-specific endpoint failed, fetching all and filtering...');
         
          // ✅ Fallback - Fetch all and filter
          await dispatch(fetchMilestones()).unwrap();
          console.log('✅ Fetched all milestones, will filter by project');
        }
       
      } catch (err: any) {
        console.error('❌ Failed to fetch milestones:', err);
        toast.error('Failed to load milestones');
      }
    };
   
    loadMilestones();
  }, [dispatch, projectId]);
 
  /* ================= FILTER PROJECT MILESTONES ================= */
  const projMilestones = useMemo(() => {
    if (!Array.isArray(milestones)) {
      console.log('⚠️ Milestones is not an array:', milestones);
      return [];
    }
   
    if (!projectId) {
      console.log('⚠️ No project ID');
      return [];
    }
   
    // ✅ Filter by project ID (in case we fetched all)
    const filtered = milestones.filter(m =>
      Number(m.ProjectId) === Number(projectId)
    );
   
    console.log('📋 Milestones for project', projectId, ':', filtered.length);
    return filtered;
  }, [milestones, projectId]);
 
  /* ================= SAVE TO LOCALSTORAGE ================= */
  useEffect(() => {
    if (!projectId) return;
 
    const milestoneData = {
      projectId,
      projectName: project.projectName,
      count: projMilestones.length,
      milestones: projMilestones,
      updatedAt: new Date().toISOString(),
    };
   
    localStorage.setItem(
      `project_${projectId}_milestones`,
      JSON.stringify(milestoneData)
    );
   
    console.log(`💾 Saved milestones to localStorage: project_${projectId}_milestones`);
  }, [projMilestones, projectId, project.projectName]);
 
  /* ================= VALIDATION ================= */
  const validate = () => {
    const e: Record<string, string> = {};
 
    if (!form.milestoneName) e.MilestoneName = 'Milestone name required';
    if (!form.paymentPercentage || Number(form.paymentPercentage) <= 0) {
      e.PaymentPercentage = 'Valid payment percentage required';
    }
    if (!form.milestoneAmount || Number(form.milestoneAmount) <= 0) {
      e.MilestoneAmount = 'Valid amount required';
    }
    if (!form.dueDate) e.DueDate = 'Due date required';
 
    setErrors(e);
    return Object.keys(e).length === 0;
  };
 
  /* ================= ADD MILESTONE ================= */
  const handleAdd = async () => {
    if (!validate()) return;
   
    if (!projectId) {
      toast.error('Project not selected');
      return;
    }
 
    try {
      console.log('➕ Creating milestone...');
     
      await dispatch(
        createMilestone({
          ProjectId: projectId,
         milestoneName: form.milestoneName,
          description: form.description,
          paymentPercentage: Number(form.paymentPercentage),
          milestoneAmount: Number(form.milestoneAmount),
          dueDate: form.dueDate,
          milestoneStatusId: Number(form.milestoneStatusId),
          mileStoneStatusName: 'Pending',
          statusColor:'',
        })
      ).unwrap();
 
      console.log('✅ Milestone added successfully');
      toast.success('Milestone added 🎉');
     
      // Reset form
      setShowAddMilestone(false);
      setForm({
        milestoneName: '',
        description: '',
        paymentPercentage: '',
        milestoneAmount: '',
        milestoneStatusId: 1,
        dueDate: '',
        mileStoneStatusName:'',
        statusColor:'',
      });
      setErrors({});
     
    } catch (err: any) {
      console.error('❌ Error adding milestone:', err);
      toast.error(err?.message || 'Failed to add milestone');
    }
  };
 
  /* ================= DELETE MILESTONE ================= */
  const removeMilestone = async (id: number, name: string) => {
    if (!window.confirm(`Remove milestone "${name}"?`)) return;
 
    try {
      console.log('🗑️ Deleting milestone:', id);
      await dispatch(deleteMilestone(id)).unwrap();
      console.log('✅ Milestone removed');
      toast.success('Milestone removed');
    } catch (err: any) {
      console.error('❌ Delete error:', err);
      toast.error(err?.message || 'Failed to remove milestone');
    }
  };
 
  /* ================= RESET FORM ================= */
  const resetForm = () => {
    setShowAddMilestone(false);
    setForm({
      milestoneName: '',
      description: '',
      paymentPercentage: '',
      milestoneAmount: '',
      milestoneStatusId: 1,
      dueDate: '',
      mileStoneStatusName:'',
      statusColor:'',
    });
    setErrors({});
  };
 
  /* ================= TOTAL MILESTONE AMOUNT ================= */
  const totalMilestoneAmount = useMemo(() => {
    return projMilestones.reduce((sum, m) => sum + (Number(m.milestoneAmount) || 0), 0);
  }, [projMilestones]);
 
  return (
    <div>
      {/* SUMMARY CARD */}
      <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg mb-4">
        <p className="text-sm text-purple-700">Project Milestones</p>
        <p className="text-2xl font-bold text-purple-800">
          {projMilestones.length} Milestone{projMilestones.length !== 1 ? 's' : ''}
        </p>
        <p className="text-sm text-purple-700">
          Total Amount: ₹{totalMilestoneAmount.toLocaleString()}
        </p>
      </div>
 
      {/* ADD BUTTON */}
      <button
        onClick={() => setShowAddMilestone(true)}
        className="mb-4 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Plus className="w-4 h-4" /> Add Milestone
      </button>
 
      {/* ADD FORM */}
      {showAddMilestone && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
          <h4 className="font-semibold mb-3">Add Milestone</h4>
         
          <div className="space-y-3">
            <div>
              <input
                placeholder="Milestone Name *"
                value={form.milestoneName}
                onChange={(e) => {
                  setForm({ ...form, milestoneName: e.target.value });
                  if (errors.MilestoneName) {
                    setErrors({ ...errors, MilestoneName: '' });
                  }
                }}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.MilestoneName ? 'border-red-500' : ''
                }`}
              />
              {errors.MilestoneName && (
                <p className="text-red-500 text-xs mt-1">{errors.MilestoneName}</p>
              )}
            </div>
 
            <textarea
              placeholder="Description (optional)"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
           
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <input
                  type="number"
                  placeholder="Payment % *"
                  value={form.paymentPercentage}
                  onChange={(e) => {
                    setForm({ ...form, paymentPercentage: e.target.value });
                    if (errors.PaymentPercentage) {
                      setErrors({ ...errors, PaymentPercentage: '' });
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.PaymentPercentage ? 'border-red-500' : ''
                  }`}
                  min="0"
                  max="100"
                />
                {errors.PaymentPercentage && (
                  <p className="text-red-500 text-xs mt-1">{errors.PaymentPercentage}</p>
                )}
              </div>
 
              <div>
                <input
                  type="number"
                  placeholder="Amount (₹) *"
                  value={form.milestoneAmount}
                  onChange={(e) => {
                    setForm({ ...form, milestoneAmount: e.target.value });
                    if (errors.MilestoneAmount) {
                      setErrors({ ...errors, MilestoneAmount: '' });
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.MilestoneAmount ? 'border-red-500' : ''
                  }`}
                  min="0"
                  step="0.01"
                />
                {errors.MilestoneAmount && (
                  <p className="text-red-500 text-xs mt-1">{errors.MilestoneAmount}</p>
                )}
              </div>
 
              <div>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => {
                    setForm({ ...form, dueDate: e.target.value });
                    if (errors.DueDate) {
                      setErrors({ ...errors, DueDate: '' });
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.DueDate ? 'border-red-500' : ''
                  }`}
                />
                {errors.DueDate && (
                  <p className="text-red-500 text-xs mt-1">{errors.DueDate}</p>
                )}
              </div>
            </div>
          </div>
 
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleAdd}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Adding...' : 'Add Milestone'}
            </button>
            <button
              onClick={resetForm}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
 
      {/* MILESTONE LIST */}
      {loading ? (
        <div className="flex items-center justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="ml-3 text-gray-500">Loading milestones...</p>
        </div>
      ) : projMilestones.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <FileText className="w-16 h-16 mx-auto mb-3 opacity-50" />
          <p className="font-medium">No milestones added yet</p>
          <p className="text-xs mt-2">Click "Add Milestone" to create project milestones</p>
        </div>
      ) : (
        <div className="space-y-3">
          {projMilestones.map((ms) => (
            <div
              key={ms.ProjectMilestoneId}
              className="bg-white border rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-semibold">{ms.milestoneName}</h4>
                    {/* <span
                      className={`px-3 py-1 text-xs rounded-full font-medium ${
                        ms.statusColor === 'Completed'
                          ? 'bg-green-100 text-green-700'
                          : ms.statusColor === 'In Progress'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {ms.statusColor}
                    </span> */}
                  </div>
                 
                  {ms.description && (
                    <p className="text-sm text-gray-600 mb-3">{ms.description}</p>
                  )}
                 
                  <div className="grid grid-cols-3 gap-6 text-sm">
                    <div>
                      <p className="text-gray-600 text-xs">Payment Percentage</p>
                      <p className="font-semibold text-base">{ms.paymentPercentage}%</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-xs">Amount</p>
                      <p className="font-semibold text-green-600 text-base">
                        ₹{ms.milestoneAmount}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-xs">Due Date</p>
                      <p className="font-semibold text-base">
                        {new Date(ms.dueDate).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
               
                <button
                  onClick={() => removeMilestone(ms.ProjectMilestoneId, ms.milestoneName)}
                  disabled={loading}
                  className="text-red-600 hover:bg-red-50 p-2 rounded transition-colors disabled:opacity-50"
                  title={`Remove ${ms.milestoneName}`}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
 
export default MilestonesTab;