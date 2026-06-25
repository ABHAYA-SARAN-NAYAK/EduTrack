import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import type { Assignment, SubmissionStatus } from '../../types';
import { StatusPill } from './StatusPill';
import { format, parseISO } from 'date-fns';
import { Calendar, User, ChevronDown, ChevronUp, CheckCircle, Clock, AlertTriangle, FileText } from 'lucide-react';

interface AssignmentTableProps {
  assignments: Assignment[];
}

export const AssignmentTable: React.FC<AssignmentTableProps> = ({ assignments }) => {
  const { subjects, students, updateStudentStatus, getDerivedStatus } = useData();
  const { addToast } = useToast();
  
  // Track expanded assignment IDs
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleRow = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const handleStatusChange = (assignmentId: string, studentId: string, newStatus: SubmissionStatus, studentName: string) => {
    updateStudentStatus(assignmentId, studentId, newStatus);
    addToast(`Updated ${studentName}'s status to ${newStatus.toUpperCase()}`, 'success');
  };

  // Helper to format due date
  const formatDueDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), 'MMM dd, yyyy (hh:mm a)');
    } catch {
      return dateStr;
    }
  };

  const getSubjectInfo = (subjectId: string) => {
    return subjects.find(s => s.id === subjectId) || { name: 'Unknown Subject', colorTag: 'indigo' };
  };

  // Tailwind v4 color mapping for tags
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
    <div className="w-full">
      {/* Desktop view (table) */}
      <div className="hidden sm:block w-full overflow-hidden rounded-2xl border glass-card bg-brand-surface-light dark:bg-brand-surface-dark">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200/50 dark:border-slate-800/50 bg-slate-50/40 dark:bg-slate-900/40 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              <th className="py-4 px-6 w-12"></th>
              <th className="py-4 px-6">Assignment Details</th>
              <th className="py-4 px-6">Subject</th>
              <th className="py-4 px-6">Due Date</th>
              <th className="py-4 px-6 text-center">Submissions Breakdown</th>
              <th className="py-4 px-6 w-12"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
            {assignments.map(asg => {
              const subInfo = getSubjectInfo(asg.subjectId);
              const isExpanded = expandedId === asg.id;
              
              // Compute submissions metrics
              const totalSubs = asg.submissions.length;
              const submittedCount = asg.submissions.filter(s => getDerivedStatus(asg.dueDate, s.status) === 'submitted').length;
              const pendingCount = asg.submissions.filter(s => getDerivedStatus(asg.dueDate, s.status) === 'pending').length;
              const lateCount = asg.submissions.filter(s => getDerivedStatus(asg.dueDate, s.status) === 'late').length;

              const percent = totalSubs > 0 ? Math.round((submittedCount / totalSubs) * 100) : 0;

              return (
                <React.Fragment key={asg.id}>
                  {/* Table Row */}
                  <tr 
                    onClick={() => toggleRow(asg.id)}
                    className={`hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors cursor-pointer ${
                      isExpanded ? 'bg-slate-50/30 dark:bg-slate-900/10' : ''
                    }`}
                  >
                    <td className="py-4.5 px-6">
                      <div className="flex items-center justify-center p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400">
                        <FileText className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                      </div>
                    </td>
                    <td className="py-4.5 px-6 max-w-sm">
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 line-clamp-1">
                        {asg.title}
                      </h4>
                      {asg.description && (
                        <p className="text-xs text-slate-400 dark:text-slate-500 line-clamp-1 mt-0.5">
                          {asg.description}
                        </p>
                      )}
                    </td>
                    <td className="py-4.5 px-6">
                      <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold border ${getSubjectBadgeStyle(subInfo.colorTag)}`}>
                        {subInfo.name}
                      </span>
                    </td>
                    <td className="py-4.5 px-6 text-slate-600 dark:text-slate-300 text-xs font-semibold">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatDueDate(asg.dueDate)}</span>
                      </div>
                    </td>
                    <td className="py-4.5 px-6">
                      <div className="flex flex-col items-center justify-center gap-1.5">
                        <div className="flex items-center gap-3 w-full max-w-[120px]">
                          <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 w-8 text-right">
                            {percent}%
                          </span>
                        </div>
                        <div className="flex items-center gap-2.5 text-[10px] font-bold">
                          <span className="text-emerald-600 dark:text-emerald-500 flex items-center gap-0.5">
                            <CheckCircle className="w-2.5 h-2.5" /> {submittedCount}
                          </span>
                          <span className="text-amber-600 dark:text-amber-500 flex items-center gap-0.5">
                            <Clock className="w-2.5 h-2.5" /> {pendingCount}
                          </span>
                          <span className="text-rose-600 dark:text-rose-500 flex items-center gap-0.5">
                            <AlertTriangle className="w-2.5 h-2.5" /> {lateCount}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4.5 px-6 text-slate-400">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </td>
                  </tr>

                  {/* Expanded Student Submission Matrix */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <tr>
                        <td colSpan={6} className="p-0 border-t-0 bg-slate-50/10 dark:bg-slate-900/5">
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: 'easeInOut' }}
                            className="overflow-hidden"
                          >
                            <div className="px-12 py-5 border-t border-b border-slate-100 dark:border-slate-800/40">
                              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3.5">
                                Student Submissions Detail
                              </h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                                {students.filter(st => st.subjectIds.includes(asg.subjectId)).map(student => {
                                  const sub = asg.submissions.find(s => s.studentId === student.id) || { status: 'pending' as SubmissionStatus };
                                  const derived = getDerivedStatus(asg.dueDate, sub.status);
                                  
                                  return (
                                    <div 
                                      key={student.id} 
                                      className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/40 bg-white dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                                    >
                                      <div className="flex items-center gap-2.5">
                                        <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 text-indigo-500 dark:text-indigo-400">
                                          <User className="w-3.5 h-3.5" />
                                        </div>
                                        <div>
                                          <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                                            {student.name}
                                          </p>
                                          <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 mt-0.5">
                                            Roll No: {student.rollNo}
                                          </p>
                                        </div>
                                      </div>
                                      <StatusPill 
                                        status={derived} 
                                        isEditable={true} 
                                        onChange={(newStatus) => handleStatusChange(asg.id, student.id, newStatus, student.name)} 
                                      />
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </motion.div>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile view (stacked cards) */}
      <div className="block sm:hidden flex flex-col gap-4">
        {assignments.map(asg => {
          const subInfo = getSubjectInfo(asg.subjectId);
          const isExpanded = expandedId === asg.id;
          
          const totalSubs = asg.submissions.length;
          const submittedCount = asg.submissions.filter(s => getDerivedStatus(asg.dueDate, s.status) === 'submitted').length;
          const percent = totalSubs > 0 ? Math.round((submittedCount / totalSubs) * 100) : 0;

          return (
            <div 
              key={asg.id}
              className="rounded-2xl border glass-card bg-brand-surface-light dark:bg-brand-surface-dark overflow-hidden transition-all"
            >
              <div 
                onClick={() => toggleRow(asg.id)}
                className="p-4 flex items-start justify-between gap-2 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-900/10"
              >
                <div className="flex-1 min-w-0">
                  <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold border mb-1.5 ${getSubjectBadgeStyle(subInfo.colorTag)}`}>
                    {subInfo.name}
                  </span>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 line-clamp-2">
                    {asg.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    Due: {formatDueDate(asg.dueDate)}
                  </p>
                  
                  {/* Mini breakdown progress */}
                  <div className="flex items-center gap-2 mt-2 w-fit">
                    <div className="w-20 bg-slate-200 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${percent}%` }} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                      {percent}% ({submittedCount}/{totalSubs})
                    </span>
                  </div>
                </div>
                <div className="text-slate-400 self-center">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-slate-100 dark:border-slate-800/40 bg-slate-50/20 dark:bg-slate-900/5 overflow-hidden"
                  >
                    <div className="p-4 flex flex-col gap-2.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Student Submissions
                      </p>
                      {students.filter(st => st.subjectIds.includes(asg.subjectId)).map(student => {
                        const sub = asg.submissions.find(s => s.studentId === student.id) || { status: 'pending' as SubmissionStatus };
                        const derived = getDerivedStatus(asg.dueDate, sub.status);
                        
                        return (
                          <div 
                            key={student.id} 
                            className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/40 bg-white dark:bg-slate-900/50"
                          >
                            <div>
                              <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{student.name}</p>
                              <p className="text-[9px] text-slate-400 dark:text-slate-500">Roll: {student.rollNo}</p>
                            </div>
                            <StatusPill 
                              status={derived} 
                              isEditable={true} 
                              onChange={(newStatus) => handleStatusChange(asg.id, student.id, newStatus, student.name)} 
                            />
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};
