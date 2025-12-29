// src/components/projects/ProjectsTab.tsx
import React, { useState,useEffect } from 'react';
import { Plus } from 'lucide-react';
import ProjectCard from './ProjectsCard';
import CreateProjectModal from './CreateProjectModal';
import ProjectManagementModal from './ProjectManagementModal/ProjectManagementModal';
import Modal from '../common/Modal';
import type { Project, Client, TeamMember, Milestone } from '../../types/Index';
import { useDispatch, useSelector } from 'react-redux';
import type{ AppDispatch ,RootState} from '../../redux/slices/store';
import { fetchProjects } from '../../redux/slices/projectSlice';

interface ProjectsTabProps {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  clients: Client[];
  isAdmin: boolean;
  teamMembers: TeamMember[];
  setTeamMembers: React.Dispatch<React.SetStateAction<TeamMember[]>>;
  milestones: Milestone[];
  setMilestones: React.Dispatch<React.SetStateAction<Milestone[]>>;
}

const ProjectsTab: React.FC<ProjectsTabProps> = ({
  // projects,
  setProjects,
  clients,
  isAdmin,
  teamMembers,
  setTeamMembers,
  milestones,
  setMilestones,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [viewProject, setViewProject] = useState<Project | null>(null);
  const dispatch=useDispatch<AppDispatch>()
  const projects=useSelector((state:RootState)=>state.project.projects)
  useEffect(()=>{
    dispatch(fetchProjects({ page: 2, pageSize: 20 }))
  },[dispatch])
  
  return (
    <div className='p-4 overflow-y-auto max-h-screen"'>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Projects</h2>
        {isAdmin && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            <span>Create Project</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj) => {
          const client = clients.find((c) => c.clientId === proj.clientId);
          const teamCount = teamMembers.filter((tm) => tm.project_id === proj.projectId).length;
          const milestoneCount = milestones.filter((m) => m.project_id === proj.projectId).length;

          return (
            <ProjectCard
              key={proj.projectId}
              project={proj}
              client={client}
              teamCount={teamCount}
              milestoneCount={milestoneCount}
              onManage={() => setViewProject(proj)}
            />
          );
        })}
      </div>

      {showModal && (
        <CreateProjectModal
          onClose={() => setShowModal(false)}
          projects={projects}
          setProjects={setProjects}
          clients={clients}
        />
      )}

      {viewProject && (
        <ProjectManagementModal
          project={viewProject}
          teamMembers={teamMembers}
          setTeamMembers={setTeamMembers}
          milestones={milestones}
          setMilestones={setMilestones}
          onClose={() => setViewProject(null)}
          isAdmin={isAdmin}
        />
      )}
    </div>
  );
};

export default ProjectsTab;