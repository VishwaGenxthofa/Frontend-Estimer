import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Trash2, Users } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
 
import type { Project, TeamMember } from '../../../types/Index';
import type { AppDispatch, RootState } from '../../../redux/store';
 
import {
  fetchTeamMembersByProject,
  createTeamMember,
  fetchTeamMembers,
  deleteTeamMember,
} from '../../../redux/teamMemberSlice';
 
/* ================= MOCK EMPLOYEES ================= */
const employees = [
  { employeeId: 101, employeeName: 'Rajesh Kumar', designation: 'Senior Developer' },
  { employeeId: 102, employeeName: 'Priya Sharma', designation: 'UI Developer' },
  { employeeId: 103, employeeName: 'Karthik Raja', designation: 'Developer' },
  { employeeId: 104, employeeName: 'Divya Lakshmi', designation: 'UI/UX Designer' },
  { employeeId: 105, employeeName: 'Arun Prakash', designation: 'QA Engineer' },
];
 
interface TeamTabProps {
  project: Project;
}
 
const TeamTab: React.FC<TeamTabProps> = ({ project }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { members, loading } = useSelector(
    (state: RootState) => state.teamMember
  );
 
  const [showAddTeam, setShowAddTeam] = useState(false);
  const [teamForm, setTeamForm] = useState({
    employeeId: '',
    employeeName: '',
    designation: '',
    hourlyRate: '',
    estimatedHours: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
 
  /* ================= FETCH TEAM MEMBERS FOR THIS PROJECT ================= */
  useEffect(() => {
    if (!project?.projectId) return;
   
    const loadTeamMembers = async () => {
      try {
        console.log('🔄 Fetching team members for project:', project.projectId);
       
        // ✅ OPTION 1: Try project-specific endpoint first
        try {
          await dispatch(fetchTeamMembersByProject(Number(project.projectId))).unwrap();
          console.log('✅ Fetched using project-specific endpoint');
        } catch (err) {
          console.warn('⚠️ Project-specific endpoint failed, fetching all and filtering...');
         
          // ✅ OPTION 2: Fallback - Fetch all and filter in component
          const allMembers = await dispatch(fetchTeamMembers()).unwrap();
          console.log('📊 All members fetched:', allMembers.length);
         
          // Filter by project manually (this will be handled by useMemo)
          const filtered = allMembers.filter(
            m => Number(m.projectId) === Number(project.projectId)
          );
          console.log('✅ Filtered members for this project:', filtered.length);
        }
       
      } catch (err: any) {
        console.error('❌ Failed to fetch team members:', err);
        toast.error('Failed to load team members');
      }
    };
   
    loadTeamMembers();
  }, [dispatch, project.projectId]);
 
  /* ================= PROJECT TEAM ================= */
  const projTeam: TeamMember[] = useMemo(() => {
    if (!Array.isArray(members)) {
      console.log('⚠️ Members is not an array:', members);
      return [];
    }
   
    if (!project?.projectId) {
      console.log('⚠️ No project ID');
      return [];
    }
   
    // ✅ CRITICAL: Filter by project ID
    // (In case we fetched all members instead of project-specific)
    const filtered = members.filter(m =>
      Number(m.projectId) === Number(project.projectId)
    );
   
    console.log('📋 projTeam members for project', project.projectId, ':', filtered.length);
    return filtered;
  }, [members, project?.projectId]);
 
  /* ================= AVAILABLE EMPLOYEES (NOT ALREADY ADDED) ================= */
  const availableEmployees = useMemo(() => {
    console.log('='.repeat(70));
    console.log('🔍 COMPUTING AVAILABLE EMPLOYEES');
    console.log('='.repeat(70));
   
    // Get employee IDs that are already added (convert to string for comparison)
    const addedEmployeeIds = projTeam.map(m => {
      // Try both string and number conversion
      const id = String(m.employeeId);
      console.log(`  → Member: ${m.employeeName}, employeeId: ${m.employeeId} (${typeof m.employeeId})`);
      return id;
    });
   
    console.log('📌 Added Employee IDs (as strings):', addedEmployeeIds);
   
    // Filter employees
    const available = employees.filter(emp => {
      const empIdStr = String(emp.employeeId);
      const isAlreadyAdded = addedEmployeeIds.includes(empIdStr);
     
      console.log(`  → ${emp.employeeName} (ID: ${empIdStr}): ${isAlreadyAdded ? '❌ Already Added' : '✅ Available'}`);
     
      return !isAlreadyAdded;
    });
   
    console.log('✅ Final Available Employees:', available.length);
    console.log('   Names:', available.map(e => e.employeeName).join(', '));
    console.log('='.repeat(70));
   
    return available;
  }, [projTeam]);
 
  /* ================= SAVE TO LOCALSTORAGE ================= */
  useEffect(() => {
    if (!project?.projectId) return;
 
    const teamData = {
      projectId: project.projectId,
      projectName: project.projectName,
      count: projTeam.length,
      totalCost: projTeam.reduce((sum, m) => sum + (Number(m.totalCost) || 0), 0),
      members: projTeam,
      updatedAt: new Date().toISOString(),
    };
   
    localStorage.setItem(
      `project_${project.projectId}_team`,
      JSON.stringify(teamData)
    );
  }, [projTeam, project.projectId, project.projectName]);
 
  /* ================= VALIDATION ================= */
  const validate = () => {
    const e: Record<string, string> = {};
 
    if (!teamForm.employeeId) {
      e.employeeId = 'Employee required';
    }
   
    if (!teamForm.hourlyRate || Number(teamForm.hourlyRate) <= 0) {
      e.hourlyRate = 'Valid hourly rate required';
    }
   
    if (!teamForm.estimatedHours || Number(teamForm.estimatedHours) <= 0) {
      e.estimatedHours = 'Valid estimated hours required';
    }
 
    // Check if employee already exists
    const exists = projTeam.some(
      (m) => String(m.employeeId) === String(teamForm.employeeId)
    );
   
    if (exists) {
      e.employeeId = 'Employee already added to this project';
    }
 
    setErrors(e);
    return Object.keys(e).length === 0;
  };
 
  /* ================= ADD TEAM MEMBER ================= */
  const handleAddTeam = async () => {
    if (!validate()) return;
 
    try {
      console.log('➕ Creating team member with data:', {
        projectId: Number(project.projectId),
        employeeId: Number(teamForm.employeeId),
        employeeName: teamForm.employeeName,
        designation: teamForm.designation,
        hourlyRate: Number(teamForm.hourlyRate),
        estimatedHours: Number(teamForm.estimatedHours),
      });
 
      const result = await dispatch(
        createTeamMember({
          projectId: Number(project.projectId),
          employeeId: Number(teamForm.employeeId),
          employeeName: teamForm.employeeName,
          designation: teamForm.designation,
          hourlyRate: Number(teamForm.hourlyRate),
          estimatedHours: Number(teamForm.estimatedHours),
          totalCost: Number(teamForm.hourlyRate) * Number(teamForm.estimatedHours),
        })
      ).unwrap();
 
      console.log('✅ Team member created:', result);
      toast.success(`${teamForm.employeeName} added to project`);
     
      // Reset form
      setShowAddTeam(false);
      setTeamForm({
        employeeId: '',
        employeeName: '',
        designation: '',
        hourlyRate: '',
        estimatedHours: '',
      });
      setErrors({});
    } catch (err: any) {
      console.error('❌ Error adding team member:', err);
      toast.error(err?.message || 'Failed to add team member');
    }
  };
 
  /* ================= DELETE TEAM MEMBER ================= */
  const removeMember = async (id: number, name: string) => {
    if (!window.confirm(`Remove ${name} from this project?`)) return;
 
    try {
      console.log('🗑️ Deleting team member:', id);
      await dispatch(deleteTeamMember(id)).unwrap();
      console.log('✅ Team member removed');
      toast.success(`${name} removed from project`);
    } catch (err: any) {
      console.error('❌ Delete error:', err);
      toast.error(err?.message || 'Delete failed');
    }
  };
 
  /* ================= PROJECT COST ================= */
  const projectTotalCost = useMemo(() => {
    return projTeam.reduce((sum, m) => sum + (Number(m.totalCost) || 0), 0);
  }, [projTeam]);
 
  /* ================= RESET FORM ================= */
  const resetForm = () => {
    setShowAddTeam(false);
    setTeamForm({
      employeeId: '',
      employeeName: '',
      designation: '',
      hourlyRate: '',
      estimatedHours: '',
    });
    setErrors({});
  };
 
  /* ================= DEBUG BUTTON ================= */
  const handleDebug = () => {
    console.log('='.repeat(70));
    console.log('🐛 DEBUG INFORMATION');
    console.log('='.repeat(70));
    console.log('Project:', project);
    console.log('Redux members:', members);
    console.log('projTeam:', projTeam);
    console.log('projTeam length:', projTeam.length);
    console.log('Available employees:', availableEmployees);
    console.log('Available count:', availableEmployees.length);
    console.log('All employees:', employees);
    console.log('='.repeat(70));
  };
 
  return (
    <div>
      {/* DEBUG BUTTON - Remove this in production */}
     
 
      {/* COST CARD */}
      <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-4">
        <p className="text-sm text-green-700">Project Team Cost</p>
        <p className="text-2xl font-bold text-green-800">
          ₹{projectTotalCost.toLocaleString()}
        </p>
        <p className="text-sm text-green-700">Members: {projTeam.length}</p>
      </div>
 
      {/* ADD BUTTON */}
      <button
        onClick={() => setShowAddTeam(true)}
        disabled={availableEmployees.length === 0}
        className="mb-4 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Plus className="w-4 h-4" />
        Add Team Member
        {availableEmployees.length > 0 && (
          <span className="ml-1 text-xs bg-blue-500 px-2 py-0.5 rounded-full">
            {availableEmployees.length} available
          </span>
        )}
      </button>
 
      {/* NO AVAILABLE EMPLOYEES MESSAGE */}
      {availableEmployees.length === 0 && projTeam.length > 0 && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">
          ℹ️ All {employees.length} employees have been added to this project
        </div>
      )}
 
      {/* ADD FORM */}
      {showAddTeam && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
          <h4 className="font-semibold mb-3">Add Team Member</h4>
 
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* EMPLOYEE DROPDOWN */}
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Select Employee ({availableEmployees.length} available)
              </label>
              <select
                value={teamForm.employeeId}
                onChange={(e) => {
                  const empId = e.target.value;
                  console.log('Selected employee ID:', empId);
                 
                  const emp = availableEmployees.find(
                    (x) => String(x.employeeId) === String(empId)
                  );
                 
                  console.log('Found employee:', emp);
                 
                  if (!emp) {
                    setTeamForm({
                      ...teamForm,
                      employeeId: '',
                      employeeName: '',
                      designation: '',
                    });
                    return;
                  }
                 
                  setTeamForm({
                    ...teamForm,
                    employeeId: String(emp.employeeId),
                    employeeName: emp.employeeName,
                    designation: emp.designation,
                  });
                 
                  if (errors.employeeId) {
                    setErrors({ ...errors, employeeId: '' });
                  }
                }}
                className={`px-3 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.employeeId ? 'border-red-500' : ''
                }`}
              >
                <option value="">-- Select Employee --</option>
                {availableEmployees.length === 0 ? (
                  <option disabled>No employees available</option>
                ) : (
                  availableEmployees.map((e) => (
                    <option key={e.employeeId} value={e.employeeId}>
                      {e.employeeName} - {e.designation}
                    </option>
                  ))
                )}
              </select>
              {errors.employeeId && (
                <p className="text-red-500 text-xs mt-1">{errors.employeeId}</p>
              )}
            </div>
 
            <div>
              <label className="block text-xs text-gray-600 mb-1">Designation</label>
              <input
                disabled
                value={teamForm.designation}
                placeholder="Auto-filled"
                className="px-3 py-2 border rounded-lg w-full bg-gray-100 cursor-not-allowed"
              />
            </div>
 
            <div>
              <label className="block text-xs text-gray-600 mb-1">Hourly Rate (₹) *</label>
              <input
                type="number"
                placeholder="Enter hourly rate"
                value={teamForm.hourlyRate}
                onChange={(e) => {
                  setTeamForm({ ...teamForm, hourlyRate: e.target.value });
                  if (errors.hourlyRate) {
                    setErrors({ ...errors, hourlyRate: '' });
                  }
                }}
                className={`px-3 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.hourlyRate ? 'border-red-500' : ''
                }`}
                min="0"
                step="0.01"
              />
              {errors.hourlyRate && (
                <p className="text-red-500 text-xs mt-1">{errors.hourlyRate}</p>
              )}
            </div>
 
            <div>
              <label className="block text-xs text-gray-600 mb-1">Estimated Hours *</label>
              <input
                type="number"
                placeholder="Enter estimated hours"
                value={teamForm.estimatedHours}
                onChange={(e) => {
                  setTeamForm({ ...teamForm, estimatedHours: e.target.value });
                  if (errors.estimatedHours) {
                    setErrors({ ...errors, estimatedHours: '' });
                  }
                }}
                className={`px-3 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.estimatedHours ? 'border-red-500' : ''
                }`}
                min="0"
                step="0.5"
              />
              {errors.estimatedHours && (
                <p className="text-red-500 text-xs mt-1">{errors.estimatedHours}</p>
              )}
            </div>
          </div>
 
          {/* Total Cost Preview */}
          {teamForm.hourlyRate && teamForm.estimatedHours && (
            <div className="mt-3 p-2 bg-blue-50 rounded text-sm">
              <strong>Total Cost:</strong> ₹
              {(Number(teamForm.hourlyRate) * Number(teamForm.estimatedHours)).toLocaleString()}
            </div>
          )}
 
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleAddTeam}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Adding...' : 'Add Member'}
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
 
      {/* TEAM LIST */}
      {loading ? (
        <div className="flex items-center justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="ml-3 text-gray-500">Loading team members...</p>
        </div>
      ) : projTeam.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <Users className="w-16 h-16 mx-auto mb-3 opacity-50" />
          <p className="font-medium">No team members added yet</p>
          <p className="text-xs mt-2">
            Click "Add Team Member" to assign employees to this project
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {projTeam.map((tm) => (
            <div
              key={tm.projectTeamMemberId}
              className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-gray-900">{tm.employeeName}</h4>
                  <p className="text-sm text-gray-600">{tm.designation}</p>
                  <p className="text-sm mt-1 text-gray-700">
                    ₹{tm.hourlyRate} × {tm.estimatedHours}h ={' '}
                    <span className="font-semibold text-green-600">
                      ₹{Number(tm.totalCost).toLocaleString()}
                    </span>
                  </p>
                </div>
 
                <button
                  onClick={() => removeMember(tm.projectTeamMemberId, tm.employeeName)}
                  disabled={loading}
                  className="text-red-600 hover:bg-red-50 p-2 rounded transition-colors disabled:opacity-50"
                  title={`Remove ${tm.employeeName}`}
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
 
export default TeamTab;