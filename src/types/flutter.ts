export interface SourceRange {
  startLine: number;
  startColumn: number;
  endLine: number;
  endColumn: number;
}

export interface WidgetNode {
  id: string;
  type: string;
  properties: Record<string, any>;
  sourceRange?: SourceRange;
  parentId: string | null;
  children: WidgetNode[];
  depth: number;
}

export type ExerciseType = 
  | 'free_coding' 
  | 'code_completion' 
  | 'visual_target' 
  | 'bug_fixing' 
  | 'prediction';

export interface ExerciseTest {
  id: string;
  description: string;
  descriptionAr: string;
  type: 'widget' | 'property' | 'text' | 'child' | 'runtime' | 'layout';
  assertion: {
    widget?: string;
    property?: string;
    expectedValue?: any;
    parentWidget?: string;
    childWidget?: string;
    customCheck?: (tree: WidgetNode, code: string) => boolean;
  };
  passed?: boolean;
  message?: string;
}

export interface EducationalError {
  category: 'syntax' | 'compilation' | 'type' | 'runtime' | 'layout_overflow' | 'test_failure';
  title: string;
  titleAr: string;
  message: string;
  explanation: string;
  explanationAr: string;
  suggestion: string;
  suggestionAr: string;
  line?: number;
  column?: number;
}

export interface Lesson {
  id: string;
  phaseId: string;
  phaseTitle: string;
  phaseTitleAr: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  exerciseType: ExerciseType;
  concept: string;
  conceptAr: string;
  objectives: string[];
  objectivesAr: string[];
  starterCode: string;
  solutionCode: string;
  visualTargetDescription?: string;
  tests: ExerciseTest[];
  hints: {
    hint1: string;
    hint1Ar: string;
    hint2: string;
    hint2Ar: string;
    conceptExplanation: string;
    conceptExplanationAr: string;
  };
}

export interface Phase {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  icon: string;
  lessons: Lesson[];
}

export interface ProjectFile {
  name: string;
  path: string;
  content: string;
  isMain?: boolean;
  readOnly?: boolean;
}

export interface ProjectTemplate {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  files: ProjectFile[];
  approvedPackages: string[];
}

export interface SkillNode {
  id: string;
  name: string;
  nameAr: string;
  category: string;
  mastery: number; // 0 to 100
  childrenIds?: string[];
  recommendation?: string;
  recommendationAr?: string;
}

export interface UserProgressState {
  completedLessons: string[];
  completedExercises: string[];
  currentLessonId: string;
  streakDays: number;
  totalPoints: number;
  skillMastery: Record<string, number>;
}
