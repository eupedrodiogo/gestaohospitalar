import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/}\)\s*\}\s*\)\}/, '})}\n');

fs.writeFileSync('src/App.tsx', code);
