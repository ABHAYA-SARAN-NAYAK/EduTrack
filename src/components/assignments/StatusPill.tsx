import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SubmissionStatus } from '../../types';
import { CheckCircle2, Clock, AlertTriangle, ChevronDown } from 'lucide-react';

interface StatusPillProps {
  status: SubmissionStatus;
  isEditable?: boolean;
  onChange?: (status: SubmissionStatus) => void;
}

export const StatusPill: React.FC<StatusPillProps> = ({
  status,
  isEditable = false,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (newStatus: SubmissionStatus) => {
    if (onChange) {
      onChange(newStatus);
    }
    setIsOpen(false);
  };

  // Status visual attributes
  const statusConfig = {
    submitted: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/50 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
      label: 'Submitted',
      icon: CheckCircle2,
      pulse: false,
    },
    pending: {
      bg: 'bg-amber-50 text-amber-700 border-amber-200/50 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
      label: 'Pending',
      icon: Clock,
      pulse: false,
    },
    late: {
      bg: 'bg-rose-50 text-rose-700 border-rose-200/50 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20',
      label: 'Late',
      icon: AlertTriangle,
      pulse: true,
    },
  };

  const current = statusConfig[status] || statusConfig.pending;
  const Icon = current.icon;

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        type="button"
        disabled={!isEditable}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border cursor-pointer select-none transition-all shadow-sm ${
          current.bg
        } ${
          isEditable
            ? 'hover:brightness-95 dark:hover:brightness-110 active:scale-95'
            : ''
        }`}
      >
        <span className="flex items-center gap-1">
          {current.pulse && (
            <span className="relative flex h-2 w-2 mr-0.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500 pulse-late"></span>
            </span>
          )}
          {!current.pulse && <Icon className="w-3.5 h-3.5 shrink-0" />}
          <span>{current.label}</span>
        </span>
        {isEditable && <ChevronDown className="w-3 h-3 text-slate-400 dark:text-slate-500 shrink-0" />}
      </button>

      <AnimatePresence>
        {isOpen && isEditable && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.12 }}
            className="absolute right-0 mt-1.5 w-32 rounded-xl border glass-card bg-white dark:bg-slate-900 shadow-xl z-50 overflow-hidden"
          >
            <div className="p-1 flex flex-col gap-0.5">
              {(['submitted', 'pending', 'late'] as SubmissionStatus[]).map((opt) => {
                const optConfig = statusConfig[opt];
                const OptIcon = optConfig.icon;
                return (
                  <button
                    key={opt}
                    onClick={() => handleSelect(opt)}
                    className={`flex items-center gap-2 w-full px-2.5 py-1.5 text-left text-xs font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ${
                      status === opt
                        ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-500/5'
                        : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <OptIcon className="w-3.5 h-3.5 shrink-0" />
                    <span>{optConfig.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
