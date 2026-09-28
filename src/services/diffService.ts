export interface DiffLine {
  type: 'added' | 'removed' | 'unchanged';
  text: string;
  leftLineNumber?: number;
  rightLineNumber?: number;
}

export function computeSideBySideDiff(oldText: string, newText: string): {
  leftLines: { text: string; lineNumber: number; type: 'removed' | 'unchanged' }[];
  rightLines: { text: string; lineNumber: number; type: 'added' | 'unchanged' }[];
} {
  const oldLines = oldText.split('\n');
  const newLines = newText.split('\n');

  // Simple and fast line-by-line diff alignment
  const leftLines: { text: string; lineNumber: number; type: 'removed' | 'unchanged' }[] = [];
  const rightLines: { text: string; lineNumber: number; type: 'added' | 'unchanged' }[] = [];

  const maxLen = Math.max(oldLines.length, newLines.length);

  for (let i = 0; i < maxLen; i++) {
    const o = oldLines[i];
    const n = newLines[i];

    if (o !== undefined && n !== undefined) {
      if (o.trim() === n.trim()) {
        leftLines.push({ text: o, lineNumber: i + 1, type: 'unchanged' });
        rightLines.push({ text: n, lineNumber: i + 1, type: 'unchanged' });
      } else {
        leftLines.push({ text: o, lineNumber: i + 1, type: 'removed' });
        rightLines.push({ text: n, lineNumber: i + 1, type: 'added' });
      }
    } else if (o !== undefined) {
      leftLines.push({ text: o, lineNumber: i + 1, type: 'removed' });
      rightLines.push({ text: '', lineNumber: i + 1, type: 'unchanged' });
    } else if (n !== undefined) {
      leftLines.push({ text: '', lineNumber: i + 1, type: 'unchanged' });
      rightLines.push({ text: n, lineNumber: i + 1, type: 'added' });
    }
  }

  return { leftLines, rightLines };
}
