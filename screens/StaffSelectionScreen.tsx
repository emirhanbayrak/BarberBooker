import React from 'react';
import { Staff } from '../types';
import { useAppContext } from '../context/AppContext';

interface StaffSelectionScreenProps {
  onStaffSelect: (staff: Staff) => void;
}

const StaffSelectionScreen: React.FC<StaffSelectionScreenProps> = ({ onStaffSelect }) => {
  const { staff } = useAppContext();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-brand-primary p-6">
      <h1 className="text-4xl font-bold text-brand-accent mb-2">Auto Service</h1>
      <h2 className="text-2xl font-light text-brand-text mb-12 tracking-wider">Repair</h2>
      <p className="text-xl text-brand-light mb-8">Personel Seçimi</p>
      <div className="w-full max-w-xs space-y-4">
        {staff.map((member) => (
          <button
            key={member.id}
            onClick={() => onStaffSelect(member)}
            className="w-full flex items-center p-4 bg-brand-secondary rounded-lg text-brand-text hover:bg-brand-accent hover:text-brand-primary transition-all duration-300 shadow-lg"
          >
            <img src={member.avatar} alt={member.name} className="w-12 h-12 rounded-full mr-4 border-2 border-brand-accent" />
            <span className="text-lg font-semibold">{member.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StaffSelectionScreen;