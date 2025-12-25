
export interface Lesson {
  id: string;
  chapterId: number;
  lessonNumber: number;
  title: string;
  isCompleted: boolean;
  isLocked: boolean;
}

export interface Chapter {
  id: number;
  title: string;
  description: string;
  learningGoals: string[];
  lessons: Lesson[];
  isCompleted: boolean;
  isLocked: boolean;
  imageUrl: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface LessonContent {
  title: string;
  explanation: string;
  codeSnippet: string;
  codeExplanation: string;
  commonMistakes: string[];
  exercise: {
    prompt: string;
    solution: string;
  };
  quiz: QuizQuestion[];
}

export interface UserProgress {
  completedLessons: string[]; // lesson ids
  currentChapterId: number;
  currentLessonId: string;
}
