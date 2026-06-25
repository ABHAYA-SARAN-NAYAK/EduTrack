import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { X, Plus } from 'lucide-react';

interface AddAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddAssignmentModal: React.FC<AddAssignmentModalProps> = ({ isOpen, onClose }) => {
  const { subjects, addAssignment } = useData();
  const { addToast } = useToast();

  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');
  
  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form fields
  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setSubjectId('');
      setDueDate('');
      setDescription('');
      setErrors({});
    }
  }, [isOpen]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!subjectId) newErrors.subjectId = 'Subject is required';
    if (!dueDate) newErrors.dueDate = 'Due Date is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      addToast('Please fill out all required fields', 'warning');
      return;
    }

    addAssignment(title, subjectId, dueDate, description);
    
    const subjectName = subjects.find(s => s.id === subjectId)?.name || 'Subject';
    addToast(`Assignment "${title}" created successfully for ${subjectName}`, 'success');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className="relative w-full max-w-lg rounded-2xl border glass-card bg-white dark:bg-slate-950 p-6 shadow-2xl z-10"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 p-2.5 rounded-xl">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">
                  Add New Assignment
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                  Create coursework for enrolled students.
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              {/* Assignment Title */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Assignment Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (errors.title) setErrors(prev => ({ ...prev, title: '' }));
                  }}
                  placeholder="e.g. Operating Systems Project"
                  className={`w-full px-3.5 py-2 text-sm rounded-xl border bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.title ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-200 dark:border-slate-800'
                  }`}
                />
                {errors.title && (
                  <p className="text-rose-500 text-[10px] font-bold mt-1 uppercase tracking-wide">
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Subject Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Subject <span className="text-rose-500">*</span>
                </label>
                <select
                  value={subjectId}
                  onChange={(e) => {
                    setSubjectId(e.target.value);
                    if (errors.subjectId) setErrors(prev => ({ ...prev, subjectId: '' }));
                  }}
                  className={`w-full px-3.5 py-2 text-sm rounded-xl border bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer ${
                    errors.subjectId ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <option value="">Select a Subject</option>
                  {subjects.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
                {errors.subjectId && (
                  <p className="text-rose-500 text-[10px] font-bold mt-1 uppercase tracking-wide">
                    {errors.subjectId}
                  </p>
                )}
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Due Date & Time <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="datetime-local"
                    value={dueDate}
                    onChange={(e) => {
                      setDueDate(e.target.value);
                      if (errors.dueDate) setErrors(prev => ({ ...prev, dueDate: '' }));
                    }}
                    className={`w-full px-3.5 py-2 text-sm rounded-xl border bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer ${
                      errors.dueDate ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-200 dark:border-slate-800'
                    }`}
                  />
                </div>
                {errors.dueDate && (
                  <p className="text-rose-500 text-[10px] font-bold mt-1 uppercase tracking-wide">
                    {errors.dueDate}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Description <span className="text-slate-400 dark:text-slate-600">(Optional)</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detail the deliverables, marks weightage, or links..."
                  rows={3}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-600/10 active:scale-95 transition-all cursor-pointer"
                >
                  Create Assignment
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
