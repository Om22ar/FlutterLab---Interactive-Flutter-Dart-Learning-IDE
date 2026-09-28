import { WidgetNode, EducationalError, SourceRange } from '../types/flutter';

export interface ParseResult {
  rootWidget: WidgetNode | null;
  errors: EducationalError[];
  warnings: EducationalError[];
  sourceMap: Map<string, SourceRange>;
  isRunnable: boolean;
}

// Map color names to hex codes
export const FLUTTER_COLORS: Record<string, string> = {
  'Colors.blue': '#2196F3',
  'Colors.red': '#F44336',
  'Colors.green': '#4CAF50',
  'Colors.amber': '#FFC107',
  'Colors.orange': '#FF9800',
  'Colors.purple': '#9C27B0',
  'Colors.teal': '#009688',
  'Colors.cyan': '#00BCD4',
  'Colors.pink': '#E91E63',
  'Colors.indigo': '#3F51B5',
  'Colors.grey': '#9E9E9E',
  'Colors.black': '#000000',
  'Colors.white': '#FFFFFF',
  'Colors.deepPurple': '#673AB7',
  'Colors.lightBlue': '#03A9F4',
  'Colors.lime': '#CDDC39',
  'Colors.yellow': '#FFEB3B',
  'Colors.deepOrange': '#FF5722',
  'Colors.blueGrey': '#607D8B',
  'Colors.transparent': 'transparent',
};

const KNOWN_WIDGETS = new Set([
  'MaterialApp', 'Scaffold', 'AppBar', 'Center', 'Container', 'Padding',
  'Row', 'Column', 'Expanded', 'Flexible', 'Stack', 'Positioned', 'SizedBox',
  'Spacer', 'Align', 'Wrap', 'ListView', 'GridView', 'Text', 'Icon', 'Image',
  'ElevatedButton', 'TextButton', 'OutlinedButton', 'FloatingActionButton',
  'Card', 'TextField', 'Checkbox', 'Switch', 'CircularProgressIndicator',
  'Divider', 'SingleChildScrollView', 'SafeArea', 'GestureDetector', 'InkWell',
  'Opacity', 'AspectRatio', 'FractionallySizedBox', 'ConstrainedBox', 'ClipRRect'
]);

export function parseFlutterCode(code: string): ParseResult {
  const errors: EducationalError[] = [];
  const warnings: EducationalError[] = [];
  const sourceMap = new Map<string, SourceRange>();

  if (!code || code.trim().length === 0) {
    return {
      rootWidget: null,
      errors: [{
        category: 'syntax',
        title: 'Empty Code',
        titleAr: 'الكود فارغ',
        message: 'No code provided to execute.',
        explanation: 'The editor is empty. Write or select a Flutter widget to start rendering.',
        explanationAr: 'محرر الكود فارغ. اكتب أو اختر ويدجت فلاتر لتبدأ بالمعاينة.',
        suggestion: 'Try writing a basic Container or Center widget.',
        suggestionAr: 'جرب كتابة Container أو Center بسيط.'
      }],
      warnings: [],
      sourceMap,
      isRunnable: false
    };
  }

  // Check bracket balance
  const bracketCheck = checkBracketBalance(code);
  if (bracketCheck) {
    errors.push(bracketCheck);
  }

  // Check common mistakes (e.g. undefined name, lowercase widget, missing const, etc.)
  const commonErrors = checkCommonMistakes(code);
  errors.push(...commonErrors);

  if (errors.length > 0) {
    return {
      rootWidget: null,
      errors,
      warnings,
      sourceMap,
      isRunnable: false
    };
  }

  // Parse widget tree
  try {
    const { root, map, layoutWarnings } = parseWidgetHierarchy(code);
    warnings.push(...layoutWarnings);
    map.forEach((range, id) => sourceMap.set(id, range));

    return {
      rootWidget: root,
      errors: [],
      warnings,
      sourceMap,
      isRunnable: root !== null
    };
  } catch (err: any) {
    return {
      rootWidget: null,
      errors: [{
        category: 'compilation',
        title: 'Parsing Error',
        titleAr: 'خطأ في معالجة الكود',
        message: err.message || 'Failed to construct widget tree',
        explanation: 'The code structure has an unexpected pattern or unclosed widget constructor.',
        explanationAr: 'هيكلية الكود تحتوي على نمط غير متوقع أو قوس استدعاء غير مغلق.',
        suggestion: 'Verify all commas and closing parentheses in your widget constructors.',
        suggestionAr: 'تأكد من وجود الفواصل والأقواس المغلقة لكل Widgets.'
      }],
      warnings: [],
      sourceMap,
      isRunnable: false
    };
  }
}

