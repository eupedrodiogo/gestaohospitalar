import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /setProfile\(myProfile\);\n\s*setCurrentLang\(myProfile\.language \|\| "pt"\);/g,
  'setProfile(myProfile);\n          setCurrentLang(myProfile.language || "pt");\n          setActiveTab(myProfile.role === "ti" ? "backup" : myProfile.role === "inovacao" ? "inovacao" : "home");'
);

code = code.replace(
  /setCurrentLang\(profData\.language \|\| "pt"\);/g,
  'setCurrentLang(profData.language || "pt");\n            setActiveTab(profData.role === "ti" ? "backup" : profData.role === "inovacao" ? "inovacao" : "home");'
);

code = code.replace(
  /setProfile\(prof\);\n\s*setCurrentLang\(prof\.language\);/g,
  'setProfile(prof);\n    setCurrentLang(prof.language);\n    setActiveTab(prof.role === "ti" ? "backup" : prof.role === "inovacao" ? "inovacao" : "home");'
);

fs.writeFileSync('src/App.tsx', code);
