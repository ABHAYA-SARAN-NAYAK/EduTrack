import React from 'react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, GraduationCap, Users, Calendar, Search } from 'lucide-react';

interface TopBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({ searchQuery, setSearchQuery }) => {
  const { role, setRole, students, selectedStudentId, setSelectedStudentId, currentDateString } = useData();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full border-b glass-card bg-brand-surface-light/80 dark:bg-brand-surface-dark/80 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Brand Logo & Date */}
      <div className="flex items-center justify-between md:justify-start gap-4">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 dark:bg-indigo-500 text-white p-2 rounded-xl shadow-lg shadow-indigo-600/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-display tracking-tight text-slate-900 dark:text-white">
              EduTrack
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Assignment Submission System
            </p>
          </div>
        </div>
        
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 text-xs font-semibold">
          <Calendar className="w-3.5 h-3.5" />
          <span>{currentDateString}</span>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative flex-1 max-w-md w-full mx-0 md:mx-4">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-4.5 w-4.5 text-slate-400" />
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={role === 'faculty' ? "Search assignments..." : "Search my assignments..."}
          className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-3 self-end md:self-auto">
        {/* Student Selector (Visible in Student role only) */}
        {role === 'student' && (
          <div className="flex items-center gap-2">
            <span className="hidden lg:inline text-xs text-slate-500 dark:text-slate-400 font-medium">
              Testing as:
            </span>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="text-xs font-semibold py-1.5 pl-2.5 pr-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name} ({student.rollNo})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Role Switcher */}
        <div className="flex p-0.5 rounded-lg bg-slate-100 dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-800/50">
          <button
            onClick={() => setRole('faculty')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              role === 'faculty'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Faculty</span>
          </button>
          <button
            onClick={() => setRole('student')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              role === 'student'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Student</span>
          </button>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
