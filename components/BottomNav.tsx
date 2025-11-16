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
    aria-label={label}
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
      <NavItem
        icon="fa-calendar-alt"
        label="Takvim"
        isActive={currentScreen === 'calendar'}
        onClick={() => setCurrentScreen('calendar')}
      />
       <NavItem
        icon="fa-plus-circle"
        label="Yeni"
        isActive={currentScreen === 'addAppointment'}
        onClick={() => setCurrentScreen('addAppointment')}
      />
      <NavItem
        icon="fa-cut"
        label="Hizmetler"
        isActive={currentScreen === 'services'}
        onClick={() => setCurrentScreen('services')}
      />
    </div>
  );
};

export default BottomNav;