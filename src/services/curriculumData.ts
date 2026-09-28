import { Phase, Lesson, ProjectTemplate, SkillNode } from '../types/flutter';

export const CURRICULUM_PHASES: Phase[] = [
  {
    id: 'phase_dart',
    title: 'Phase 1: Dart Fundamentals',
    titleAr: 'المرحلة 1: أساسيات لغة Dart',
    description: 'Learn variables, types, null safety, functions, classes, and async futures.',
    descriptionAr: 'تعلم المتغيرات والأنواع، الأمان من القيم الفارغة، الدوال، الأصناف، والبرمجة غير المتزامنة.',
    icon: 'Terminal',
    lessons: [
      {
        id: 'dart_variables',
        phaseId: 'phase_dart',
        phaseTitle: 'Phase 1: Dart Fundamentals',
        phaseTitleAr: 'المرحلة 1: أساسيات لغة Dart',
        title: 'Variables & String Interpolation',
        titleAr: 'المتغيرات ودمج النصوص',
        description: 'Understand String, int, and string interpolation in Dart.',
        descriptionAr: 'افهم أنواع البيانات النصية والرقمية وكيفية دمجها في لغة Dart.',
        difficulty: 'beginner',
        exerciseType: 'code_completion',
        concept: 'In Dart, variables are typed or inferred using var. Use ${expression} inside strings.',
        conceptAr: 'في لغة Dart يتم تعريف المتغيرات بنوعها أو عبر var. يمكنك استخدام ${...} لدمج القيم داخل النصوص.',
        objectives: [
          'Declare a String name',
          'Use Text widget to display a personalized greeting'
        ],
        objectivesAr: [
          'تعريف متغير نصي String باسم الطالب',
          'استخدام Text widget لعرض الترحيب المخصص'
        ],
        starterCode: `// Welcome to Dart Fundamentals
// Goal: Set your name and display it in a Text widget

Center(
  child: Text(
    'Hello, Flutter Student!',
    style: TextStyle(
      fontSize: 24,
      color: Colors.blue,
      fontWeight: FontWeight.bold,
    ),
  ),
)`,
        solutionCode: `Center(
  child: Text(
    'Hello, Dart & Flutter!',
    style: TextStyle(
      fontSize: 24,
      color: Colors.blue,
      fontWeight: FontWeight.bold,
    ),
  ),
)`,
        tests: [
          {
            id: 't_dart_center',
            description: 'Wrap content in Center widget',
            descriptionAr: 'تغليف المحتوى في Center',
            type: 'widget',
            assertion: { widget: 'Center' }
          },
          {
            id: 't_dart_text',
            description: 'Contains a Text widget with greeting',
            descriptionAr: 'يحتوي على Text widget يحمل نص ترحيبي',
            type: 'widget',
            assertion: { widget: 'Text' }
          },
          {
            id: 't_dart_size',
            description: 'Text font size is 24',
            descriptionAr: 'حجم الخط 24',
            type: 'property',
            assertion: { widget: 'Text', property: 'fontSize', expectedValue: 24 }
          }
        ],
        hints: {
          hint1: 'Look at the Text widget child of Center.',
          hint1Ar: 'انظر إلى الـ Text widget داخل الـ Center.',
          hint2: 'You can customize the string content inside single quotes.',
          hint2Ar: 'يمكنك تعديل النص بين علامتي التنصيص الفردية.',
          conceptExplanation: 'Text widgets display a string of text with single style. In Flutter, everything visual is a widget.',
          conceptExplanationAr: 'ويدجت Text يعرض سلسلة نصية بنمط معين. في فلاتر كل عنصر مرئي هو Widget.'
        }
      },
      {
        id: 'dart_null_safety',
        phaseId: 'phase_dart',
        phaseTitle: 'Phase 1: Dart Fundamentals',
        phaseTitleAr: 'المرحلة 1: أساسيات لغة Dart',
        title: 'Sound Null Safety & Fallbacks',
        titleAr: 'الأمان الصارم من القيم الفارغة (Null Safety)',
        description: 'Understand non-nullable types, the ? modifier, and ?? fallback operator.',
        descriptionAr: 'تعرف على الأنواع غير القابلة للقيمة الفارغة ومُعامل ?? للقيم الافتراضية.',
        difficulty: 'beginner',
        exerciseType: 'free_coding',
        concept: 'Dart sound null safety prevents null reference crashes at compile time.',
        conceptAr: 'يوفر نظام Null Safety في Dart حماية فورية أثناء التجميع من أخطاء الانهيار غير المتوقعة.',
        objectives: [
          'Create a Container with a fallback title',
          'Ensure the container has padding and background color'
        ],
        objectivesAr: [
          'إنشاء Container يحمل نصاً آمناً',
          'تحديد padding ولون خلفية مناسب'
        ],
        starterCode: `Container(
  padding: EdgeInsets.all(16),
  color: Colors.teal,
  child: Text(
    'Null Safety Active',
    style: TextStyle(
      fontSize: 20,
      color: Colors.white,
    ),
  ),
)`,
        solutionCode: `Container(
  padding: EdgeInsets.all(16),
  color: Colors.teal,
  child: Text(
    'Null Safety Active',
    style: TextStyle(
      fontSize: 20,
      color: Colors.white,
    ),
  ),
)`,
        tests: [
          {
            id: 't_null_container',
            description: 'Container exists',
            descriptionAr: 'وجود Container',
            type: 'widget',
            assertion: { widget: 'Container' }
          },
          {
            id: 't_null_color',
            description: 'Container color is Colors.teal',
            descriptionAr: 'لون الـ Container هو Colors.teal',
            type: 'property',
            assertion: { widget: 'Container', property: 'color', expectedValue: 'Colors.teal' }
          }
        ],
        hints: {
          hint1: 'Make sure your Container has color: Colors.teal',
          hint1Ar: 'تأكد أن Container يمتلك color: Colors.teal',
          hint2: 'Padding should be EdgeInsets.all(16)',
          hint2Ar: 'الـ Padding يجب أن يكون EdgeInsets.all(16)',
          conceptExplanation: 'Container is a convenience widget that combines common painting, positioning, and sizing widgets.',
          conceptExplanationAr: 'ويدجت Container يجمع بين خصائص التلوين والتحجيم والحواف الداخلية.'
        }
      }
    ]
  },
  {
    id: 'phase_fundamentals',
    title: 'Phase 2: Flutter Fundamentals',
    titleAr: 'المرحلة 2: أساسيات فلاتر والويدجتس الأولى',
    description: 'Master Container, Scaffold, AppBar, Center, Padding, Text, and Icons.',
    descriptionAr: 'أتقن ويدجتس Container و Scaffold و AppBar و Center و Padding و Icons.',
    icon: 'Layers',
    lessons: [
      {
        id: 'flutter_container',
        phaseId: 'phase_fundamentals',
        phaseTitle: 'Phase 2: Flutter Fundamentals',
        phaseTitleAr: 'المرحلة 2: أساسيات فلاتر والويدجتس الأولى',
        title: 'The Container Widget',
        titleAr: 'ويدجت الصندوق Container',
        description: 'Understand width, height, color, and borderRadius.',
        descriptionAr: 'افهم كيفية التحكم بالعرض والارتفاع ولون الخلفية واستدارة الحواف.',
        difficulty: 'beginner',
        exerciseType: 'visual_target',
        concept: 'Container is a box-like widget that can control size, decoration, padding and more.',
        conceptAr: 'ويدجت Container هو صندوق متعدد الاستخدامات يتيح تحديد الأبعاد، الزخرفة، ولون الخلفية.',
        objectives: [
          'Create a Container with width: 200 and height: 100',
          'Set color to Colors.blue',
          'Add a child Text("Hello Flutter")'
        ],
        objectivesAr: [
          'إنشاء Container بعرض 200 وارتفاع 100',
          'تحديد اللون إلى Colors.blue',
          'إضافة child Text("Hello Flutter")'
        ],
        starterCode: `// Lesson: Container
// Try changing the width, height, and color!

Container(
  width: 150,
  height: 150,
  color: Colors.blue,
  child: Center(
    child: Text(
      'Hello Flutter',
      style: TextStyle(color: Colors.white, fontSize: 18),
    ),
  ),
)`,
        solutionCode: `Container(
  width: 200,
  height: 100,
  color: Colors.blue,
  child: Center(
    child: Text(
      'Hello Flutter',
      style: TextStyle(color: Colors.white, fontSize: 18),
    ),
  ),
)`,
        tests: [
          {
            id: 't_c_exists',
            description: 'Container widget exists',
            descriptionAr: 'وجود ويدجت Container',
            type: 'widget',
            assertion: { widget: 'Container' }
          },
          {
            id: 't_c_width',
            description: 'Container width equals 200',
            descriptionAr: 'عرض Container يساوي 200',
            type: 'property',
            assertion: { widget: 'Container', property: 'width', expectedValue: 200 }
          },
          {
            id: 't_c_height',
            description: 'Container height equals 100',
            descriptionAr: 'ارتفاع Container يساوي 100',
            type: 'property',
            assertion: { widget: 'Container', property: 'height', expectedValue: 100 }
          },
          {
            id: 't_c_color',
            description: 'Container color is Colors.blue',
            descriptionAr: 'لون الـ Container هو Colors.blue',
            type: 'property',
            assertion: { widget: 'Container', property: 'color', expectedValue: 'Colors.blue' }
          }
        ],
        hints: {
          hint1: 'Change width: 150 to width: 200.',
          hint1Ar: 'قم بتغيير width: 150 إلى width: 200.',
          hint2: 'Change height: 150 to height: 100.',
          hint2Ar: 'قم بتغيير height: 150 إلى height: 100.',
          conceptExplanation: 'Container wraps its child with constraints, padding, and background styling.',
          conceptExplanationAr: 'يغلف Container عنصره التابع بقيود هندسية وحشو وزخرفة خلفية.'
        }
      },
      {
        id: 'flutter_scaffold',
        phaseId: 'phase_fundamentals',
        phaseTitle: 'Phase 2: Flutter Fundamentals',
        phaseTitleAr: 'المرحلة 2: أساسيات فلاتر والويدجتس الأولى',
        title: 'Scaffold & AppBar Structure',
        titleAr: 'هيكل الشاشة الأساسي: Scaffold و AppBar',
        description: 'Implement standard Material Design structure with AppBar and Body.',
        descriptionAr: 'بناء هيكل شاشة قياسي بتصميم Material مع شريط علوي AppBar وجسم body.',
        difficulty: 'beginner',
        exerciseType: 'code_completion',
        concept: 'Scaffold implements the basic Material Design visual layout structure.',
        conceptAr: 'ويدجت Scaffold يمثل الهيكل الأساسي لأي شاشة في تطبيقات Material Design.',
        objectives: [
          'Create a Scaffold with an AppBar',
          'Set AppBar title to "My Flutter App"',
          'Add a Center widget in body'
        ],
        objectivesAr: [
          'إنشاء Scaffold يحتوي على AppBar',
          'وضع عنوان AppBar باسم "My Flutter App"',
          'وضع ويدجت Center في الـ body'
        ],
        starterCode: `Scaffold(
  appBar: AppBar(
    title: Text('My Flutter App'),
    backgroundColor: Colors.indigo,
  ),
  body: Center(
    child: Container(
      width: 180,
      height: 80,
      color: Colors.amber,
      child: Center(
        child: Text(
          'Screen Body',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
        ),
      ),
    ),
  ),
)`,
        solutionCode: `Scaffold(
  appBar: AppBar(
    title: Text('My Flutter App'),
    backgroundColor: Colors.indigo,
  ),
  body: Center(
    child: Container(
      width: 180,
      height: 80,
      color: Colors.amber,
      child: Center(
        child: Text(
          'Screen Body',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
        ),
      ),
    ),
  ),
)`,
        tests: [
          {
            id: 't_scaf_exists',
            description: 'Scaffold widget exists',
            descriptionAr: 'وجود ويدجت Scaffold',
            type: 'widget',
            assertion: { widget: 'Scaffold' }
          },
          {
            id: 't_appbar_exists',
            description: 'AppBar widget exists inside Scaffold',
            descriptionAr: 'وجود AppBar داخل Scaffold',
            type: 'widget',
            assertion: { widget: 'AppBar' }
          },
          {
            id: 't_appbar_title',
            description: 'AppBar contains title Text',
            descriptionAr: 'شريط AppBar يحتوي على عنوان نصي',
            type: 'child',
            assertion: { parentWidget: 'AppBar', childWidget: 'Text' }
          }
        ],
        hints: {
          hint1: 'Scaffold requires an appBar: and a body: property.',
          hint1Ar: 'يتطلب Scaffold خاصية appBar وخاصية body.',
          hint2: 'Wrap the screen body in Center for centered alignment.',
          hint2Ar: 'استخدم Center لمحاذاة المحتوى في وسط الشاشة.',
          conceptExplanation: 'Scaffold provides slots for AppBars, Drawers, Snackbars, and Floating Action Buttons.',
          conceptExplanationAr: 'يوفر Scaffold أماكن مخصصة للشريط العلوي، القائمة الجانبية، والزر العائم.'
        }
      }
    ]
  },
  {
    id: 'phase_layout',
    title: 'Phase 3: Layouts & Constraints',
    titleAr: 'المرحلة 3: التخطيط والمحاذاة والقيود',
    description: 'Master Row, Column, MainAxisAlignment, Expanded, SizedBox, and Stack.',
    descriptionAr: 'أتقن Row و Column و Expanded و SizedBox و Stack ونظام القيود.',
    icon: 'Grid',
    lessons: [
      {
        id: 'layout_rows_columns',
        phaseId: 'phase_layout',
        phaseTitle: 'Phase 3: Layouts & Constraints',
        phaseTitleAr: 'المرحلة 3: التخطيط والمحاذاة والقيود',
        title: 'Rows and Columns Alignment',
        titleAr: 'محاذاة الصفوف والأعمدة (Row & Column)',
        description: 'Understand the difference between mainAxisAlignment and crossAxisAlignment.',
        descriptionAr: 'افهم الفرق بين المحور الرئيسي والمحور المتقاطع وكيفية المحاذاة.',
        difficulty: 'intermediate',
        exerciseType: 'visual_target',
        concept: 'Column arranges children vertically (main axis: Y, cross axis: X). Row arranges horizontally.',
        conceptAr: 'ترتب Column عناصرها عمودياً (المحور الرئيسي رأسي). بينما ترتب Row عناصرها أفقياً.',
        objectives: [
          'Create a Column with 3 elements',
          'Set mainAxisAlignment: MainAxisAlignment.center',
          'Include Icons and Text in the Column'
        ],
        objectivesAr: [
          'إنشاء Column يحتوي على 3 عناصر',
          'ضبط mainAxisAlignment: MainAxisAlignment.center',
          'دمج أيقونات ونصوص داخل العمود'
        ],
        starterCode: `Column(
  mainAxisAlignment: MainAxisAlignment.center,
  crossAxisAlignment: CrossAxisAlignment.center,
  children: [
    Icon(
      Icons.star,
      size: 48,
      color: Colors.amber,
    ),
    SizedBox(height: 12),
    Text(
      'Flutter Mastery',
      style: TextStyle(
        fontSize: 22,
        fontWeight: FontWeight.bold,
      ),
    ),
    SizedBox(height: 8),
    Text(
      'Row & Column Layouts',
      style: TextStyle(
        fontSize: 16,
        color: Colors.grey,
      ),
    ),
  ],
)`,
        solutionCode: `Column(
  mainAxisAlignment: MainAxisAlignment.center,
  crossAxisAlignment: CrossAxisAlignment.center,
  children: [
    Icon(
      Icons.star,
      size: 48,
      color: Colors.amber,
    ),
    SizedBox(height: 12),
    Text(
      'Flutter Mastery',
      style: TextStyle(
        fontSize: 22,
        fontWeight: FontWeight.bold,
      ),
    ),
    SizedBox(height: 8),
    Text(
      'Row & Column Layouts',
      style: TextStyle(
        fontSize: 16,
        color: Colors.grey,
      ),
    ),
  ],
)`,
        tests: [
          {
            id: 't_col_exists',
            description: 'Column widget exists',
            descriptionAr: 'وجود ويدجت Column',
            type: 'widget',
            assertion: { widget: 'Column' }
          },
          {
            id: 't_col_main_axis',
            description: 'mainAxisAlignment is set to center',
            descriptionAr: 'ضبط mainAxisAlignment على center',
            type: 'property',
            assertion: { widget: 'Column', property: 'mainAxisAlignment', expectedValue: 'center' }
          },
          {
            id: 't_col_icon',
            description: 'Contains an Icon widget',
            descriptionAr: 'يحتوي على ويدجت Icon',
            type: 'widget',
            assertion: { widget: 'Icon' }
          }
        ],
        hints: {
          hint1: 'Ensure mainAxisAlignment: MainAxisAlignment.center is present.',
          hint1Ar: 'تأكد من كتابة mainAxisAlignment: MainAxisAlignment.center.',
          hint2: 'Use SizedBox(height: 12) to add vertical spacing between widgets.',
          hint2Ar: 'استخدم SizedBox(height: 12) لإضافة مسافة رأسية بين العناصر.',
          conceptExplanation: 'MainAxisAlignment controls distribution along the primary flex axis: center, spaceBetween, spaceAround, start, end.',
          conceptExplanationAr: 'تحدد خاصية MainAxisAlignment توزيع العناصر على المحور الأساسي: center أو spaceBetween وغيرها.'
        }
      },
      {
        id: 'layout_expanded',
        phaseId: 'phase_layout',
        phaseTitle: 'Phase 3: Layouts & Constraints',
        phaseTitleAr: 'المرحلة 3: التخطيط والمحاذاة والقيود',
        title: 'Expanded & Preventing Overflows',
        titleAr: 'ويدجت Expanded وتجنب أخطاء Overflow',
        description: 'Learn how Expanded distributes remaining flex space and avoids yellow-black overflow stripes.',
        descriptionAr: 'تعلم كيف يوزع Expanded المساحة المتبقية بالتساوي ويمنع خطأ تجاوز الشاشة.',
        difficulty: 'intermediate',
        exerciseType: 'bug_fixing',
        concept: 'Using fixed width items in a Row causes RenderFlex overflow. Wrap items in Expanded to fill available space dynamically.',
        conceptAr: 'استخدام أبعاد ثابتة كبيرة داخل Row يسبب Overflow. تغليف العنصر بـ Expanded يجعله يملأ المساحة المتاحة بمرونة.',
        objectives: [
          'Fix the Row layout using Expanded',
          'Distribute flex space evenly between containers'
        ],
        objectivesAr: [
          'إصلاح تخطيط Row باستخدام Expanded',
          'توزيع المساحة بين الصناديق بمرونة'
        ],
        starterCode: `Row(
  children: [
    Expanded(
      child: Container(
        height: 80,
        color: Colors.red,
        child: Center(
          child: Text('Box 1', style: TextStyle(color: Colors.white)),
        ),
      ),
    ),
    SizedBox(width: 8),
    Expanded(
      child: Container(
        height: 80,
        color: Colors.blue,
        child: Center(
          child: Text('Box 2', style: TextStyle(color: Colors.white)),
        ),
      ),
    ),
    SizedBox(width: 8),
    Expanded(
      child: Container(
        height: 80,
        color: Colors.green,
        child: Center(
          child: Text('Box 3', style: TextStyle(color: Colors.white)),
        ),
      ),
    ),
  ],
)`,
        solutionCode: `Row(
  children: [
    Expanded(
      child: Container(
        height: 80,
        color: Colors.red,
        child: Center(
          child: Text('Box 1', style: TextStyle(color: Colors.white)),
        ),
      ),
    ),
    SizedBox(width: 8),
    Expanded(
      child: Container(
        height: 80,
        color: Colors.blue,
        child: Center(
          child: Text('Box 2', style: TextStyle(color: Colors.white)),
        ),
      ),
    ),
    SizedBox(width: 8),
    Expanded(
      child: Container(
        height: 80,
        color: Colors.green,
        child: Center(
          child: Text('Box 3', style: TextStyle(color: Colors.white)),
        ),
      ),
    ),
  ],
)`,
        tests: [
          {
            id: 't_exp_row',
            description: 'Row widget exists',
            descriptionAr: 'وجود ويدجت Row',
            type: 'widget',
            assertion: { widget: 'Row' }
          },
          {
            id: 't_exp_expanded',
            description: 'Uses Expanded widgets to absorb width',
            descriptionAr: 'استخدام ويدجت Expanded لامتصاص المساحة',
            type: 'widget',
            assertion: { widget: 'Expanded' }
          }
        ],
        hints: {
          hint1: 'Wrap each Container inside an Expanded widget.',
          hint1Ar: 'قم بتغليف كل Container داخل ويدجت Expanded.',
          hint2: 'This forces each box to share the Row width proportionally.',
          hint2Ar: 'هذا يجبر كل صندوق على اقتسام عرض السطر بالتساوي.',
          conceptExplanation: 'Expanded expands a child of a Row, Column, or Flex so that the child fills the available space.',
          conceptExplanationAr: 'ويدجت Expanded يجعل العنصر التابع يملأ المساحة المتاحة في السطر أو العمود.'
        }
      }
    ]
  },
  {
    id: 'phase_state',
    title: 'Phase 5: State & Reactivity',
    titleAr: 'المرحلة 5: إدارة الحالة والتفاعل (State)',
    description: 'Learn StatefulWidget, setState, and reactive UI rebuilding.',
    descriptionAr: 'تعلم الفرق بين StatelessWidget و StatefulWidget وكيفية تحديث الشاشة عبر setState.',
    icon: 'Zap',
    lessons: [
      {
        id: 'state_setstate_counter',
        phaseId: 'phase_state',
        phaseTitle: 'Phase 5: State & Reactivity',
        phaseTitleAr: 'المرحلة 5: إدارة الحالة والتفاعل (State)',
        title: 'Interactive Counter with setState',
        titleAr: 'عداد تفاعلي مع setState',
        description: 'Trigger UI updates by mutating state inside setState(() { ... }).',
        descriptionAr: 'تحديث الواجهة فورياً عند تعديل قيمة المتغير داخل دالة setState.',
        difficulty: 'intermediate',
        exerciseType: 'free_coding',
        concept: 'Calling setState tells the Flutter framework that the internal state has changed and triggers build().',
        conceptAr: 'استدعاء دالة setState يُخطر محرك فلاتر بتغير الحالة، مما يعيد استدعاء دالة build() لتحديث الشاشة.',
        objectives: [
          'Create a Column with a counter Text and an ElevatedButton',
          'Trigger increment on button press'
        ],
        objectivesAr: [
          'إنشاء عمود يحمل نص العداد وزر ElevatedButton',
          'زيادة قيمة العداد عند النقر على الزر'
        ],
        starterCode: `Column(
  mainAxisAlignment: MainAxisAlignment.center,
  children: [
    Text(
      'You have pushed the button:',
      style: TextStyle(fontSize: 16),
    ),
    SizedBox(height: 12),
    Text(
      '42',
      style: TextStyle(
        fontSize: 36,
        fontWeight: FontWeight.bold,
        color: Colors.blue,
      ),
    ),
    SizedBox(height: 20),
    ElevatedButton(
      child: Text('Increment Counter'),
    ),
  ],
)`,
        solutionCode: `Column(
  mainAxisAlignment: MainAxisAlignment.center,
  children: [
    Text(
      'You have pushed the button:',
      style: TextStyle(fontSize: 16),
    ),
    SizedBox(height: 12),
    Text(
      '42',
      style: TextStyle(
        fontSize: 36,
        fontWeight: FontWeight.bold,
        color: Colors.blue,
      ),
    ),
    SizedBox(height: 20),
    ElevatedButton(
      child: Text('Increment Counter'),
    ),
  ],
)`,
        tests: [
          {
            id: 't_state_btn',
            description: 'ElevatedButton exists',
            descriptionAr: 'وجود زر ElevatedButton',
            type: 'widget',
            assertion: { widget: 'ElevatedButton' }
          },
          {
            id: 't_state_text',
            description: 'Counter text is rendered with large bold font',
            descriptionAr: 'عرض نص العداد بخط عريض وكبير',
            type: 'property',
            assertion: { widget: 'Text', property: 'fontSize', expectedValue: 36 }
          }
        ],
        hints: {
          hint1: 'Keep the Column centered and include the ElevatedButton.',
          hint1Ar: 'حافظ على محاذاة العمود بالمنتصف وأضف زر ElevatedButton.',
          hint2: 'Clicking the button in the interactive preview triggers the counter state!',
          hint2Ar: 'الضغط على الزر في نافذة المعاينة التفاعلية سيزيد قيمة العداد مباشرة!',
          conceptExplanation: 'Flutter builds the UI declaratively: UI = f(state). Whenever state changes via setState(), build() runs again.',
          conceptExplanationAr: 'واجهة فلاتر تصريحية (UI = f(state)). متى ما تغيرت الحالة عبر setState() يُعاد رسم الشاشة.'
        }
      }
    ]
  },
  {
    id: 'phase_networking',
    title: 'Phase 7: Networking & Mock APIs',
    titleAr: 'المرحلة 7: الاتصال بالشبكة وخوادم Mock API',
    description: 'Fetch data asynchronously with FutureBuilder, handle loading and error states securely.',
    descriptionAr: 'جلب البيانات عبر الإنترنت بواسطة FutureBuilder والتعامل مع حالات التحميل والخطأ بأمان.',
    icon: 'Globe',
    lessons: [
      {
        id: 'net_futurebuilder',
        phaseId: 'phase_networking',
        phaseTitle: 'Phase 7: Networking & Mock APIs',
        phaseTitleAr: 'المرحلة 7: الاتصال بالشبكة وخوادم Mock API',
        title: 'Mock API & FutureBuilder',
        titleAr: 'جلب البيانات وعرضها باستخدام FutureBuilder',
        description: 'Connect to /api/mock/users and render list cards with status indicators.',
        descriptionAr: 'الاتصال بنقطة النهاية الآمنة وعرض بطاقات المستخدمين.',
        difficulty: 'advanced',
        exerciseType: 'free_coding',
        concept: 'FutureBuilder listens to a Future and rebuilds its widget tree based on the ConnectionState.',
        conceptAr: 'ويدجت FutureBuilder يراقب دالة غير متزامنة (Future) ويبني الواجهة بحسب حالة الاتصال (loading / data / error).',
        objectives: [
          'Render a Card representing API data',
          'Display user profile with an Icon and Text'
        ],
        objectivesAr: [
          'إنشاء بطاقة Card لعرض بيانات مستخدم من الخادم',
          'إظهار أيقونة المستخدم واسمه'
        ],
        starterCode: `Card(
  elevation: 4,
  margin: EdgeInsets.all(16),
  child: Padding(
    padding: EdgeInsets.all(16),
    child: Row(
      children: [
        Icon(
          Icons.person,
          size: 40,
          color: Colors.blue,
        ),
        SizedBox(width: 16),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Alex Mercer',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 4),
            Text(
              'Senior Flutter Engineer',
              style: TextStyle(color: Colors.grey),
            ),
          ],
        ),
      ],
    ),
  ),
)`,
        solutionCode: `Card(
  elevation: 4,
  margin: EdgeInsets.all(16),
  child: Padding(
    padding: EdgeInsets.all(16),
    child: Row(
      children: [
        Icon(
          Icons.person,
          size: 40,
          color: Colors.blue,
        ),
        SizedBox(width: 16),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Alex Mercer',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 4),
            Text(
              'Senior Flutter Engineer',
              style: TextStyle(color: Colors.grey),
            ),
          ],
        ),
      ],
    ),
  ),
)`,
        tests: [
          {
            id: 't_net_card',
            description: 'Card widget exists',
            descriptionAr: 'وجود ويدجت Card',
            type: 'widget',
            assertion: { widget: 'Card' }
          },
          {
            id: 't_net_row',
            description: 'Card contains a Row for avatar and info',
            descriptionAr: 'تحتوي البطاقة على Row لترتيب الصورة والمعلومات',
            type: 'child',
            assertion: { parentWidget: 'Card', childWidget: 'Row' }
          }
        ],
        hints: {
          hint1: 'Card widget creates a rounded Material container with shadow.',
          hint1Ar: 'ويدجت Card ينشئ صندوقًا بزوايا مستديرة وظل مادي أنيق.',
          hint2: 'Use Row to align the Icon alongside the Column of texts.',
          hint2Ar: 'استخدم Row لوضع الأيقونة بجانب العمود النصي.',
          conceptExplanation: 'In full applications, data fetched from HTTP endpoints is fed into models and rendered in Cards or ListViews.',
          conceptExplanationAr: 'في التطبيقات الحقيقية، تمرر البيانات المسترجعة من API إلى نماذج (Models) وتُعرض في قوائم وبطاقات.'
        }
      }
    ]
  }
];

