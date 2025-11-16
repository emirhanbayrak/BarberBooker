import React, { useState, useEffect } from 'react';
import { Service } from '../types';

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (service: Omit<Service, 'id'> | Service) => void;
  serviceToEdit: Service | null;
}

const ServiceModal: React.FC<ServiceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  serviceToEdit,
}) => {
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    if (serviceToEdit) {
      setName(serviceToEdit.name);
      setDuration(serviceToEdit.duration.toString());
      setPrice(serviceToEdit.price.toString());
    } else {
      setName('');
      setDuration('');
      setPrice('');
    }
  }, [serviceToEdit, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !duration || !price || +duration <= 0 || +price < 0) {
      alert('Lütfen tüm alanları geçerli değerlerle doldurun.');
      return;
    }

    const serviceData = {
      name,
      duration: Number(duration),
      price: Number(price),
    };

    if (serviceToEdit) {
      onSave({ ...serviceData, id: serviceToEdit.id });
    } else {
      onSave(serviceData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4 animate-fade-in">
      <div className="bg-brand-secondary rounded-lg shadow-xl p-6 w-full max-w-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-brand-accent">
            {serviceToEdit ? 'Hizmeti Düzenle' : 'Yeni Hizmet Ekle'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <i className="fa-solid fa-times text-xl"></i>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="service-name" className="block text-sm font-medium text-gray-300 mb-1">Hizmet Adı</label>
            <input
              id="service-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Örn: Saç Kesim"
              className="w-full p-3 bg-brand-primary border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent"
              required
            />
          </div>
          <div>
            <label htmlFor="service-duration" className="block text-sm font-medium text-gray-300 mb-1">Süre (dakika)</label>
            <input
              id="service-duration"
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Örn: 45"
              min="1"
              className="w-full p-3 bg-brand-primary border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent"
              required
            />
          </div>
          <div>
            <label htmlFor="service-price" className="block text-sm font-medium text-gray-300 mb-1">Fiyat (₺)</label>
            <input
              id="service-price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Örn: 250"
              min="0"
              className="w-full p-3 bg-brand-primary border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent"
              required
            />
          </div>
          <div className="mt-6 flex justify-end pt-2">
            <button
              type="submit"
              className="bg-brand-accent text-brand-primary font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity"
            >
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceModal;
