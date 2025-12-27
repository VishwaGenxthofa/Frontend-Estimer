// Save statuses to localStorage
export const saveStatusesToStorage = (statuses: any[]) => {
  localStorage.setItem('projectStatuses', JSON.stringify(statuses));
};

// Get statuses from localStorage
export const getStatusesFromStorage = (): any[] => {
  const data = localStorage.getItem('projectStatuses');
  return data ? JSON.parse(data) : [];
};

// Clear localStorage
export const clearStatusesStorage = () => {
  localStorage.removeItem('projectStatuses');
};
