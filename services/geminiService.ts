
import { GoogleGenAI, Type } from "@google/genai";
import { LessonContent } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateDetailedLesson = async (
  chapterTitle: string,
  lessonTitle: string,
  chapterId: number,
  lessonNumber: number
): Promise<LessonContent> => {
  const prompt = `
    أنت معلم برمجة محترف. قم بتوليد محتوى درس تعليمي كامل للغة بايثون.
    الفصل: ${chapterTitle}
    الدرس: ${lessonTitle}
    رقم الدرس: ${lessonNumber} من أصل 5 في هذا الفصل.
    
    المطلوب:
    1. شرح تفصيلي ومبسط جداً باللغة العربية.
    2. كود بايثون نموذجي يشرح الفكرة.
    3. شرح لكل سطر في الكود.
    4. قائمة بالأخطاء الشائعة للمبتدئين في هذا الموضوع.
    5. تمرين تطبيقي مع الحل.
    6. اختبار قصير مكون من 5 أسئلة اختيار من متعدد.
    
    يجب أن يكون المحتوى بالكامل باللغة العربية (ماعدا مصطلحات البرمجة والكود).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            explanation: { type: Type.STRING },
            codeSnippet: { type: Type.STRING },
            codeExplanation: { type: Type.STRING },
            commonMistakes: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            exercise: {
              type: Type.OBJECT,
              properties: {
                prompt: { type: Type.STRING },
                solution: { type: Type.STRING }
              },
              required: ["prompt", "solution"]
            },
            quiz: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: { 
                    type: Type.ARRAY, 
                    items: { type: Type.STRING } 
                  },
                  correctAnswer: { type: Type.NUMBER, description: "Index of the correct answer (0-3)" }
                },
                required: ["question", "options", "correctAnswer"]
              }
            }
          },
          required: ["title", "explanation", "codeSnippet", "codeExplanation", "commonMistakes", "exercise", "quiz"],
          propertyOrdering: ["title", "explanation", "codeSnippet", "codeExplanation", "commonMistakes", "exercise", "quiz"]
        }
      }
    });

    const data = JSON.parse(response.text || '{}');
    return data as LessonContent;
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    // Fallback static data if API fails or key is missing
    return {
      title: lessonTitle,
      explanation: "عذراً، حدث خطأ أثناء تحميل محتوى الدرس. يرجى التحقق من اتصالك بالإنترنت.",
      codeSnippet: "print('Error loading content')",
      codeExplanation: "لا يوجد شرح متاح حالياً.",
      commonMistakes: ["خطأ في الاتصال"],
      exercise: { prompt: "حاول إعادة تحميل الصفحة.", solution: "F5" },
      quiz: []
    };
  }
};
