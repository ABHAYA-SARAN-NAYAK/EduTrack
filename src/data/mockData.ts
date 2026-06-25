import type { Subject, Student, Assignment } from '../types';

export const SUBJECTS: Subject[] = [
  { id: 'sub-cs101', name: 'Computer Science (CS-101)', colorTag: 'indigo' },
  { id: 'sub-mth202', name: 'Advanced Mathematics (MTH-202)', colorTag: 'amber' },
  { id: 'sub-phy103', name: 'Quantum Physics (PHY-103)', colorTag: 'cyan' },
  { id: 'sub-chm104', name: 'Organic Chemistry (CHM-104)', colorTag: 'emerald' },
  { id: 'sub-eng105', name: 'Technical Writing (ENG-105)', colorTag: 'rose' },
];

export const STUDENTS: Student[] = [
  { id: 'std-01', name: 'Alex Johnson', rollNo: 'CS2026001', subjectIds: ['sub-cs101', 'sub-mth202', 'sub-phy103'] },
  { id: 'std-02', name: 'Sarah Miller', rollNo: 'CS2026002', subjectIds: ['sub-cs101', 'sub-mth202', 'sub-eng105'] },
  { id: 'std-03', name: 'David Chen', rollNo: 'CS2026003', subjectIds: ['sub-mth202', 'sub-phy103', 'sub-chm104'] },
  { id: 'std-04', name: 'Emily Watson', rollNo: 'CS2026004', subjectIds: ['sub-cs101', 'sub-chm104', 'sub-eng105'] },
  { id: 'std-05', name: 'Kabir Verma', rollNo: 'CS2026005', subjectIds: ['sub-cs101', 'sub-mth202', 'sub-phy103', 'sub-chm104', 'sub-eng105'] },
];

// Helper to construct relative ISO dates based on current date: June 25, 2026
const getDateOffset = (days: number): string => {
  const baseDate = new Date('2026-06-25T12:00:00Z');
  baseDate.setDate(baseDate.getDate() + days);
  return baseDate.toISOString();
};

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-01',
    title: 'Operating Systems - Process Scheduling Simulator',
    subjectId: 'sub-cs101',
    dueDate: getDateOffset(-5), // Due 5 days ago (June 20, 2026) -> Should be LATE if pending
    description: 'Implement a simulation of Round Robin and Shortest Job First scheduling algorithms in Python or Java. Submit code and analysis report.',
    createdAt: getDateOffset(-12),
    submissions: [
      { studentId: 'std-01', status: 'submitted', submittedAt: getDateOffset(-6) },
      { studentId: 'std-02', status: 'submitted', submittedAt: getDateOffset(-5) },
      { studentId: 'std-04', status: 'pending' }, // This will be computed as Late
      { studentId: 'std-05', status: 'pending' }, // This will be computed as Late
    ]
  },
  {
    id: 'asg-02',
    title: 'Linear Algebra - Vector Spaces & Eigenvalues',
    subjectId: 'sub-mth202',
    dueDate: getDateOffset(-2), // Due 2 days ago (June 23, 2026) -> LATE if pending
    description: 'Solve the problem sheet on vector spaces, subspaces, linear independence, and eigenvalue computations. Show step-by-step proofs.',
    createdAt: getDateOffset(-9),
    submissions: [
      { studentId: 'std-01', status: 'submitted', submittedAt: getDateOffset(-3) },
      { studentId: 'std-02', status: 'pending' }, // Late
      { studentId: 'std-03', status: 'submitted', submittedAt: getDateOffset(-2) },
      { studentId: 'std-05', status: 'pending' }, // Late
    ]
  },
  {
    id: 'asg-03',
    title: 'Photoelectric Effect Lab Analysis',
    subjectId: 'sub-phy103',
    dueDate: getDateOffset(2), // Due in 2 days (June 27, 2026) -> UPCOMING
    description: 'Analyze the experimental voltage-current datasets, plot the stopping potential versus frequency, and calculate Planck\'s constant.',
    createdAt: getDateOffset(-4),
    submissions: [
      { studentId: 'std-01', status: 'pending' },
      { studentId: 'std-03', status: 'submitted', submittedAt: getDateOffset(-1) },
      { studentId: 'std-05', status: 'pending' },
    ]
  },
  {
    id: 'asg-04',
    title: 'Synthesis of Aspirin & Recrystallization Report',
    subjectId: 'sub-chm104',
    dueDate: getDateOffset(4), // Due in 4 days (June 29, 2026) -> UPCOMING
    description: 'Submit your lab log showing step-by-step synthesis mechanism of Acetylsalicylic acid (Aspirin) and recrystallization calculations for yield.',
    createdAt: getDateOffset(-3),
    submissions: [
      { studentId: 'std-03', status: 'pending' },
      { studentId: 'std-04', status: 'submitted', submittedAt: getDateOffset(0) },
      { studentId: 'std-05', status: 'pending' },
    ]
  },
  {
    id: 'asg-05',
    title: 'Portfolio Writing: Technical Documentation',
    subjectId: 'sub-eng105',
    dueDate: getDateOffset(7), // Due in 7 days (July 2, 2026) -> UPCOMING
    description: 'Write a comprehensive API quick-start guide or user manual for a command line utility. Focus on readability, layout, and markdown rules.',
    createdAt: getDateOffset(-1),
    submissions: [
      { studentId: 'std-02', status: 'pending' },
      { studentId: 'std-04', status: 'pending' },
      { studentId: 'std-05', status: 'pending' },
    ]
  }
];
