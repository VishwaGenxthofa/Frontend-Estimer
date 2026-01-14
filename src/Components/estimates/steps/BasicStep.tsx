// steps/BasicStep.tsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch,RootState } from '../../../redux/store';
import { fetchProjects } from '../../../redux/projectSlice';
interface Props {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const BasicStep: React.FC<Props> = ({ formData, setFormData }) => {
  const dispatch=useDispatch<AppDispatch>()
  const { taxconfig } = useSelector((state: RootState) => state.estimatestaxconfig);
 const { projects } = useSelector((state: RootState) => state.project);
 useEffect(()=>{
    dispatch(fetchProjects({ page: 2, pageSize: 20 }))  
 },[])
  return (
    <div className="space-y-4">
      <div>
  <label className="block text-sm font-semibold mb-2"> Project Name *</label>
        <select
          value={formData.projectId}
          onChange={(e) =>
            setFormData({ ...formData, projectId: Number(e.target.value) })
          }
          className="w-full px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select Project</option>

          {projects.map((project) => (
            <option key={project.projectId} value={project.projectId}>
              {project.projectName}
            </option>
          ))}
        </select>
      </div>


      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Version</label>
          <input
            type="number"
            step="0.1"
            value={formData.versionNumber}
            onChange={(e) => setFormData({ ...formData, versionNumber: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Profit %</label>
          <input
            type="number"
            value={formData.profitPercentage}
            onChange={(e) => setFormData({ ...formData, profitPercentage: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Tax Config *</label>
        <select
          value={formData.taxId}
          onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          {taxconfig.filter((t: any) => t.isActive).map((tax: any) => (
            <option key={tax.taxConfigId} value={tax.taxConfigId}>
              {tax.taxName} ({tax.taxRate}%)
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Remarks</label>
        <textarea
          value={formData.clientRemarks}
          onChange={(e) => setFormData({ ...formData, clientRemarks: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder="Client remarks or notes"
        />
      </div>
    </div>
  );
};

export default BasicStep;