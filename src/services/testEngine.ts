import { ExerciseTest, WidgetNode } from '../types/flutter';

export interface EvaluationResult {
  allPassed: boolean;
  passCount: number;
  totalCount: number;
  testResults: {
    test: ExerciseTest;
    passed: boolean;
    reason: string;
  }[];
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

export function evaluateExercise(tests: ExerciseTest[], rootWidget: WidgetNode | null, code: string): EvaluationResult {
  if (!tests || tests.length === 0) {
    return {
      allPassed: true,
      passCount: 0,
      totalCount: 0,
      testResults: []
    };
  }

  let passCount = 0;
  const testResults = tests.map(test => {
    let passed = false;
    let reason = '';

    if (!rootWidget) {
      return {
        test,
        passed: false,
        reason: 'No valid widget tree was produced from code.'
      };
    }

    switch (test.type) {
      case 'widget': {
        const targetType = test.assertion.widget;
        if (!targetType) {
          passed = true;
          break;
        }
        const matches = findWidgetsByType(rootWidget, targetType);
        if (matches.length > 0) {
          passed = true;
          reason = `Found ${matches.length} instance(s) of ${targetType}.`;
        } else {
          passed = false;
          reason = `Expected widget <${targetType}> was not found in the widget tree.`;
        }
        break;
      }

      case 'property': {
        const targetType = test.assertion.widget;
        const propName = test.assertion.property;
        const expectedVal = test.assertion.expectedValue;

        if (!propName) {
          passed = true;
          break;
        }

        const candidateWidgets = targetType ? findWidgetsByType(rootWidget, targetType) : [rootWidget];
        if (candidateWidgets.length === 0) {
          passed = false;
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
        const parentType = test.assertion.parentWidget;
        const childType = test.assertion.childWidget;

        if (!parentType || !childType) {
          passed = true;
          break;
        }

        const parents = findWidgetsByType(rootWidget, parentType);
        if (parents.length === 0) {
          passed = false;
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
          // Also check recursive descendents
          const allDescendants = findWidgetsByType(p, childType);
          if (allDescendants.length > 0) {
            hasChild = true;
            break;
          }
        }

        if (hasChild) {
          passed = true;
          reason = `<${parentType}> properly contains <${childType}>.`;
        } else {
          passed = false;
          reason = `Expected <${parentType}> to have child widget <${childType}>.`;
        }
        break;
      }

      default:
        passed = true;
        reason = 'Assertion passed.';
        break;
    }

    if (passed) passCount++;

    return {
      test,
      passed,
      reason
    };
  });

  return {
    allPassed: passCount === tests.length,
    passCount,
    totalCount: tests.length,
    testResults
  };
}
