import React from "react";
import { MODULES, EMPRESA } from "../data/moduleData";
import {
  TEORIA_M1_HTML, TEORIA_M2_HTML, ESTRUTURA_M3_HTML,
  TEORIA_M4_HTML, CASO_M4_HTML, CONTAS_M4, EVENTOS_M4,
  TEORIA_M5_HTML,
  TEORIA_M6_HTML, CONTAS_M6, EVENTOS_M6,
  TEORIA_M7_HTML, CASO_M7_HTML,
  TEORIA_M8_HTML, CONTAS_M8, EVENTOS_M8,
  TEORIA_M9_HTML,
  TEORIA_M10_HTML, CONTAS_M10, EVENTOS_M10,
} from "../data/moduleData";
import { TeoriaCard, SimuladorLancamentos, EstudoDeCaso, EstudoDeCasoAvaliado } from "./ModuloUI";
import {
  ConsultaPlanoContas, CalculadoraDepreciacao, CalculadoraProvisao,
  MontagemDRE, MontagemDLPA, PainelConsolidadoM11,
} from "./Modulos";
import { ExercicioMultiplaEscolha, ExercicioPareamento } from "./Exercicios";
import { EXERCICIOS_M1 } from "../data/exerciciosM1";
import { EXERCICIOS_M2 } from "../data/exerciciosM2";
import { EXERCICIOS_M3 } from "../data/exerciciosM3";

const NOTA_EMPRESA = `Todos os eventos abaixo pertencem à mesma empresa fictícia — <strong>${EMPRESA.nome}</strong> — e usam o mesmo plano de contas. Monte cada lançamento e clique em <strong>Lançar</strong> quando débito e crédito estiverem balanceados.`;

// Cada módulo é uma lista de painéis (um por aba), na mesma ordem de
// MODULES[i].tabs. empresaId é passado para os que precisam de dados
// isolados por aluno.
function paineisDoModulo(moduleId, empresaId) {
  switch (moduleId) {
    case "m1":
      return [<TeoriaCard html={TEORIA_M1_HTML} />, <ExercicioMultiplaEscolha empresaId={empresaId} moduleId="m1" blocos={EXERCICIOS_M1} />];
    case "m2":
      return [<TeoriaCard html={TEORIA_M2_HTML} />, <ExercicioMultiplaEscolha empresaId={empresaId} moduleId="m2" blocos={EXERCICIOS_M2} />];
    case "m3":
      return [<TeoriaCard html={ESTRUTURA_M3_HTML} />, <ConsultaPlanoContas />, <ExercicioPareamento empresaId={empresaId} moduleId="m3" blocos={EXERCICIOS_M3} />];
    case "m4":
      return [
        <TeoriaCard html={TEORIA_M4_HTML} />,
        <SimuladorLancamentos empresaId={empresaId} moduleId="m4" contas={CONTAS_M4} eventos={EVENTOS_M4} notaEmpresa={NOTA_EMPRESA} />,
        <EstudoDeCaso empresaId={empresaId} moduleId="m4" html={CASO_M4_HTML} />,
      ];
    case "m5":
      return [<TeoriaCard html={TEORIA_M5_HTML} />, <MontagemDRE empresaId={empresaId} />];
    case "m6":
      return [
        <TeoriaCard html={TEORIA_M6_HTML} />,
        <CalculadoraDepreciacao empresaId={empresaId} />,
        <SimuladorLancamentos empresaId={empresaId} moduleId="m6" contas={CONTAS_M6} eventos={EVENTOS_M6} notaEmpresa={`Os eventos abaixo continuam na empresa fictícia — <strong>${EMPRESA.nome}</strong>. Para o evento 3, calcule a cota de depreciação na aba anterior antes de lançar.`} />,
      ];
    case "m7":
      return [<TeoriaCard html={TEORIA_M7_HTML} />, <EstudoDeCasoAvaliado empresaId={empresaId} moduleId="m7" html={CASO_M7_HTML} />];
    case "m8":
      return [
        <TeoriaCard html={TEORIA_M8_HTML} />,
        <CalculadoraProvisao empresaId={empresaId} />,
        <SimuladorLancamentos empresaId={empresaId} moduleId="m8" contas={CONTAS_M8} eventos={EVENTOS_M8} notaEmpresa={`Lançamentos da PECLD para a mesma empresa fictícia — <strong>${EMPRESA.nome}</strong>.`} />,
      ];
    case "m9":
      return [<TeoriaCard html={TEORIA_M9_HTML} />, <MontagemDLPA empresaId={empresaId} />];
    case "m10":
      return [
        <TeoriaCard html={TEORIA_M10_HTML} />,
        <SimuladorLancamentos empresaId={empresaId} moduleId="m10" contas={CONTAS_M10} eventos={EVENTOS_M10} notaEmpresa={`Lançamentos de operações financeiras da <strong>${EMPRESA.nome}</strong>.`} />,
      ];
    case "m11":
      return [<PainelConsolidadoM11 empresaId={empresaId} />];
    default:
      return [<p>Módulo não encontrado.</p>];
  }
}

export function ModuleContent({ moduleId, empresaId }) {
  const [aba, setAba] = React.useState(0);
  const modulo = MODULES.find((m) => m.id === moduleId);
  if (!modulo) return null;
  const paineis = paineisDoModulo(moduleId, empresaId);

  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-inksoft mb-1">Módulo {modulo.code}</div>
      <h1 className="font-serif text-3xl mb-1">
        <span className="font-mono text-base text-ledger border border-ledger rounded-sm px-2 py-0.5 mr-3 align-middle">{modulo.code}</span>
        {modulo.title}
      </h1>
      <p className="text-inksoft max-w-2xl mb-6">{modulo.desc}</p>

      {modulo.tabs.length > 1 && (
        <div className="flex gap-1 border-b border-paperline mb-6">
          {modulo.tabs.map((t, i) => (
            <button key={t} onClick={() => setAba(i)}
              className={`px-4 py-2 text-sm -mb-px border-b-2 ${aba === i ? "border-ledger text-ledger font-semibold" : "border-transparent text-inksoft"}`}>
              {t}
            </button>
          ))}
        </div>
      )}

      {paineis[aba]}
    </div>
  );
}

export { MODULES };
