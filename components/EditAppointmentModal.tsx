
import React, { useState, useEffect } from 'react';
import { Appointment } from '../types';

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
  
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (appointment) {
      const startTime = new Date(appointment.startTime);
      setDate(startTime.toISOString().split('T')[0]);
      setTime(startTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
      setPrice(appointment.price.toString());
      setMaterialCost(appointment.materialCost ? appointment.materialCost.toString() : '');
      setNotes(appointment.notes || '');
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

  const handleSave = () => {
    const [year, month, day] = date.split('-').map(Number);
    const [hours, minutes] = time.split(':').map(Number);
    const newStartTime = new Date(year, month - 1, day, hours, minutes);

    onSave({
      ...appointment,
      startTime: newStartTime,
      price: Number(price),
      materialCost: materialCost ? Number(materialCost) : 0,
      notes: notes,
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