import React, { useState } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import DashboardScreen from './screens/DashboardScreen';
import CalendarScreen from './screens/CalendarScreen';
import AddAppointmentScreen from './screens/AddAppointmentScreen';
import BottomNav from './components/BottomNav';
import Toast from './components/Toast';
import WelcomeScreen from './screens/WelcomeScreen';

export type Screen = 'dashboard' | 'calendar' | 'addAppointment';

const AppContent: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');
  const { toastMessage, currentStaff } = useAppContext();

  if (!currentStaff) {
    return <WelcomeScreen />;
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <DashboardScreen />;
      case 'calendar':
        return <CalendarScreen />;
      case 'addAppointment':
        return <AddAppointmentScreen onAppointmentAdded={() => setCurrentScreen('calendar')} />;
      default:
        return <DashboardScreen />;
    }
  };

  return (
    <div className="h-screen w-screen bg-brand-primary text-brand-text flex flex-col font-sans max-w-md mx-auto shadow-2xl shadow-brand-accent/20">
      <main className="flex-grow overflow-y-auto pb-20">
        {renderScreen()}
      </main>
      <BottomNav currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} />
      {toastMessage && <Toast message={toastMessage} />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};


export default App;