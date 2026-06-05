import React from "react";
import DiretoriaPanel from "./DiretoriaPanel";

interface DiretoriaAdministrativaPanelProps {
  userRole: string;
  userName: string;
}

export default function DiretoriaAdministrativaPanel({ userRole, userName }: DiretoriaAdministrativaPanelProps) {
  return (
    <DiretoriaPanel userRole={userRole} userName={userName} />
  );
}
