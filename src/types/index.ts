// Типы данных CRM-платформы "Слаботочные Системы Сервис"

export type UserRole = 'admin' | 'dispatcher' | 'engineer' | 'client';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  avatar?: string;
  skills?: string[];
  zone?: string;
}

export type IncidentPriority = 'critical' | 'high' | 'medium' | 'low';
export type IncidentStatus = 'new' | 'assigned' | 'in_progress' | 'resolved' | 'closed';
export type IncidentCategory = 'ops' | 'video' | 'skud' | 'sks' | 'smoke' | 'alert';

export interface Incident {
  id: string;
  number: string;
  title: string;
  description: string;
  category: IncidentCategory;
  priority: IncidentPriority;
  status: IncidentStatus;
  objectId: string;
  objectName: string;
  clientName: string;
  assignedTo?: string;
  assignedToName?: string;
  createdAt: string;
  deadline: string;
  resolvedAt?: string;
  slaReactionMinutes: number;
  slaResolutionHours: number;
  photos?: string[];
}

export interface Client {
  id: string;
  name: string;
  inn: string;
  phone: string;
  email: string;
  address: string;
  contractCount: number;
  objectCount: number;
}

export interface CRMObject {
  id: string;
  name: string;
  clientId: string;
  clientName: string;
  address: string;
  lat: number;
  lng: number;
  floors: number;
  systems: string[];
  equipmentCount: number;
  children?: CRMObject[];
}

export interface Equipment {
  id: string;
  name: string;
  objectId: string;
  serialNumber: string;
  category: string;
  installDate: string;
  lastCalibration?: string;
  nextCalibration?: string;
  status: 'active' | 'maintenance' | 'decommissioned';
  characteristics: Record<string, string>;
}

export type ContractType = 'subscription' | 'one_time';
export type ContractStatus = 'active' | 'expired' | 'terminated';

export interface Contract {
  id: string;
  number: string;
  clientId: string;
  clientName: string;
  type: ContractType;
  status: ContractStatus;
  startDate: string;
  endDate: string;
  amount: number;
  monthlyAmount?: number;
  systems: string[];
}

export type PPRTaskStatus = 'planned' | 'in_progress' | 'completed' | 'overdue';

export interface PPRTask {
  id: string;
  objectId: string;
  objectName: string;
  assignedTo: string;
  assignedToName: string;
  scheduledDate: string;
  status: PPRTaskStatus;
  checklist: ChecklistItem[];
  template: string;
}

export interface ChecklistItem {
  id: string;
  title: string;
  checked: boolean;
  comment?: string;
}

export interface WarehouseItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  minQuantity: number;
  reserved: number;
  unit: string;
  price: number;
  location: string;
}

export interface WarehouseMovement {
  id: string;
  itemId: string;
  itemName: string;
  type: 'in' | 'out' | 'reservation';
  quantity: number;
  date: string;
  reason: string;
  incidentId?: string;
}

export interface Notification {
  id: string;
  type: 'incident' | 'sla' | 'assignment' | 'system' | 'payment';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface SLAMetrics {
  totalIncidents: number;
  resolvedOnTime: number;
  breached: number;
  avgReactionTime: number;
  avgResolutionTime: number;
}

export interface KPIData {
  activeIncidents: number;
  overdueIncidents: number;
  engineersOnShift: number;
  todayPPR: number;
  monthlyRevenue: number;
  clientSatisfaction: number;
}
