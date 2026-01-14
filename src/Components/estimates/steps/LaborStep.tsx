// steps/LaborStep.tsx
import React, { useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch,RootState } from '../../../redux/store';
import { fetchEmployees } from '../../../redux/employeesSlice';

interface Props {
  laborCosts: any[];
  setLaborCosts: React.Dispatch<React.SetStateAction<any[]>>;
  totals: any;
}

const LaborStep: React.FC<Props> = ({ laborCosts, setLaborCosts, totals }) => {
  const dispatch=useDispatch<AppDispatch>();
  const { employees } = useSelector((state: RootState) => state.employees);
useEffect (()=>{
   dispatch(fetchEmployees())
},[dispatch])
  const handleEmployeeChange = (index: number, employeeId: string) => {
    const updated = [...laborCosts];
    updated[index].employeeId = employeeId;
    const emp = employees.find((e: any) => e.employeeId === parseInt(employeeId));
    if (emp) {
      updated[index].notes = emp.designation;
      updated[index].hourlyRate = emp.hourlyRate;
    }
    setLaborCosts(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-xl">Labor Costs</h3>
        <button
          onClick={() => setLaborCosts([...laborCosts, { employeeId: '', notes: '', estimatedHours: '', hourlyRate: '' }])}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      {laborCosts.map((l: any, i: number) => {
        const employee = employees.find((emp: any) => emp.employeeId === parseInt(l.employeeId));

        return (
          <div key={i} className="p-4 bg-slate-50 rounded-lg border">
            <div className="flex justify-between mb-3">
              <span className="font-semibold">Labor #{i + 1}</span>
              {laborCosts.length > 1 && (
                <button
                  onClick={() => setLaborCosts(laborCosts.filter((_, idx) => idx !== i))}
                  className="text-red-600 hover:bg-red-50 p-1 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Employee</label>
                <select
                  value={l.employeeId}
                  onChange={(e) => handleEmployeeChange(i, e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">Select Employee</option>
                  {employees.filter((e: any) => e.isActive).map((emp: any) => (
                    <option key={emp.employeeId} value={emp.employeeId}>
                      {emp.employeeName} - {emp.designation}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <input type="text" value={l.notes || ''} readOnly className="w-full px-3 py-2 border rounded-lg bg-slate-100" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Hours</label>
                  <input
                    type="number"
                    value={l.estimatedHours}
                    onChange={(e) => {
                      const u = [...laborCosts];
                      u[i].estimatedHours = e.target.value;
                      setLaborCosts(u);
                    }}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Hours"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Rate (₹/hr)</label>
                  <input
                    type="number"
                    value={l.hourlyRate}
                    readOnly
                    className="w-full px-3 py-2 border rounded-lg bg-slate-100"
                  />
                </div>
              </div>

              {employee && (
                <div className="text-sm bg-blue-50 px-4 py-2 rounded-lg">
                  <strong>{employee.employeeName}</strong> - {employee.designation} @ ₹{employee.hourlyRate}/hr
                  <div className="text-xs text-slate-600 mt-1">
                    {employee.department} | Skills: {employee.skills.join(', ')}
                  </div>
                </div>
              )}

              <div className="text-right font-semibold">
                Total: ₹{((parseFloat(l.estimatedHours) || 0) * (parseFloat(l.hourlyRate) || 0)).toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        );
      })}

      <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
        <p className="font-bold text-emerald-900 text-lg">
          Total Labor Cost: ₹{totals.totalLaborCost.toLocaleString('en-IN')}
        </p>
      </div>
    </div>
  );
};

export default LaborStep;