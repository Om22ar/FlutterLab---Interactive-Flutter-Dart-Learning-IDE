import { EducationalError } from '../types/flutter';

/**
 * Maps raw Dart/Flutter compiler error messages or runtime issues to structured EducationalError.
 * Provides:
 * - Clear categorized title & message
 * - 'What this means' explanation
 * - Actionable 'Try this' steps
 * - Line & column indicators
 */
export function categorizeError(rawError: string | Error, code?: string): EducationalError {
  const msg = typeof rawError === 'string' ? rawError : rawError.message || String(rawError);

  // Line / column extraction regex (e.g. line 12, col 5 or (12:5) or at 12:5)
  let line: number | undefined;
  let column: number | undefined;

  const lineColMatch = msg.match(/(?:line\s+|:)(\d+)(?::|,|\s+column\s+)(\d+)/i) || msg.match(/line\s+(\d+)/i);
  if (lineColMatch) {
    line = parseInt(lineColMatch[1], 10);
    if (lineColMatch[2]) {
      column = parseInt(lineColMatch[2], 10);
    }
  }

  // 1. Bracket & syntax errors
  if (msg.includes('Unmatched Closing Bracket') || msg.includes('Unexpected closing') || msg.includes('Mismatched Brackets')) {
    return {
      category: 'syntax',
      title: 'Mismatched or Unexpected Bracket',
      titleAr: 'قوس غير متطابق أو إضافي',
      message: msg,
      explanation: 'Dart uses nested brackets: parentheses () for constructors/methods, curly braces {} for maps/bodies, and square brackets [] for lists.',
      explanationAr: 'تستخدم دارت وفلاتر الأقواس المتداخلة: () لمنشئات الويدجتس، و {} للأجسام والخرائط، و [] لقوائم الأبناء children.',
      suggestion: 'Check the matching pairs. Press Dart Format (or Align) to reveal unaligned or stray brackets.',
      suggestionAr: 'راجع تطابق أزواج الأقواس. اضغط على زر تنسيق الكود لتسهيل تمييز الأقواس الزائدة.',
      line,
      column,
    };
  }

  if (msg.includes('Unclosed') || msg.includes('Expected to find') || msg.includes('missing') && msg.includes(')')) {
    return {
      category: 'syntax',
      title: 'Unclosed Constructor or Bracket',
      titleAr: 'قوس أو ويدجت لم يتم إغلاقه',
      message: msg,
      explanation: 'A widget constructor or list was opened but never closed before reaching the end of the statement.',
      explanationAr: 'تم فتح ويدجت أو قائمة children دون وضع قوس الإغلاق المناسب قبل نهاية الملف.',
      suggestion: 'Add the closing parenthesis ")" followed by a comma "," to close the outermost widget.',
      suggestionAr: 'أضف قوس الإغلاق ")" متبوعاً بفاصلة "," لإغلاق الويدجت الخارجي.',
      line,
      column,
    };
  }

  // 2. Undefined names & Identifiers
  if (msg.includes('Undefined name') || msg.includes('is not defined') || msg.includes('is not a getter')) {
    const identMatch = msg.match(/['"]([a-zA-Z0-9_]+)['"]/);
    const identifier = identMatch ? identMatch[1] : 'identifier';

    // Check if it looks like a lowercase widget
    if (/^[a-z]/.test(identifier) && ['container', 'center', 'column', 'row', 'scaffold', 'appbar', 'text', 'icon'].includes(identifier.toLowerCase())) {
      const pascal = identifier.charAt(0).toUpperCase() + identifier.slice(1);
      return {
        category: 'type',
        title: `Lowercase Widget Class '${identifier}'`,
        titleAr: `اسم الويدجت مكتوب بحرف صغير '${identifier}'`,
        message: `'${identifier}' is undefined. In Flutter, widgets are classes and must use PascalCase.`,
        explanation: 'In Dart and Flutter, widget classes always begin with an uppercase letter.',
        explanationAr: 'في لغة Dart وفلاتر، أسماء كلاسات الويدجتس تبدأ دائماً بحرف كبير (PascalCase).',
        suggestion: `Change '${identifier}' to uppercase '${pascal}'.`,
        suggestionAr: `قم بتغيير '${identifier}' إلى '${pascal}'.`,
        line,
        column,
      };
    }

    return {
      category: 'compilation',
      title: `Undefined Identifier '${identifier}'`,
      titleAr: `عنصر أو متغير غير معرف '${identifier}'`,
      message: `The compiler cannot locate any class, variable, or method named '${identifier}'.`,
      explanation: 'Dart strictly checks all references at compile time. If an identifier is not defined or imported, compilation halts.',
      explanationAr: 'لغة Dart صارمة في فحص المعرفات وقت البناء. إذا لم يتم تعريف المتغير أو استيراده يتوقف المترجم.',
      suggestion: `Verify spelling, ensure '${identifier}' was defined in the correct scope, or check for proper capitalization.`,
      suggestionAr: `تأكد من صحة هجاء الكلمة، وتأكد من تعريفها في النطاق المناسب أو كتابة الحرف الأول كبيراً.`,
      line,
      column,
    };
  }

  // 3. RenderFlex Overflow (Layout error)
  if (msg.includes('RenderFlex overflowed') || msg.includes('overflow') || msg.includes('A RenderFlex')) {
    const pixelMatch = msg.match(/by\s+([0-9.]+)\s+pixels/);
    const pixels = pixelMatch ? pixelMatch[1] : 'several';
    return {
      category: 'layout_overflow',
      title: 'RenderFlex Overflow Detected',
      titleAr: 'خطأ تجاوز المساحة (RenderFlex Overflow)',
      message: `A Row or Column has overflowed available viewport space by ${pixels} pixels.`,
      explanation: 'In Flutter, Flex containers (Row & Column) do not automatically scroll or compress fixed-dimension children. When total child size exceeds constraints, Flutter renders yellow/black stripes.',
      explanationAr: 'في فلاتر، لا تقوم Row أو Column بالتمرير التلقائي. إذا تجاوز مجموع أحجام العناصر عرض الشاشة، يظهر شريط التحذير الأصفر والأسود.',
      suggestion: 'Wrap expanding children with Expanded() or Flexible(), or replace Row/Column with a scrollable ListView or Wrap widget.',
      suggestionAr: 'قم بتغليف العناصر بـ Expanded() أو Flexible()، أو استخدم ListView / Wrap للتمرير التلقائي.',
      line,
      column,
    };
  }

  // 4. Missing comma or argument errors
  if (msg.includes('Expected') && msg.includes(',') || msg.includes('comma')) {
    return {
      category: 'syntax',
      title: 'Missing Trailing Comma',
      titleAr: 'فاصلة ناقصة بين الخصائص',
      message: msg,
      explanation: 'Flutter widget parameters must be separated by commas (e.g. width: 200, height: 100,).',
      explanationAr: 'يجب الفصل بين خصائص الويدجت بواسطة الفاصلة (مثال: width: 200, height: 100,).',
      suggestion: 'Ensure there is a comma "," between each named argument in your constructor.',
      suggestionAr: 'تأكد من وجود فاصلة "," بين كل خاصية وأخرى داخل الويدجت.',
      line,
      column,
    };
  }

  // 5. Unknown named parameter
  if (msg.includes('named parameter') || msg.includes('argument') || msg.includes('Unknown Argument')) {
    return {
      category: 'compilation',
      title: 'Unknown Named Parameter',
      titleAr: 'خاصية غير موجودة في هذا الويدجت',
      message: msg,
      explanation: 'You passed a parameter name that does not exist on this Widget constructor (e.g. background instead of color).',
      explanationAr: 'قمت بتمرير خاصية غير مسجلة في منشئ هذا الويدجت (مثل كتابة background بدل color).',
      suggestion: 'Check the official widget properties: Container uses "color", Text uses "style: TextStyle()", and Row/Column use "children: []".',
      suggestionAr: 'راجع خصائص الويدجت القياسية: يستخدم Container خاصية color، ويستخدم Text خاصية style، وتستخدم Row خاصية children.',
      line,
      column,
    };
  }

  // Default fallback
  return {
    category: 'compilation',
    title: 'Compiler Diagnostic',
    titleAr: 'تنبيه من المترجم',
    message: msg,
    explanation: 'The code runner encountered a diagnostic during AST evaluation or compilation.',
    explanationAr: 'واجه مشغل الكود تنبيهاً أثناء تحليل الشجرة البرمجية أو وقت البناء.',
    suggestion: 'Review your widget constructors, syntax brackets, and parameter names.',
    suggestionAr: 'راجع هيكل الويدجتس والأقواس والخصائص المكتوبة.',
    line,
    column,
  };
}
