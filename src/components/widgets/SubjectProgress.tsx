import React from 'react';
import { useData } from '../../context/DataContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { CheckSquare } from 'lucide-react';

export const SubjectProgress: React.FC = () => {
  const { subjects, assignments, getDerivedStatus, students } = useData();

  // Compute submission statistics per subject
  const subjectStats = React.useMemo(() => {
    return subjects.map(sub => {
      // Find all assignments for this subject
      const subAssignments = assignments.filter(a => a.subjectId === sub.id);
      
      // Calculate enrollment slots
      const enrolledStudents = students.filter(st => st.subjectIds.includes(sub.id));
      const totalExpectedSlots = subAssignments.length * enrolledStudents.length;
      
      let submittedSlots = 0;
      subAssignments.forEach(asg => {
        asg.submissions.forEach(subm => {
          // Double check the student is enrolled (for safety)
          const isEnrolled = enrolledStudents.some(s => s.id === subm.studentId);
          const derived = getDerivedStatus(asg.dueDate, subm.status);
          if (isEnrolled && derived === 'submitted') {
            submittedSlots++;
          }
        });
      });

      const percent = totalExpectedSlots > 0 
        ? Math.round((submittedSlots / totalExpectedSlots) * 100) 
        : 0;

      return {
        id: sub.id,
        name: sub.name.split(' (')[0], // Short name e.g. "Computer Science"
        fullName: sub.name,
        percentage: percent,
        submitted: submittedSlots,
        total: totalExpectedSlots,
        colorTag: sub.colorTag
      };
    });
  }, [subjects, assignments, students, getDerivedStatus]);

  // Recharts styling helpers
  const getRechartsColor = (colorTag: string) => {
    const maps: Record<string, string> = {
      indigo: '#6366f1',
      amber: '#f59e0b',
      cyan: '#06b6d4',
      emerald: '#10b981',
      rose: '#f43f5e',
    };
    return maps[colorTag] || '#6366f1';
  };

  // Format data for Recharts Bar Chart
  const chartData = subjectStats.map(stat => ({
    name: stat.name,
    Completion: stat.percentage,
    fill: getRechartsColor(stat.colorTag)
  }));

  // CSS Color mapping for tailwind v4 progress bar
  const getProgressBarColor = (colorTag: string) => {
    const maps: Record<string, string> = {
      indigo: 'bg-indigo-500',
      amber: 'bg-amber-500',
      cyan: 'bg-cyan-500',
      emerald: 'bg-emerald-500',
      rose: 'bg-rose-500',
    };
    return maps[colorTag] || 'bg-indigo-500';
  };

  return (
    <div className="rounded-2xl p-5 border glass-card bg-brand-surface-light dark:bg-brand-surface-dark flex flex-col gap-5 h-full">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/40 pb-3">
        <CheckSquare className="w-4 h-4 text-indigo-500" />
        <span className="text-sm font-bold font-display text-slate-800 dark:text-slate-200">
          Coursework Progress Breakdown
        </span>
      </div>

      {/* Recharts Bar Chart Visualizer */}
      <div className="w-full h-48 select-none text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
          >
            <XAxis 
              dataKey="name" 
              stroke="#94a3b8" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
            />
            <YAxis 
              stroke="#94a3b8" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip 
              cursor={{ fill: 'rgba(148, 163, 184, 0.05)' }}
              contentStyle={{
                backgroundColor: 'rgba(22, 27, 40, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '11px',
                fontWeight: '600'
              }}
              formatter={(value) => [`${value}%`, 'Submission Rate']}
            />
            <Bar 
              dataKey="Completion" 
              radius={[6, 6, 0, 0]} 
              maxBarSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Progress Bars List */}
      <div className="flex flex-col gap-3.5 flex-1 justify-center">
        {subjectStats.map(stat => (
          <div key={stat.id} className="space-y-1">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-600 dark:text-slate-350 line-clamp-1 max-w-[170px]" title={stat.fullName}>
                {stat.fullName}
              </span>
              <span className="text-slate-400 dark:text-slate-500 text-[10px] font-bold">
                {stat.percentage}% ({stat.submitted}/{stat.total} slots)
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-900/60 h-2 rounded-full overflow-hidden border border-slate-200/20 dark:border-transparent">
              <div 
                className={`h-full rounded-full transition-all duration-700 ${getProgressBarColor(stat.colorTag)}`}
                style={{ width: `${stat.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
