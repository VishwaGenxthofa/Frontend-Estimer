import React, { useState, useEffect } from 'react';
import Modal from '../../common/Modal';
import TeamTab from './TeamTab';
import MilestonesTab from './MilestonesTab';
import type { Project, TeamMember, Milestone } from '../../../types/Index';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../redux/store';
import { fetchTeamMembersByProject } from '../../../redux/teamMemberSlice';
import { fetchMilestonesByProject } from '../../../redux/milestoneSlice';
 
interface ProjectManagementModalProps {
  project: Project;
  onClose: () => void;
  isAdmin: boolean;
}
 
const ProjectManagementModal: React.FC<ProjectManagementModalProps> = ({
  project,
  onClose,
  isAdmin,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { members } = useSelector((state: RootState) => state.teamMember);
  const { milestones } = useSelector((state: RootState) => state.milestone);
 
  const [activeTab, setActiveTab] = useState<'team' | 'milestones'>('team');
 
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [projectMilestones, setProjectMilestones] = useState<Milestone[]>([]);
 
  /* ================= FETCH DATA WHEN MODAL OPENS ================= */
  useEffect(() => {
    if (!project?.projectId) return;
 
    dispatch(fetchTeamMembersByProject(project.projectId));
    dispatch(fetchMilestonesByProject(project.projectId));
  }, [dispatch, project?.projectId]);
 
  /* ================= UPDATE LOCAL STATE WHEN REDUX CHANGES ================= */
  useEffect(() => {
    if (!project?.projectId) return;
 
    const projTeam = members.filter((m) => m.projectId === project.projectId);
    setTeamMembers(projTeam);
  }, [members, project.projectId]);
 
  useEffect(() => {
    if (!project?.projectId) return;
 
    const projMile = milestones.filter((m) => m.ProjectId === project.projectId);
    setProjectMilestones(projMile);
  }, [milestones, project.projectId]);
 
  return (
    <Modal onClose={onClose} title={`Manage Project - ${project.projectName}`} wide>
      {/* TAB BUTTONS */}
      <div className="border-b mb-6">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab('team')}
            className={`pb-3 px-1 border-b-2 font-medium transition-colors ${
              activeTab === 'team'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Team Members ({teamMembers.length})
          </button>
          <button
            onClick={() => setActiveTab('milestones')}
            className={`pb-3 px-1 border-b-2 font-medium transition-colors ${
              activeTab === 'milestones'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Milestones ({projectMilestones.length})
          </button>
        </div>
      </div>
 
      {/* TABS CONTENT */}
      {activeTab === 'team' && (
        <TeamTab project={project} teamMembers={teamMembers} setTeamMembers={setTeamMembers} />
      )}
 
      {activeTab === 'milestones' && (
        <MilestonesTab
          project={project}
          milestones={projectMilestones}
          setMilestones={setProjectMilestones}
        />
      )}
    </Modal>
  );
};
 
export default ProjectManagementModal;