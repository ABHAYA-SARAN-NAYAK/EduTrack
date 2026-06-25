import React from 'react';
import { motion } from 'framer-motion';
import { useData } from '../../context/DataContext';
import type { Assignment, SubmissionStatus } from '../../types';
import { FileText, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface SummaryCardsProps {
  filteredAssignments: Assignment[];
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ filteredAssignments }) => {
  const { role, selectedStudentId, getDerivedStatus } = useData();

  // Compute metrics based on the filtered list
  const metrics = React.useMemo(() => {
    if (role === 'faculty') {
      let totalAssignments = filteredAssignments.length;
      let totalSubmissionsCount = 0;
      let pendingCount = 0;
      let lateCount = 0;
      let totalExpectedSubmissions = 0;

      filteredAssignments.forEach(asg => {
        asg.submissions.forEach(sub => {
          totalExpectedSubmissions++;
          const derived = getDerivedStatus(asg.dueDate, sub.status);
          if (derived === 'submitted') {
            totalSubmissionsCount++;
          } else if (derived === 'late') {
            lateCount++;
          } else {
            pendingCount++;
          }
        });
      });

      const submissionRate = totalExpectedSubmissions > 0 
        ? Math.round((totalSubmissionsCount / totalExpectedSubmissions) * 100) 
        : 0;

      return [
        {
          title: 'Total Assignments',
          value: totalAssignments,
          subtext: `${totalExpectedSubmissions} student slots`,
          icon: FileText,
          color: 'text-indigo-500 bg-indigo-500/10 dark:bg-indigo-500/5',
          borderColor: 'group-hover:border-indigo-500/40'
        },
        {
          title: 'Submission Rate',
          value: `${submissionRate}%`,
          subtext: `${totalSubmissionsCount} of ${totalExpectedSubmissions} slots`,
          icon: CheckCircle2,
          color: 'text-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/5',
          borderColor: 'group-hover:border-emerald-500/40'
        },
        {
          title: 'Pending Submissions',
          value: pendingCount,
          subtext: 'Awaiting student work',
          icon: Clock,
          color: 'text-amber-500 bg-amber-500/10 dark:bg-amber-500/5',
          borderColor: 'group-hover:border-amber-500/40'
        },
        {
          title: 'Late Submissions',
          value: lateCount,
          subtext: 'Passed due dates',
          icon: AlertCircle,
          color: 'text-rose-500 bg-rose-500/10 dark:bg-rose-500/5',
          borderColor: 'group-hover:border-rose-500/40'
        }
      ];
    } else {
      // Student Dashboard metrics
      let totalAssigned = filteredAssignments.length;
      let submittedCount = 0;
      let pendingCount = 0;
      let lateCount = 0;

      filteredAssignments.forEach(asg => {
        const sub = asg.submissions.find(s => s.studentId === selectedStudentId);
        const rawStatus = sub ? sub.status : ('pending' as SubmissionStatus);
        const derived = getDerivedStatus(asg.dueDate, rawStatus);

        if (derived === 'submitted') {
          submittedCount++;
        } else if (derived === 'late') {
          lateCount++;
        } else {
          pendingCount++;
        }
      });

      return [
        {
          title: 'Total Assignments',
          value: totalAssigned,
          subtext: 'Assigned to my subjects',
          icon: FileText,
          color: 'text-indigo-500 bg-indigo-500/10 dark:bg-indigo-500/5',
          borderColor: 'group-hover:border-indigo-500/40'
        },
        {
          title: 'Submitted Tasks',
          value: submittedCount,
          subtext: `${totalAssigned > 0 ? Math.round((submittedCount / totalAssigned) * 100) : 0}% completion rate`,
          icon: CheckCircle2,
          color: 'text-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/5',
          borderColor: 'group-hover:border-emerald-500/40'
        },
        {
          title: 'Pending Work',
          value: pendingCount,
          subtext: 'Active deadlines',
          icon: Clock,
          color: 'text-amber-500 bg-amber-500/10 dark:bg-amber-500/5',
          borderColor: 'group-hover:border-amber-500/40'
        },
        {
          title: 'Overdue (Late)',
          value: lateCount,
          subtext: 'Needs immediate action',
          icon: AlertCircle,
          color: 'text-rose-500 bg-rose-500/10 dark:bg-rose-500/5',
          borderColor: 'group-hover:border-rose-500/40'
        }
      ];
    }
  }, [filteredAssignments, role, selectedStudentId, getDerivedStatus]);

  // Framer Motion Container & Item variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
    >
      {metrics.map((card, idx) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={idx}
            variants={itemVariants}
            whileHover={{ y: -3 }}
            className={`group rounded-2xl p-5 border glass-card bg-brand-surface-light dark:bg-brand-surface-dark transition-all duration-300 ${card.borderColor}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                  {card.title}
                </p>
                <h3 className="text-3xl font-bold font-display tracking-tight text-slate-800 dark:text-white">
                  {card.value}
                </h3>
              </div>
              <div className={`p-3 rounded-xl ${card.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-3 border-t border-slate-100 dark:border-slate-800/40 pt-2.5">
              {card.subtext}
            </p>
          </motion.div>
        );
      })}
    </motion.div>
  );
};
