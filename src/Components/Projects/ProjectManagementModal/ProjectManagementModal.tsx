import React, { useState } from 'react';
import Modal from '../../common/Modal';
import TeamTab from './TeamTab';
import MilestonesTab from './MilestonesTab';
import type { Project, TeamMember, Milestone } from '../../../types';

interface ProjectManagementModalProps {
  project: Project;
  teamMembers: TeamMember[];
  setTeamMembers: React.Dispatch<React.SetStateAction<TeamMember[]>>;
  milestones: Milestone[];
  setMilestones: React.Dispatch<React.SetStateAction<Milestone[]>>;
  onClose: () => void;
  isAdmin: boolean;
}

const ProjectManagementModal: React.FC<ProjectManagementModalProps> = ({
  project,
  teamMembers,
  setTeamMembers,
  milestones,
  setMilestones,
  onClose,
  isAdmin,
}) => {
  const [activeTab, setActiveTab] = useState<'team' | 'milestones'>('team');

  return (
    <Modal onClose={onClose} title={`Manage Project - ${project.project_name}`} wide>
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
            Team Members ({teamMembers.filter((t) => t.project_id === project.project_id).length})
          </button>
          <button
            onClick={() => setActiveTab('milestones')}
            className={`pb-3 px-1 border-b-2 font-medium transition-colors ${
              activeTab === 'milestones'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Milestones ({milestones.filter((m) => m.project_id === project.project_id).length})
          </button>
        </div>
      </div>

      {activeTab === 'team' && (
        <TeamTab project={project} teamMembers={teamMembers} setTeamMembers={setTeamMembers} />
      )}

      {activeTab === 'milestones' && (
        <MilestonesTab project={project} milestones={milestones} setMilestones={setMilestones} />
      )}
    </Modal>
  );
};

export default ProjectManagementModal;