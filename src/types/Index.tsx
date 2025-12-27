// src/types/index.ts
export interface User {
  email: string;
  role: 'Admin' | 'Client';
 
}

export interface Client {
  clientId: number;
  companyName: string;
  companyContactPerson:string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: string;
  isActive:boolean;
}

export interface Project {
  projectId?: number;
  projectName: string;
 projectCode: string;
  projectManagerId: number;
  projectStatusId: number;
 clientId: number;
 startDate: string;
  plannedEndDate: string;
  paymentTerms: number;
  finalBillingAmount:Number;
}
export interface ProjectStatus {
  projectStatusId: number;
  statusName: string;
  description: string;
  displayOrder: number;
  statusColor: string;
  isActive: boolean;
}

export interface TeamMember {
  team_id: number;
  project_id: number;
  employee_name: string;
  role: string;
  hourly_rate: string;
  estimated_hours: string;
  allocation: number;
}

export interface Milestone {
  milestone_id: number;
  project_id: number;
  milestone_name: string;
  description: string;
  payment_percentage: number;
  milestone_amount: number;
  planned_date: string;
  status: string;
}

export interface Estimate {
  estimation_id: number;
  project_id: number;
  version: number;
  status: string;
  laborCosts: TeamMember[];
  directCosts: any[];
  indirectCosts: any[];
  additionalCosts: any[];
  profit: number;
  tax: number;
  laborCost: number;
  dc: number;
  ic: number;
  ac: number;
  sub: number;
  profitAmt: number;
  taxAmt: number;
  final: number;
  change_comment?: string;
}

export interface Invoice {
  invoice_id: number;
  invoice_number: string;
  project_id: number;
  milestone_id?: number | null;
  is_advance: boolean;
  client_id: string;
  invoice_date: string;
  due_date: string;
  amount: number;
  tax_rate: number;
  tax_amount: number;
  total_amount: number;
  paid_amount: number;
  balance: number;
  status: 'Unpaid' | 'Partially Paid' | 'Paid';
}

export interface Payment {
  payment_id: number;
  invoice_id: number;
  amount: number;
  payment_date: string;
  payment_mode: string;
  reference: string;
}