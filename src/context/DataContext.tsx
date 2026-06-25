import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Role, Assignment, Subject, Student, SubmissionStatus } from '../types';
import { SUBJECTS, STUDENTS, INITIAL_ASSIGNMENTS } from '../data/mockData';

interface DataContextType {
  role: Role | null;
  setRole: (role: Role) => void;
  students: Student[];
  subjects: Subject[];
  selectedStudentId: string;
  setSelectedStudentId: (id: string) => void;
  assignments: Assignment[];
  addAssignment: (title: string, subjectId: string, dueDate: string, description?: string) => void;
  updateStudentStatus: (assignmentId: string, studentId: string, status: SubmissionStatus) => void;
  selfSubmitAssignment: (assignmentId: string, studentId: string) => void;
  currentDateString: string;
  getDerivedStatus: (dueDate: string, status: SubmissionStatus) => SubmissionStatus;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// System base date for demo consistency: June 25, 2026
const SYSTEM_DATE = new Date('2026-06-25T18:36:55+05:30');

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<Role | null>(() => {
    const saved = localStorage.getItem('edutrack-role');
    return (saved as Role) || null;
  });

  const [selectedStudentId, setSelectedStudentIdState] = useState<string>(() => {
    const saved = localStorage.getItem('edutrack-selected-student');
    return saved || STUDENTS[0].id;
  });

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = localStorage.getItem('edutrack-assignments');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse local assignments', e);
      }
    }
    return INITIAL_ASSIGNMENTS;
  });

  // Sync state changes to localStorage
  useEffect(() => {
    if (role) {
      localStorage.setItem('edutrack-role', role);
    }
  }, [role]);

  useEffect(() => {
    localStorage.setItem('edutrack-selected-student', selectedStudentId);
  }, [selectedStudentId]);

  useEffect(() => {
    localStorage.setItem('edutrack-assignments', JSON.stringify(assignments));
  }, [assignments]);

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
  };

  const setSelectedStudentId = (id: string) => {
    setSelectedStudentIdState(id);
  };

  // Status helper that auto-derives late status for render
  const getDerivedStatus = (dueDate: string, currentStatus: SubmissionStatus): SubmissionStatus => {
    if (currentStatus === 'pending') {
      const due = new Date(dueDate);
      if (due < SYSTEM_DATE) {
        return 'late';
      }
    }
    return currentStatus;
  };

  const addAssignment = (title: string, subjectId: string, dueDate: string, description?: string) => {
    // Generate initial submissions list for all students enrolled in the subject
    const subjectStudents = STUDENTS.filter(s => s.subjectIds.includes(subjectId));
    
    const newAssignment: Assignment = {
      id: `asg-${Date.now()}`,
      title,
      subjectId,
      dueDate: new Date(dueDate).toISOString(),
      description,
      createdAt: SYSTEM_DATE.toISOString(),
      submissions: subjectStudents.map(student => ({
        studentId: student.id,
        status: 'pending'
      }))
    };

    setAssignments(prev => [newAssignment, ...prev]);
  };

  const updateStudentStatus = (assignmentId: string, studentId: string, newStatus: SubmissionStatus) => {
    setAssignments(prev => prev.map(asg => {
      if (asg.id === assignmentId) {
        const updatedSubmissions = asg.submissions.map(sub => {
          if (sub.studentId === studentId) {
            return {
              ...sub,
              status: newStatus,
              submittedAt: newStatus === 'submitted' ? SYSTEM_DATE.toISOString() : undefined
            };
          }
          return sub;
        });

        // If the student was not previously assigned (should not happen normally but good for robustness)
        const hasStudent = updatedSubmissions.some(sub => sub.studentId === studentId);
        if (!hasStudent) {
          updatedSubmissions.push({
            studentId,
            status: newStatus,
            submittedAt: newStatus === 'submitted' ? SYSTEM_DATE.toISOString() : undefined
          });
        }

        return { ...asg, submissions: updatedSubmissions };
      }
      return asg;
    }));
  };

  const selfSubmitAssignment = (assignmentId: string, studentId: string) => {
    updateStudentStatus(assignmentId, studentId, 'submitted');
  };

  const value = {
    role,
    setRole,
    students: STUDENTS,
    subjects: SUBJECTS,
    selectedStudentId,
    setSelectedStudentId,
    assignments,
    addAssignment,
    updateStudentStatus,
    selfSubmitAssignment,
    currentDateString: SYSTEM_DATE.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }),
    getDerivedStatus
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
