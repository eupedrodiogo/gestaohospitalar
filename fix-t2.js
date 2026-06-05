import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/<\/>\n     \n          \{profile\.role === "inovacao" && \(/g, '</>\n          )}\n          {profile.role === "inovacao" && (');

code = code.replace(/<\/>\n          \)\}\n          \{profile\.role === "inovacao" && \(/g, '</>\n          )}\n          {profile.role === "inovacao" && (');

fs.writeFileSync('src/App.tsx', code);
