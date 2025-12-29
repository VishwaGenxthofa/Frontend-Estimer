import React, { useEffect } from 'react';
import { Users, FileText } from 'lucide-react';
import type { Project, Client } from '../../types/Index';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch ,RootState} from '../../redux/slices/store';
import { fetchProjects } from '../../redux/slices/projectSlice';
import { FaCalendarAlt, FaUserClock } from "react-icons/fa";
import { Toaster } from 'react-hot-toast';
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
  const formatDate = (dateString?: string) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

  return (
    // <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
    //   <div className="flex justify-between items-start mb-4">
    //     <div>
    //       <h3 className="text-lg font-semibold">{project.projectName}</h3>
    //       <p className="text-xs text-gray-500">{project.projectCode}</p>
    //     </div>
    //     {/* <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-600 rounded-full">
    //       {project.status}
    //     </span> */}
    //   </div>

    //   <div className="space-y-2 text-sm mb-4">
    //     <p><span className="text-gray-600">Client:</span> <span className="font-medium">{client?.companyName}</span></p>
    //     <p><span className="text-gray-600">Start:</span> {project.startDate}</p>
    //     <p><span className="text-gray-600">Payment Terms:</span> {project.paymentTerms} days</p>
    //   </div>

    //   {/* <div className="grid grid-cols-2 gap-2 mb-4">
    //     <div className={`p-2 rounded text-center ${teamCount > 0 ? 'bg-green-50' : 'bg-gray-50'}`}>
    //       <Users className="w-4 h-4 mx-auto mb-1" />
    //       <p className="text-xs">{teamCount} Team Members</p>
    //     </div>
    //     <div className={`p-2 rounded text-center ${milestoneCount > 0 ? 'bg-green-50' : 'bg-gray-50'}`}>
    //       <FileText className="w-4 h-4 mx-auto mb-1" />
    //       <p className="text-xs">{milestoneCount} Milestones</p>
    //     </div>
    //   </div> */}

    //   <button
    //     onClick={onManage}
    //     className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
    //   >
    //     Manage Project
    //   </button>
    // </div>
    <>
    <div className=''>
      <Toaster position="top-right" />
   <div className="
  flex flex-col md:flex-row 
  w-full max-w-225
  bg-white rounded-2xl shadow-lg overflow-hidden
">
  {/* Left Gradient Section */}
  <div
    className="  w-full md:w-55 h-25 md:h-auto  bg-linear-to-br from-blue-500 to-blue-200   flex items-center justify-center"
  >
    <span className="text-white text-2xl md:text-3xl font-bold">
      {project.projectCode}
    </span>
  </div>

  {/* Right Content */}
  <div className="flex-1 p-4 md:p-6">
    <h2 className="text-xl md:text-2xl font-bold text-gray-800">
      {project.projectName}
    </h2>
      <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-600 rounded-full">
          {project.projectStatusId}
        </span>
    <span
      className="
        inline-block mt-2 mb-4
        px-3 py-1 md:px-4
        text-xs md:text-sm
        rounded-full bg-blue-50 text-blue-600 font-medium
      "
    >
      Client: {project.clientId}
    </span>

    {/* Details */}
    <div className="space-y-1 md:space-y-2 text-gray-600 text-sm">
      <p>
        <span className="font-medium text-gray-700">Start:</span>{" "}
          {formatDate(project.startDate)}
      </p>
      <p>
        <span className="font-medium text-gray-700">Due:</span>{" "}
        {formatDate(project.plannedEndDate)}
      </p>
      <p>
        <span className="font-medium text-gray-700">Payment:</span>{" "}
        {project.paymentTerms} Days
      </p>
    </div>

    {/* Button */}
    <div className="mt-5 md:mt-6">
      <button
        onClick={onManage}
        className="
          w-full md:w-auto
          px-6 py-2
          rounded-lg bg-blue-500 text-white font-medium
          hover:bg-blue-600 transition
        "
      >
        Manage Project →
      </button>
    </div>
  </div>
</div>
</div>
</>

  );
};

export default ProjectCard;