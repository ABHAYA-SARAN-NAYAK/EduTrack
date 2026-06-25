import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { TopBar } from '../components/layout/TopBar';
import { SummaryCards } from '../components/layout/SummaryCards';
import { FilterBar } from '../components/layout/FilterBar';
import { AssignmentTable } from '../components/assignments/AssignmentTable';
import { AddAssignmentModal } from '../components/assignments/AddAssignmentModal';
import { SubjectProgress } from '../components/widgets/SubjectProgress';
import { EmptyState } from '../components/ui/EmptyState';
import { Plus } from 'lucide-react';

export const FacultyDashboard: React.FC = () => {
  const { assignments, getDerivedStatus } = useData();

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Compute filtered assignments reactively
  const filteredAssignments = useMemo(() => {
    return assignments.filter(asg => {
      // 1. Filter by Search Query
      const matchesSearch = asg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (asg.description && asg.description.toLowerCase().includes(searchQuery.toLowerCase()));

      // 2. Filter by Subjects
      const matchesSubject = selectedSubjectIds.length === 0 || selectedSubjectIds.includes(asg.subjectId);

      // 3. Filter by Submission Status
      // In faculty view, an assignment matches a status if ANY student submission matches that status.
      let matchesStatus = true;
      if (selectedStatus !== 'all') {
        matchesStatus = asg.submissions.some(sub => {
          const derived = getDerivedStatus(asg.dueDate, sub.status);
          return derived === selectedStatus;
        });
      }

      return matchesSearch && matchesSubject && matchesStatus;
    });
  }, [assignments, searchQuery, selectedSubjectIds, selectedStatus, getDerivedStatus]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedSubjectIds([]);
    setSelectedStatus('all');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-brand-bg-dark text-slate-800 dark:text-slate-100 flex flex-col font-sans">
      <TopBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
        {/* Metric Summary Cards */}
        <SummaryCards filteredAssignments={filteredAssignments} />

        {/* Dashboard Core Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Column: Filters and Charts */}
          <div className="lg:col-span-1 space-y-6">
            <FilterBar
              selectedSubjectIds={selectedSubjectIds}
              setSelectedSubjectIds={setSelectedSubjectIds}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
            />
            
            <SubjectProgress />
          </div>

          {/* Right Column: Assignments table list */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
                  Course Assignments
                </h2>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                  {filteredAssignments.length} assignment{filteredAssignments.length !== 1 ? 's' : ''} listed
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Assignment</span>
              </button>
            </div>

            {filteredAssignments.length > 0 ? (
              <AssignmentTable assignments={filteredAssignments} />
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

      {/* Add Assignment Modal */}
      <AddAssignmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
