import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { DataProvider, useData } from './context/DataContext';
import { ToastProvider } from './context/ToastContext';
import { RoleSelect } from './pages/RoleSelect';
import { FacultyDashboard } from './pages/FacultyDashboard';
import { StudentDashboard } from './pages/StudentDashboard';

const AppContent: React.FC = () => {
  const { role } = useData();

  if (role === null) {
    return <RoleSelect />;
  }

  return (
    <div className="w-full min-h-screen transition-colors duration-200">
      {role === 'faculty' ? (
        <FacultyDashboard />
      ) : (
        <StudentDashboard />
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <DataProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </DataProvider>
    </ThemeProvider>
  );
};

export default App;
