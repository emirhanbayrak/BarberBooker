
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

export interface Service {
  id: number;
  name: string;
  duration: number; // in minutes
  price: number;
}

export interface Appointment {
  id: number;
  clientName: string;
  staffId: number;
  serviceId: number;
  startTime: Date;
  endTime: Date;
  price: number;
}