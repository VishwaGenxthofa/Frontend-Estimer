import React, { useEffect } from 'react';
import { Users, FileText } from 'lucide-react';
import type { Project, Client } from '../../types/Index';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch ,RootState} from '../../redux/slices/store';
import { fetchProjects } from '../../redux/slices/projectSlice';

interface ProjectCardProps {
  project: Project;
  client: Client | undefined;
  teamCount: number;
  milestoneCount: number;
  onManage: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  client,
  teamCount,
  milestoneCount,
  onManage,
}) => {
  
  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">{project.projectName}</h3>
          <p className="text-xs text-gray-500">{project.projectCode}</p>
        </div>
        {/* <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-600 rounded-full">
          {project.status}
        </span> */}
      </div>

      <div className="space-y-2 text-sm mb-4">
        <p><span className="text-gray-600">Client:</span> <span className="font-medium">{client?.companyName}</span></p>
        <p><span className="text-gray-600">Start:</span> {project.startDate}</p>
        <p><span className="text-gray-600">Payment Terms:</span> {project.paymentTerms} days</p>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className={`p-2 rounded text-center ${teamCount > 0 ? 'bg-green-50' : 'bg-gray-50'}`}>
          <Users className="w-4 h-4 mx-auto mb-1" />
          <p className="text-xs">{teamCount} Team Members</p>
        </div>
        <div className={`p-2 rounded text-center ${milestoneCount > 0 ? 'bg-green-50' : 'bg-gray-50'}`}>
          <FileText className="w-4 h-4 mx-auto mb-1" />
          <p className="text-xs">{milestoneCount} Milestones</p>
        </div>
      </div>

      <button
        onClick={onManage}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
      >
        Manage Project
      </button>
    </div>
  );
};

export default ProjectCard;