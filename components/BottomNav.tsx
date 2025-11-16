import React from 'react';
import { Screen } from '../App';

interface BottomNavProps {
  currentScreen: Screen;
  setCurrentScreen: (screen: Screen) => void;
}

const NavItem: React.FC<{
  icon: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-full transition-colors duration-200 ${
      isActive ? 'text-brand-accent' : 'text-gray-400 hover:text-brand-light'
    }`}
  >
    <i className={`fa-solid ${icon} text-xl`}></i>
    <span className="text-xs mt-1">{label}</span>
  </button>
);

const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, setCurrentScreen }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-brand-secondary border-t border-brand-accent/20 max-w-md mx-auto flex justify-around items-center z-50">
      <NavItem
        icon="fa-th-large"
        label="Panel"
        isActive={currentScreen === 'dashboard'}
        onClick={() => setCurrentScreen('dashboard')}
      />
      <button 
        onClick={() => setCurrentScreen('addAppointment')}
        className="w-16 h-16 bg-brand-accent rounded-full flex items-center justify-center text-brand-primary text-3xl shadow-lg -mt-8 border-4 border-brand-primary transform hover:scale-105 active:scale-95 transition-transform duration-200"
      >
        <i className="fa-solid fa-plus"></i>
      </button>
      <NavItem
        icon="fa-calendar-alt"
        label="Takvim"
        isActive={currentScreen === 'calendar'}
        onClick={() => setCurrentScreen('calendar')}
      />
    </div>
  );
};

export default BottomNav;