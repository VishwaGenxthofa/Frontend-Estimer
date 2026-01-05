import React, { useState,useEffect } from 'react';
import Modal from '../common/Modal';
import type { Project, Client } from '../../types/Index';
import { Plus,Check,Trash2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch,RootState } from '../../redux/store';
import toast from 'react-hot-toast';
import {
  fetchProjectStatuses,
  createProjectStatus,
  deleteProjectStatus,
} from '../../redux/projectStatusSlice';
import { fetchEmployees } from '../../redux/employeesSlice';
import { createProject} from '../../redux/projectSlice';
interface CreateProjectModalProps {
  onClose: () => void;
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  clients: Client[];
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  onClose,
   projects,
  setProjects,
  clients,
}) => {
  const [showAddStatus, setShowAddStatus] = useState(false);
   const dispatch = useDispatch<AppDispatch>();
  
const { statuses, loading } = useSelector(
  (state: RootState) => state.projectStatus);
const [errors, setErrors] = useState<{
  projectName?: string;
  clientId?: string;
  projectManagerId?: string;
  projectStatusId?: string;
  startDate?: string;
  plannedEndDate?: string;
  paymentTerms?: string;
}>({});
const validateForm = () => {
  const newErrors: typeof errors = {};

  if (!form.projectName?.trim()) newErrors.projectName = 'Project Name is required';
  if (!form.clientId) newErrors.clientId = 'Client is required';
  if (!form.projectManagerId) newErrors.projectManagerId = 'Project Manager is required';
  if (!form.projectStatusId) newErrors.projectStatusId = 'Project Status is required';
  if (!form.startDate) newErrors.startDate = 'Start Date is required';
  if (!form.plannedEndDate) newErrors.plannedEndDate = 'Planned End Date is required';
  if (!form.paymentTerms || form.paymentTerms < 0)
    newErrors.paymentTerms = 'Payment Terms must be a positive number';

  setErrors(newErrors);

  // Return true if no errors
  return Object.keys(newErrors).length === 0;
};

  const [form, setForm] = useState({
   projectName: '',
   clientId: '',
    projectManagerId: '',
    projectStatusId: '',
    startDate: '',
    plannedEndDate: '',
    paymentTerms: 0,
     finalBillingAmount:0,
      companyName:'',
       projectStatus:'',
       statusColor:'',
       projectManager:'',
  });

  

const handleSubmit = async () => {
  if (!validateForm()) {
    toast.error("Please fix validation errors");
    return;
  }

  const payload: Project = {
    projectName: form.projectName,
    clientId: Number(form.clientId),
    projectManagerId: Number(form.projectManagerId),
    projectStatusId: Number(form.projectStatusId),
    startDate: form.startDate,
    plannedEndDate: form.plannedEndDate,
    paymentTerms: Number(form.paymentTerms),
    finalBillingAmount: Number(form.finalBillingAmount) || 0,
    companyName:form.companyName,
     projectStatus:form.projectStatus,
     statusColor:form.statusColor,
     projectManager:form. projectManager,
  };

  try {
    const action = await dispatch(createProject(payload));

    if (createProject.fulfilled.match(action)) {
      toast.success("Project created successfully ");

      setForm({
        projectName: "",
        clientId: "",
        projectManagerId: "",
        projectStatusId: "",
        startDate: "",
        plannedEndDate: "",
        paymentTerms: 0,
        finalBillingAmount: 0,
         companyName:"",
          projectStatus:"",
          statusColor:"",
          projectManager:"",
      });

      setErrors({});
      onClose();
    } else {
      const errorMsg =
        (action.payload as string) || "Failed to create project";
      toast.error(errorMsg);
      setErrors({ projectName: errorMsg });
    }
  } catch (error) {
    toast.error("Something went wrong ");
    setErrors({ projectName: "Something went wrong" });
  }
};

const [newStatus, setNewStatus] = useState({
    statusName: '',
    description: '',
    displayOrder: '',
    statusColor: '#3b82f6'
  });
 useEffect(() => {
    dispatch(fetchProjectStatuses());
     dispatch(fetchEmployees());
  },[dispatch])
  // Mock data
  // const [clients] = useState([
  //   { id: 1, name: 'Acme Corp' },
  //   { id: 2, name: 'Tech Solutions' },
  //   { id: 3, name: 'Global Industries' }
  // ]);

  
 const selectProjectManagers = (state: RootState) =>
  state.employees.employees.filter(emp =>
    emp.designation.includes('Project Manager')
  );
  const projectManagers = useSelector(selectProjectManagers);
  // const [projectStatuses, setProjectStatuses] = useState([
  //   { id: 1, statusName: 'Planning', statusColor: '#3b82f6' },
  //   { id: 2, statusName: 'In Progress', statusColor: '#f59e0b' },
  //   { id: 3, statusName: 'On Hold', statusColor: '#ef4444' },
  //   { id: 4, statusName: 'Completed', statusColor: '#10b981' }
  // ]);

  const handleInputChange = (e:any) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleNewStatusChange = (e:any) => {
    const { name, value } = e.target;
    setNewStatus(prev => ({ ...prev, [name]: value }));
  };

   const handleAddStatus = async () => {
    if (!newStatus.statusName.trim()) return;

    const payload = {
      statusName: newStatus.statusName,
      description: newStatus.description,
      displayOrder: Number(newStatus.displayOrder) || 1,
      statusColor: newStatus.statusColor,
      isActive: true,
    };

    const action = await dispatch(createProjectStatus(payload));

    if (createProjectStatus.fulfilled.match(action)) {
      setForm((prev: any) => ({
        ...prev,
        projectStatusId: action.payload.projectStatusId,
      }));

      setNewStatus({
        statusName: '',
        description: '',
        displayOrder: '',
        statusColor: '#3b82f6',
      });

      setShowAddStatus(false);
    }
  };

  const handleDeleteStatus = (id: number) => {
    if (!confirm('Are you sure you want to delete this status?')) return;

    dispatch(deleteProjectStatus(id));

    // clear selected if deleted
    if (Number(form.projectStatusId) === id) {
      setForm((prev: any) => ({ ...prev, projectStatusId: '' }));
    }
  };

  const selectedStatus =statuses.find(
    (s) => s.projectStatusId === Number(form.projectStatusId)
  );
  
  return (
    <>
     
    <Modal onClose={onClose} title="Create New Project">
      
      <div className="space-y-4">
        <div>
        <label className="block text-sm font-medium mb-1">Project Name <span className="text-red-500">*</span></label>
        <input
          placeholder="Project Name"
          value={form.projectName}
          onChange={(e) => setForm({ ...form, projectName: e.target.value })}
           className={`w-full px-3 py-2 border rounded ${
            errors.projectName ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.projectName && <p className="text-red-500 text-sm">{errors.projectName}</p>}
        </div>
        <div>
        <label className="block text-sm font-medium mb-1"> Clients Name<span className="text-red-500">*</span></label>
        <select
          value={form.clientId}
          onChange={(e) => setForm({ ...form, clientId: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select companyName *</option>
          {clients.map((c) => (
            <option key={c.clientId} value={c.clientId}>
              {c.companyName}
            </option>
          ))}
        </select>
        </div>
          {/* Project Manager Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Manager <span className="text-red-500">*</span>
            </label>
            <select
              name="projectManagerId"
              value={form.projectManagerId}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Project Manager</option>
              {projectManagers.map(pm => (
                <option key={pm.employeeId} value={pm.employeeId}>{pm.employeeName}</option>
              ))}
            </select>
          </div>


         {/* Project Status Selection with Add New */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Status <span className="text-red-500">*</span>
            </label>
            
            <div className="flex gap-2">
              <select
                name="projectStatusId"
                value={form.projectStatusId}
                onChange={handleInputChange}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Project Status</option>
                {statuses.map(status => (
                  <option key={status.projectStatusId} value={status.projectStatusId}>
                    {status.statusName}
                  
                  </option>
                ))}
              </select>
              
              <button
                type="button"
                onClick={() => setShowAddStatus(!showAddStatus)}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
              >
                <Plus size={18} />
                Add New
              </button>
            </div>

            {/* Add New Status Form */}
            {showAddStatus && (
              <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-3">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Add New Project Status</h3>
                
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Status Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="statusName"
                    value={newStatus.statusName}
                    onChange={handleNewStatusChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., Under Review"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={newStatus.description}
                    onChange={handleNewStatusChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Brief description of this status"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Display Order
                    </label>
                    <input
                      type="number"
                      name="displayOrder"
                      value={newStatus.displayOrder}
                      onChange={handleNewStatusChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Order"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Status Color
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        name="statusColor"
                        value={newStatus.statusColor}
                        onChange={handleNewStatusChange}
                        className="h-10 w-16 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={newStatus.statusColor}
                        onChange={(e) => setNewStatus(prev => ({ ...prev, statusColor: e.target.value }))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleAddStatus}
                    className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Check size={18} />
                    Add Status
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddStatus(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
             {/* STATUS LIST WITH DELETE */}
      {/* <div className="mt-4 space-y-2">
        {statuses.map((status) => (
          <div
            key={status.projectStatusId}
            className="flex items-center justify-between p-2 border rounded-lg"
          >
            <span
              className="px-3 py-1 rounded-full text-white text-sm"
              style={{ backgroundColor: status.statusColor }}
            >
              {status.statusName}
            </span>

            <button
              onClick={() => handleDeleteStatus(status.projectStatusId)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div> */}
            {/* Display Selected Status with Color */}
            {selectedStatus && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-sm text-gray-600">Selected:</span>
                <span
                  className="px-3 py-1 rounded-full text-sm font-medium text-white"
                   style={{ backgroundColor: selectedStatus.statusColor }}
                >   {selectedStatus.statusName}
                </span>
              </div>
            )}
          </div>

         <div className='flex w-full gap-4'>
         <div className='w-full'>
        <label className="block text-sm font-medium mb-1">Start Date <span className="text-red-500">*</span></label>
        <input
          type="date"
          placeholder="Start Date"
          value={form.startDate}
          onChange={(e) => setForm({ ...form, startDate: e.target.value })}
         className={`w-full px-3 py-2 border rounded ${
            errors.startDate ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate}</p>}
        
        </div>
        <div className='w-full'>
        <label className="block text-sm font-medium mb-1">End Date<span className="text-red-500">*</span></label>
        <input
          type="date"
          placeholder="Planned End Date"
          value={form.plannedEndDate}
          onChange={(e) => setForm({ ...form, plannedEndDate: e.target.value })}
          className={`w-full px-3 py-2 border rounded ${
            errors.plannedEndDate ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.plannedEndDate && (
          <p className="text-red-500 text-sm">{errors.plannedEndDate}</p>
        )}
        </div>
        </div>
        <div>
        <label className="block text-sm font-medium mb-1">Payment Terms <span className="text-red-500">*</span></label>
        <input
          type="number"
          placeholder="Payment Terms (days)"
          value={form.paymentTerms}
          onChange={(e) => setForm({ ...form, paymentTerms: Number(e.target.value) || 0 })}
          className={`w-full px-3 py-2 border rounded ${
            errors.paymentTerms ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.paymentTerms && <p className="text-red-500 text-sm">{errors.paymentTerms}</p>}
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium"
          >
            Create Project
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
    </>
  );
};

export default CreateProjectModal;