export const SKILL_TREE: SkillNode[] = [
  {
    id: 'skill_dart',
    name: 'Dart Syntax & OOP',
    nameAr: 'لغة Dart والبرمجة كائنية التوجه',
    category: 'Language',
    mastery: 85,
    childrenIds: ['skill_null_safety', 'skill_async']
  },
  {
    id: 'skill_null_safety',
    name: 'Null Safety',
    nameAr: 'الأمان من القيم الفارغة',
    category: 'Language',
    mastery: 90
  },
  {
    id: 'skill_async',
    name: 'Async & Futures',
    nameAr: 'البرمجة غير المتزامنة والوعود',
    category: 'Language',
    mastery: 70,
    recommendation: 'Practice FutureBuilder and error handling with try-catch.',
    recommendationAr: 'راجع التعامل مع FutureBuilder والتقاط الأخطاء.'
  },
  {
    id: 'skill_widgets',
    name: 'Core Widgets',
    nameAr: 'الويدجتس الأساسية',
    category: 'Flutter',
    mastery: 95,
    childrenIds: ['skill_container', 'skill_scaffold']
  },
  {
    id: 'skill_container',
    name: 'Container & BoxDecoration',
    nameAr: 'الصندوق والزخرفة',
    category: 'Flutter',
    mastery: 100
  },
  {
    id: 'skill_scaffold',
    name: 'Scaffold & Navigation',
    nameAr: 'الهيكل وشريط التطبيق',
    category: 'Flutter',
    mastery: 90
  },
  {
    id: 'skill_layout',
    name: 'Layouts & Constraints',
    nameAr: 'التخطيط والقيود الهندسية',
    category: 'Layout',
    mastery: 65,
    childrenIds: ['skill_flex', 'skill_constraints'],
    recommendation: 'Review: Row and Column alignment and Expanded usage.',
    recommendationAr: 'موصى به: مراجعة محاذاة Row و Column واستخدام Expanded.'
  },
  {
    id: 'skill_flex',
    name: 'Flex (Row & Column)',
    nameAr: 'محاور Flex (الصفوف والأعمدة)',
    category: 'Layout',
    mastery: 75
  },
  {
    id: 'skill_constraints',
    name: 'BoxConstraints & Overflow',
    nameAr: 'قيود الصناديق وأخطاء التجاوز',
    category: 'Layout',
    mastery: 55,
    recommendation: 'Study RenderFlex overflow prevention with Expanded and Flexible.',
    recommendationAr: 'ادرس تجنب أخطاء RenderFlex overflow بواسطة Expanded و Flexible.'
  },
  {
    id: 'skill_state',
    name: 'State Management',
    nameAr: 'إدارة الحالة',
    category: 'Architecture',
    mastery: 50,
    recommendation: 'Practice lifting state up and using setState vs Provider.',
    recommendationAr: 'تدرب على رفع الحالة واستخدام setState مقارنة بـ Provider.'
  }
];

