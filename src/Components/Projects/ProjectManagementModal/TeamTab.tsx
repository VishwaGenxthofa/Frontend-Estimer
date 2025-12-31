import React, { useEffect, useState, useMemo } from 'react';
import { Plus, Trash2, Users } from 'lucide-react';
import type { Project, TeamMember } from '../../../types/Index';
import {
  fetchTeamMembersByProject,
  createTeamMember,
  deleteTeamMember,
} from '../../../redux/teamMemberSlice';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../redux/store';
import { toast } from 'react-hot-toast';

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
  const { members, loading } = useSelector((state: RootState) => state.teamMember);

  const [showAddTeam, setShowAddTeam] = useState(false);
  const [teamForm, setTeamForm] = useState({
    employeeId: '',
    employeeName: '',
    designation: '',
    hourlyRate: '',
    estimatedHours: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const projectId = project.projectId;

  /* ================= FETCH TEAM MEMBERS ================= */
  useEffect(() => {
    if (!projectId) return;
    dispatch(fetchTeamMembersByProject(Number(projectId)));
  }, [dispatch, projectId]);

  /* ================= SAFE TEAM MEMBERS ================= */
  const projTeam = useMemo(() => {
    if (!members) return [];
    return Array.isArray(members) ? members : [members];
  }, [members]);

  /* ================= VALIDATION ================= */
  const validate = () => {
    const e: Record<string, string> = {};

    if (!teamForm.employeeId) e.employeeId = 'Employee required';
    if (!teamForm.hourlyRate) e.hourlyRate = 'Hourly rate required';
    if (!teamForm.estimatedHours) e.estimatedHours = 'Estimated hours required';

    const exists = projTeam.some((tm) => tm.employeeId === Number(teamForm.employeeId));
    if (exists) e.employeeId = 'Employee already added';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ================= ADD TEAM MEMBER ================= */
  const handleAddTeam = async () => {
    if (!validate()) return;

    if (!projectId) {
      toast.error('Project not selected');
      return;
    }

    try {
      await dispatch(
        createTeamMember({
          projectId,
          employeeId: Number(teamForm.employeeId),
          employeeName: teamForm.employeeName,
          designation: teamForm.designation,
          hourlyRate: Number(teamForm.hourlyRate),
          estimatedHours: Number(teamForm.estimatedHours),
          totalCost: Number(teamForm.hourlyRate) * Number(teamForm.estimatedHours),
        })
      ).unwrap();

      toast.success('Team member added successfully 🎉');
      dispatch(fetchTeamMembersByProject(projectId));

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
      toast.error(err?.message || 'Failed to add team member. Try again');
    }
  };

  /* ================= DELETE TEAM MEMBER ================= */
  const removeMember = (id: number) => {
    if (!projectId) return;

    if (confirm('Remove this team member?')) {
      dispatch(deleteTeamMember(id))
        .unwrap()
        .then(() => {
          toast.success('Team member removed');
          dispatch(fetchTeamMembersByProject(projectId));
        })
        .catch(() => {
          toast.error('Failed to remove team member');
        });
    }
  };

  /* ================= PROJECT COST ================= */
  const projectTotalCost = projTeam.reduce((sum, m) => sum + m.totalCost, 0);

  return (
    <div>
      {/* PROJECT COST */}
      <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-4">
        <p className="text-sm text-green-700">Project Team Cost</p>
        <p className="text-2xl font-bold text-green-800">
          ₹{projectTotalCost.toLocaleString()}
        </p>
      </div>

      {/* ADD BUTTON */}
      <button
        onClick={() => setShowAddTeam(true)}
        className="mb-4 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        <Plus className="w-4 h-4" /> Add Team Member
      </button>

      {/* ADD FORM */}
      {showAddTeam && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h4 className="font-semibold mb-3">Add Team Member</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">
                EmployeeName <span className="text-red-500">*</span>
              </label>
              <select
                value={teamForm.employeeId}
                onChange={(e) => {
                  const emp = employees.find((x) => x.employeeId === Number(e.target.value));
                  if (!emp) return;
                  setTeamForm({
                    ...teamForm,
                    employeeId: emp.employeeId.toString(),
                    employeeName: emp.employeeName,
                    designation: emp.designation,
                  });
                }}
                className="px-3 py-2 border rounded-lg w-full"
              >
                <option value="">Select Employee</option>
                {employees.map((e) => (
                  <option key={e.employeeId} value={e.employeeId}>
                    {e.employeeName}
                  </option>
                ))}
              </select>
              {errors.employeeId && (
                <p className="text-red-500 text-xs mt-1">{errors.employeeId}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Designation <span className="text-red-500">*</span>
              </label>
              <input
                disabled
                value={teamForm.designation}
                placeholder="Designation"
                className="px-3 py-2 border rounded-lg bg-gray-100 w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Hourly Rate <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                placeholder="Hourly Rate"
                value={teamForm.hourlyRate}
                onChange={(e) => setTeamForm({ ...teamForm, hourlyRate: e.target.value })}
                className="px-3 py-2 border rounded-lg w-full"
              />
              {errors.hourlyRate && (
                <p className="text-red-500 text-xs mt-1">{errors.hourlyRate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Hours <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                placeholder="Estimated Hours"
                value={teamForm.estimatedHours}
                onChange={(e) =>
                  setTeamForm({ ...teamForm, estimatedHours: e.target.value })
                }
                className="px-3 py-2 border rounded-lg w-full"
              />
              {errors.estimatedHours && (
                <p className="text-red-500 text-xs mt-1">{errors.estimatedHours}</p>
              )}
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={handleAddTeam}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Add
            </button>
            <button
              onClick={() => setShowAddTeam(false)}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* TEAM MEMBER LIST */}
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : projTeam.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <Users className="w-16 h-16 mx-auto mb-3 opacity-50" />
          <p>No team members added yet</p>
        </div>
      ) : (
        projTeam.map((tm: TeamMember) => (
          <div
            key={tm.projectTeamMemberId}
            className="bg-white border rounded-lg p-5 shadow-sm mb-3"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-lg font-semibold">{tm.employeeName}</h4>
                <p className="text-sm text-gray-600">{tm.designation}</p>

                <div className="grid grid-cols-3 gap-6 mt-3 text-sm">
                  <div>
                    <p className="text-gray-600">Rate</p>
                    <p className="font-semibold">₹{tm.hourlyRate}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Hours</p>
                    <p className="font-semibold">{tm.estimatedHours}h</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Cost</p>
                    <p className="font-semibold text-green-600">
                      ₹{tm.totalCost.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => removeMember(tm.projectTeamMemberId)}
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

export default TeamTab;
