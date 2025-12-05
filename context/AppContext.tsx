
import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import { Staff, Client, Service, Appointment, ServiceCategory } from '../types';
import { STAFF_MEMBERS, CLIENTS, SERVICES, APPOINTMENTS, SERVICE_CATEGORIES } from '../constants';

interface AppContextType {
  currentStaff: Staff | null;
  staff: Staff[];
  clients: Client[];
  services: Service[];
  categories: ServiceCategory[];
  appointments: Appointment[];
  toastMessage: string | null;
  loginUser: (name: string) => void;
  addAppointment: (appointment: Omit<Appointment, 'id' | 'endTime'>) => boolean;
  updateAppointment: (updatedAppointment: Appointment) => boolean;
  deleteAppointment: (appointmentId: number) => void;
  showToast: (message: string) => void;
  addService: (service: Omit<Service, 'id'>) => void;
  updateService: (updatedService: Service) => void;
  deleteService: (serviceId: number) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

const APPOINTMENTS_STORAGE_KEY = 'sy-auto-service-appointments';
const SERVICES_STORAGE_KEY = 'sy-auto-service-services-v1'; // Changed key to force update

const loadAppointments = (): Appointment[] => {
    try {
        const storedData = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
        if (storedData) {
            const parsed = JSON.parse(storedData) as any[];
            // Convert date strings back to Date objects and handle migration if needed
            return parsed.map(app => ({
                ...app,
                serviceIds: app.serviceIds || (app.serviceId ? [app.serviceId] : []),
                startTime: new Date(app.startTime),
                endTime: new Date(app.endTime),
            }));
        }
    } catch (error) {
        console.error("Failed to load appointments from local storage", error);
    }
    // If nothing is stored or an error occurs, initialize with default data
    return APPOINTMENTS;
};

const loadServices = (): Service[] => {
    try {
        const storedData = localStorage.getItem(SERVICES_STORAGE_KEY);
        if (storedData) {
            return JSON.parse(storedData) as Service[];
        }
    } catch (error) {
        console.error("Failed to load services from local storage", error);
    }
    return SERVICES;
};


export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [staff] = useState<Staff[]>(STAFF_MEMBERS);
  const [categories] = useState<ServiceCategory[]>(SERVICE_CATEGORIES);
  const [clients, setClients] = useState<Client[]>(CLIENTS);
  const [services, setServices] = useState<Service[]>(loadServices);
  const [appointments, setAppointments] = useState<Appointment[]>(loadAppointments);
  const [currentStaff, setCurrentStaff] = useState<Staff | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
        localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(appointments));
    } catch (error) {
        console.error("Failed to save appointments to local storage", error);
    }
  }, [appointments]);

  useEffect(() => {
    try {
        localStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(services));
    } catch (error) {
        console.error("Failed to save services to local storage", error);
    }
  }, [services]);

  const loginUser = (name: string) => {
    localStorage.setItem('sy-auto-service-userName', name);
    setCurrentStaff({
        id: 1, // Assuming a single staff system for now
        name: name,
        avatar: 'https://picsum.photos/id/1005/200/200' 
    });
  };

  useEffect(() => {
    const storedName = localStorage.getItem('sy-auto-service-userName');
    if (storedName) {
        loginUser(storedName);
    }
  }, []);


  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
        setToastMessage(null);
    }, 3000);
  };

  const addAppointment = (newAppointmentData: Omit<Appointment, 'id' | 'endTime'>): boolean => {
    const selectedServices = services.filter(s => newAppointmentData.serviceIds.includes(s.id));
    
    if (selectedServices.length === 0) {
      alert('Lütfen en az bir hizmet seçin.');
      return false;
    }

    const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration, 0);
    const newStartTime = newAppointmentData.startTime;

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    if (newStartTime < startOfToday) {
        alert('Geçmiş tarihlere randevu oluşturulamaz.');
        return false;
    }
    
    const newEndTime = new Date(newStartTime.getTime() + totalDuration * 60000);

    const hasConflict = appointments.some(existingAppointment => {
        if (existingAppointment.staffId !== newAppointmentData.staffId) {
            return false;
        }
        return (
            newStartTime < existingAppointment.endTime &&
            newEndTime > existingAppointment.startTime
        );
    });

    if (hasConflict) {
        alert('Seçilen zaman diliminde başka bir randevu bulunmaktadır. Lütfen farklı bir saat seçin.');
        return false;
    }

    const newAppointment: Appointment = {
      ...newAppointmentData,
      id: Date.now(),
      endTime: newEndTime,
    };
    setAppointments(prev => [...prev, newAppointment].sort((a,b) => a.startTime.getTime() - b.startTime.getTime()));
    showToast('Randevu başarıyla oluşturuldu!');
    return true;
  };
  
  const updateAppointment = (updatedAppointment: Appointment): boolean => {
    const selectedServices = services.filter(s => updatedAppointment.serviceIds.includes(s.id));
    
    if (selectedServices.length === 0) {
      alert('Lütfen en az bir hizmet seçin.');
      return false;
    }

    const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration, 0);
    const newStartTime = updatedAppointment.startTime;
    
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    if (newStartTime < startOfToday) {
        alert('Randevular geçmiş tarihlere taşınamaz.');
        return false;
    }
    
    const newEndTime = new Date(updatedAppointment.startTime.getTime() + totalDuration * 60000);
    
    const hasConflict = appointments.some(existingAppointment => {
        if (existingAppointment.id === updatedAppointment.id) {
            return false; 
        }
        if (existingAppointment.staffId !== updatedAppointment.staffId) {
            return false;
        }
        return (
            newStartTime < existingAppointment.endTime &&
            newEndTime > existingAppointment.startTime
        );
    });

    if (hasConflict) {
        alert('Seçilen zaman diliminde başka bir randevu bulunmaktadır. Lütfen farklı bir saat seçin.');
        return false;
    }
    
    const finalUpdatedAppointment = { ...updatedAppointment, endTime: newEndTime };
    
    setAppointments(prev => 
        prev.map(app => (app.id === finalUpdatedAppointment.id ? finalUpdatedAppointment : app))
            .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
    );
    showToast('Randevu başarıyla güncellendi!');
    return true;
  };

  const deleteAppointment = (appointmentId: number) => {
    setAppointments(prev => 
      prev.filter(app => app.id !== appointmentId)
          .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
    );
    showToast('Randevu başarıyla silindi.');
  };

  const addService = (newServiceData: Omit<Service, 'id'>) => {
    const newService: Service = {
      ...newServiceData,
      id: Date.now(),
    };
    setServices(prev => [...prev, newService].sort((a,b) => a.name.localeCompare(b.name)));
    showToast('Hizmet başarıyla eklendi!');
  };

  const updateService = (updatedService: Service) => {
    setServices(prev => 
        prev.map(s => (s.id === updatedService.id ? updatedService : s))
            .sort((a, b) => a.name.localeCompare(b.name))
    );
    showToast('Hizmet başarıyla güncellendi!');
  };

  const deleteService = (serviceId: number) => {
    setServices(prev => 
      prev.filter(s => s.id !== serviceId)
    );
    showToast('Hizmet başarıyla silindi.');
  };

  const value = {
    currentStaff,
    staff,
    clients,
    services,
    categories,
    appointments,
    toastMessage,
    loginUser,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    showToast,
    addService,
    updateService,
    deleteService,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