export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: 'proj_profile_card',
    title: 'Project 01: Interactive Profile Card',
    titleAr: 'المشروع 1: بطاقة الملف الشخصي التفاعلية',
    description: 'Clean modern profile card featuring avatar, badge status, stats row, and contact button.',
    descriptionAr: 'بطاقة شخصية متكاملة تضم صورة رمزية، شارة الحالة، سطر الإحصائيات، وزر المراسلة.',
    approvedPackages: ['flutter', 'flutter_test'],
    files: [
      {
        name: 'main.dart',
        path: 'lib/main.dart',
        isMain: true,
        content: `// Project 01: Profile Card UI
Center(
  child: Container(
    width: 280,
    padding: EdgeInsets.all(20),
    color: Colors.white,
    child: Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Icon(
          Icons.account_circle,
          size: 72,
          color: Colors.blue,
        ),
        SizedBox(height: 12),
        Text(
          'Sarah Connor',
          style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
        ),
        SizedBox(height: 4),
        Text(
          'Mobile App Developer',
          style: TextStyle(color: Colors.grey, fontSize: 14),
        ),
        SizedBox(height: 16),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.star, color: Colors.amber, size: 20),
            SizedBox(width: 4),
            Text('4.9 Rating', style: TextStyle(fontWeight: FontWeight.bold)),
          ],
        ),
        SizedBox(height: 20),
        ElevatedButton(
          child: Text('Contact Me'),
        ),
      ],
    ),
  ),
)`
      },
      {
        name: 'pubspec.yaml',
        path: 'pubspec.yaml',
        readOnly: true,
        content: `name: profile_card_app
description: An interactive profile card in Flutter
version: 1.0.0+1
environment:
  sdk: ">=3.0.0 <4.0.0"
dependencies:
  flutter:
    sdk: flutter
flutter:
  uses-material-design: true`
      }
    ]
  },
  {
    id: 'proj_todo_app',
    title: 'Project 02: Flutter Todo List',
    titleAr: 'المشروع 2: تطبيق المهام اليومية (Todo List)',
    description: 'Stateful task manager with checkable items and action buttons.',
    descriptionAr: 'مدير مهام تفاعلي يحمل عناصر قابلة للتعليم وزر إضافة مهام جديدة.',
    approvedPackages: ['flutter', 'provider'],
    files: [
      {
        name: 'main.dart',
        path: 'lib/main.dart',
        isMain: true,
        content: `Scaffold(
  appBar: AppBar(
    title: Text('My Tasks (3)'),
    backgroundColor: Colors.teal,
  ),
  body: Container(
    padding: EdgeInsets.all(16),
    child: Column(
      children: [
        Container(
          padding: EdgeInsets.all(16),
          color: Colors.white,
          child: Row(
            children: [
              Icon(Icons.check_circle, color: Colors.green),
              SizedBox(width: 12),
              Text(
                'Learn Dart Syntax',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
            ],
          ),
        ),
        SizedBox(height: 10),
        Container(
          padding: EdgeInsets.all(16),
          color: Colors.white,
          child: Row(
            children: [
              Icon(Icons.check_circle, color: Colors.green),
              SizedBox(width: 12),
              Text(
                'Build Widget Tree',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
            ],
          ),
        ),
        SizedBox(height: 10),
        Container(
          padding: EdgeInsets.all(16),
          color: Colors.white,
          child: Row(
            children: [
              Icon(Icons.radio_button_unchecked, color: Colors.grey),
              SizedBox(width: 12),
              Text(
                'Deploy Flutter Web App',
                style: TextStyle(fontSize: 16),
              ),
            ],
          ),
        ),
        SizedBox(height: 24),
        ElevatedButton(
          child: Text('+ Add New Task'),
        ),
      ],
    ),
  ),
)`
      },
      {
        name: 'pubspec.yaml',
        path: 'pubspec.yaml',
        readOnly: true,
        content: `name: todo_flutter_app
description: Flutter Todo App
version: 1.0.0
dependencies:
  flutter:
    sdk: flutter`
      }
    ]
  },
  {
    id: 'proj_weather_app',
    title: 'Project 03: Weather Dashboard with Mock API',
    titleAr: 'المشروع 3: تطبيق الطقس المتصل بالخادم',
    description: 'Weather metrics display fetching data from educational mock API.',
    descriptionAr: 'واجهة طقس عصرية تعرض درجات الحرارة وسرعة الرياح عبر Mock API.',
    approvedPackages: ['flutter', 'http'],
    files: [
      {
        name: 'main.dart',
        path: 'lib/main.dart',
        isMain: true,
        content: `Container(
  padding: EdgeInsets.all(24),
  color: Colors.indigo,
  child: Center(
    child: Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Icon(
          Icons.wb_sunny,
          size: 64,
          color: Colors.amber,
        ),
        SizedBox(height: 12),
        Text(
          'Dubai, UAE',
          style: TextStyle(fontSize: 26, color: Colors.white, fontWeight: FontWeight.bold),
        ),
        SizedBox(height: 8),
        Text(
          '28°C',
          style: TextStyle(fontSize: 48, color: Colors.white, fontWeight: FontWeight.bold),
        ),
        SizedBox(height: 6),
        Text(
          'Sunny & Clear Skies',
          style: TextStyle(fontSize: 16, color: Colors.white70),
        ),
        SizedBox(height: 24),
        Container(
          padding: EdgeInsets.all(12),
          color: Colors.deepPurple,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                'Humidity: 45%',
                style: TextStyle(color: Colors.white, fontSize: 14),
              ),
              SizedBox(width: 20),
              Text(
                'Wind: 14 km/h',
                style: TextStyle(color: Colors.white, fontSize: 14),
              ),
            ],
          ),
        ),
      ],
    ),
  ),
)`
      },
      {
        name: 'pubspec.yaml',
        path: 'pubspec.yaml',
        readOnly: true,
        content: `name: weather_app
description: Weather application in Flutter
version: 1.0.0
dependencies:
  flutter:
    sdk: flutter
  http: ^1.2.0`
      }
    ]
  }
];
