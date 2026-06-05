import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Fix syntax error in button replacement
code = code.replace(
  /<button\n\s*\{profile\.role !== "inovacao" && \(\nonClick/m,
  '{profile.role !== "inovacao" && (\n<button\n onClick'
);

code = code.replace(
  /setActiveTab\(role === "ti" \? "backup" : role === "inovacao" \? "inovacao" : "home"\);/g,
  'setActiveTab(role === "ti" ? "backup" : role === "inovacao" ? "inovacao" : "home");'
);

code = code.replace(
  /setActiveTab\(newRole === "ti" \? "backup" : newRole === "inovacao" \? "inovacao" : "home"\);/g,
  'setActiveTab(newRole === "ti" ? "backup" : newRole === "inovacao" ? "inovacao" : "home");'
);

// wait the original script DID apply the change for `setActiveTab(...)`.
// But I want to make sure it handles the toggle properly. 

fs.writeFileSync('src/App.tsx', code);
