
import React from 'react';

export const COLORS = {
  primary: '#4f46e5',
  secondary: '#0ea5e9',
  success: '#10b981',
  danger: '#ef4444',
  warning: '#f59e0b',
  locked: '#94a3b8',
};

export const UI_STRINGS = {
  appName: 'elev.code',
  startLearning: 'ابدأ التعلم الآن',
  continueLearning: 'أكمل رحلتك',
  chapters: 'الفصول',
  lessons: 'الدروس',
  next: 'التالي',
  previous: 'السابق',
  finish: 'إنهاء',
  locked: 'مغلق',
  unlocked: 'مفتوح',
  correct: 'إجابة صحيحة!',
  wrong: 'حاول مرة أخرى',
  checkAnswer: 'تحقق من الإجابة',
  lessonComplete: 'اكتمل الدرس!',
  chapterComplete: 'اكتمل الفصل!',
};

export const ICONS = {
  Lock: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
    </svg>
  ),
  Check: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  ),
  Play: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
    </svg>
  ),
};
