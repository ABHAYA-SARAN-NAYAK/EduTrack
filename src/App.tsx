import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { DataProvider, useData } from './context/DataContext';
import { ToastProvider } from './context/ToastContext';
import { RoleSelect } from './pages/RoleSelect';
import { FacultyDashboard } from './pages/FacultyDashboard';
import { StudentDashboard } from './pages/StudentDashboard';

const AppContent: React.FC = () => {
  const { role } = useData();
  
  // Decide whether to show the landing page based on whether a role has been set before
  const [showLanding, setShowLanding] = useState(() => {
    return !localStorage.getItem('edutrack-role');
  });

  if (showLanding) {
    return (
      <div className="w-full">
        {/* We capture role changes in RoleSelect and dismiss the landing page */}
        <RoleSelect />
        {/* We can listen to changes on role and close landing page */}
        <RoleChangeListener onRoleSet={() => setShowLanding(false)} />
      </div>
    );
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

// Small utility to transition from landing page once a role is clicked
const RoleChangeListener: React.FC<{ onRoleSet: () => void }> = ({ onRoleSet }) => {
  const { role } = useData();
  React.useEffect(() => {
    const savedRole = localStorage.getItem('edutrack-role');
    if (savedRole) {
      onRoleSet();
    }
  }, [role, onRoleSet]);
  return null;
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
