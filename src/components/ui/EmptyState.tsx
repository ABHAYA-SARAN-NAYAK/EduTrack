import React from 'react';
import { SearchX, Inbox } from 'lucide-react';

interface EmptyStateProps {
  type: 'search' | 'empty';
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  title,
  description,
  actionText,
  onAction,
}) => {
  const isSearch = type === 'search';
  const Icon = isSearch ? SearchX : Inbox;

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10 min-h-[300px]">
      <div className="p-4 bg-slate-100 dark:bg-slate-800/80 text-slate-400 dark:text-slate-500 rounded-full mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold font-display text-slate-700 dark:text-slate-200 mb-1">
        {title || (isSearch ? 'No Results Found' : 'No Assignments')}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">
        {description || 
          (isSearch 
            ? 'We couldn\'t find any assignments matching your search terms or active filters. Try refining them.' 
            : 'No assignments have been posted for your subjects yet. Enjoy the quiet!')}
      </p>
      {onAction && actionText && (
        <button
          onClick={onAction}
          className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-95 cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
