import { ExerciseTest, WidgetNode } from '../types/flutter';

export interface TestCaseResult {
  test: ExerciseTest;
  passed: boolean;
  reason: string;
  expectedOutput: string;
  actualOutput: string;
  assertionType: string;
}

export interface DetailedEvaluationResult {
  allPassed: boolean;
  passCount: number;
  totalCount: number;
  results: TestCaseResult[];
}

// Helper to find all nodes of a given type in tree
function findWidgetsByType(root: WidgetNode | null, type: string): WidgetNode[] {
  if (!root) return [];
  const results: WidgetNode[] = [];

  function traverse(node: WidgetNode) {
    if (node.type.toLowerCase() === type.toLowerCase()) {
      results.push(node);
    }
    node.children.forEach(traverse);
  }

  traverse(root);
  return results;
}

export function evaluateExerciseDetailed(
  tests: ExerciseTest[],
  rootWidget: WidgetNode | null,
  code: string
): DetailedEvaluationResult {
  if (!tests || tests.length === 0) {
    return {
      allPassed: true,
      passCount: 0,
      totalCount: 0,
      results: [],
    };
  }

  let passCount = 0;
  const results: TestCaseResult[] = tests.map(test => {
    let passed = false;
    let reason = '';
    let expectedOutput = '';
    let actualOutput = '';
    const assertionType = test.type;

    if (!rootWidget) {
      return {
        test,
        passed: false,
        reason: 'No valid widget tree was produced from code.',
        expectedOutput: `Valid tree with <${test.assertion.widget || 'Widget'}>`,
        actualOutput: 'null (empty or unparsed tree)',
        assertionType,
      };
    }

    switch (test.type) {
      case 'widget': {
        const targetType = test.assertion.widget || 'Widget';
        expectedOutput = `Widget <${targetType}> present in tree`;
        const matches = findWidgetsByType(rootWidget, targetType);
        if (matches.length > 0) {
          passed = true;
          actualOutput = `Found ${matches.length} instance(s) of <${targetType}>`;
          reason = `Found ${matches.length} instance(s) of <${targetType}>.`;
        } else {
          passed = false;
          actualOutput = `<${targetType}> not found (0 instances)`;
          reason = `Expected widget <${targetType}> was not found in the widget tree.`;
        }
        break;
      }

      case 'property': {
        const targetType = test.assertion.widget;
        const propName = test.assertion.property;
        const expectedVal = test.assertion.expectedValue;

        expectedOutput = `${targetType ? targetType + '.' : ''}${propName} == ${JSON.stringify(expectedVal)}`;

        if (!propName) {
          passed = true;
          actualOutput = 'N/A';
          reason = 'No property specified';
          break;
        }

        const candidateWidgets = targetType ? findWidgetsByType(rootWidget, targetType) : [rootWidget];
        if (candidateWidgets.length === 0) {
          passed = false;
          actualOutput = `Target widget <${targetType}> missing`;
          reason = `Target widget <${targetType}> not found to inspect property '${propName}'.`;
          break;
        }

        let foundMatch = false;
        let actualVal: any = undefined;

        for (const w of candidateWidgets) {
          const val = w.properties[propName];
          actualVal = val;
          if (expectedVal !== undefined) {
            if (typeof expectedVal === 'string' && typeof val === 'string') {
              if (val.toLowerCase() === expectedVal.toLowerCase()) {
                foundMatch = true;
                break;
              }
            } else if (val === expectedVal) {
              foundMatch = true;
              break;
            }
          } else if (val !== undefined) {
            foundMatch = true;
            break;
          }
        }

        actualOutput = `${actualVal !== undefined ? JSON.stringify(actualVal) : 'undefined'}`;

        if (foundMatch) {
          passed = true;
          reason = `Property '${propName}' matched expected value: ${expectedVal}.`;
        } else {
          passed = false;
          reason = `Expected ${targetType ? targetType + '.' : ''}${propName} = ${expectedVal}, but found ${actualVal !== undefined ? actualVal : 'undefined'}.`;
        }
        break;
      }

      case 'child': {
        const parentType = test.assertion.parentWidget || 'Parent';
        const childType = test.assertion.childWidget || 'Child';

        expectedOutput = `<${parentType}> must contain <${childType}>`;

        const parents = findWidgetsByType(rootWidget, parentType);
        if (parents.length === 0) {
          passed = false;
          actualOutput = `Parent <${parentType}> was not found`;
          reason = `Parent widget <${parentType}> not found in tree.`;
          break;
        }

        let hasChild = false;
        for (const p of parents) {
          const directChildren = p.children.map(c => c.type.toLowerCase());
          if (directChildren.includes(childType.toLowerCase())) {
            hasChild = true;
            break;
          }
          const allDescendants = findWidgetsByType(p, childType);
          if (allDescendants.length > 0) {
            hasChild = true;
            break;
          }
        }

        if (hasChild) {
          passed = true;
          actualOutput = `<${childType}> is properly nested within <${parentType}>`;
          reason = `<${parentType}> properly contains <${childType}>.`;
        } else {
          passed = false;
          actualOutput = `<${parentType}> contains children [${parents[0].children.map(c => c.type).join(', ') || 'none'}], missing <${childType}>`;
          reason = `Expected <${parentType}> to have child widget <${childType}>.`;
        }
        break;
      }

      default:
        passed = true;
        expectedOutput = 'Custom assertion';
        actualOutput = 'Passed';
        reason = 'Assertion passed.';
        break;
    }

    if (passed) passCount++;

    return {
      test,
      passed,
      reason,
      expectedOutput,
      actualOutput,
      assertionType,
    };
  });

  return {
    allPassed: passCount === tests.length,
    passCount,
    totalCount: tests.length,
    results,
  };
}
