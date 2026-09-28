import React, { useState } from 'react';
import { 
  FolderTree, 
  ChevronRight, 
  ChevronDown, 
  Box, 
  Layers, 
  Code, 
  Sparkles,
  Info,
  Maximize2
} from 'lucide-react';
import { WidgetNode, SourceRange } from '../types/flutter';

interface WidgetTreePanelProps {
  rootWidget: WidgetNode | null;
  selectedWidget: WidgetNode | null;
  onSelectWidget: (widget: WidgetNode) => void;
  language: 'ar' | 'en';
}

export const WidgetTreePanel: React.FC<WidgetTreePanelProps> = ({
  rootWidget,
  selectedWidget,
  onSelectWidget,
  language,
}) => {
  const isAr = language === 'ar';
  const [collapsedNodes, setCollapsedNodes] = useState<Record<string, boolean>>({});

  const toggleCollapse = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCollapsedNodes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const renderTreeNode = (node: WidgetNode) => {
    const isSelected = selectedWidget?.id === node.id;
    const hasChildren = node.children && node.children.length > 0;
    const isCollapsed = collapsedNodes[node.id] || false;

    // Pick badge color based on widget category
    const getWidgetBadgeColor = (type: string) => {
      if (['Row', 'Column', 'Stack', 'Wrap'].includes(type)) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      if (['Container', 'SizedBox', 'Padding', 'Card'].includes(type)) return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
      if (['Text', 'Icon', 'Image'].includes(type)) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      if (['Scaffold', 'AppBar', 'MaterialApp'].includes(type)) return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30';
      if (['ElevatedButton', 'GestureDetector'].includes(type)) return 'text-pink-400 bg-pink-500/10 border-pink-500/30';
      return 'text-slate-300 bg-slate-800 border-slate-700';
    };

    return (
      <div key={node.id} className="flex flex-col">
        <div
          onClick={() => onSelectWidget(node)}
          style={{ paddingLeft: `${node.depth * 14 + 8}px` }}
          className={`flex items-center gap-1.5 py-1.5 pr-2 rounded-lg cursor-pointer transition-colors text-xs font-mono group ${
            isSelected 
              ? 'bg-cyan-500/20 text-cyan-200 font-semibold border border-cyan-500/40 shadow-sm' 
              : 'hover:bg-slate-800/60 text-slate-300'
          }`}
        >
          {hasChildren ? (
            <button 
              onClick={(e) => toggleCollapse(node.id, e)}
              className="p-0.5 text-slate-400 hover:text-white rounded"
            >
              {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          ) : (
            <span className="w-3.5 h-3.5 flex items-center justify-center text-slate-600">•</span>
          )}

          <span className={`px-1.5 py-0.5 rounded text-[11px] border font-medium ${getWidgetBadgeColor(node.type)}`}>
            {node.type}
          </span>

          {/* Quick property preview tag */}
          {node.properties.text && (
            <span className="text-[10px] text-slate-400 truncate max-w-[100px]">
              "{node.properties.text}"
            </span>
          )}
          {node.properties.color && (
            <span className="text-[10px] text-slate-500 truncate">
              {node.properties.color.replace('Colors.', '')}
            </span>
          )}
          {node.properties.width && node.properties.height && (
            <span className="text-[10px] text-slate-500">
              {node.properties.width}×{node.properties.height}
            </span>
          )}
        </div>

        {/* Children nodes */}
        {hasChildren && !isCollapsed && (
          <div className="flex flex-col border-l border-slate-800/80 ml-3">
            {node.children.map(renderTreeNode)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 border border-slate-800/80 rounded-xl overflow-hidden shadow-2xl">
      {/* Panel Header */}
      <div className="h-10 bg-slate-900/90 border-b border-slate-800/80 px-3 flex items-center justify-between select-none">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
          <FolderTree className="w-3.5 h-3.5 text-cyan-400" />
          <span>{isAr ? 'شجرة الـ Widgets (Tree)' : 'Widget Tree'}</span>
        </div>

        {selectedWidget && (
          <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded">
            {selectedWidget.type}
          </span>
        )}
      </div>

      {/* Tree Content */}
      <div className="flex-1 overflow-auto p-2">
        {rootWidget ? (
          <div className="space-y-0.5">
            {renderTreeNode(rootWidget)}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center text-slate-500">
            <Box className="w-8 h-8 mb-2 text-slate-700" />
            <p className="text-xs">{isAr ? 'لا توجد شجرة ويدجت نشطة' : 'No active widget tree'}</p>
          </div>
        )}
      </div>

      {/* Educational Tree footer explanation */}
      <div className="p-2.5 bg-slate-900/70 border-t border-slate-800/70 text-[11px] text-slate-400 flex items-start gap-1.5 select-none">
        <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
        <span>
          {isAr 
            ? 'انقر فوق أي Widget لرؤية مصدرها في الكود وتعديل خصائصها بصرياً.'
            : 'Click any node to highlight its source in the editor and view properties.'}
        </span>
      </div>
    </div>
  );
};
