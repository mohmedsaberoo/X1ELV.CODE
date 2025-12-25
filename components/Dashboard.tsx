
import React from 'react';
import { Chapter, UserProgress } from '../types';
import { ProgressBar } from './ProgressBar';
import { ICONS } from '../constants';

interface DashboardProps {
  curriculum: Chapter[];
  progress: UserProgress;
  onSelectChapter: (id: number) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ curriculum, progress, onSelectChapter }) => {
  const completedCount = progress.completedLessons.length;
  const totalCount = curriculum.length * 5;
  const overallProgress = (completedCount / totalCount) * 100;

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 md:px-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-l from-indigo-700 to-indigo-500 rounded-[2rem] p-8 md:p-12 mb-12 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-right">
            <h1 className="text-3xl md:text-5xl font-black mb-4">أهلاً بك في رحلة احتراف بايثون! 🚀</h1>
            <p className="text-indigo-100 text-lg md:text-xl max-w-xl">
              أنت الآن في رحلة منظمة للتحول من مبتدئ إلى مبرمج بايثون محترف عبر 90 فصلاً ممتعاً.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 w-full md:w-64 text-center">
            <div className="text-4xl font-black mb-2">{Math.round(overallProgress)}%</div>
            <div className="text-sm font-bold uppercase tracking-wider text-indigo-100">تقدمك الإجمالي</div>
            <div className="mt-4">
              <ProgressBar progress={overallProgress} />
            </div>
          </div>
        </div>
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
      </div>

      <h2 className="text-3xl font-black text-slate-800 mb-8 flex items-center gap-3">
        <span className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-xl">🗺️</span>
        خارطة الطريق (Curriculum Map)
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {curriculum.map((chapter) => {
          const isLocked = chapter.isLocked;
          const completedInChapter = chapter.lessons.filter(l => progress.completedLessons.includes(l.id)).length;
          const chapterProgress = (completedInChapter / 5) * 100;

          return (
            <div 
              key={chapter.id}
              onClick={() => !isLocked && onSelectChapter(chapter.id)}
              className={`group relative bg-white rounded-3xl overflow-hidden border-2 transition-all duration-300 ${
                isLocked 
                  ? 'border-slate-100 grayscale cursor-not-allowed opacity-75' 
                  : 'border-transparent hover:border-indigo-500 shadow-lg hover:shadow-2xl cursor-pointer hover:-translate-y-2'
              }`}
            >
              <div className="relative h-40 overflow-hidden">
                <img 
                  src={chapter.imageUrl} 
                  alt={chapter.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   {!isLocked && <div className="bg-white text-indigo-600 font-black px-6 py-2 rounded-full shadow-lg">ابدأ الآن</div>}
                </div>
                {isLocked && (
                  <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center">
                    <div className="bg-white/90 p-3 rounded-2xl shadow-xl">
                      <ICONS.Lock />
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                   <span className="text-xs font-bold text-slate-400 uppercase">الفصل {chapter.id}</span>
                   {chapterProgress === 100 && (
                     <span className="text-emerald-500 font-bold text-xs flex items-center gap-1">
                       <ICONS.Check /> مكتمل
                     </span>
                   )}
                </div>
                <h3 className="text-lg font-black text-slate-800 mb-4 group-hover:text-indigo-600 transition-colors">
                  {chapter.title}
                </h3>
                
                <div className="mt-auto">
                  <ProgressBar progress={chapterProgress} />
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-[10px] font-bold text-slate-400">5 دروس</span>
                    <span className="text-[10px] font-bold text-indigo-600">{completedInChapter}/5 مكتمل</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
