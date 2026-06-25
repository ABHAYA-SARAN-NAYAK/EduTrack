import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { TopBar } from '../components/layout/TopBar';
import { SummaryCards } from '../components/layout/SummaryCards';
import { FilterBar } from '../components/layout/FilterBar';
import { AssignmentCard } from '../components/assignments/AssignmentCard';
import { UpcomingDeadlines } from '../components/widgets/UpcomingDeadlines';
import { EmptyState } from '../components/ui/EmptyState';
import { motion, AnimatePresence } from 'framer-motion';

export const StudentDashboard: React.FC = () => {
  const { assignments, students, selectedStudentId, getDerivedStatus } = useData();

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState('all');

  const currentStudent = students.find(s => s.id === selectedStudentId);

  // Compute student-specific filtered assignments reactively
  const filteredAssignments = useMemo(() => {
    if (!currentStudent) return [];

    // 1. Filter only assignments matching the student's enrolled subjects
    const studentAssignments = assignments.filter(asg => 
      currentStudent.subjectIds.includes(asg.subjectId)
    );

    // 2. Filter by Search Query & Chips
    return studentAssignments.filter(asg => {
      // Search term match
      const matchesSearch = asg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (asg.description && asg.description.toLowerCase().includes(searchQuery.toLowerCase()));

      // Subject chips match
      const matchesSubject = selectedSubjectIds.length === 0 || selectedSubjectIds.includes(asg.subjectId);

      // Status match
      let matchesStatus = true;
      if (selectedStatus !== 'all') {
        const sub = asg.submissions.find(s => s.studentId === selectedStudentId);
        const rawStatus = sub ? sub.status : 'pending';
        const derived = getDerivedStatus(asg.dueDate, rawStatus);
        matchesStatus = derived === selectedStatus;
      }

      return matchesSearch && matchesSubject && matchesStatus;
    });
  }, [assignments, currentStudent, selectedStudentId, searchQuery, selectedSubjectIds, selectedStatus, getDerivedStatus]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedSubjectIds([]);
    setSelectedStatus('all');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-brand-bg-dark text-slate-800 dark:text-slate-100 flex flex-col font-sans">
      <TopBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
        {/* Profile Card Summary for mobile selection visibility */}
        <div className="rounded-2xl p-4 border border-indigo-100 dark:border-indigo-950/20 bg-indigo-50/50 dark:bg-indigo-950/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-200">
              Welcome back, {currentStudent?.name}!
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
              Roll Number: {currentStudent?.rollNo} • Enrolled in {currentStudent?.subjectIds.length} subjects
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl shadow-sm">
            <span>Demo Mode Active</span>
          </div>
        </div>

        {/* Metric Summary Cards */}
        <SummaryCards filteredAssignments={filteredAssignments} />

        {/* Dashboard Core Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Column: Filters and Deadlines */}
          <div className="lg:col-span-1 space-y-6">
            <FilterBar
              selectedSubjectIds={selectedSubjectIds}
              setSelectedSubjectIds={setSelectedSubjectIds}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
            />
            
            <UpcomingDeadlines />
          </div>

          {/* Right Column: Assignments Cards List */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
                My Coursework Tasks
              </h2>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                {filteredAssignments.length} assignment{filteredAssignments.length !== 1 ? 's' : ''} assigned
              </p>
            </div>

            {filteredAssignments.length > 0 ? (
              <motion.div 
                layout 
                className="flex flex-col gap-4"
              >
                <AnimatePresence mode="popLayout">
                  {filteredAssignments.map(asg => (
                    <AssignmentCard key={asg.id} assignment={asg} />
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <EmptyState
                type={searchQuery || selectedSubjectIds.length > 0 || selectedStatus !== 'all' ? 'search' : 'empty'}
                onAction={handleResetFilters}
                actionText="Reset All Filters"
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
