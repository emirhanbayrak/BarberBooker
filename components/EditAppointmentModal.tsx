
import React, { useState, useEffect } from 'react';
import { Appointment } from '../types';
import { CAR_DATABASE } from '../constants';

interface EditAppointmentModalProps {
  isOpen: boolean;
  appointment: Appointment | null;
  onClose: () => void;
  onSave: (updatedAppointment: Appointment) => void;
  onDelete: (appointmentId: number) => void;
}

const EditAppointmentModal: React.FC<EditAppointmentModalProps> = ({
  isOpen,
  appointment,
  onClose,
  onSave,
  onDelete,
}) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [price, setPrice] = useState('');
  const [materialCost, setMaterialCost] = useState('');
  const [notes, setNotes] = useState('');
  
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [customMake, setCustomMake] = useState('');
  const [customModel, setCustomModel] = useState('');
  const [carYear, setCarYear] = useState('');

  const today = new Date().toISOString().split('T')[0];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  useEffect(() => {
    if (appointment) {
      const startTime = new Date(appointment.startTime);
      setDate(startTime.toISOString().split('T')[0]);
      setTime(startTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
      setPrice(appointment.price.toString());
      setMaterialCost(appointment.materialCost ? appointment.materialCost.toString() : '');
      setNotes(appointment.notes || '');
      setCarYear(appointment.carYear ? appointment.carYear.toString() : '');
      
      // Determine if it's a known make/model or custom
      const isKnownMake = CAR_DATABASE.some(c => c.make === appointment.carMake);
      if (isKnownMake) {
          setSelectedMake(appointment.carMake);
          const models = CAR_DATABASE.find(c => c.make === appointment.carMake)?.models || [];
          const isKnownModel = models.includes(appointment.carModel);
          if (isKnownModel) {
             setSelectedModel(appointment.carModel);
             setCustomMake('');
             setCustomModel('');
          } else {
             setSelectedModel('Diğer');
             setCustomModel(appointment.carModel);
             setCustomMake('');
          }
      } else {
          setSelectedMake('Diğer');
          setCustomMake(appointment.carMake);
          setCustomModel(appointment.carModel);
          setSelectedModel('Diğer'); // Force logic to show custom input
      }

    }
  }, [appointment]);

  if (!isOpen || !appointment) {
    return null;
  }

  const calculateProfit = () => {
      const revenue = Number(price) || 0;
      const cost = Number(materialCost) || 0;
      return revenue - cost;
  };

  const getModelsForMake = (make: string) => {
    if (make === 'Diğer') return [];
    const car = CAR_DATABASE.find(c => c.make === make);
    return car ? car.models : [];
  };

  const handleSave = () => {
    const finalMake = selectedMake === 'Diğer' ? customMake : selectedMake;
    const finalModel = (selectedMake === 'Diğer' || selectedModel === 'Diğer') ? customModel : selectedModel;

    if (!finalMake || !finalModel) {
        alert("Lütfen araç marka ve modelini belirtiniz.");
        return;
    }

    const [year, month, day] = date.split('-').map(Number);
    const [hours, minutes] = time.split(':').map(Number);
    const newStartTime = new Date(year, month - 1, day, hours, minutes);

    onSave({
      ...appointment,
      startTime: newStartTime,
      price: Number(price),
      materialCost: materialCost ? Number(materialCost) : 0,
      notes: notes,
      carMake: finalMake,
      carModel: finalModel,
      carYear: carYear ? Number(carYear) : undefined
    });
  };

  const handleDelete = () => {
    if (window.confirm('Bu randevuyu silmek istediğinizden emin misiniz?')) {
      onDelete(appointment.id);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-brand-secondary rounded-lg shadow-xl p-6 w-full max-w-sm max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-brand-accent">Randevuyu Düzenle</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <i className="fa-solid fa-times text-xl"></i>
          </button>
        </div>
        <div className="space-y-4">
          
          <div className="grid grid-cols-2 gap-4">
              <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Marka</label>
                  <select
                      value={selectedMake}
                      onChange={(e) => {
                          setSelectedMake(e.target.value);
                          setSelectedModel('');
                          if (e.target.value !== 'Diğer') setCustomMake('');
                      }}
                      className="w-full p-2 bg-brand-primary border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent text-sm"
                  >
                      <option value="">Seçiniz</option>
                      {CAR_DATABASE.map(car => (
                          <option key={car.make} value={car.make}>{car.make}</option>
                      ))}
                      <option value="Diğer">Diğer</option>
                  </select>
              </div>
              <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Model</label>
                  {selectedMake === 'Diğer' ? (
                       <input
                        type="text"
                        disabled
                        value="Manuel Giriş"
                        className="w-full p-2 bg-brand-primary border border-gray-600 rounded-lg focus:outline-none opacity-50 text-sm cursor-not-allowed"
                       />
                  ) : (
                    <select
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="w-full p-2 bg-brand-primary border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent text-sm"
                        disabled={!selectedMake}
                    >
                        <option value="">{selectedMake ? 'Seçiniz' : 'Marka?'}</option>
                        {getModelsForMake(selectedMake).map(m => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                        <option value="Diğer">Diğer</option>
                    </select>
                  )}
              </div>
          </div>

          {(selectedMake === 'Diğer' || selectedModel === 'Diğer') && (
               <div className="bg-brand-primary/30 p-3 rounded border border-brand-accent/20 grid grid-cols-2 gap-2 animate-fade-in">
                    {selectedMake === 'Diğer' && (
                        <div>
                             <label className="block text-xs font-medium text-gray-400 mb-1">Marka</label>
                             <input 
                                type="text"
                                value={customMake}
                                onChange={(e) => setCustomMake(e.target.value)}
                                className="w-full p-2 bg-brand-primary border border-gray-600 rounded text-sm"
                             />
                        </div>
                    )}
                    <div className={selectedMake !== 'Diğer' ? 'col-span-2' : ''}>
                         <label className="block text-xs font-medium text-gray-400 mb-1">Model</label>
                         <input 
                            type="text"
                            value={customModel}
                            onChange={(e) => setCustomModel(e.target.value)}
                            className="w-full p-2 bg-brand-primary border border-gray-600 rounded text-sm"
                         />
                    </div>
               </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Model Yılı</label>
            <select
                value={carYear}
                onChange={(e) => setCarYear(e.target.value)}
                className="w-full p-2 bg-brand-primary border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent text-sm"
            >
                <option value="">Seçiniz (Opsiyonel)</option>
                {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Tarih</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={today}
                  className="w-full p-3 bg-brand-primary border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent [color-scheme:dark]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Saat</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full p-3 bg-brand-primary border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent [color-scheme:dark]"
                />
              </div>
          </div>

          <div className="flex gap-4">
              <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Ücret (₺)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full p-3 bg-brand-primary border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent"
                  />
              </div>
              <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Malzeme (₺)</label>
                  <input
                    type="number"
                    value={materialCost}
                    onChange={(e) => setMaterialCost(e.target.value)}
                    placeholder="0"
                    className="w-full p-3 bg-brand-primary border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent"
                  />
              </div>
          </div>
          
           <div className="bg-brand-primary/30 p-2 rounded flex justify-between items-center text-sm border border-gray-700">
                <span className="text-gray-400">Tahmini Kâr:</span>
                <span className={`font-bold font-mono ${calculateProfit() >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {calculateProfit()} ₺
                </span>
            </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Notlar</label>
            <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-3 bg-brand-primary border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent h-20 resize-none"
            />
          </div>

        </div>
        <div className="mt-6 flex space-x-3">
          <button
            onClick={handleSave}
            className="flex-1 bg-brand-accent text-brand-primary font-bold py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            Kaydet
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            Sil
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditAppointmentModal;