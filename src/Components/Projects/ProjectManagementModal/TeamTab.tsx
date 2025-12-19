import React, { useState } from 'react';
import { Plus, Trash2, Users } from 'lucide-react';
import type { TeamMember, Project } from '../../../types';

interface TeamTabProps {
  project: Project;
  teamMembers: TeamMember[];
  setTeamMembers: React.Dispatch<React.SetStateAction<TeamMember[]>>;
}

const TeamTab: React.FC<TeamTabProps> = ({ project, teamMembers, setTeamMembers }) => {
  const [showAddTeam, setShowAddTeam] = useState(false);
  const [teamForm, setTeamForm] = useState({
    employee_name: '',
    role: '',
    hourly_rate: '',
    estimated_hours: '',
    allocation: 100,
  });

  const projTeam = teamMembers.filter((tm) => tm.project_id === project.project_id);

  const handleAddTeam = () => {
    if (!teamForm.employee_name || !teamForm.role) return;

    setTeamMembers([
      ...teamMembers,
      {
        team_id: Math.max(...teamMembers.map((t) => t.team_id), 0) + 1,
        project_id: project.project_id,
        ...teamForm,
        hourly_rate: teamForm.hourly_rate || '0',
        estimated_hours: teamForm.estimated_hours || '0',
        allocation: Number(teamForm.allocation),
      },
    ]);

    setShowAddTeam(false);
    setTeamForm({ employee_name: '', role: '', hourly_rate: '', estimated_hours: '', allocation: 100 });
  };

  const removeTeamMember = (id: number) => {
    if (confirm('Remove this team member?')) {
      setTeamMembers(teamMembers.filter((tm) => tm.team_id !== id));
    }
  };

  return (
    <div>
      <button
        onClick={() => setShowAddTeam(true)}
        className="mb-4 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        <Plus className="w-4 h-4" /> Add Team Member
      </button>

      {showAddTeam && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h4 className="font-semibold mb-3">Add Team Member</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              placeholder="Employee Name"
              value={teamForm.employee_name}
              onChange={(e) => setTeamForm({ ...teamForm, employee_name: e.target.value })}
              className="px-3 py-2 border rounded-lg"
            />
            <input
              placeholder="Role (e.g., Developer)"
              value={teamForm.role}
              onChange={(e) => setTeamForm({ ...teamForm, role: e.target.value })}
              className="px-3 py-2 border rounded-lg"
            />
            <input
              type="number"
              placeholder="Hourly Rate (₹)"
              value={teamForm.hourly_rate}
              onChange={(e) => setTeamForm({ ...teamForm, hourly_rate: e.target.value })}
              className="px-3 py-2 border rounded-lg"
            />
            <input
              type="number"
              placeholder="Estimated Hours"
              value={teamForm.estimated_hours}
              onChange={(e) => setTeamForm({ ...teamForm, estimated_hours: e.target.value })}
              className="px-3 py-2 border rounded-lg"
            />
            <input
              type="number"
              placeholder="Allocation %"
              value={teamForm.allocation}
              onChange={(e) => setTeamForm({ ...teamForm, allocation: Number(e.target.value) })}
              className="px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={handleAddTeam} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Add
            </button>
            <button onClick={() => setShowAddTeam(false)} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {projTeam.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <Users className="w-16 h-16 mx-auto mb-3 opacity-50" />
            <p>No team members added yet</p>
          </div>
        ) : (
          projTeam.map((tm) => (
            <div key={tm.team_id} className="bg-white border rounded-lg p-5 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-lg font-semibold">{tm.employee_name}</h4>
                  <p className="text-sm text-gray-600">{tm.role}</p>
                  <div className="grid grid-cols-3 gap-6 mt-3 text-sm">
                    <div>
                      <p className="text-gray-600">Hourly Rate</p>
                      <p className="font-semibold">₹{tm.hourly_rate}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Est. Hours</p>
                      <p className="font-semibold">{tm.estimated_hours}h</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Total Cost</p>
                      <p className="font-semibold text-green-600">
                        ₹{(Number(tm.hourly_rate) * Number(tm.estimated_hours)).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeTeamMember(tm.team_id)}
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

export default TeamTab;