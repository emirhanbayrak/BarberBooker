import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import { Staff, Client, Service, Appointment } from '../types';
import { STAFF_MEMBERS, CLIENTS, SERVICES, APPOINTMENTS } from '../constants';

interface AppContextType {
  currentStaff: Staff | null;
  staff: Staff[];
  clients: Client[];
  services: Service[];
  appointments: Appointment[];
  toastMessage: string | null;
  loginUser: (name: string) => void;
  addAppointment: (appointment: Omit<Appointment, 'id' | 'endTime'>) => boolean;
  updateAppointment: (updatedAppointment: Appointment) => boolean;
  deleteAppointment: (appointmentId: number) => void;
  showToast: (message: string) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [staff] = useState<Staff[]>(STAFF_MEMBERS);
  const [clients, setClients] = useState<Client[]>(CLIENTS);
  const [services] = useState<Service[]>(SERVICES);
  const [appointments, setAppointments] = useState<Appointment[]>(APPOINTMENTS);
  const [currentStaff, setCurrentStaff] = useState<Staff | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loginUser = (name: string) => {
    localStorage.setItem('sy-hair-designer-userName', name);
    setCurrentStaff({
        id: 1, // Assuming a single staff system for now
        name: name,
        avatar: 'https://picsum.photos/id/1005/200/200' 
    });
  };

  useEffect(() => {
    const storedName = localStorage.getItem('sy-hair-designer-userName');
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
    const service = services.find(s => s.id === newAppointmentData.serviceId);
    if (!service) return false;

    const newStartTime = newAppointmentData.startTime;

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    if (newStartTime < startOfToday) {
        alert('Geçmiş tarihlere randevu oluşturulamaz.');
        return false;
    }
    
    const newEndTime = new Date(newStartTime.getTime() + service.duration * 60000);

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
    const service = services.find(s => s.id === updatedAppointment.serviceId);
    if (!service) return false;

    const newStartTime = updatedAppointment.startTime;
    
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    if (newStartTime < startOfToday) {
        alert('Randevular geçmiş tarihlere taşınamaz.');
        return false;
    }
    
    const newEndTime = new Date(updatedAppointment.startTime.getTime() + service.duration * 60000);
    
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


  const value = {
    currentStaff,
    staff,
    clients,
    services,
    appointments,
    toastMessage,
    loginUser,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    showToast,
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