import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf8');

const desktopCode = `
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

const idxDesktop = code.indexOf(
  '              </button>\n            </>\n          )}'
);
if (idxDesktop !== -1) {
  code = code.slice(0, idxDesktop + 45) + desktopCode + code.slice(idxDesktop + 45);
}

const mobileCode = `
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

const idxMobile = code.indexOf(
  '              </button>\n            </>\n          )}\n\n          {profile.role !== "ti" && profile.role !== "inovacao" && ('
);
if (idxMobile !== -1) {
  code = code.slice(0, idxMobile + 45) + mobileCode + code.slice(idxMobile + 45);
}

fs.writeFileSync('src/App.tsx', code);
