import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 6. Sideabar desktop (add atendimento button)
const sadtDesktop = \`{profile.role === "sadt" && (
            <button
              onClick={() => setActiveTab("sadt")}
              className={\\\`w-full flex items-center \\\${isSidebarExpanded ? "justify-start px-3" : "justify-center px-0"} gap-3 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer \\\${
                activeTab === "sadt"
                  ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/30"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/40 border border-transparent"
              }\\\`}
              title={!isSidebarExpanded ? "SADT" : undefined}
            >
              <Activity className="w-[20px] h-[20px] shrink-0" />
              {isSidebarExpanded && (
                <span className="whitespace-nowrap">SADT</span>
              )}
            </button>
          )}\`;

const atendimentoDesktop = \`{profile.role === "atendimento" && (
            <button
              onClick={() => setActiveTab("atendimento")}
              className={\\\`w-full flex items-center \\\${isSidebarExpanded ? "justify-start px-3" : "justify-center px-0"} gap-3 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer \\\${
                activeTab === "atendimento"
                  ? "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/40 border border-transparent"
              }\\\`}
              title={!isSidebarExpanded ? "Atendimento" : undefined}
            >
              <HeartHandshake className="w-[20px] h-[20px] shrink-0" />
              {isSidebarExpanded && (
                <span className="whitespace-nowrap">Atendimento</span>
              )}
            </button>
          )}\`;

code = code.replace(sadtDesktop, sadtDesktop + '\\n          ' + atendimentoDesktop);

// 7. Sidebar mobile
const sadtMobile = \`{profile.role === "sadt" && (
            <button
              onClick={() => setActiveTab("sadt")}
              className="flex flex-col items-center justify-center w-full h-full space-y-1 relative"
            >
              <div
                className={\\\`py-1 px-5 rounded-full transition-all duration-300 flex items-center justify-center \\\${activeTab === "sadt" ? "bg-indigo-500/15 text-indigo-400 scale-110" : "text-slate-400 hover:text-slate-300 hover:bg-slate-800/30"}\\\`}
              >
                <Activity className="w-[22px] h-[22px]" />
              </div>
              <span
                className={\\\`text-[11px] font-medium tracking-wide transition-colors \\\${activeTab === "sadt" ? "text-indigo-400" : "text-slate-500"}\\\`}
              >
                SADT
              </span>
            </button>
          )}\`;

const atendimentoMobile = \`{profile.role === "atendimento" && (
            <button
              onClick={() => setActiveTab("atendimento")}
              className="flex flex-col items-center justify-center w-full h-full space-y-1 relative"
            >
              <div
                className={\\\`py-1 px-5 rounded-full transition-all duration-300 flex items-center justify-center \\\${activeTab === "atendimento" ? "bg-rose-500/15 text-rose-400 scale-110" : "text-slate-400 hover:text-slate-300 hover:bg-slate-800/30"}\\\`}
              >
                <HeartHandshake className="w-[22px] h-[22px]" />
              </div>
              <span
                className={\\\`text-[11px] font-medium tracking-wide transition-colors \\\${activeTab === "atendimento" ? "text-rose-400" : "text-slate-500"}\\\`}
              >
                Atend
              </span>
            </button>
          )}\`;

code = code.replace(sadtMobile, sadtMobile + '\\n          ' + atendimentoMobile);

// 8. Grid modal mobile ("Mais opções")
const sadtMoreOptions = \`{profile.role !== "sadt" && (
                <button
                  onClick={() => {
                    setActiveTab("sadt");
                    setShowMoreTabs(false);
                  }}
                  className={\\\`flex flex-col items-center justify-center gap-2.5 p-4 rounded-2xl border transition-all duration-300 \\\${
                    activeTab === "sadt"
                      ? "bg-indigo-500/15 border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.1)]"
                      : "bg-slate-800/40 border-slate-700 hover:border-slate-500 hover:bg-slate-800"
                  }\\\`}
                >
                  <Activity
                    className={\\\`w-6 h-6 \\\${activeTab === "sadt" ? "text-indigo-400" : "text-indigo-400/80"}\\\`}
                  />
                  <span
                    className={\\\`text-[10px] font-bold uppercase tracking-wider text-center \\\${activeTab === "sadt" ? "text-indigo-400" : "text-slate-300"}\\\`}
                  >
                    SADT
                  </span>
                </button>
              )}\`;

const atendimentoMoreOptions = \`{profile.role !== "atendimento" && (
                <button
                  onClick={() => {
                    setActiveTab("atendimento");
                    setShowMoreTabs(false);
                  }}
                  className={\\\`flex flex-col items-center justify-center gap-2.5 p-4 rounded-2xl border transition-all duration-300 \\\${
                    activeTab === "atendimento"
                      ? "bg-rose-500/15 border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.1)]"
                      : "bg-slate-800/40 border-slate-700 hover:border-slate-500 hover:bg-slate-800"
                  }\\\`}
                >
                  <HeartHandshake
                    className={\\\`w-6 h-6 \\\${activeTab === "atendimento" ? "text-rose-400" : "text-rose-400/80"}\\\`}
                  />
                  <span
                    className={\\\`text-[10px] font-bold uppercase tracking-wider text-center \\\${activeTab === "atendimento" ? "text-rose-400" : "text-slate-300"}\\\`}
                  >
                    Atendimento
                  </span>
                </button>
              )}\`;

code = code.replace(sadtMoreOptions, sadtMoreOptions + '\\n              ' + atendimentoMoreOptions);

// 10. Render AtendimentoPanel where appropriate
const sadtRender = \`{activeTab === "sadt" && (
            <SadtPanel userRole={profile.role} userName={profile.name} />
          )}\`;

const atendimentoRender = \`{activeTab === "atendimento" && (
            <AtendimentoPanel userRole={profile.role} userName={profile.name} />
          )}\`;

code = code.replace(sadtRender, sadtRender + "\\n\\n          " + atendimentoRender);


code = code.replace(/\\["assessment", "metrics", "recrutamento", "vagas", "climate", "training", "feedback", "inovacao", "sadt"\\]/g, '["assessment", "metrics", "recrutamento", "vagas", "climate", "training", "feedback", "inovacao", "sadt", "atendimento"]');

fs.writeFileSync('src/App.tsx', code);
