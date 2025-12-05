
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';

const DashboardScreen: React.FC = () => {
    const { currentStaff, appointments, services } = useAppContext();
    const [revenueView, setRevenueView] = useState<'weekly' | 'monthly'>('weekly');

    const chartData = useMemo(() => {
        const today = new Date();
        today.setHours(0,0,0,0);
        
        if (revenueView === 'weekly') {
            const weekData = [];
            for (let i = 6; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(today.getDate() - i);
                
                // Start and End of the specific day
                const startOfDay = new Date(date);
                startOfDay.setHours(0,0,0,0);
                const endOfDay = new Date(date);
                endOfDay.setHours(23,59,59,999);

                const dailyAppointments = appointments.filter(app => {
                    const appDate = new Date(app.startTime);
                    return app.staffId === currentStaff!.id && appDate >= startOfDay && appDate <= endOfDay;
                });

                const dailyRevenue = dailyAppointments.reduce((sum, app) => {
                    return sum + app.price;
                }, 0);

                weekData.push({
                    label: date.toLocaleDateString('tr-TR', { weekday: 'short' }),
                    revenue: dailyRevenue
                });
            }
            return weekData;
        } else { // monthly (last 4 weeks)
            const monthData = [];
            const todayEnd = new Date();
            todayEnd.setHours(23, 59, 59, 999);

            for (let i = 3; i >= 0; i--) {
                const weekLabel = i === 0 ? 'Bu Hafta' : `${i}. Hafta Önce`;
                
                const endDate = new Date(todayEnd);
                endDate.setDate(todayEnd.getDate() - (i * 7));
                
                const startDate = new Date(endDate);
                startDate.setDate(endDate.getDate() - 6);
                startDate.setHours(0, 0, 0, 0);

                const weeklyAppointments = appointments.filter(app => {
                    const appDate = new Date(app.startTime);
                    return app.staffId === currentStaff!.id && appDate >= startDate && appDate <= endDate;
                });
                
                const weeklyRevenue = weeklyAppointments.reduce((sum, app) => {
                    return sum + app.price;
                }, 0);

                monthData.push({
                    label: weekLabel,
                    revenue: weeklyRevenue
                });
            }
            return monthData;
        }
    }, [revenueView, appointments, currentStaff]);

    const todaysAppointments = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        return appointments.filter(app => {
            const appDate = new Date(app.startTime);
            return app.staffId === currentStaff!.id && appDate >= today && appDate < tomorrow;
        });
    }, [appointments, currentStaff]);

    const totalRevenue = useMemo(() => {
        return todaysAppointments.reduce((sum, app) => sum + app.price, 0);
    }, [todaysAppointments]);
    
    // Updated Logic: Find the absolute next appointment, even if it's tomorrow or next week
    const upcomingAppointment = useMemo(() => {
        const now = new Date();
        return appointments
            .filter(app => {
                const appDate = new Date(app.startTime);
                return app.staffId === currentStaff!.id && appDate > now;
            })
            .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())[0];
    }, [appointments, currentStaff]);

    const maxRevenue = Math.max(1, ...chartData.map(d => d.revenue));

    const getServiceNames = (serviceIds: number[]) => {
        return serviceIds.map(id => services.find(s => s.id === id)?.name).filter(Boolean).join(', ');
    };

    const formatTime = (date: Date) => {
        return new Date(date).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    };

    const isToday = (date: Date) => {
        const d = new Date(date);
        const today = new Date();
        return d.getDate() === today.getDate() &&
               d.getMonth() === today.getMonth() &&
               d.getFullYear() === today.getFullYear();
    };

    return (
        <div className="p-6">
            <header className="mb-8">
                <p className="text-lg text-gray-400">Hoşgeldin,</p>
                <h1 className="text-4xl font-bold text-brand-accent">{currentStaff!.name}</h1>
            </header>

            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-brand-secondary p-4 rounded-lg shadow-lg text-center border border-brand-primary/20">
                    <p className="text-4xl font-bold text-brand-accent">{todaysAppointments.length}</p>
                    <p className="text-gray-300">Bugünkü Randevu</p>
                </div>
                <div className="bg-brand-secondary p-4 rounded-lg shadow-lg text-center border border-brand-primary/20">
                    <p className="text-4xl font-bold text-brand-accent">{totalRevenue}<span className="text-2xl">₺</span></p>
                    <p className="text-gray-300">Tahmini Gelir</p>
                </div>
            </div>

            <div className="bg-brand-secondary p-4 rounded-lg shadow-lg border border-brand-primary/20">
                <h2 className="text-xl font-semibold text-brand-light mb-4 border-b border-brand-accent/20 pb-2">Sıradaki Randevu</h2>
                {upcomingAppointment ? (
                    <div>
                        <div className="flex justify-between items-center mb-1">
                           <span className="font-bold text-lg text-brand-accent truncate pr-2">{upcomingAppointment.clientName}</span>
                           <div className="flex flex-col items-end flex-shrink-0">
                               <span className="font-mono text-lg">{formatTime(upcomingAppointment.startTime)}</span>
                               {!isToday(upcomingAppointment.startTime) && (
                                   <span className="text-xs text-brand-accent">{new Date(upcomingAppointment.startTime).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}</span>
                               )}
                           </div>
                        </div>
                        <div className="text-sm text-gray-400 mb-2 flex items-center">
                             <i className="fa-solid fa-car-side mr-2 text-brand-accent/70"></i>
                             {upcomingAppointment.carYear ? `${upcomingAppointment.carYear} ` : ''} 
                             {upcomingAppointment.carMake} {upcomingAppointment.carModel}
                        </div>
                        <p className="text-gray-300 line-clamp-1 text-sm">{getServiceNames(upcomingAppointment.serviceIds)}</p>
                    </div>
                ) : (
                    <p className="text-gray-400">Yaklaşan randevu bulunmuyor.</p>
                )}
            </div>
            
            <div className="bg-brand-secondary p-4 rounded-lg shadow-lg mt-8 border border-brand-primary/20">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-brand-light">Gelir Özeti</h2>
                    <div className="bg-brand-primary p-1 rounded-full text-sm flex">
                        <button onClick={() => setRevenueView('weekly')} className={`px-3 py-1 rounded-full transition-colors ${revenueView === 'weekly' ? 'bg-brand-accent text-brand-primary' : 'text-gray-400 hover:text-white'}`}>Haftalık</button>
                        <button onClick={() => setRevenueView('monthly')} className={`px-3 py-1 rounded-full transition-colors ${revenueView === 'monthly' ? 'bg-brand-accent text-brand-primary' : 'text-gray-400 hover:text-white'}`}>Aylık</button>
                    </div>
                </div>
                <div className="flex justify-around items-end h-48 pt-4">
                    {chartData.some(d => d.revenue > 0) ? chartData.map((data, index) => (
                        <div key={index} className="flex flex-col items-center w-full h-full justify-end group">
                             <p className="text-xs text-brand-accent font-mono mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">{data.revenue}₺</p>
                            <div 
                                className="w-3/5 bg-brand-accent rounded-t-sm group-hover:opacity-80 transition-all duration-300"
                                style={{ height: `${(data.revenue / maxRevenue) * 100}%` }}
                            ></div>
                            <div className="text-[10px] text-gray-400 mt-2 whitespace-nowrap">{data.label}</div>
                        </div>
                    )) : <div className="flex items-center justify-center w-full h-full"><p className="text-gray-500">Görüntülenecek gelir verisi yok.</p></div>}
                </div>
            </div>
        </div>
    );
};

export default DashboardScreen;
