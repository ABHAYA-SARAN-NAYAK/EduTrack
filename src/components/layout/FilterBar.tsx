import React from 'react';
import { useData } from '../../context/DataContext';
import { Filter, X } from 'lucide-react';

interface FilterBarProps {
  selectedSubjectIds: string[];
  setSelectedSubjectIds: (ids: string[]) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedSubjectIds,
  setSelectedSubjectIds,
  selectedStatus,
  setSelectedStatus,
}) => {
  const { subjects } = useData();

  const handleSubjectToggle = (subjectId: string) => {
    if (selectedSubjectIds.includes(subjectId)) {
      setSelectedSubjectIds(selectedSubjectIds.filter(id => id !== subjectId));
    } else {
      setSelectedSubjectIds([...selectedSubjectIds, subjectId]);
    }
  };

  const clearAllFilters = () => {
    setSelectedSubjectIds([]);
    setSelectedStatus('all');
  };

  const hasActiveFilters = selectedSubjectIds.length > 0 || selectedStatus !== 'all';

  // Tailwind v4 dynamic colors mapping
  const getSubjectColorStyles = (colorTag: string) => {
    const maps: Record<string, { active: string; inactive: string }> = {
      indigo: {
        active: 'bg-indigo-600 dark:bg-indigo-500 text-white border-indigo-600 dark:border-indigo-500',
        inactive: 'bg-indigo-500/5 hover:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/15'
      },
      amber: {
        active: 'bg-amber-600 dark:bg-amber-500 text-white border-amber-600 dark:border-amber-500',
        inactive: 'bg-amber-500/5 hover:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/15'
      },
      cyan: {
        active: 'bg-cyan-600 dark:bg-cyan-500 text-white border-cyan-600 dark:border-cyan-500',
        inactive: 'bg-cyan-500/5 hover:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/15'
      },
      emerald: {
        active: 'bg-emerald-600 dark:bg-emerald-500 text-white border-emerald-600 dark:border-emerald-500',
        inactive: 'bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/15'
      },
      rose: {
        active: 'bg-rose-600 dark:bg-rose-500 text-white border-rose-600 dark:border-rose-500',
        inactive: 'bg-rose-500/5 hover:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/15'
      }
    };
    return maps[colorTag] || maps.indigo;
  };

  return (
    <div className="rounded-2xl p-5 border glass-card bg-brand-surface-light dark:bg-brand-surface-dark flex flex-col gap-4">
      {/* Header with clear action */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/40 pb-3">
        <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
          <Filter className="w-4 h-4 text-indigo-500" />
          <span className="text-sm font-bold font-display">Filters</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors cursor-pointer"
          >
            <X className="w-3 h-3" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Subjects filter list */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
          Filter by Subject
        </label>
        <div className="flex flex-wrap gap-2">
          {subjects.map((sub) => {
            const isActive = selectedSubjectIds.includes(sub.id);
            const style = getSubjectColorStyles(sub.colorTag);
            return (
              <button
                key={sub.id}
                onClick={() => handleSubjectToggle(sub.id)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                  isActive ? style.active : style.inactive
                }`}
              >
                {sub.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Status filter list */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
          Filter by Submission Status
        </label>
        <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-900/60 w-fit">
          {['all', 'submitted', 'pending', 'late'].map((status) => {
            const isActive = selectedStatus === status;
            const label = status.charAt(0).toUpperCase() + status.slice(1);
            return (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all uppercase tracking-wide ${
                  isActive
                    ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
