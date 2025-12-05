
import React, { useState, useEffect } from 'react';
import { Service } from '../types';
import { useAppContext } from '../context/AppContext';

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
  const { categories } = useAppContext();
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState<number>(categories[0]?.id || 1);
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [price, setPrice] = useState('');
  const [requiresParts, setRequiresParts] = useState(false);

  useEffect(() => {
    if (serviceToEdit) {
      setName(serviceToEdit.name);
      setCategoryId(serviceToEdit.categoryId);
      setDescription(serviceToEdit.description || '');
      setDuration(serviceToEdit.duration.toString());
      setPrice(serviceToEdit.price.toString());
      setRequiresParts(serviceToEdit.requiresParts || false);
    } else {
      setName('');
      setCategoryId(categories[0]?.id || 1);
      setDescription('');
      setDuration('');
      setPrice('');
      setRequiresParts(false);
    }
  }, [serviceToEdit, isOpen, categories]);

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
      categoryId,
      description,
      duration: Number(duration),
      price: Number(price),
      requiresParts
    };

    if (serviceToEdit) {
      onSave({ ...serviceData, id: serviceToEdit.id });
    } else {
      onSave(serviceData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4 animate-fade-in">
      <div className="bg-brand-secondary rounded-lg shadow-xl p-6 w-full max-w-sm max-h-[90vh] overflow-y-auto">
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
            <label htmlFor="service-category" className="block text-sm font-medium text-gray-300 mb-1">Kategori</label>
            <select
              id="service-category"
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              className="w-full p-3 bg-brand-primary border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent"
            >
                {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
            </select>
          </div>
          <div>
            <label htmlFor="service-name" className="block text-sm font-medium text-gray-300 mb-1">Hizmet Adı</label>
            <input
              id="service-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Örn: Balata Değişimi"
              className="w-full p-3 bg-brand-primary border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent"
              required
            />
          </div>
          <div>
            <label htmlFor="service-desc" className="block text-sm font-medium text-gray-300 mb-1">Açıklama</label>
            <textarea
              id="service-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Hizmet detayları..."
              className="w-full p-3 bg-brand-primary border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent h-20"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
                <label htmlFor="service-duration" className="block text-sm font-medium text-gray-300 mb-1">Süre (dk)</label>
                <input
                id="service-duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="45"
                min="1"
                className="w-full p-3 bg-brand-primary border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent"
                required
                />
            </div>
            <div className="flex-1">
                <label htmlFor="service-price" className="block text-sm font-medium text-gray-300 mb-1">Fiyat (₺)</label>
                <input
                id="service-price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="250"
                min="0"
                className="w-full p-3 bg-brand-primary border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent"
                required
                />
            </div>
          </div>
          
          <div className="flex items-center gap-2 mt-2">
            <input 
                id="requires-parts"
                type="checkbox"
                checked={requiresParts}
                onChange={(e) => setRequiresParts(e.target.checked)}
                className="w-4 h-4 rounded border-gray-600 bg-brand-primary text-brand-accent focus:ring-brand-accent"
            />
            <label htmlFor="requires-parts" className="text-sm text-gray-300">Parça değişimi içeriyor</label>
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
