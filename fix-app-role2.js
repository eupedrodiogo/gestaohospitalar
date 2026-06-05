import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Also, the default tab for Inovação profile should be "inovacao" instead of "home".
// This happens in handleActivateOfflineMode or when changing profile
code = code.replace(
  /setActiveTab\("home"\);(?=\s*\/\/ Mock auth)/g,
  'setActiveTab(role === "ti" ? "backup" : role === "inovacao" ? "inovacao" : "home");'
);

code = code.replace(
  /setActiveTab\("home"\);(?=\s*setProfile\(\(prev\))/g,
  'setActiveTab(newRole === "ti" ? "backup" : newRole === "inovacao" ? "inovacao" : "home");'
);


// Sidebar - Desktop
// I'll add an Inovação button right below where TI is:
const inovacaoButtonCode = `

          {profile.role === "inovacao" && (
            <button
              onClick={() => setActiveTab("inovacao")}
              className={\`w-full flex items-center \${isSidebarExpanded ? "justify-start px-3" : "justify-center px-0"} gap-3 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer \${
                activeTab === "inovacao"
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/40 border border-transparent"
              }\`}
              title={!isSidebarExpanded ? "Hub de Inovação" : undefined}
            >
              <Lightbulb className="w-[20px] h-[20px] shrink-0" />
              {isSidebarExpanded && (
                <span className="whitespace-nowrap">Hub de Inovação</span>
              )}
            </button>
          )}`;

code = code.replace(
  /\{profile\.role === "ti" && \([\s\S]*?\{profile\.role === "ti" && \(\s*<>\s*<button[\s\S]*?<\/button>\s*<\/div>\s*<\/>\s*\)}/m,
  (match) => match + inovacaoButtonCode
);

// Sidebar - Mobile Bottom Navigation
const inovacaoMobileCode = `
          {profile.role === "inovacao" && (
            <button
              onClick={() => setActiveTab("inovacao")}
              className="flex flex-col items-center justify-center w-full h-full space-y-1 relative"
            >
              <div
                className={\`py-1 px-5 rounded-full transition-all duration-300 flex items-center justify-center \${activeTab === "inovacao" ? "bg-amber-500/15 text-amber-400 scale-110" : "text-slate-400 hover:text-slate-300 hover:bg-slate-800/30"}\`}
              >
                <Lightbulb className="w-[22px] h-[22px]" />
              </div>
              <span
                className={\`text-[11px] font-medium tracking-wide transition-colors \${activeTab === "inovacao" ? "text-amber-400" : "text-slate-500"}\`}
              >
                Inovação
              </span>
            </button>
          )}`;

code = code.replace(
  /\{profile\.role === "ti" && \(\s*<>\s*<button[\s\S]*?<\/button>\s*<\/>\s*\)}/m,
  (match) => match + inovacaoMobileCode
);

// In "Mais" menu, we only show it if profile.role !== "inovacao" ??? Wait no, Inovacao can just always show it, or we hide it if role === inovacao
code = code.replace(
  /onClick=\{\(\) => \{\s*setActiveTab\("inovacao"\);\s*setShowMoreTabs\(false\);\s*\}\}[\s\S]*?Inovação\s*<\/span>\s*<\/button>/m,
  (match) => `{profile.role !== "inovacao" && (\n${match}\n)}`
);

// Also remove from "isSidebarExpanded" Mais menu list
code = code.replace(
  /onClick=\{\(\) => setActiveTab\("inovacao"\)\}[\s\S]*?Hub de Inovação\s*<\/span>\s*<\/button>/m,
  (match) => `{profile.role !== "inovacao" && (\n${match}\n)}`
);


fs.writeFileSync('src/App.tsx', code);
