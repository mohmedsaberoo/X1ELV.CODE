
import React, { useState, useEffect } from 'react';
import { LessonContent, Lesson } from '../types';
import { generateDetailedLesson } from '../services/geminiService';
import { ICONS, UI_STRINGS } from '../constants';

interface LessonViewerProps {
  lesson: Lesson;
  chapterTitle: string;
  onComplete: () => void;
}

export const LessonViewer: React.FC<LessonViewerProps> = ({ lesson, chapterTitle, onComplete }) => {
  const [content, setContent] = useState<LessonContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [showSolution, setShowSolution] = useState(false);
  const [activeTab, setActiveTab] = useState<'explanation' | 'quiz' | 'exercise'>('explanation');

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      const data = await generateDetailedLesson(
        chapterTitle,
        lesson.title,
        lesson.chapterId,
        lesson.lessonNumber
      );
      setContent(data);
      setLoading(false);
      setQuizScore(null);
      setQuizAnswers([]);
      setShowSolution(false);
      setActiveTab('explanation');
      window.scrollTo(0, 0);
    };
    fetchContent();
  }, [lesson, chapterTitle]);

  const handleQuizSubmit = () => {
    if (!content) return;
    let score = 0;
    content.quiz.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctAnswer) score++;
    });
    setQuizScore(score);
    if (score === content.quiz.length) {
      // Logic for passing
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-slate-600 font-medium animate-pulse">جاري تحضير الدرس بواسطة الذكاء الاصطناعي...</p>
      </div>
    );
  }

  if (!content) return <div>خطأ في تحميل الدرس.</div>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Lesson Header */}
      <div className="mb-8 border-b border-slate-200 pb-6">
        <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold mb-3">
          الفصل {lesson.chapterId} • الدرس {lesson.lessonNumber}
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">{content.title}</h1>
        <p className="text-slate-500">{chapterTitle}</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 space-x-reverse mb-8 bg-white p-1 rounded-xl shadow-sm border border-slate-200">
        <button 
          onClick={() => setActiveTab('explanation')}
          className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold transition-all ${activeTab === 'explanation' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          الشرح والكود
        </button>
        <button 
          onClick={() => setActiveTab('exercise')}
          className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold transition-all ${activeTab === 'exercise' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          تمرين تطبيقي
        </button>
        <button 
          onClick={() => setActiveTab('quiz')}
          className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold transition-all ${activeTab === 'quiz' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          اختبار قصير
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 min-h-[400px]">
        {activeTab === 'explanation' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="prose prose-slate max-w-none mb-8">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="w-2 h-8 bg-indigo-600 rounded-full"></span>
                الشرح
              </h3>
              <p className="text-slate-700 leading-relaxed text-lg whitespace-pre-wrap">{content.explanation}</p>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-800">
                <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
                كود بايثون
              </h3>
              <div className="relative group">
                <pre className="code-font bg-slate-900 text-slate-100 p-6 rounded-xl overflow-x-auto shadow-inner text-sm md:text-base leading-relaxed">
                  {content.codeSnippet}
                </pre>
                <div className="absolute top-4 left-4">
                  <span className="bg-slate-800 text-slate-400 px-2 py-1 rounded text-xs uppercase tracking-widest font-mono">Python 3</span>
                </div>
              </div>
            </div>

            <div className="mb-8 bg-slate-50 p-6 rounded-xl border border-slate-200">
              <h4 className="font-bold text-slate-800 mb-3">شرح الكود:</h4>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed whitespace-pre-wrap">{content.codeExplanation}</p>
            </div>

            <div className="bg-rose-50 p-6 rounded-xl border border-rose-100">
              <h4 className="font-bold text-rose-700 mb-3 flex items-center gap-2">
                ⚠️ أخطاء شائعة للمبتدئين:
              </h4>
              <ul className="list-disc list-inside space-y-2 text-rose-600 text-sm md:text-base">
                {content.commonMistakes.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'exercise' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              تحدي اليوم 💪
            </h3>
            <div className="bg-indigo-50 p-8 rounded-2xl border-2 border-dashed border-indigo-200 mb-8">
              <p className="text-indigo-900 text-lg leading-relaxed font-medium">{content.exercise.prompt}</p>
            </div>

            {!showSolution ? (
              <button 
                onClick={() => setShowSolution(true)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all transform hover:-translate-y-1"
              >
                إظهار الحل
              </button>
            ) : (
              <div className="animate-in zoom-in duration-300">
                <h4 className="font-bold text-emerald-600 mb-3">الحل المقترح:</h4>
                <pre className="code-font bg-slate-900 text-slate-100 p-6 rounded-xl overflow-x-auto shadow-inner mb-6">
                  {content.exercise.solution}
                </pre>
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-700 text-sm">
                  رائع! تأكد من كتابة الكود بنفسك وفهم المنطق خلفه قبل الانتقال.
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'quiz' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-2xl font-bold mb-6">اختبر معلوماتك</h3>
            <div className="space-y-8">
              {content.quiz.map((q, qIdx) => (
                <div key={qIdx} className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                  <p className="font-bold text-slate-800 text-lg mb-4">{qIdx + 1}. {q.question}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {q.options.map((opt, oIdx) => (
                      <button
                        key={oIdx}
                        onClick={() => {
                          const newAns = [...quizAnswers];
                          newAns[qIdx] = oIdx;
                          setQuizAnswers(newAns);
                        }}
                        className={`p-4 text-right rounded-xl border-2 transition-all font-medium ${
                          quizAnswers[qIdx] === oIdx 
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                            : 'border-white bg-white hover:border-slate-300 text-slate-600'
                        } ${quizScore !== null && oIdx === q.correctAnswer ? 'bg-emerald-50 border-emerald-500' : ''}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {quizScore === null ? (
              <button 
                onClick={handleQuizSubmit}
                disabled={quizAnswers.length < content.quiz.length}
                className="w-full mt-10 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold py-4 rounded-xl shadow-lg transition-all"
              >
                تحقق من الإجابات
              </button>
            ) : (
              <div className="mt-10 p-8 rounded-2xl text-center bg-white border-4 border-emerald-500 shadow-2xl animate-bounce">
                <h4 className="text-3xl font-black text-emerald-600 mb-2">درجتك: {quizScore} / {content.quiz.length}</h4>
                <p className="text-slate-600 mb-6">
                  {quizScore === content.quiz.length ? 'أداء مثالي! أنت مستعد تماماً للدرس التالي.' : 'عمل جيد، راجع الأخطاء وواصل التعلم!'}
                </p>
                <button 
                  onClick={onComplete}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-12 rounded-xl transition-all shadow-lg"
                >
                  الدرس التالي ➔
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
