export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in-progress',
  AWAITING_APPROVAL = 'awaiting-approval',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface Client {
  id: string;
  name: string;
  address: string;
  phone: string;
  notes?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stockQuantity: number;
  unit: string;
  updatedAt: string;
}

export interface MaterialUsage {
  itemId: string;
  itemName: string;
  quantity: number;
}

export interface InventoryAdjustment {
  id: string;
  itemId: string;
  itemName: string;
  type: 'usage' | 'restock' | 'return';
  quantity: number;
  date: string;
  technicianId?: string;
  technicianName?: string;
  appointmentId?: string;
  notes?: string;
}

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  technicianId: string;
  technicianName: string;
  scheduledAt: string;
  status: AppointmentStatus;
  description: string;
  report?: string;
  photoUrls?: string[];
  materialsUsed?: MaterialUsage[];
  rejectionReason?: string;
  updatedAt: string;
}
