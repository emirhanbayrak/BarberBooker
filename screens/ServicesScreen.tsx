
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Service } from '../types';
import ServiceModal from '../components/ServiceModal';

const ServicesScreen: React.FC = () => {
    const { services, categories, addService, updateService, deleteService } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [serviceToEdit, setServiceToEdit] = useState<Service | null>(null);
    const [expandedCategories, setExpandedCategories] = useState<number[]>([]);

    const toggleCategory = (categoryId: number) => {
        setExpandedCategories(prev => 
            prev.includes(categoryId) 
                ? prev.filter(id => id !== categoryId) 
                : [...prev, categoryId]
        );
    };

    const openModalToAdd = () => {
        setServiceToEdit(null);
        setIsModalOpen(true);
    };

    const openModalToEdit = (e: React.MouseEvent, service: Service) => {
        e.stopPropagation();
        setServiceToEdit(service);
        setIsModalOpen(true);
    };

    const handleSaveService = (serviceData: Omit<Service, 'id'> | Service) => {
        if ('id' in serviceData) {
            updateService(serviceData as Service);
        } else {
            addService(serviceData as Omit<Service, 'id'>);
        }
        setIsModalOpen(false);
    };

    const handleDeleteService = (e: React.MouseEvent, serviceId: number) => {
        e.stopPropagation();
        if (window.confirm('Bu hizmeti silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
            deleteService(serviceId);
        }
    };

    return (
        <div className="p-6 pb-24">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-brand-accent">Hizmet Kataloğu</h1>
                <button
                    onClick={openModalToAdd}
                    className="bg-brand-accent text-brand-primary font-semibold py-2 px-4 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity"
                >
                    <i className="fa-solid fa-plus"></i>
                    <span>Yeni</span>
                </button>
            </div>

            <div className="space-y-4">
                {categories.map(category => {
                    const categoryServices = services.filter(s => s.categoryId === category.id);
                    const isExpanded = expandedCategories.includes(category.id);

                    return (
                        <div key={category.id} className="bg-brand-secondary rounded-lg shadow-md overflow-hidden animate-fade-in border border-brand-primary/20">
                            <button 
                                onClick={() => toggleCategory(category.id)}
                                className="w-full p-4 flex justify-between items-center text-left hover:bg-brand-primary/20 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="font-semibold text-brand-light text-lg">{category.name}</span>
                                    <span className="text-xs bg-brand-primary text-gray-400 px-2 py-0.5 rounded-full">
                                        {categoryServices.length}
                                    </span>
                                </div>
                                <i className={`fa-solid fa-chevron-down text-brand-accent transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}></i>
                            </button>
                            
                            <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                                <div className="border-t border-brand-primary/10">
                                    {categoryServices.length > 0 ? (
                                        <div className="divide-y divide-brand-primary/10">
                                            {categoryServices.map(service => (
                                                <div 
                                                    key={service.id} 
                                                    className="p-4 pl-6 hover:bg-brand-primary/10 transition-colors cursor-pointer group"
                                                    onClick={(e) => openModalToEdit(e, service)}
                                                >
                                                    <div className="flex justify-between items-start mb-1">
                                                        <h4 className="font-medium text-brand-text group-hover:text-brand-accent transition-colors">{service.name}</h4>
                                                        <div className="flex items-center gap-3">
                                                            <span className="font-mono text-brand-accent font-bold">{service.price}₺</span>
                                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <button 
                                                                    onClick={(e) => openModalToEdit(e, service)} 
                                                                    className="text-gray-400 hover:text-white p-1"
                                                                >
                                                                    <i className="fa-solid fa-pencil text-sm"></i>
                                                                </button>
                                                                <button 
                                                                    onClick={(e) => handleDeleteService(e, service.id)} 
                                                                    className="text-gray-400 hover:text-red-500 p-1"
                                                                >
                                                                    <i className="fa-solid fa-trash text-sm"></i>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-gray-400 mb-2 line-clamp-2">{service.description}</p>
                                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                                        <span className="flex items-center gap-1">
                                                            <i className="fa-regular fa-clock"></i> {service.duration} dk
                                                        </span>
                                                        {service.requiresParts && (
                                                            <span className="flex items-center gap-1 text-orange-400">
                                                                <i className="fa-solid fa-wrench"></i> Parça Değişimi
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-4 text-center text-gray-500 text-sm">
                                            Bu kategoride hizmet bulunmuyor.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <ServiceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveService}
                serviceToEdit={serviceToEdit}
            />
        </div>
    );
};

export default ServicesScreen;
