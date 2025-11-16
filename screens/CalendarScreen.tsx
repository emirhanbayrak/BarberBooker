import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import EditAppointmentModal from '../components/EditAppointmentModal';
import { Appointment } from '../types';

type ViewMode = 'day' | 'week';

const CalendarScreen: React.FC = () => {
    const { currentStaff, appointments, services, updateAppointment, deleteAppointment } = useAppContext();
    const [viewMode, setViewMode] = useState<ViewMode>('day');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

    const changeDate = (amount: number) => {
        const newDate = new Date(currentDate);
        if(viewMode === 'day') {
            newDate.setDate(currentDate.getDate() + amount);
        } else {
            newDate.setDate(currentDate.getDate() + amount * 7);
        }
        setCurrentDate(newDate);
    };

    const staffAppointments = useMemo(() =>
        appointments.filter(app => app.staffId === currentStaff.id),
        [appointments, currentStaff]
    );

    const getServiceName = (serviceId: number) => services.find(s => s.id === serviceId)?.name || 'Hizmet';
    
    const handleSaveAppointment = (updatedAppointment: Appointment) => {
        const success = updateAppointment(updatedAppointment);
        if (success) {
            setSelectedAppointment(null);
        }
    };

    const handleDeleteAppointment = (appointmentId: number) => {
        deleteAppointment(appointmentId);
    };


    const renderDayView = () => {
        const appointmentsForDay = staffAppointments.filter(app => {
            const appDate = new Date(app.startTime);
            return appDate.toDateString() === currentDate.toDateString();
        });

        const timeSlots = [];
        for (let i = 8; i < 20; i++) {
            timeSlots.push(`${i.toString().padStart(2, '0')}:00`);
        }

        return (
            <div className="relative h-[1440px]">
                {timeSlots.map((time, index) => (
                    <div key={time} className="h-[120px] border-t border-brand-secondary flex items-start">
                        <span className="text-xs text-gray-400 -mt-2 ml-2">{time}</span>
                    </div>
                ))}
                {appointmentsForDay.map(app => {
                    const top = ((app.startTime.getHours() - 8) * 120) + (app.startTime.getMinutes() * 2);
                    const duration = (app.endTime.getTime() - app.startTime.getTime()) / (1000 * 60);
                    const height = duration * 2;
                    return (
                        <div
                            key={app.id}
                            onClick={() => setSelectedAppointment(app)}
                            className="absolute left-16 right-0 bg-brand-accent/80 backdrop-blur-sm rounded-lg p-2 text-brand-primary overflow-hidden cursor-pointer hover:ring-2 hover:ring-brand-light transition-all"
                            style={{ top: `${top}px`, height: `${height}px` }}
                        >
                            <p className="font-bold text-sm">{getServiceName(app.serviceId)}</p>
                            <p className="text-xs">{app.clientName}</p>
                            <p className="text-xs font-mono">{`${app.startTime.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })} - ${app.endTime.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}`}</p>
                        </div>
                    );
                })}
            </div>
        );
    };
    
    const renderWeekView = () => {
        const weekStart = new Date(currentDate);
        weekStart.setDate(currentDate.getDate() - currentDate.getDay());
        const days = Array.from({ length: 7 }).map((_, i) => {
            const date = new Date(weekStart);
            date.setDate(weekStart.getDate() + i);
            return date;
        });

        return (
            <div className="grid grid-cols-7 gap-1">
                {days.map(day => {
                    const dayAppointments = staffAppointments.filter(app => new Date(app.startTime).toDateString() === day.toDateString());
                    const isToday = day.toDateString() === new Date().toDateString();
                    return (
                        <div key={day.toISOString()} className={`p-1 rounded-md ${isToday ? 'bg-brand-accent/20' : ''}`}>
                            <p className={`text-center text-sm font-bold ${isToday ? 'text-brand-accent' : ''}`}>{day.toLocaleDateString('tr-TR', { weekday: 'short' })}</p>
                            <p className="text-center text-xs text-gray-400 mb-2">{day.getDate()}</p>
                            <div className="space-y-1">
                                {dayAppointments.map(app => (
                                    <div key={app.id} className="bg-brand-accent/80 text-brand-primary p-1 rounded text-[10px] leading-tight">
                                        <p className="font-bold truncate">{getServiceName(app.serviceId)}</p>
                                        <p className="truncate">{app.clientName}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <button onClick={() => changeDate(-1)} className="p-2 rounded-full hover:bg-brand-secondary"><i className="fa-solid fa-chevron-left"></i></button>
                <h2 className="text-xl font-bold text-brand-light">
                    {viewMode === 'day' 
                     ? currentDate.toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
                     : `Hafta: ${new Date(currentDate).toLocaleDateString('tr-TR', { month: 'long', day: 'numeric' })}`}
                </h2>
                <button onClick={() => changeDate(1)} className="p-2 rounded-full hover:bg-brand-secondary"><i className="fa-solid fa-chevron-right"></i></button>
            </div>
            <div className="flex justify-center mb-4 bg-brand-secondary p-1 rounded-full">
                <button onClick={() => setViewMode('day')} className={`px-4 py-1 rounded-full text-sm font-semibold ${viewMode === 'day' ? 'bg-brand-accent text-brand-primary' : ''}`}>Günlük</button>
                <button onClick={() => setViewMode('week')} className={`px-4 py-1 rounded-full text-sm font-semibold ${viewMode === 'week' ? 'bg-brand-accent text-brand-primary' : ''}`}>Haftalık</button>
            </div>
            <div className="overflow-y-auto">
                {viewMode === 'day' ? renderDayView() : renderWeekView()}
            </div>
            <EditAppointmentModal
                isOpen={!!selectedAppointment}
                appointment={selectedAppointment}
                onClose={() => setSelectedAppointment(null)}
                onSave={handleSaveAppointment}
                onDelete={handleDeleteAppointment}
            />
        </div>
    );
};

export default CalendarScreen;