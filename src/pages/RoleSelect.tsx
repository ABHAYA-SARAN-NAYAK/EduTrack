import React from 'react';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import { GraduationCap, Users, Sun, Moon, ArrowRight, CheckSquare } from 'lucide-react';

export const RoleSelect: React.FC = () => {
  const { setRole } = useData();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-brand-bg-dark text-slate-800 dark:text-slate-105 flex flex-col font-sans transition-colors relative overflow-hidden">
      
      {/* Decorative Blur Orbs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header controls */}
      <header className="w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 dark:bg-indigo-500 text-white p-2 rounded-xl shadow-lg">
            <CheckSquare className="w-5 h-5" />
          </div>
          <span className="text-lg font-bold font-display tracking-tight text-slate-900 dark:text-white">
            EduTrack
          </span>
        </div>
        
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </header>

      {/* Landing Main Body */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 z-10">
        <div className="max-w-xl w-full text-center space-y-8">
          
          {/* Welcome Text */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-3"
          >
            <h1 className="text-4xl sm:text-5xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white leading-tight">
              College Coursework <br />
              <span className="bg-gradient-to-r from-indigo-550 to-indigo-400 bg-clip-text text-transparent">
                Tracking, Simplified.
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-md mx-auto font-medium">
              Eliminate chaos. Faculty get full visibility into grades & submissions. Students stay on top of deadlines.
            </p>
          </motion.div>

          {/* Selection Cards Container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-5"
          >
            {/* Faculty Portal Card */}
            <motion.div
              whileHover={{ y: -4 }}
              onClick={() => setRole('faculty')}
              className="group text-left p-6 rounded-2xl border glass-card bg-white dark:bg-brand-surface-dark cursor-pointer transition-all hover:border-indigo-500/40 hover:shadow-lg dark:hover:shadow-indigo-950/20"
            >
              <div className="bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 p-3 rounded-xl w-fit mb-5 group-hover:scale-105 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-display text-slate-800 dark:text-white flex items-center gap-1">
                <span>Faculty Portal</span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-indigo-500" />
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-2 leading-relaxed">
                Create assignments, grade student coursework, track batch submission statistics, and edit states.
              </p>
            </motion.div>

            {/* Student Portal Card */}
            <motion.div
              whileHover={{ y: -4 }}
              onClick={() => setRole('student')}
              className="group text-left p-6 rounded-2xl border glass-card bg-white dark:bg-brand-surface-dark cursor-pointer transition-all hover:border-indigo-500/40 hover:shadow-lg dark:hover:shadow-indigo-950/20"
            >
              <div className="bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 p-3 rounded-xl w-fit mb-5 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-display text-slate-800 dark:text-white flex items-center gap-1">
                <span>Student Portal</span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-indigo-500" />
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-2 leading-relaxed">
                View pending deadlines, check grades & feedback, self-submit assignments, and avoid late coursework.
              </p>
            </motion.div>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider"
          >
            Dual-role dashboard demonstration • pure frontend prototype
          </motion.p>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-6 text-xs font-semibold text-slate-400 dark:text-slate-600 z-10 border-t border-slate-200/40 dark:border-slate-850/40 bg-white/10 dark:bg-brand-surface-dark/10 backdrop-blur-md">
        <span>EduTrack © 2026. Built as an Internship Submission Project.</span>
      </footer>
    </div>
  );
};
