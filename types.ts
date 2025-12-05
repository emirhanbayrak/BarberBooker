
export interface Staff {
  id: number;
  name: string;
  avatar: string;
}

export interface Client {
  id: number;
  name:string;
  phone: string;
  notes: string;
  lastVisit: Date;
}

export interface ServiceCategory {
  id: number;
  name: string;
  slug: string;
}

export interface Service {
  id: number;
  categoryId: number;
  name: string;
  description?: string;
  duration: number; // in minutes
  price: number;
  requiresParts?: boolean;
}

export interface Appointment {
  id: number;
  clientName: string;
  staffId: number;
  serviceIds: number[];
  startTime: Date;
  endTime: Date;
  price: number;
  materialCost?: number;
  notes?: string;
}