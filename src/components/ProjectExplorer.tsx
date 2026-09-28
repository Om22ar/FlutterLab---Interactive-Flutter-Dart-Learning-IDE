import React from 'react';
import { 
  FolderTree, 
  FileCode, 
  FileText, 
  Package, 
  Check, 
  Sparkles,
  ExternalLink,
  Plus
} from 'lucide-react';
import { ProjectTemplate, ProjectFile } from '../types/flutter';

interface ProjectExplorerProps {
  templates: ProjectTemplate[];
  activeTemplate: ProjectTemplate;
  onSelectTemplate: (template: ProjectTemplate) => void;
  activeFile: ProjectFile;
  onSelectFile: (file: ProjectFile) => void;
  language: 'ar' | 'en';
}

export const ProjectExplorer: React.FC<ProjectExplorerProps> = ({
  templates,
  activeTemplate,
  onSelectTemplate,
  activeFile,
  onSelectFile,
  language,
}) => {
  const isAr = language === 'ar';

  return (
    <div className="h-full flex flex-col bg-slate-950 border-r border-slate-800/80 w-72 select-none shrink-0">
      {/* Templates Selector */}
      <div className="p-3 border-b border-slate-800/80 space-y-2">
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
          {isAr ? 'المشاريع التطبيقية الكاملة' : 'Mini Projects'}
        </label>
        <select
          value={activeTemplate.id}
          onChange={(e) => {
            const found = templates.find(t => t.id === e.target.value);
            if (found) onSelectTemplate(found);
          }}
          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-medium"
        >
          {templates.map(t => (
            <option key={t.id} value={t.id}>
              {isAr ? t.titleAr : t.title}
            </option>
          ))}
        </select>
      </div>

      {/* File Tree Explorer */}
      <div className="flex-1 overflow-auto p-3 space-y-3">
        <div className="space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5 px-1">
            <FolderTree className="w-3.5 h-3.5 text-cyan-400" />
            <span>Files ({activeTemplate.files.length})</span>
          </div>

          <div className="space-y-1 pt-1">
            {activeTemplate.files.map(f => {
              const isSelected = activeFile.path === f.path;
              return (
                <button
                  key={f.path}
                  onClick={() => onSelectFile(f)}
                  className={`w-full px-2.5 py-1.5 rounded-lg text-left flex items-center justify-between text-xs font-mono transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {f.name.endsWith('.dart') ? (
                      <FileCode className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    ) : (
                      <FileText className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    )}
                    <span className="truncate">{f.path}</span>
                  </div>
                  {f.readOnly && (
                    <span className="text-[9px] uppercase tracking-wider text-slate-600 border border-slate-800 px-1 rounded">
                      Lock
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Approved Packages Registry (Section 29) */}
        <div className="pt-3 border-t border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold px-1">
            <span className="flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isAr ? 'الحزم المعتمدة' : 'Approved Packages'}</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">Sandbox OK</span>
          </div>

          <div className="space-y-1">
            {activeTemplate.approvedPackages.map(pkg => (
              <div 
                key={pkg} 
                className="flex items-center justify-between px-2.5 py-1 bg-slate-900/60 rounded border border-slate-800 text-[11px] font-mono text-slate-300"
              >
                <span>{pkg}</span>
                <Check className="w-3 h-3 text-emerald-400" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Project Description Info */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-900/60 text-xs text-slate-400 space-y-1">
        <span className="font-semibold text-slate-300 block">
          {isAr ? 'حول المشروع:' : 'About Project:'}
        </span>
        <p className="text-[11px] leading-relaxed">
          {isAr ? activeTemplate.descriptionAr : activeTemplate.description}
        </p>
      </div>
    </div>
  );
};