function checkBracketBalance(code: string): EducationalError | null {
  const stack: { char: string; line: number; col: number }[] = [];
  const lines = code.split('\n');

  for (let l = 0; l < lines.length; l++) {
    const line = lines[l];
    // skip comment lines
    if (line.trim().startsWith('//')) continue;

    for (let c = 0; c < line.length; c++) {
      const char = line[c];
      if (char === '(' || char === '{' || char === '[') {
        stack.push({ char, line: l + 1, col: c + 1 });
      } else if (char === ')' || char === '}' || char === ']') {
        if (stack.length === 0) {
          return {
            category: 'syntax',
            title: 'Unmatched Closing Bracket',
            titleAr: 'قوس إغلاق غير متطابق',
            message: `Unexpected closing '${char}' at line ${l + 1}, column ${c + 1}.`,
            explanation: `You typed a closing bracket '${char}', but there was no matching opening bracket before it.`,
            explanationAr: `قمت بكتابة قوس إغلاق '${char}' دون وجود قوس فتح مطابق قبله.`,
            suggestion: `Remove the extra '${char}' or make sure you opened the corresponding bracket earlier.`,
            suggestionAr: `قم بحذف القوس الإضافي '${char}' أو تأكد من فتح القوس المناظر له.`,
            line: l + 1,
            column: c + 1
          };
        }
        const top = stack.pop()!;
        const expected = top.char === '(' ? ')' : top.char === '{' ? '}' : ']';
        if (char !== expected) {
          return {
            category: 'syntax',
            title: 'Mismatched Brackets',
            titleAr: 'أقواس غير متطابقة',
            message: `Found '${char}' at line ${l + 1} but expected '${expected}' to match opening bracket on line ${top.line}.`,
            explanation: `Brackets must be closed in the reverse order they were opened (LIFO). You opened '${top.char}' and tried to close it with '${char}'.`,
            explanationAr: `يجب إغلاق الأقواس بنفس ترتيب فتحها المعاكس. لقد فتحت '${top.char}' وحاولت إغلاقه بـ '${char}'.`,
            suggestion: `Replace '${char}' with '${expected}' or verify the nested structure.`,
            suggestionAr: `استبدل '${char}' بـ '${expected}' أو راجع تداخل الأقواس.`,
            line: l + 1,
            column: c + 1
          };
        }
      }
    }
  }

  if (stack.length > 0) {
    const unclosed = stack[stack.length - 1];
    return {
      category: 'syntax',
      title: 'Unclosed Bracket',
      titleAr: 'قوس لم يتم إغلاقه',
      message: `Unclosed '${unclosed.char}' opened at line ${unclosed.line}, column ${unclosed.col}.`,
      explanation: `Dart and Flutter require every opening bracket '(', '{', or '[' to be properly closed.`,
      explanationAr: `تتطلب لغة Dart وفلاتر إغلاق كل قوس تم فتحه بدقة.`,
      suggestion: `Add the closing '${unclosed.char === '(' ? ')' : unclosed.char === '{' ? '}' : ']'}' before the end of the widget.`,
      suggestionAr: `أضف قوس الإغلاق المناسب في نهاية الـWidget.`,
      line: unclosed.line,
      column: unclosed.col
    };
  }

  return null;
}

