"use client";

import { useEffect, useMemo, useState } from "react";
import { BootScreen } from "@/components/os/BootScreen";
import { Desktop } from "@/components/os/Desktop";
import { MobileShell } from "@/components/os/MobileShell";
import { RafaDroidBootScreen } from "@/components/os/RafaDroidBootScreen";
import { profile } from "@/content/profile";

export type AppId =
  | "home"
  | "projects"
  | "skills"
  | "timeline"
  | "contact"
  | "recruiter"
  | "missions";

const bootModules = [
  {
    label: "Carregando Personalidade",
    total: 100,
    entries: [
      "CARISMA.SYS",
      "HUMOR_LEVE.DLL",
      "CRITERIO.EXE",
      "CRIATIVIDADE.VXD",
      "ATENÇÃO_A_DETALHES.INI",
    ],
  },
  {
    label: "Montando Experiências",
    total: 80,
    entries: [
      "DOAL_SOLUÇÕES.OLD.WORK",
      "FRONT_END.LOG",
      "UX_UI.DESIGN",
      "JOGOS_CONFIDENCIAIS.BUILD",
      "WEB_DESIGNER.CERT",
    ],
  },
  {
    label: "Indexando Projetos",
    total: 120,
    entries: [
      "ARCADIUM_GCDP.CASE",
      "LUNA_AI.COMPANION",
      "BORDO_HUB.GUILD",
      "RDNS.NETWORK",
      "ROM_TRANSLATION.STUDIO",
    ],
  },
  {
    label: "Instalando Stack",
    total: 96,
    entries: [
      "REACT.UI",
      "NEXT_JS.ROUTER",
      "TYPESCRIPT.STRICT",
      "FIREBASE.DATA",
      "TAILWIND.INTERFACE",
    ],
  },
  {
    label: "Ativando Qualidade",
    total: 72,
    entries: [
      "ATOMIC_DESIGN.PROTOCOL",
      "WCAG_A11Y.SHIELD",
      "PERFORMANCE.CACHE",
      "CÓDIGO_LIMPO.CFG",
      "RESPONSIVIDADE.SCREEN",
    ],
  },
  {
    label: "Executando Antivírus",
    total: 64,
    entries: [
      "NYAN_CAT_CODE.EXE QUARENTENADO",
      "LANDING_GENÉRICA.DLL REMOVIDA",
      "COMPONENTE_1000_LINHAS.SYS BLOQUEADO",
      "CANSAÇO NÃO PASSOU NO SCAN",
    ],
  },
];

type RafaelOSProps = {
  initialApp?: AppId;
};

export function RafaelOS({ initialApp = "home" }: RafaelOSProps) {
  const [booted, setBooted] = useState(false);
  const [isRafaDroid, setIsRafaDroid] = useState<boolean | null>(null);
  const [activeApp, setActiveApp] = useState<AppId>(initialApp);
  const [virusAlerts, setVirusAlerts] = useState<string[]>([]);

  const bootConfig = useMemo(
    () => ({
      title: "RafaelOS 2000\nProfessional Edition",
      subtitle: `Por favor, aguarde enquanto o sistema inicializa ${profile.name} sem pegar fogo.`,
      modules: bootModules,
    }),
    [],
  );

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 520px)");
    const updateMode = () => setIsRafaDroid(mobileQuery.matches);

    updateMode();
    mobileQuery.addEventListener("change", updateMode);

    return () => mobileQuery.removeEventListener("change", updateMode);
  }, []);

  useEffect(() => {
    if (virusAlerts.length === 0) return;

    const timer = window.setTimeout(() => {
      setVirusAlerts((items) => items.slice(1));
    }, 4600);

    return () => window.clearTimeout(timer);
  }, [virusAlerts]);

  const triggerVirus = () => {
    setVirusAlerts((items) => [
      ...items,
      "VIRUS DETECTED: messy-layout.dll moved to /quarantine",
    ]);
  };

  if (isRafaDroid === null) {
    return (
      <main
        className="rafadroid-boot-screen"
        aria-label="Carregando modo visual"
      />
    );
  }

  if (!booted) {
    if (isRafaDroid) {
      return <RafaDroidBootScreen onComplete={() => setBooted(true)} />;
    }

    return (
      <BootScreen config={bootConfig} onComplete={() => setBooted(true)} />
    );
  }

  if (isRafaDroid) {
    return <MobileShell activeApp={activeApp} onActivateApp={setActiveApp} />;
  }

  return (
    <Desktop
      activeApp={activeApp}
      glitchLevel={1}
      onActivateApp={setActiveApp}
      onTriggerVirus={triggerVirus}
      virusAlerts={virusAlerts}
    />
  );
}
