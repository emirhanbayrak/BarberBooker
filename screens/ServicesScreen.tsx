import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Service } from '../types';
import ServiceModal from '../components/ServiceModal';

const ServicesScreen: React.FC = () => {
    const { services, addService, updateService, deleteService } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [serviceToEdit, setServiceToEdit] = useState<Service | null>(null);

    const openModalToAdd = () => {
        setServiceToEdit(null);
        setIsModalOpen(true);
    };

    const openModalToEdit = (service: Service) => {
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

    const handleDeleteService = (serviceId: number) => {
        if (window.confirm('Bu hizmeti silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
            deleteService(serviceId);
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-brand-accent">Hizmet Yönetimi</h1>
                <button
                    onClick={openModalToAdd}
                    className="bg-brand-accent text-brand-primary font-semibold py-2 px-4 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity"
                >
                    <i className="fa-solid fa-plus"></i>
                    <span>Yeni Ekle</span>
                </button>
            </div>

            <div className="space-y-4">
                {services.length > 0 ? services.map(service => (
                    <div key={service.id} className="bg-brand-secondary p-4 rounded-lg shadow-md flex justify-between items-center animate-fade-in">
                        <div>
                            <h3 className="text-lg font-semibold text-brand-light">{service.name}</h3>
                            <p className="text-sm text-gray-400">{service.duration} dakika - <span className="font-mono">{service.price}₺</span></p>
                        </div>
                        <div className="flex gap-4">
                            <button onClick={() => openModalToEdit(service)} className="text-gray-300 hover:text-brand-accent transition-colors" aria-label={`${service.name} hizmetini düzenle`}><i className="fa-solid fa-pencil"></i></button>
                            <button onClick={() => handleDeleteService(service.id)} className="text-gray-300 hover:text-red-500 transition-colors" aria-label={`${service.name} hizmetini sil`}><i className="fa-solid fa-trash"></i></button>
                        </div>
                    </div>
                )) : (
                    <div className="text-center text-gray-400 mt-16">
                        <i className="fa-solid fa-cut text-4xl mb-4 text-gray-500"></i>
                        <p>Henüz hiç hizmet eklenmemiş.</p>
                        <p className="text-sm">Başlamak için 'Yeni Ekle' butonuna tıklayın.</p>
                    </div>
                )}
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