function checkCommonMistakes(code: string): EducationalError[] {
  const errors: EducationalError[] = [];
  const lines = code.split('\n');

  lines.forEach((line, index) => {
    const lineNum = index + 1;
    const trimmed = line.trim();

    // Check lowercase widget names like container( or text(
    const lowercaseWidgetMatch = trimmed.match(/\b(container|scaffold|center|column|row|text|icon|padding)\s*\(/);
    if (lowercaseWidgetMatch) {
      const wrong = lowercaseWidgetMatch[1];
      const correct = wrong.charAt(0).toUpperCase() + wrong.slice(1);
      errors.push({
        category: 'type',
        title: `Lowercase Widget Identifier '${wrong}'`,
        titleAr: `اسم الـWidget يبدأ بحرف صغير '${wrong}'`,
        message: `'${wrong}' is not defined. Did you mean '${correct}'?`,
        explanation: `In Dart and Flutter, Widget classes always start with an uppercase letter following PascalCase convention.`,
        explanationAr: `في لغة Dart وفلاتر، أسماء كلاسات الـWidgets تبدأ دائمًا بحرف كبير (PascalCase).`,
        suggestion: `Change '${wrong}' to '${correct}'.`,
        suggestionAr: `قم بتغيير '${wrong}' إلى '${correct}'.`,
        line: lineNum,
        column: line.indexOf(wrong) + 1
      });
    }

    // Check undefined colors like Colors.bluee or Colors.reds
    const colorMatch = trimmed.match(/Colors\.([a-zA-Z0-9]+)/);
    if (colorMatch) {
      const fullColor = `Colors.${colorMatch[1]}`;
      if (!FLUTTER_COLORS[fullColor]) {
        errors.push({
          category: 'compilation',
          title: `Undefined Color '${fullColor}'`,
          titleAr: `لون غير معرف '${fullColor}'`,
          message: `'${colorMatch[1]}' is not a getter on 'Colors'.`,
          explanation: `Flutter's Colors palette defines standard colors like Colors.blue, Colors.red, Colors.green, etc.`,
          explanationAr: `باليتة ألوان فلاتر تدعم ألوان محددة مثل Colors.blue و Colors.red وغيرها.`,
          suggestion: `Check the spelling of the color name. Available: Colors.blue, red, green, amber, purple, teal, orange, etc.`,
          suggestionAr: `تأكد من هجاء اسم اللون مثل Colors.blue أو Colors.green.`,
          line: lineNum,
          column: line.indexOf(fullColor) + 1
        });
      }
    }

    // Check invalid property names
    const propMatch = trimmed.match(/\b([a-zA-Z0-9_]+)\s*:/);
    if (propMatch) {
      const prop = propMatch[1];
      const validProps = [
        'child', 'children', 'color', 'width', 'height', 'padding', 'margin',
        'decoration', 'borderRadius', 'alignment', 'mainAxisAlignment',
        'crossAxisAlignment', 'title', 'appBar', 'body', 'home', 'style',
        'backgroundColor', 'elevation', 'onPressed', 'icon', 'size',
        'fontSize', 'fontWeight', 'mainAxisSize', 'spacing', 'runSpacing',
        'itemCount', 'itemBuilder', 'scrollDirection', 'controller', 'leading',
        'actions', 'bottomNavigationBar', 'floatingActionButton'
      ];
      if (!validProps.includes(prop) && !prop.startsWith('hint') && !prop.startsWith('label')) {
        // Warning or error if clearly misspelled
        if (prop === 'colour' || prop === 'background' || prop === 'widht' || prop === 'heigth') {
          errors.push({
            category: 'compilation',
            title: `Unknown Argument '${prop}'`,
            titleAr: `خاصية غير معروفة '${prop}'`,
            message: `The named parameter '${prop}' isn't defined.`,
            explanation: `Did you mean '${prop === 'colour' ? 'color' : prop === 'background' ? 'color' : prop === 'widht' ? 'width' : 'height'}'?`,
            explanationAr: `هل قصدت '${prop === 'colour' ? 'color' : prop === 'background' ? 'color' : prop === 'widht' ? 'width' : 'height'}'؟`,
            suggestion: `Use standard Flutter property names.`,
            suggestionAr: `استخدم مسميات الخصائص المعتمدة في فلاتر.`,
            line: lineNum,
            column: line.indexOf(prop) + 1
          });
        }
      }
    }
  });

  return errors;
}

// Hierarchical Widget Parser
function parseWidgetHierarchy(code: string): { root: WidgetNode | null; map: Map<string, SourceRange>; layoutWarnings: EducationalError[] } {
  const map = new Map<string, SourceRange>();
  const layoutWarnings: EducationalError[] = [];
  let widgetCounter = 0;

  const lines = code.split('\n');

  // Helper to find the matching closing paren
  function findClosingParen(startIndex: number): number {
    let depth = 0;
    for (let i = startIndex; i < code.length; i++) {
      if (code[i] === '(') depth++;
      else if (code[i] === ')') {
        depth--;
        if (depth === 0) return i;
      }
    }
    return -1;
  }

  // Convert char index to line/column (1-based)
  function indexToLineCol(idx: number): { line: number; col: number } {
    let cur = 0;
    for (let l = 0; l < lines.length; l++) {
      const lineLen = lines[l].length + 1; // +1 for \n
      if (cur + lineLen > idx) {
        return { line: l + 1, col: idx - cur + 1 };
      }
      cur += lineLen;
    }
    return { line: lines.length, col: 1 };
  }

  function parseNode(startIdx: number, parentId: string | null, depth: number): { node: WidgetNode | null; nextIdx: number } {
    // Find the next known widget
    let matchIdx = -1;
    let matchedType = '';

    for (const wType of KNOWN_WIDGETS) {
      const regex = new RegExp(`\\b${wType}\\s*\\(`, 'g');
      regex.lastIndex = startIdx;
      const m = regex.exec(code);
      if (m && (matchIdx === -1 || m.index < matchIdx)) {
        matchIdx = m.index;
        matchedType = wType;
      }
    }

    if (matchIdx === -1) {
      return { node: null, nextIdx: code.length };
    }

    const openParenIdx = code.indexOf('(', matchIdx);
    const closeParenIdx = findClosingParen(openParenIdx);
    if (closeParenIdx === -1) {
      return { node: null, nextIdx: code.length };
    }

    const bodyText = code.substring(openParenIdx + 1, closeParenIdx);
    const id = `w_${matchedType.toLowerCase()}_${++widgetCounter}`;

    const startPos = indexToLineCol(matchIdx);
    const endPos = indexToLineCol(closeParenIdx);
    const sourceRange: SourceRange = {
      startLine: startPos.line,
      startColumn: startPos.col,
      endLine: endPos.line,
      endColumn: endPos.col
    };
    map.set(id, sourceRange);

    const properties: Record<string, any> = {};

    // Extract Text widget positional string: Text('Hello') or Text("Hello")
    if (matchedType === 'Text') {
      const textMatch = bodyText.match(/['"](.*?)['"]/);
      if (textMatch) {
        properties.text = textMatch[1];
      }
      // Check fontSize, color
      const fontSizeMatch = bodyText.match(/fontSize\s*:\s*([0-9.]+)/);
      if (fontSizeMatch) properties.fontSize = parseFloat(fontSizeMatch[1]);

      const textColorMatch = bodyText.match(/color\s*:\s*(Colors\.[a-zA-Z0-9]+)/);
      if (textColorMatch) properties.textColor = textColorMatch[1];

      const fontWeightMatch = bodyText.match(/fontWeight\s*:\s*FontWeight\.([a-zA-Z0-9]+)/);
      if (fontWeightMatch) properties.fontWeight = fontWeightMatch[1];
    }

    // Extract Icon data: Icon(Icons.star)
    if (matchedType === 'Icon') {
      const iconMatch = bodyText.match(/Icons\.([a-zA-Z0-9_]+)/);
      if (iconMatch) properties.icon = iconMatch[1];

      const colorMatch = bodyText.match(/color\s*:\s*(Colors\.[a-zA-Z0-9]+)/);
      if (colorMatch) properties.color = colorMatch[1];

      const sizeMatch = bodyText.match(/size\s*:\s*([0-9.]+)/);
      if (sizeMatch) properties.size = parseFloat(sizeMatch[1]);
    }

    // Extract width and height
    const widthMatch = bodyText.match(/\bwidth\s*:\s*([0-9.]+)/);
    if (widthMatch) properties.width = parseFloat(widthMatch[1]);

    const heightMatch = bodyText.match(/\bheight\s*:\s*([0-9.]+)/);
    if (heightMatch) properties.height = parseFloat(heightMatch[1]);

    // Extract color
    const colorMatch = bodyText.match(/\bcolor\s*:\s*(Colors\.[a-zA-Z0-9]+)/);
    if (colorMatch) properties.color = colorMatch[1];

    // Extract alignment / MainAxisAlignment / CrossAxisAlignment
    const mainAxisMatch = bodyText.match(/mainAxisAlignment\s*:\s*MainAxisAlignment\.([a-zA-Z0-9]+)/);
    if (mainAxisMatch) properties.mainAxisAlignment = mainAxisMatch[1];

    const crossAxisMatch = bodyText.match(/crossAxisAlignment\s*:\s*CrossAxisAlignment\.([a-zA-Z0-9]+)/);
    if (crossAxisMatch) properties.crossAxisAlignment = crossAxisMatch[1];

    // Extract padding: EdgeInsets.all(16)
    const paddingMatch = bodyText.match(/padding\s*:\s*EdgeInsets\.all\(([0-9.]+)\)/);
    if (paddingMatch) properties.padding = parseFloat(paddingMatch[1]);

    const symPadMatch = bodyText.match(/padding\s*:\s*EdgeInsets\.symmetric\s*\((.*?)\)/);
    if (symPadMatch) {
      const h = symPadMatch[1].match(/horizontal\s*:\s*([0-9.]+)/);
      const v = symPadMatch[1].match(/vertical\s*:\s*([0-9.]+)/);
      properties.paddingH = h ? parseFloat(h[1]) : 0;
      properties.paddingV = v ? parseFloat(v[1]) : 0;
    }

    // Extract BorderRadius: BorderRadius.circular(16)
    const radiusMatch = bodyText.match(/BorderRadius\.circular\(([0-9.]+)\)/);
    if (radiusMatch) properties.borderRadius = parseFloat(radiusMatch[1]);

    // Extract elevation
    const elevationMatch = bodyText.match(/elevation\s*:\s*([0-9.]+)/);
    if (elevationMatch) properties.elevation = parseFloat(elevationMatch[1]);

    // Children parsing
    const children: WidgetNode[] = [];

    // Find children: [...]
    const childrenRegex = /\bchildren\s*:\s*\[/g;
    const childrenMatch = childrenRegex.exec(bodyText);
    if (childrenMatch) {
      const startBracket = openParenIdx + 1 + childrenMatch.index + childrenMatch[0].length - 1;
      let bracketDepth = 0;
      let endBracket = -1;
      for (let i = startBracket; i < code.length; i++) {
        if (code[i] === '[') bracketDepth++;
        else if (code[i] === ']') {
          bracketDepth--;
          if (bracketDepth === 0) {
            endBracket = i;
            break;
          }
        }
      }

      if (endBracket !== -1) {
        let childScan = startBracket + 1;
        while (childScan < endBracket) {
          const res = parseNode(childScan, id, depth + 1);
          if (res.node) {
            children.push(res.node);
            childScan = res.nextIdx;
          } else {
            break;
          }
        }
      }
    }

    // Find child: SomeWidget(...)
    const childRegex = /\bchild\s*:\s*/g;
    const childMatch = childRegex.exec(bodyText);
    if (childMatch && !childrenMatch) {
      const childStart = openParenIdx + 1 + childMatch.index + childMatch[0].length;
      const res = parseNode(childStart, id, depth + 1);
      if (res.node) {
        children.push(res.node);
      }
    }

    // Special layout check: Row overflow detection
    if (matchedType === 'Row') {
      let totalWidth = 0;
      children.forEach(c => {
        if (c.properties.width) totalWidth += c.properties.width;
        else if (c.type === 'Container') totalWidth += 100;
        else totalWidth += 60;
      });
      if (totalWidth > 380) {
        layoutWarnings.push({
          category: 'layout_overflow',
          title: 'A RenderFlex overflowed',
          titleAr: 'تجاوز حدود المساحة (RenderFlex Overflow)',
          message: `A RenderFlex overflowed by ${Math.round(totalWidth - 380)} pixels on the right.`,
          explanation: `In Flutter, a Row will throw an overflow error if its children exceed the screen width. By default, widgets do not automatically shrink.`,
          explanationAr: `في فلاتر، تتسبب Row في خطأ overflow عندما تتجاوز العناصر عرض الشاشة المتاح بدون استخدام Expanded أو Flexible.`,
          suggestion: `Wrap child widgets in Expanded() or Flexible() or use a scrollable ListView/Wrap.`,
          suggestionAr: `قم بتغليف العناصر بـ Expanded() أو استخدم Wrap / ListView لتجنب تجاوز الشاشة.`,
          line: startPos.line
        });
      }
    }

    const node: WidgetNode = {
      id,
      type: matchedType,
      properties,
      sourceRange,
      parentId,
      children,
      depth
    };

    return { node, nextIdx: closeParenIdx + 1 };
  }

  // Search for the root widget (prioritize MaterialApp -> Scaffold or outermost widget)
  const rootRes = parseNode(0, null, 0);

  return {
    root: rootRes.node,
    map,
    layoutWarnings
  };
}
