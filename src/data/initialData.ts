// data/initialData.ts
export const initialEstimationState = {
  estimates: [
    // your two estimates here (same as before)
  ],
  laborCosts: [ /* your labor costs */ ],
  directCosts: [ /* ... */ ],
  indirectCosts: [ /* ... */ ],
  additionalCosts: [ /* ... */ ],
  employees: [
    // your 8 employees with designation, skills, etc.
  ],
  costTypes: [ /* your 9 cost types */ ],
  taxConfigs: [ /* GST, VAT, Sales Tax */ ],
  statuses: [
    { estimationStatusId: 1, statusName: "Draft", statusColor: "#9CA3AF" },
    { estimationStatusId: 2, statusName: "Pending Approval", statusColor: "#F59E0B" },
    { estimationStatusId: 3, statusName: "Approved", statusColor: "#10B981" },
    { estimationStatusId: 4, statusName: "Rejected", statusColor: "#EF4444" }
  ],
  selectedEstimate: null,
  showDetailModal: false,
  showCreateModal: false,
};