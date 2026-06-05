import React from "react";
import DiretoriaPanel from "./DiretoriaPanel";

interface DiretoriaGeralPanelProps {
  userRole: string;
  userName: string;
}

export default function DiretoriaGeralPanel({ userRole, userName }: DiretoriaGeralPanelProps) {
  return (
    <DiretoriaPanel userRole={userRole} userName={userName} />
  );
}
