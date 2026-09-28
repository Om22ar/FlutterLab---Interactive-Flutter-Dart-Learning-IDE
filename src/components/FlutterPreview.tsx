import React, { useState } from 'react';
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  RotateCw, 
  Crosshair, 
  Sun, 
  Moon, 
  AlertTriangle,
  ZoomIn,
  RefreshCw,
  Info,
  Sliders,
  PanelRightClose,
  PanelRightOpen
} from 'lucide-react';
import { WidgetNode, SourceRange, EducationalError } from '../types/flutter';
import { FLUTTER_COLORS } from '../services/flutterParser';

interface FlutterPreviewProps {
  rootWidget: WidgetNode | null;
  selectedWidgetId: string | null;
  onSelectWidget: (widget: WidgetNode) => void;
  warnings: EducationalError[];
  isRunning: boolean;
  language: 'ar' | 'en';
  onToggleRightPanel?: () => void;
  isRightPanelVisible?: boolean;
}

export const FlutterPreview: React.FC<FlutterPreviewProps> = ({
  rootWidget,
  selectedWidgetId,
  onSelectWidget,
  warnings,
  isRunning,
  language,
  onToggleRightPanel,
  isRightPanelVisible = true,
}) => {
  const isAr = language === 'ar';
  const [deviceFrame, setDeviceFrame] = useState<'iphone' | 'pixel' | 'tablet' | 'responsive'>('iphone');
  const [isLandscape, setIsLandscape] = useState(false);
  const [isInspectorActive, setIsInspectorActive] = useState(true);
  const [flutterTheme, setFlutterTheme] = useState<'light' | 'dark'>('light');
  
  // Interactive mock state for button presses / counters
  const [interactiveCounter, setInteractiveCounter] = useState<number>(42);
  const [interactiveTasks, setInteractiveTasks] = useState<Record<string, boolean>>({});

  const handleButtonClick = () => {
    setInteractiveCounter(prev => prev + 1);
  };

  const getDeviceDimensions = () => {
    if (deviceFrame === 'iphone') {
      return isLandscape ? { width: '560px', height: '320px' } : { width: '320px', height: '540px' };
    }
    if (deviceFrame === 'pixel') {
      return isLandscape ? { width: '540px', height: '310px' } : { width: '310px', height: '520px' };
    }
    if (deviceFrame === 'tablet') {
      return isLandscape ? { width: '600px', height: '420px' } : { width: '420px', height: '560px' };
    }
    return { width: '100%', height: '100%' };
  };

  const dims = getDeviceDimensions();

  // Recursive widget renderer
  const renderWidget = (node: WidgetNode): React.ReactNode => {
    const isSelected = selectedWidgetId === node.id;
    const props = node.properties || {};

    const baseWrapperProps = {
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation();
        onSelectWidget(node);
      },
      className: `relative transition-all duration-200 cursor-pointer ${
        isInspectorActive ? 'hover:outline-1 hover:outline-dashed hover:outline-cyan-400' : ''
      } ${isSelected ? 'outline-2 outline-dashed outline-cyan-500 shadow-lg shadow-cyan-500/20' : ''}`
    };

    // Render dimensions and widget name badge if selected in inspector
    const inspectorBadge = isSelected ? (
      <div className="absolute -top-5 left-0 z-40 bg-cyan-600 text-white text-[10px] font-mono px-1.5 py-0.5 rounded shadow pointer-events-none flex items-center gap-1">
        <span>{node.type}</span>
        {props.width && props.height && (
          <span className="opacity-80">({props.width}×{props.height})</span>
        )}
      </div>
    ) : null;

    switch (node.type) {
      case 'MaterialApp':
        return (
          <div key={node.id} {...baseWrapperProps} className={`w-full h-full flex flex-col font-sans ${flutterTheme === 'dark' ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
            {inspectorBadge}
            {node.children.map(renderWidget)}
          </div>
        );

      case 'Scaffold':
        return (
          <div key={node.id} {...baseWrapperProps} className={`w-full h-full flex flex-col relative overflow-hidden ${flutterTheme === 'dark' ? 'bg-slate-900' : 'bg-slate-100'}`}>
            {inspectorBadge}
            {node.children.map(renderWidget)}
          </div>
        );

      case 'AppBar': {
        const bg = FLUTTER_COLORS[props.backgroundColor] || '#3F51B5';
        return (
          <div 
            key={node.id}
            {...baseWrapperProps} 
            className="w-full h-12 flex items-center px-4 shadow-sm text-white z-10 shrink-0"
            style={{ backgroundColor: bg }}
          >
            {inspectorBadge}
            <div className="font-semibold text-base tracking-wide flex-1">
              {node.children.length > 0 ? node.children.map(renderWidget) : 'Flutter App'}
            </div>
          </div>
        );
      }

      case 'Center':
        return (
          <div key={node.id} {...baseWrapperProps} className="w-full h-full flex items-center justify-center p-2 flex-1">
            {inspectorBadge}
            {node.children.map(renderWidget)}
          </div>
        );

      case 'Container': {
        const bg = FLUTTER_COLORS[props.color] || (flutterTheme === 'dark' ? '#1e293b' : '#ffffff');
        const style: React.CSSProperties = {
          backgroundColor: bg,
          width: props.width ? `${props.width}px` : undefined,
          height: props.height ? `${props.height}px` : undefined,
          borderRadius: props.borderRadius ? `${props.borderRadius}px` : '8px',
          padding: props.padding ? `${props.padding}px` : (props.paddingH || props.paddingV ? `${props.paddingV || 0}px ${props.paddingH || 0}px` : '0px'),
        };

        return (
          <div key={node.id} {...baseWrapperProps} style={style} className="shadow-sm flex flex-col items-center justify-center box-border transition-all">
            {inspectorBadge}
            {node.children.map(renderWidget)}
          </div>
        );
      }

      case 'Padding': {
        const p = props.padding || 16;
        return (
          <div key={node.id} {...baseWrapperProps} style={{ padding: `${p}px` }} className="w-full">
            {inspectorBadge}
            {node.children.map(renderWidget)}
          </div>
        );
      }

      case 'Row': {
        let justify = 'justify-start';
        if (props.mainAxisAlignment === 'center') justify = 'justify-center';
        if (props.mainAxisAlignment === 'spaceBetween') justify = 'justify-between';
        if (props.mainAxisAlignment === 'spaceAround') justify = 'justify-around';
        if (props.mainAxisAlignment === 'spaceEvenly') justify = 'justify-evenly';
        if (props.mainAxisAlignment === 'end') justify = 'justify-end';

        return (
          <div key={node.id} {...baseWrapperProps} className={`w-full flex flex-row items-center ${justify} gap-2 relative`}>
            {inspectorBadge}
            {node.children.map(renderWidget)}
          </div>
        );
      }

      case 'Column': {
        let justify = 'justify-start';
        if (props.mainAxisAlignment === 'center') justify = 'justify-center';
        if (props.mainAxisAlignment === 'spaceBetween') justify = 'justify-between';
        if (props.mainAxisAlignment === 'spaceAround') justify = 'justify-around';
        if (props.mainAxisAlignment === 'end') justify = 'justify-end';

        return (
          <div key={node.id} {...baseWrapperProps} className={`w-full h-full flex flex-col items-center ${justify} gap-1 relative`}>
            {inspectorBadge}
            {node.children.map(renderWidget)}
          </div>
        );
      }

      case 'Expanded':
      case 'Flexible':
        return (
          <div key={node.id} {...baseWrapperProps} className="flex-1 flex flex-col items-center justify-center min-w-0">
            {inspectorBadge}
            {node.children.map(renderWidget)}
          </div>
        );

      case 'SizedBox': {
        const style: React.CSSProperties = {
          width: props.width ? `${props.width}px` : undefined,
          height: props.height ? `${props.height}px` : undefined,
        };
        return (
          <div key={node.id} {...baseWrapperProps} style={style} className="shrink-0">
            {inspectorBadge}
            {node.children.map(renderWidget)}
          </div>
        );
      }

      case 'Card':
        return (
          <div 
            key={node.id}
            {...baseWrapperProps} 
            className={`rounded-xl shadow-md border ${
              flutterTheme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'
            } overflow-hidden`}
          >
            {inspectorBadge}
            {node.children.map(renderWidget)}
          </div>
        );

      case 'Text': {
        const color = FLUTTER_COLORS[props.textColor] || (flutterTheme === 'dark' ? '#f8fafc' : '#0f172a');
        let displayedText = props.text !== undefined ? String(props.text) : 'Text';
        
        // If this is a counter text, bind to dynamic state!
        if (displayedText.trim() === '42' || (!isNaN(Number(displayedText)) && Number(displayedText) >= 42)) {
          displayedText = String(interactiveCounter);
        }

        const style: React.CSSProperties = {
          fontSize: props.fontSize ? `${props.fontSize}px` : '15px',
          fontWeight: props.fontWeight === 'bold' ? 700 : 400,
          color,
        };

        return (
          <span key={node.id} {...baseWrapperProps} style={style} className="leading-tight inline-block">
            {inspectorBadge}
            {displayedText}
          </span>
        );
      }

      case 'Icon': {
        const color = FLUTTER_COLORS[props.color] || '#2196F3';
        const size = props.size || 24;
        return (
          <div key={node.id} {...baseWrapperProps} style={{ color, fontSize: `${size}px` }} className="flex items-center justify-center">
            {inspectorBadge}
            <span className="material-symbols-outlined select-none" style={{ fontSize: `${size}px` }}>
              {props.icon || 'star'}
            </span>
          </div>
        );
      }

      case 'ElevatedButton':
        return (
          <button 
            key={node.id}
            {...baseWrapperProps}
            onClick={(e) => {
              e.stopPropagation();
              handleButtonClick();
              onSelectWidget(node);
            }}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-95 text-white font-medium rounded-full shadow-md text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {inspectorBadge}
            {node.children.length > 0 ? node.children.map(renderWidget) : <span>Press Me</span>}
          </button>
        );

      default:
        return (
          <div key={node.id} {...baseWrapperProps} className="p-2 border border-dashed border-slate-400 rounded">
            {inspectorBadge}
            <span className="text-xs text-slate-500 font-mono">{node.type}</span>
            {node.children.map(renderWidget)}
          </div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 border border-slate-800/80 rounded-xl overflow-hidden shadow-2xl relative">
      {/* Simulator Control Header */}
      <div className="h-10 bg-slate-900/90 border-b border-slate-800/80 px-3 flex items-center justify-between select-none">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mr-2">
            <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isAr ? 'المعاينة الحية' : 'Live Preview'}</span>
          </span>

          {/* Device Selector */}
          <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setDeviceFrame('iphone')}
              className={`p-1 rounded cursor-pointer ${deviceFrame === 'iphone' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-slate-200'}`}
              title="iPhone 16 Pro"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDeviceFrame('tablet')}
              className={`p-1 rounded cursor-pointer ${deviceFrame === 'tablet' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-slate-200'}`}
              title="Tablet View"
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDeviceFrame('responsive')}
              className={`p-1 rounded cursor-pointer ${deviceFrame === 'responsive' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-slate-200'}`}
              title="Responsive Canvas"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Rotate Orientation */}
          {deviceFrame !== 'responsive' && (
            <button
              onClick={() => setIsLandscape(!isLandscape)}
              className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
              title="Rotate Device"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Inspector Mode & Theme Toggle */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsInspectorActive(!isInspectorActive)}
            className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 transition-all cursor-pointer ${
              isInspectorActive
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800'
            }`}
            title="Inspect Flutter Widgets"
          >
            <Crosshair className="w-3 h-3 text-cyan-400" />
            <span className="hidden sm:inline">{isAr ? 'الفاحص' : 'Inspector'}</span>
          </button>

          <button
            onClick={() => setFlutterTheme(flutterTheme === 'light' ? 'dark' : 'light')}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800 cursor-pointer"
            title="Toggle Flutter Theme"
          >
            {flutterTheme === 'light' ? <Moon className="w-3.5 h-3.5 text-indigo-400" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
          </button>

          {onToggleRightPanel && (
            <button
              onClick={onToggleRightPanel}
              className={`p-1 rounded text-xs transition-colors cursor-pointer border ${
                isRightPanelVisible 
                  ? 'border-cyan-500/30 text-cyan-300 bg-cyan-950/40' 
                  : 'border-slate-800 text-slate-400 hover:text-slate-200 bg-slate-900'
              }`}
              title={isAr 
                ? (isRightPanelVisible ? 'إخفاء شجرة الويدجتس والخصائص' : 'إظهار شجرة الويدجتس والخصائص') 
                : (isRightPanelVisible ? 'Hide Inspector & Tree' : 'Show Inspector & Tree')}
            >
              {isRightPanelVisible ? (
                <PanelRightClose className="w-3.5 h-3.5" />
              ) : (
                <PanelRightOpen className="w-3.5 h-3.5" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Simulator Viewport Area */}
      <div className="flex-1 overflow-auto p-4 flex items-center justify-center flutter-canvas-grid relative bg-[#070a11]">
        {/* Render Overflow Hazard Warning if Row/Column exceeds bound */}
        {warnings.some(w => w.category === 'layout_overflow') && (
          <div className="absolute top-2 left-2 right-2 z-50 bg-amber-500/90 text-slate-950 font-bold text-xs p-2 rounded shadow-lg flex items-center gap-2 border-2 border-amber-600 animate-bounce">
            <AlertTriangle className="w-4 h-4 shrink-0 text-slate-950" />
            <span>A RenderFlex overflowed! Wrap Row children in Expanded or Flexible.</span>
          </div>
        )}

        {/* Phone Frame or Responsive Window */}
        <div 
          style={{ width: dims.width, height: dims.height }}
          className={`transition-all duration-300 relative flex flex-col ${
            deviceFrame !== 'responsive'
              ? 'rounded-[38px] p-3 bg-slate-900 border-4 border-slate-700 shadow-2xl ring-1 ring-slate-600/50'
              : 'w-full h-full'
          }`}
        >
          {/* Phone Dynamic Island / Camera Notch */}
          {deviceFrame !== 'responsive' && !isLandscape && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-4 bg-black rounded-full z-50 flex items-center justify-end px-2">
              <div className="w-2 h-2 rounded-full bg-slate-800 ring-1 ring-slate-700" />
            </div>
          )}

          {/* Screen Content */}
          <div className={`w-full h-full rounded-[28px] overflow-hidden flex flex-col relative ${flutterTheme === 'dark' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'}`}>
            {/* Status Bar */}
            <div className="h-6 w-full flex items-center justify-between px-5 text-[10px] font-medium text-slate-500 shrink-0 select-none">
              <span>9:41</span>
              <div className="flex items-center gap-1.5">
                <span>5G</span>
                <span>100%</span>
              </div>
            </div>

            {/* Flutter Render Canvas */}
            <div className="flex-1 w-full overflow-hidden flex flex-col relative">
              {rootWidget ? (
                renderWidget(rootWidget)
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-500">
                  <RefreshCw className={`w-8 h-8 mb-2 ${isRunning ? 'animate-spin text-cyan-400' : 'text-slate-600'}`} />
                  <p className="text-xs">{isAr ? 'الكود فارغ أو قيد المعالجة' : 'Waiting for runnable Flutter code...'}</p>
                </div>
              )}
            </div>

            {/* Bottom Home Indicator */}
            {deviceFrame !== 'responsive' && (
              <div className="h-4 w-full flex items-center justify-center shrink-0">
                <div className="w-28 h-1 bg-slate-400/40 rounded-full" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
