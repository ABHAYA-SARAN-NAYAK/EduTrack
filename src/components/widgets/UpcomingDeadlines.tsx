import React from 'react';
import { useData } from '../../context/DataContext';
import type { SubmissionStatus } from '../../types';
import { parseISO, differenceInDays } from 'date-fns';
import { Bell, Flame, Calendar, Clock } from 'lucide-react';

// System date for relative computations
const SYSTEM_DATE = new Date('2026-06-25T18:36:55+05:30');

export const UpcomingDeadlines: React.FC = () => {
  const { assignments, selectedStudentId, subjects, getDerivedStatus, students } = useData();

  const currentStudent = students.find(s => s.id === selectedStudentId);

  // Compute upcoming deadlines for the selected student
  const deadlines = React.useMemo(() => {
    if (!currentStudent) return [];

    // Filter assignments assigned to this student's enrolled subjects
    const studentAssignments = assignments.filter(asg => 
      currentStudent.subjectIds.includes(asg.subjectId)
    );

    // Filter for unsubmitted tasks and map details
    const unsubmitted = studentAssignments
      .filter(asg => {
        const sub = asg.submissions.find(s => s.studentId === selectedStudentId);
        const rawStatus = sub ? sub.status : ('pending' as SubmissionStatus);
        const derived = getDerivedStatus(asg.dueDate, rawStatus);
        return derived !== 'submitted';
      })
      .map(asg => {
        const sub = asg.submissions.find(s => s.studentId === selectedStudentId);
        const rawStatus = sub ? sub.status : ('pending' as SubmissionStatus);
        const derived = getDerivedStatus(asg.dueDate, rawStatus);
        const subject = subjects.find(s => s.id === asg.subjectId);
        
        const due = parseISO(asg.dueDate);
        const diffDays = differenceInDays(due, SYSTEM_DATE);
        
        let urgency: 'high' | 'medium' | 'low' = 'low';
        let relativeTime = '';

        if (derived === 'late') {
          urgency = 'high';
          relativeTime = 'Overdue';
        } else if (diffDays <= 2) {
          urgency = 'medium';
          relativeTime = `Due in ${diffDays === 0 ? 'today' : `${diffDays}d`}`;
        } else {
          urgency = 'low';
          relativeTime = `Due in ${diffDays}d`;
        }

        return {
          id: asg.id,
          title: asg.title,
          subjectName: subject?.name.split(' (')[0] || 'Course',
          dueDate: due,
          urgency,
          relativeTime,
          derivedStatus: derived
        };
      });

    // Sort by due date ascending (closest deadline first)
    return unsubmitted.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  }, [assignments, selectedStudentId, currentStudent, subjects, getDerivedStatus]);

  if (deadlines.length === 0) {
    return (
      <div className="rounded-2xl p-5 border glass-card bg-brand-surface-light dark:bg-brand-surface-dark flex flex-col gap-4 h-full items-center justify-center text-center py-8">
        <div className="p-3 bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-500 rounded-full">
          <Bell className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-700 dark:text-slate-200">No Pending Deadlines</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-[200px]">You are all caught up on your assignments!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl p-5 border glass-card bg-brand-surface-light dark:bg-brand-surface-dark flex flex-col gap-4 h-full">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/40 pb-3">
        <Bell className="w-4 h-4 text-indigo-500" />
        <span className="text-sm font-bold font-display text-slate-800 dark:text-slate-200">
          Upcoming Deadlines
        </span>
      </div>

      {/* Deadlines List */}
      <div className="flex flex-col gap-3 max-h-[350px] overflow-y-auto pr-1">
        {deadlines.map(item => (
          <div 
            key={item.id}
            className={`flex items-start justify-between gap-3 p-3 rounded-xl border transition-all ${
              item.urgency === 'high' 
                ? 'bg-rose-500/5 border-rose-500/20 text-rose-700 dark:text-rose-400' 
                : item.urgency === 'medium'
                ? 'bg-amber-500/5 border-amber-500/20 text-amber-700 dark:text-amber-400'
                : 'bg-slate-500/5 border-slate-200/50 dark:border-slate-800/40 text-slate-600 dark:text-slate-350'
            }`}
          >
            <div className="flex-1 min-w-0">
              <span className="text-[9px] font-extrabold uppercase tracking-wide opacity-80 block">
                {item.subjectName}
              </span>
              <p className="text-xs font-bold line-clamp-1 text-slate-800 dark:text-slate-200 mt-0.5" title={item.title}>
                {item.title}
              </p>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-1 inline-flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {item.dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>

            {/* Urgency Badge */}
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider shrink-0 ${
              item.urgency === 'high' 
                ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-450 border border-rose-300/20' 
                : item.urgency === 'medium'
                ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-450 border border-amber-300/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-transparent'
            }`}>
              {item.urgency === 'high' && <Flame className="w-2.5 h-2.5 shrink-0" />}
              {item.urgency === 'medium' && <Clock className="w-2.5 h-2.5 shrink-0" />}
              <span>{item.relativeTime}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
