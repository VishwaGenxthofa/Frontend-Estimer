import React, { useEffect } from 'react';
import { Users, FileText } from 'lucide-react';
import type { Project, Client } from '../../types/Index';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../redux//store';
import { fetchProjects } from '../../redux/projectSlice';
import { FaCalendarAlt, FaUserClock } from "react-icons/fa";
import { Toaster } from 'react-hot-toast';
import { fetchTeamMembersByProject } from '../../redux/teamMemberSlice';
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
  // teamCount,
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
  const { members, loading } = useSelector( (state:RootState) => state.teamMember);
  const dispatch=useDispatch<AppDispatch>()
  useEffect(() => {
    if (!project.projectId) return;
  
    dispatch(fetchTeamMembersByProject(project.projectId));
  }, [dispatch, project.projectId]);
  
const projTeam = Array.isArray(members) ? members : [];
const teamCount = projTeam.length;
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
      {/* <div className=''>
        <Toaster position="top-right" />
        <div className="
  flex flex-col md:flex-row w-full max-w-225 bg-blue-200 rounded-2xl shadow-lg overflow-hidden">
          

       
          <div className="flex-1 p-4 md:p-6">
            <div className='flex  justify-between'>
              <h2 className="text-gray-800 text-2xl md:text-3xl font-bold p-1">
                {project.projectCode}
              </h2>
              <div>
                <span
                  style={{ backgroundColor: project.statusColor }}
                  className="px-3 py-1 text-xs font-medium  text-white rounded-full">
                  {project.projectStatus}
                </span>
              </div>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">
              {project.companyName}
            </h2>


           
            <div className=" flex  gap-4 space-y-1 md:space-y-2 text-gray-600 text-sm">
              <p>
                <span className="font-medium text-gray-700">Start:</span>{" "}
                {formatDate(project.startDate)}
              </p>
              <p>
                <span className="font-medium text-gray-700">Due:</span>{" "}
                {formatDate(project.plannedEndDate)}
              </p>

            </div>
            <p className=''>
              <span className="font-medium text-gray-700">Payment:</span>{" "}
              {project.paymentTerms} Days
            </p>
            <div className=" text-gray-700 flex  text-sm font-semibold ">
              Project Manager:{project.projectManager}
            </div>
          
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
                Manage Project
              </button>
            </div>
          </div>
        </div>
      </div> */}
   
      <div className="w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
        {/* Card Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 px-8 pt-8 pb-20 relative overflow-hidden">
          {/* Decorative Circle */}
          <div className="absolute -top-1/2 -right-[10%] w-72 h-72 bg-white/5 rounded-full"></div>
          
          {/* Bottom Border Line */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to from-transparent via-white/20 to-transparent"></div>
          
          {/* Header Content */}
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-5">
              <div className="inline-block text-xs font-semibold text-white/60 tracking-[0.15em] px-3 py-1.5 border-[1.5px] border-white/20 rounded-md bg-white/5">
                {project.projectCode}
              </div>
              <div>
                <span
                  style={{ backgroundColor: project.statusColor }}
                  className="px-3 py-1 text-xs font-medium  text-white rounded-full">
                  {project.projectStatus}
                </span>
              </div>
            </div>
            <h1 className="text-[42px] font-bold text-white tracking-tight leading-none">
               {project.companyName}
            </h1>
          </div>
        </div>

        {/* Card Body */}
        <div className="px-8 py-8 -mt-12 relative z-20">
          {/* Timeline Container */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6">
            <div className="text-[11px] font-bold text-slate-500 tracking-widest uppercase mb-4">
              Project Timeline
            </div>
            <div className="flex justify-between items-center gap-4">
              <div className="flex-1">
                <div className="text-[10px] text-slate-400 tracking-wide uppercase font-semibold mb-1.5">
                   Start Date

                </div>
                <div className="text-base font-bold text-slate-800">
                 {formatDate(project.startDate)}
                </div>
              </div>
              
              <div className="relative mt-4">
                <div className="w-8 h-0.5 bg-gradient-to from-slate-300 to-slate-400 rounded-full"></div>
                <div className="absolute -right-2 -top-2 text-slate-500 text-sm">→</div>
              </div>
              
              <div className="flex-1 text-right">
                <div className="text-[10px] text-slate-400 tracking-wide uppercase font-semibold mb-1.5">
                  Due Date
                </div>
                <div className="text-base font-bold text-slate-800">
                  {formatDate(project.plannedEndDate)}
                </div>
              </div>
            </div>
          </div>
          
          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4 mb-7">
            <div className="bg-white border-[1.5px] border-slate-200 rounded-lg p-4 transition-all duration-300 hover:border-slate-300 hover:translate-x-1 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to from-blue-900 to-slate-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="text-[10px] text-slate-500 tracking-wide uppercase font-bold mb-2">
                Payment Terms
              </div>
              <div className="text-[17px] font-bold text-slate-900">
               {project.paymentTerms}  Days
              </div>
            </div>

            <div className="bg-white border-[1.5px] border-slate-200 rounded-lg p-4 transition-all duration-300 hover:border-slate-300 hover:translate-x-1 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to from-blue-900 to-slate-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="text-[10px] text-slate-500 tracking-wide uppercase font-bold mb-2">
                Project Manager
              </div>
              <div className="text-[17px] font-bold text-slate-900">
              {project.projectManager}
              </div>
            </div>
          </div>
           {/* Team Members and Milestones */}
          <div className="flex justify-between items-center mb-6 px-2">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-sm font-semibold text-slate-700"> {teamCount}  Team Members</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-sm font-semibold text-slate-700">0 Milestones</span>
            </div>
          </div>
          {/* Action Button */}
          <button   onClick={onManage} className="w-full bg-gradient-to-br from-slate-900 to-blue-900 text-white py-4 px-6 rounded-lg text-[15px] font-bold uppercase tracking-[0.1em] relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5  ">
            <div className="absolute inset-0 bg-white/10 rounded-full scale-0 group-hover:scale-150 transition-transform duration-500 origin-center"></div>
            <span className="relative z-10">Manage Project</span>
          </button>
        </div>
      </div>
    
    </>

  );
};

export default ProjectCard;