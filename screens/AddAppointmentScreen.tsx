
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Service } from '../types';

interface AddAppointmentScreenProps {
  onAppointmentAdded: () => void;
}

const AddAppointmentScreen: React.FC<AddAppointmentScreenProps> = ({ onAppointmentAdded }) => {
    const { services, categories, addAppointment, currentStaff } = useAppContext();
    
    const [clientName, setClientName] = useState<string>('');
    const [selectedServiceIds, setSelectedServiceIds] = useState<number[]>([]);
    const [appointmentDate, setAppointmentDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [appointmentTime, setAppointmentTime] = useState<string>('09:00');
    const [price, setPrice] = useState<string>('');
    const [materialCost, setMaterialCost] = useState<string>('');
    const [notes, setNotes] = useState<string>('');
    const [expandedCategories, setExpandedCategories] = useState<number[]>([]);
    
    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        const total = services
            .filter(s => selectedServiceIds.includes(s.id))
            .reduce((sum, s) => sum + s.price, 0);
        setPrice(total.toString());
    }, [selectedServiceIds, services]);

    const toggleCategory = (categoryId: number) => {
        setExpandedCategories(prev => 
            prev.includes(categoryId) 
                ? prev.filter(id => id !== categoryId) 
                : [...prev, categoryId]
        );
    };

    const toggleService = (serviceId: number) => {
        setSelectedServiceIds(prev => 
            prev.includes(serviceId)
                ? prev.filter(id => id !== serviceId)
                : [...prev, serviceId]
        );
    };

    const getSelectedServicesSummary = () => {
        if (selectedServiceIds.length === 0) return 'Hizmet seçilmedi';
        const count = selectedServiceIds.length;
        const totalDuration = services
            .filter(s => selectedServiceIds.includes(s.id))
            .reduce((sum, s) => sum + s.duration, 0);
        
        return `${count} hizmet seçildi (${totalDuration} dk)`;
    };

    const calculateProfit = () => {
        const revenue = Number(price) || 0;
        const cost = Number(materialCost) || 0;
        return revenue - cost;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!clientName || selectedServiceIds.length === 0 || !appointmentDate || !appointmentTime || !price) {
            alert('Lütfen tüm zorunlu alanları doldurun ve en az bir hizmet seçin.');
            return;
        }

        const [year, month, day] = appointmentDate.split('-').map(Number);
        const [hours, minutes] = appointmentTime.split(':').map(Number);
        
        const startTime = new Date(year, month - 1, day, hours, minutes);

        const success = addAppointment({
            clientName: clientName,
            serviceIds: selectedServiceIds,
            staffId: currentStaff!.id,
            startTime: startTime,
            price: Number(price),
            materialCost: materialCost ? Number(materialCost) : 0,
            notes: notes,
        });

        if (success) {
          onAppointmentAdded();
        }
    };

    return (
        <div className="p-6 pb-24">
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
                    <div className="flex justify-between items-end mb-2">
                        <label className="block text-sm font-medium text-gray-300">Hizmetler</label>
                        <span className="text-xs text-brand-accent">{getSelectedServicesSummary()}</span>
                    </div>
                    <div className="border border-gray-600 rounded-lg bg-brand-secondary max-h-[300px] overflow-y-auto">
                        {categories.map(category => {
                            const categoryServices = services.filter(s => s.categoryId === category.id);
                            if (categoryServices.length === 0) return null;
                            const isExpanded = expandedCategories.includes(category.id);
                            
                            // Check if any service in this category is selected
                            const hasSelection = categoryServices.some(s => selectedServiceIds.includes(s.id));

                            return (
                                <div key={category.id} className="border-b border-gray-700 last:border-0">
                                    <button
                                        type="button"
                                        onClick={() => toggleCategory(category.id)}
                                        className={`w-full p-3 flex justify-between items-center text-left hover:bg-brand-primary/30 transition-colors ${hasSelection ? 'bg-brand-accent/10' : ''}`}
                                    >
                                        <span className={`font-medium ${hasSelection ? 'text-brand-accent' : 'text-gray-300'}`}>{category.name}</span>
                                        <i className={`fa-solid fa-chevron-down text-xs text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}></i>
                                    </button>
                                    
                                    {isExpanded && (
                                        <div className="bg-brand-primary/20 p-2 space-y-1">
                                            {categoryServices.map(service => {
                                                const isSelected = selectedServiceIds.includes(service.id);
                                                return (
                                                    <div 
                                                        key={service.id} 
                                                        onClick={() => toggleService(service.id)}
                                                        className={`flex items-start p-2 rounded cursor-pointer transition-colors ${isSelected ? 'bg-brand-accent/20' : 'hover:bg-brand-primary/40'}`}
                                                    >
                                                        <div className={`w-5 h-5 mt-0.5 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${isSelected ? 'bg-brand-accent border-brand-accent' : 'border-gray-500'}`}>
                                                            {isSelected && <i className="fa-solid fa-check text-brand-primary text-xs"></i>}
                                                        </div>
                                                        <div className="ml-3 flex-1">
                                                            <div className="flex justify-between">
                                                                <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-gray-300'}`}>{service.name}</span>
                                                                <span className="text-sm font-mono text-brand-accent">{service.price}₺</span>
                                                            </div>
                                                            <div className="text-xs text-gray-500 mt-0.5">
                                                                <i className="fa-regular fa-clock mr-1"></i>{service.duration} dk
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Toplam Ücret</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="0"
                                className="w-full p-3 pl-8 bg-brand-secondary border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent"
                                required
                            />
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₺</span>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Malzeme Fiyatı</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={materialCost}
                                onChange={(e) => setMaterialCost(e.target.value)}
                                placeholder="0"
                                className="w-full p-3 pl-8 bg-brand-secondary border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent"
                            />
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₺</span>
                        </div>
                    </div>
                </div>

                {/* Profit Calculation Display */}
                <div className="bg-brand-primary/30 p-3 rounded-lg flex justify-between items-center border border-gray-700">
                    <span className="text-sm text-gray-400">Tahmini Kâr:</span>
                    <span className={`font-bold font-mono text-lg ${calculateProfit() >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {calculateProfit()} ₺
                    </span>
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

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Yorum / Not Ekle</label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Randevu ile ilgili notlar..."
                        className="w-full p-3 bg-brand-secondary border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent h-24 resize-none"
                    />
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