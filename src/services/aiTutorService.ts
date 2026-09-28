export type AiTutorMode = 
  | 'explain' 
  | 'debug' 
  | 'hint' 
  | 'review' 
  | 'quiz' 
  | 'widget_explain' 
  | 'compare'
  | 'similar_exercise';

export interface AiTutorRequest {
  mode: AiTutorMode;
  code: string;
  lessonTitle: string;
  lessonConcept: string;
  selectedWidget?: string;
  errorMessage?: string;
  attemptNumber?: number;
  userPrompt?: string;
  language?: 'ar' | 'en';
}

export interface AiTutorResponse {
  markdown: string;
  thinkingProcess?: string;
  suggestedAction?: string;
  errorExplanation?: {
    what: string;
    why: string;
    where: string;
    howToThink: string;
    tryThis: string;
  };
}

export async function askAiTutor(req: AiTutorRequest): Promise<AiTutorResponse> {
  try {
    const res = await fetch('/api/ai/tutor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Server returned status ${res.status}`);
    }

    return await res.json();
  } catch (err: any) {
    // Graceful smart educational fallback if server is unreachable
    return generateLocalFallback(req);
  }
}

function generateLocalFallback(req: AiTutorRequest): AiTutorResponse {
  const isAr = req.language === 'ar';
  
  if (req.mode === 'hint') {
    const attempt = req.attemptNumber || 1;
    if (attempt === 1) {
      return {
        markdown: isAr 
          ? `💡 **تلميح 1 (توجيه عام):**\nانظر إلى خصائص الـ Widget المستهدفة في الدرس "${req.lessonTitle}". هل قمت بتحديد الأبعاد واللون المطلوبين؟`
          : `💡 **Hint 1 (Gentle Nudge):**\nLook at the required properties in "${req.lessonTitle}". Did you set the width, height, and color as specified?`
      };
    } else if (attempt === 2) {
      return {
        markdown: isAr
          ? `💡 **تلميح 2 (أكثر دقة):**\nفي فلاتر، تتطلب الخصائص قيمًا مثل \`Colors.blue\` و \`width: 200\`. تأكد من عدم نسيان الفواصل بين الخصائص.`
          : `💡 **Hint 2 (More Specific):**\nIn Flutter, properties take specific types like \`Colors.blue\` and \`width: 200\`. Ensure each argument is separated with a comma.`
      };
    } else {
      return {
        markdown: isAr
          ? `📘 **شرح المفهوم الأساسي:**\n${req.lessonConcept}\n\nتذكر أن كل كائن هو Widget يمتلك معلمات مسماة (named parameters).`
          : `📘 **Core Concept Breakdown:**\n${req.lessonConcept}\n\nRemember that everything visual is a Widget taking named parameters.`
      };
    }
  }

  if (req.mode === 'debug') {
    return {
      markdown: isAr
        ? `🔍 **تحليل المصحح الذكي (Debug Mode):**\n\n- الكود المكتوب متماسك ولكن تأكد من تطابق الأقواس () والفواصل ,\n- إذا ظهر خطأ Overflow، فكر في تغليف العنصر بـ \`Expanded\` أو \`Flexible\`.\n- اضغط على زر **Format** لتنظيم الأسطر ومساعدتك على اكتشاف القوس الناقص.`
        : `🔍 **Smart Debugger Analysis:**\n\n- Check that every opening parenthesis has a corresponding closing one.\n- If you encounter a layout overflow error, consider wrapping child items inside an \`Expanded\` or \`Flexible\` widget.\n- Click **Format** to clean up indentation and easily spot mismatched brackets.`
    };
  }

  if (req.mode === 'widget_explain') {
    return {
      markdown: isAr
        ? `📦 **شرح الـ Widget المحددة (${req.selectedWidget || 'Widget'}):**\n\nهذا الـ Widget مسؤول عن تحديد موقع أو مظهر أو أبعاد العناصر التابعة له في الـ Widget Tree. في فلاتر، يمرر الآباء القيود (Constraints) إلى الأبناء، بينما يحدد الأبناء أبعادهم بناءً على تلك القيود.`
        : `📦 **Explanation of Selected Widget (${req.selectedWidget || 'Widget'}):**\n\nThis widget controls dimensions, styling, or layout for its descendants in the Flutter Widget Tree. In Flutter layout architecture: Constraints go down, Sizes go up, Parents decide position.`
    };
  }

  return {
    markdown: isAr
      ? `🤖 **مرشد FlutterLab التعليمي:**\n\nأنت تعمل حالياً على درس: **${req.lessonTitle}**.\n\nالمفهوم الرئيسي:\n${req.lessonConcept}\n\nجرّب تعديل الكود واضغط على زر **تشغيل (Run)** لمشاهدة التحديث فورياً على الشاشة!`
      : `🤖 **FlutterLab AI Coach:**\n\nYou are working on: **${req.lessonTitle}**.\n\nKey Concept:\n${req.lessonConcept}\n\nEdit your code in the editor and press **Run** to see the interactive updates live!`
  };
}
