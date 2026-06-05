const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/disabled:bg-slate-50/g, "");

fs.writeFileSync('src/App.tsx', code);
console.log("Removed disabled:bg-slate-50");
