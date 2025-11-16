import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Service } from '../types';

interface AddAppointmentScreenProps {
  onAppointmentAdded: () => void;
}

const AddAppointmentScreen: React.FC<AddAppointmentScreenProps> = ({ onAppointmentAdded }) => {
    const { services, addAppointment, currentStaff } = useAppContext();
    
    const [clientName, setClientName] = useState<string>('');
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [appointmentDate, setAppointmentDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [appointmentTime, setAppointmentTime] = useState<string>('09:00');
    const [price, setPrice] = useState<string>('');
    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        if (selectedService) {
            setPrice(selectedService.price.toString());
        }
    }, [selectedService]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!clientName || !selectedService || !appointmentDate || !appointmentTime || !price) {
            alert('Lütfen tüm alanları doldurun.');
            return;
        }

        const [year, month, day] = appointmentDate.split('-').map(Number);
        const [hours, minutes] = appointmentTime.split(':').map(Number);
        
        const startTime = new Date(year, month - 1, day, hours, minutes);

        const success = addAppointment({
            clientName: clientName,
            serviceId: selectedService.id,
            staffId: currentStaff!.id,
            startTime: startTime,
            price: Number(price),
        });

        if (success) {
          onAppointmentAdded();
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-brand-accent mb-6">Yeni Randevu</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Müşteri Adı</label>
                    <input
                        type="text"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="Müşterinin adını girin"
                        className="w-full p-3 bg-brand-secondary border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Hizmet</label>
                    <select
                        onChange={(e) => setSelectedService(services.find(s => s.id === +e.target.value) || null)}
                        className="w-full p-3 bg-brand-secondary border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent"
                        required
                        defaultValue=""
                    >
                        <option value="" disabled>Hizmet Seçin</option>
                        {services.map(service => (
                            <option key={service.id} value={service.id}>{service.name} ({service.duration} dk)</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Alınan Ücret</label>
                    <div className="relative">
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="Ücret girin"
                            className="w-full p-3 pl-8 bg-brand-secondary border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent"
                            required
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₺</span>
                    </div>
                </div>
                <div className="flex space-x-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-300 mb-1">Tarih</label>
                        <input
                            type="date"
                            value={appointmentDate}
                            onChange={(e) => setAppointmentDate(e.target.value)}
                            min={today}
                            className="w-full p-3 bg-brand-secondary border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent [color-scheme:dark]"
                            required
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-300 mb-1">Saat</label>
                        <input
                            type="time"
                            value={appointmentTime}
                            onChange={(e) => setAppointmentTime(e.target.value)}
                            className="w-full p-3 bg-brand-secondary border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent [color-scheme:dark]"
                            required
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    className="w-full bg-brand-accent text-brand-primary font-bold py-4 rounded-lg text-lg hover:opacity-90 transition-opacity"
                >
                    Randevu Oluştur
                </button>
            </form>
        </div>
    );
};

export default AddAppointmentScreen;