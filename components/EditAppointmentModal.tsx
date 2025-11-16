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
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (appointment) {
      const startTime = new Date(appointment.startTime);
      setDate(startTime.toISOString().split('T')[0]);
      setTime(startTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
    }
  }, [appointment]);

  if (!isOpen || !appointment) {
    return null;
  }

  const handleSave = () => {
    const [year, month, day] = date.split('-').map(Number);
    const [hours, minutes] = time.split(':').map(Number);
    const newStartTime = new Date(year, month - 1, day, hours, minutes);

    onSave({
      ...appointment,
      startTime: newStartTime,
    });
  };

  const handleDelete = () => {
    if (window.confirm('Bu randevuyu silmek istediğinizden emin misiniz?')) {
      onDelete(appointment.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-brand-secondary rounded-lg shadow-xl p-6 w-full max-w-sm">
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