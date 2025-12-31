import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Trash2, Users } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';

import type { Project, TeamMember } from '../../../types/Index';
import type { AppDispatch, RootState } from '../../../redux/store';

import {
  fetchTeamMembers,
  createTeamMember,
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

  /* ================= FETCH ALL TEAM MEMBERS ================= */
  useEffect(() => {
    dispatch(fetchTeamMembers()); // ✅ ONLY ONE API
  }, [dispatch]);

  /* ================= FILTER PROJECT TEAM ================= */
const projTeam: TeamMember[] = useMemo(() => {
  if (!Array.isArray(members) || !project?.projectId) return [];

  return members.filter(
    (m) => Number(m.projectId) === Number(project.projectId)
  );
}, [members, project.projectId]);

console.log(projTeam)
  /* ================= VALIDATION ================= */
  const validate = () => {
    const e: Record<string, string> = {};

    if (!teamForm.employeeId) e.employeeId = 'Employee required';
    if (!teamForm.hourlyRate) e.hourlyRate = 'Hourly rate required';
    if (!teamForm.estimatedHours) e.estimatedHours = 'Estimated hours required';

    const exists = projTeam.some(
      (m) => m.employeeId === Number(teamForm.employeeId)
    );
    if (exists) e.employeeId = 'Employee already added';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ================= ADD TEAM MEMBER ================= */
  const handleAddTeam = async () => {
    if (!validate()) return;

    try {
      await dispatch(
        createTeamMember({
          projectId: project.projectId,
          employeeId: Number(teamForm.employeeId),
          employeeName: teamForm.employeeName,
          designation: teamForm.designation,
          hourlyRate: Number(teamForm.hourlyRate),
          estimatedHours: Number(teamForm.estimatedHours),
          totalCost:
            Number(teamForm.hourlyRate) *
            Number(teamForm.estimatedHours),
        })
      ).unwrap();

      toast.success('Team member added');
      dispatch(fetchTeamMembers());

      setShowAddTeam(false);
      setTeamForm({
        employeeId: '',
        employeeName: '',
        designation: '',
        hourlyRate: '',
        estimatedHours: '',
      });
      setErrors({});
    } catch {
      toast.error('Failed to add team member');
    }
  };

  /* ================= DELETE TEAM MEMBER ================= */
  const removeMember = async (id: number) => {
    if (!confirm('Remove this team member?')) return;

    try {
      await dispatch(deleteTeamMember(id)).unwrap();
      toast.success('Team member removed');
      dispatch(fetchTeamMembers());
    } catch {
      toast.error('Delete failed');
    }
  };

  /* ================= PROJECT COST ================= */
  const projectTotalCost = projTeam.reduce(
    (sum, m) => sum + m.totalCost,
    0
  );

  return (
    <div>
      {/* COST CARD */}
      <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-4">
        <p className="text-sm text-green-700">Project Team Cost</p>
        <p className="text-2xl font-bold text-green-800">
          ₹{projectTotalCost.toLocaleString()}
        </p>
        <p className="text-sm text-green-700">
          Members: {projTeam.length}
        </p>
      </div>

      {/* ADD BUTTON */}
      <button
        onClick={() => setShowAddTeam(true)}
        className="mb-4 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        <Plus className="w-4 h-4" /> Add Team Member
      </button>

      {/* ADD FORM */}
      {showAddTeam && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h4 className="font-semibold mb-3">Add Team Member</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <select
              value={teamForm.employeeId}
              onChange={(e) => {
                const emp = employees.find(
                  (x) => x.employeeId === Number(e.target.value)
                );
                if (!emp) return;
                setTeamForm({
                  ...teamForm,
                  employeeId: emp.employeeId.toString(),
                  employeeName: emp.employeeName,
                  designation: emp.designation,
                });
              }}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="">Select Employee</option>
              {employees.map((e) => (
                <option key={e.employeeId} value={e.employeeId}>
                  {e.employeeName}
                </option>
              ))}
            </select>

            <input
              disabled
              value={teamForm.designation}
              className="px-3 py-2 border rounded-lg bg-gray-100"
            />

            <input
              type="number"
              placeholder="Hourly Rate"
              value={teamForm.hourlyRate}
              onChange={(e) =>
                setTeamForm({ ...teamForm, hourlyRate: e.target.value })
              }
              className="px-3 py-2 border rounded-lg"
            />

            <input
              type="number"
              placeholder="Estimated Hours"
              value={teamForm.estimatedHours}
              onChange={(e) =>
                setTeamForm({ ...teamForm, estimatedHours: e.target.value })
              }
              className="px-3 py-2 border rounded-lg"
            />
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

      {/* TEAM LIST */}
      {loading ? (
        <p>Loading...</p>
      ) : projTeam.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <Users className="w-16 h-16 mx-auto mb-3 opacity-50" />
          <p>No team members added</p>
        </div>
      ) : (
        projTeam.map((tm) => (
          <div
            key={tm.projectTeamMemberId}
            className="bg-white border rounded-lg p-4 mb-3"
          >
            <div className="flex justify-between">
              <div>
                <h4 className="font-semibold">{tm.employeeName}</h4>
                <p className="text-sm text-gray-600">{tm.designation}</p>
                <p className="text-sm">
                  ₹{tm.hourlyRate} × {tm.estimatedHours}h ={' '}
                  <span className="font-semibold text-green-600">
                    ₹{tm.totalCost}
                  </span>
                </p>
              </div>

              <button
                onClick={() => removeMember(tm.projectTeamMemberId)}
                className="text-red-600"
              >
                <Trash2 />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TeamTab;
