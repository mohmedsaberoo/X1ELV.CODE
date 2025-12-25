
import React from 'react';

interface ProgressBarProps {
  progress: number;
  label?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, label }) => {
  const percentage = Math.min(100, Math.max(0, progress));
  
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-slate-700">{label}</span>
          <span className="text-sm font-medium text-indigo-600">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
        <div 
          className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
