
import React, { useState, useEffect } from 'react';
import { generateCurriculum } from './data/curriculum';
import { Chapter, UserProgress, Lesson } from './types';
import { Dashboard } from './components/Dashboard';
import { LessonViewer } from './components/LessonViewer';
import { UI_STRINGS } from './constants';

const App: React.FC = () => {
  const [curriculum, setCurriculum] = useState<Chapter[]>([]);
  const [progress, setProgress] = useState<UserProgress>({
    completedLessons: [],
    currentChapterId: 1,
    currentLessonId: ''
  });
  const [view, setView] = useState<'dashboard' | 'lesson'>('dashboard');
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    // Initialize curriculum
    const baseCurriculum = generateCurriculum();
    
    // Load progress from localStorage
    const savedProgress = localStorage.getItem('elev_code_progress');
    if (savedProgress) {
      const parsed = JSON.parse(savedProgress) as UserProgress;
      setProgress(parsed);
      
      // Update locks based on loaded progress
      const updatedCurriculum = baseCurriculum.map(ch => {
        const lessons = ch.lessons.map(l => {
          const prevLessonIdx = baseCurriculum.flatMap(c => c.lessons).findIndex(allL => allL.id === l.id) - 1;
          const allFlat = baseCurriculum.flatMap(c => c.lessons);
          const isLocked = prevLessonIdx >= 0 ? !parsed.completedLessons.includes(allFlat[prevLessonIdx].id) : false;
          return { ...l, isLocked, isCompleted: parsed.completedLessons.includes(l.id) };
        });
        const isCompleted = lessons.every(l => l.isCompleted);
        const prevChapter = baseCurriculum.find(c => c.id === ch.id - 1);
        const isLocked = prevChapter ? !prevChapter.lessons.every(l => parsed.completedLessons.includes(l.id)) : false;
        
        return { ...ch, lessons, isLocked, isCompleted };
      });
      setCurriculum(updatedCurriculum);
    } else {
      setCurriculum(baseCurriculum);
    }
  }, []);

  const saveProgress = (newProgress: UserProgress) => {
    setProgress(newProgress);
    localStorage.setItem('elev_code_progress', JSON.stringify(newProgress));
    
    // Re-lock curriculum
    const updated = curriculum.map(ch => {
      const lessons = ch.lessons.map(l => {
        const allFlat = curriculum.flatMap(c => c.lessons);
        const idx = allFlat.findIndex(al => al.id === l.id);
        const isLocked = idx === 0 ? false : !newProgress.completedLessons.includes(allFlat[idx-1].id);
        return { ...l, isLocked, isCompleted: newProgress.completedLessons.includes(l.id) };
      });
      const prevCh = curriculum.find(c => c.id === ch.id - 1);
      const isLocked = prevCh ? !prevCh.lessons.every(pl => newProgress.completedLessons.includes(pl.id)) : false;
      return { ...ch, lessons, isLocked, isCompleted: lessons.every(l => l.isCompleted) };
    });
    setCurriculum(updated);
  };

  const handleSelectChapter = (id: number) => {
    const chapter = curriculum.find(ch => ch.id === id);
    if (chapter) {
      setSelectedChapter(chapter);
      // Find first uncompleted/available lesson
      const nextLesson = chapter.lessons.find(l => !l.isCompleted) || chapter.lessons[0];
      setActiveLesson(nextLesson);
      setView('lesson');
    }
  };

  const handleLessonComplete = () => {
    if (!activeLesson) return;

    const newCompleted = [...progress.completedLessons];
    if (!newCompleted.includes(activeLesson.id)) {
      newCompleted.push(activeLesson.id);
    }

    const nextProgress = { ...progress, completedLessons: newCompleted };
    saveProgress(nextProgress);

    // Find next lesson
    const allFlatLessons = curriculum.flatMap(c => c.lessons);
    const currentIndex = allFlatLessons.findIndex(l => l.id === activeLesson.id);
    const nextLesson = allFlatLessons[currentIndex + 1];

    if (nextLesson) {
      setActiveLesson(nextLesson);
      setSelectedChapter(curriculum.find(c => c.id === nextLesson.chapterId) || selectedChapter);
    } else {
      alert("تهانينا! لقد أنهيت المنهج بالكامل!");
      setView('dashboard');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => setView('dashboard')}
          >
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl">e</div>
            <span className="text-2xl font-black text-slate-800 tracking-tight">elev.code</span>
          </div>
          
          <nav className="hidden md:flex gap-8">
            <button 
              onClick={() => setView('dashboard')}
              className={`font-bold text-sm transition-colors ${view === 'dashboard' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
            >
              الرئيسية
            </button>
            <button className="font-bold text-sm text-slate-500 hover:text-slate-900">الملف الشخصي</button>
            <button className="font-bold text-sm text-slate-500 hover:text-slate-900">المجتمع</button>
          </nav>

          <div className="flex items-center gap-4">
            <div className="flex -space-x-2 space-x-reverse">
              <div className="w-8 h-8 rounded-full border-2 border-white bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-700">JS</div>
            </div>
            <button className="bg-slate-100 p-2 rounded-full hover:bg-slate-200 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {view === 'dashboard' ? (
          <Dashboard 
            curriculum={curriculum} 
            progress={progress} 
            onSelectChapter={handleSelectChapter} 
          />
        ) : (
          <div className="animate-in slide-in-from-left duration-300">
            {activeLesson && selectedChapter && (
              <LessonViewer 
                lesson={activeLesson} 
                chapterTitle={selectedChapter.title}
                onComplete={handleLessonComplete}
              />
            )}
          </div>
        )}
      </main>

      {/* Mobile Footer Nav */}
      <footer className="md:hidden sticky bottom-0 bg-white border-t border-slate-200 p-2 flex justify-around">
        <button onClick={() => setView('dashboard')} className="flex flex-col items-center p-2 text-indigo-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-[10px] font-bold mt-1">الرئيسية</span>
        </button>
        <button className="flex flex-col items-center p-2 text-slate-400">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span className="text-[10px] font-bold mt-1">المحتوى</span>
        </button>
        <button className="flex flex-col items-center p-2 text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-[10px] font-bold mt-1">أنا</span>
        </button>
      </footer>
    </div>
  );
};

export default App;
