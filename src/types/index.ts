export type Role = "faculty" | "student";

export type SubmissionStatus = "submitted" | "pending" | "late";

export interface Subject {
  id: string;
  name: string;
  colorTag: string; // Tailwind color class prefix (e.g. 'indigo', 'emerald', 'amber', 'rose', 'cyan')
}

export interface Student {
  id: string;
  name: string;
  rollNo: string;
  subjectIds: string[]; // List of subjects this student is enrolled in
}

export interface Submission {
  studentId: string;
  status: SubmissionStatus;
  submittedAt?: string; // ISO date string
  grade?: string; // e.g., 'A', 'B', '10/10' (optional detail)
  remarks?: string; // optional feedback
}

export interface Assignment {
  id: string;
  title: string;
  subjectId: string;
  dueDate: string; // ISO date string
  description?: string;
  createdAt: string; // ISO date string
  submissions: Submission[];
}
