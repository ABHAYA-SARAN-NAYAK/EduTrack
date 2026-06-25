import React from 'react';
import { motion } from 'framer-motion';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import type { Assignment, SubmissionStatus } from '../../types';
import { StatusPill } from './StatusPill';
import { format, parseISO } from 'date-fns';
import { Calendar, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

interface AssignmentCardProps {
  assignment: Assignment;
}

export const AssignmentCard: React.FC<AssignmentCardProps> = ({ assignment }) => {
  const { subjects, selectedStudentId, selfSubmitAssignment, getDerivedStatus } = useData();
  const { addToast } = useToast();
  
  const [isExpanded, setIsExpanded] = React.useState(false);

  const subjectInfo = subjects.find(s => s.id === assignment.subjectId) || { name: 'Unknown Subject', colorTag: 'indigo' };
  
  // Find current student's submission record
  const studentSubmission = assignment.submissions.find(s => s.studentId === selectedStudentId);
  const rawStatus = studentSubmission ? studentSubmission.status : ('pending' as SubmissionStatus);
  const status = getDerivedStatus(assignment.dueDate, rawStatus);

  const handleMarkAsSubmitted = (e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid expanding card
    selfSubmitAssignment(assignment.id, selectedStudentId);
    addToast(`Marked "${assignment.title}" as SUBMITTED!`, 'success');
  };

  const formatDueDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), 'MMM dd, yyyy (hh:mm a)');
    } catch {
      return dateStr;
    }
  };

  // Tailwind v4 color mapping for badges
  const getSubjectBadgeStyle = (colorTag: string) => {
    const maps: Record<string, string> = {
      indigo: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-200/30 dark:border-indigo-500/20',
      amber: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200/30 dark:border-amber-500/20',
      cyan: 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-200/30 dark:border-cyan-500/20',
      emerald: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200/30 dark:border-emerald-500/20',
      rose: 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200/30 dark:border-rose-500/20',
    };
    return maps[colorTag] || maps.indigo;
  };

  return (
    <motion.div
      layout
      whileHover={{ y: -2 }}
      onClick={() => setIsExpanded(!isExpanded)}
      className="group rounded-2xl border glass-card bg-brand-surface-light dark:bg-brand-surface-dark p-5 cursor-pointer shadow-md transition-all duration-300 hover:border-slate-300/40 dark:hover:border-slate-700/50 flex flex-col gap-4 text-left"
    >
      {/* Header Info */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1.5 flex-1">
          <span className={`inline-flex px-2.5 py-0.5 rounded-lg text-[10px] font-bold border ${getSubjectBadgeStyle(subjectInfo.colorTag)}`}>
            {subjectInfo.name}
          </span>
          <h3 className="text-base font-bold font-display text-slate-800 dark:text-white leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {assignment.title}
          </h3>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <StatusPill status={status} />
        </div>
      </div>

      {/* Description Preview (always show a snippet, expand for all) */}
      {assignment.description && (
        <p className={`text-xs text-slate-500 dark:text-slate-400 font-medium ${isExpanded ? '' : 'line-clamp-2'}`}>
          {assignment.description}
        </p>
      )}

      {/* Footer Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-150/40 dark:border-slate-800/40 pt-3.5 mt-1">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>Due: {formatDueDate(assignment.dueDate)}</span>
        </div>

        {/* Action Button & Expand Toggle */}
        <div className="flex items-center justify-between sm:justify-end gap-3.5">
          {status !== 'submitted' ? (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleMarkAsSubmitted}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-600/10 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Mark Submitted</span>
            </motion.button>
          ) : (
            studentSubmission?.submittedAt && (
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-500">
                Submitted {format(parseISO(studentSubmission.submittedAt), 'MMM dd')}
              </span>
            )
          )}
          
          <button 
            type="button" 
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
