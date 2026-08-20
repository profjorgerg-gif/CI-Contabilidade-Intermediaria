import React, { useEffect, useState } from "react";
import { calcularDRE, calcularDLPA, calcularProvisaoPECLD } from "../lib/calculosFinanceiros";
import { fmt } from "../lib/simuladorEngine";
import { CREDITOS_M7, M8_PERCENTUAIS_PADRAO, M9_DADOS_PADRAO } from "../data/moduleData";
import { Card } from "./ModuloUI";

async function contarLancamentos(empresaId, moduleId) {
  const r = await window.storage.get(`${moduleId}_lancamentos_${empresaId}`, true).catch(() => null);
  return r ? JSON.parse(r.value).length : 0;
}

async function notaMediaExercicio(empresaId, moduleId, chaveSufixo) {
  const r = await window.storage.get(`${moduleId}_${chaveSufixo}_${empresaId}`, true).catch(() => null);
  if (!r) return { feitos: 0, media: null };
  const dados = JSON.parse(r.value);
  const notas = Object.values(dados.notas || {});
  if (notas.length === 0) return { feitos: 0, media: null };
  const media = notas.reduce((s, n) => s + n, 0) / notas.length;
  return { feitos: notas.length, media };
}

async function statusCaso(empresaId, moduleId, chave) {
  const r = await window.storage.get(`${moduleId}_${chave}_${empresaId}`, true).catch(() => null);
  if (!r) return null;
  return JSON.parse(r.value);
}

async function carregarDados(empresaId) {
  const [m4, m6, m8, m10] = await Promise.all([
    contarLancamentos(empresaId, "m4"), contarLancamentos(empresaId, "m6"),
    contarLancamentos(empresaId, "m8"), contarLancamentos(empresaId, "m10"),
  ]);

  const dre = await calcularDRE(empresaId);
  const percentuaisR = await window.storage.get(`m8_percentuais_${empresaId}`, true).catch(() => null);
  const percentuais = percentuaisR ? JSON.parse(percentuaisR.value) : M8_PERCENTUAIS_PADRAO;
  const provisao = calcularProvisaoPECLD(CREDITOS_M7, percentuais);
  const dlpaParamsR = await window.storage.get(`m9_dlpa_${empresaId}`, true).catch(() => null);
  const dlpaParams = dlpaParamsR ? JSON.parse(dlpaParamsR.value) : M9_DADOS_PADRAO;
  const dlpa = await calcularDLPA(empresaId, dlpaParams);

  const [ex1, ex2, ex3] = await Promise.all([
    notaMediaExercicio(empresaId, "m1", "exercicios"),
    notaMediaExercicio(empresaId, "m2", "exercicios"),
    notaMediaExercicio(empresaId, "m3", "pareamento"),
  ]);

  const [caso4, caso7, caso11] = await Promise.all([
    window.storage.get(`m4_resposta_caso_${empresaId}`, true).catch(() => null),
    statusCaso(empresaId, "m7", "caso_avaliado"),
    statusCaso(empresaId, "m11", "caso_avaliado"),
  ]);

  return {
    lancamentos: { m4, m6, m8, m10 },
    dre, provisao, dlpa,
    exercicios: { m1: ex1, m2: ex2, m3: ex3 },
    casos: {
      m4: caso4 ? !!(JSON.parse(caso4.value) || "").trim?.() : false,
      m7: caso7, m11: caso11,
    },
  };
}

function BarraModulo({ label, valor, max }) {
  const pct = max > 0 ? Math.min(100, (valor / max) * 100) : 0;
  return (
    <div className="mb-2">
      <div className="flex justify-between text-xs text-inksoft mb-0.5"><span>{label}</span><span>{valor} lançamento(s)</span></div>
      <div className="h-2 bg-paperline rounded-full overflow-hidden"><div className="h-full bg-ledger" style={{ width: `${pct}%` }} /></div>
    </div>
  );
}

function BadgeStatusCaso({ label, dados }) {
  let texto = "Não iniciado", cor = "text-inksoft border-paperline";
  if (dados === true) { texto = "Respondido"; cor = "text-ledger border-ledger"; }
  else if (dados?.status === "enviado") { texto = "Enviado — aguardando correção"; cor = "text-debit border-debit"; }
  else if (dados?.status === "corrigido") { texto = `Corrigido — ${dados.nota}/10`; cor = "text-ledger border-ledger"; }
  else if (dados?.status === "rascunho") { texto = "Rascunho salvo"; cor = "text-debit border-debit"; }
  return (
    <div className="flex justify-between items-center py-1.5 border-t border-paperline text-sm">
      <span>{label}</span>
      <span className={`text-xs px-2 py-0.5 rounded-full border ${cor}`}>{texto}</span>
    </div>
  );
}

function BarraNota({ label, dados }) {
  const pct = dados.media !== null ? (dados.media / 10) * 100 : 0;
  return (
    <div className="mb-2">
      <div className="flex justify-between text-xs text-inksoft mb-0.5">
        <span>{label}</span>
        <span>{dados.feitos > 0 ? `${dados.feitos}/5 blocos · média ${dados.media.toFixed(1)}/10` : "Não iniciado"}</span>
      </div>
      <div className="h-2 bg-paperline rounded-full overflow-hidden"><div className="h-full bg-debit" style={{ width: `${pct}%` }} /></div>
    </div>
  );
}

export function DashboardEmpresa({ empresaId, nomeEmpresa }) {
  const [dados, setDados] = useState(null);

  useEffect(() => {
    setDados(null);
    if (empresaId) carregarDados(empresaId).then(setDados);
  }, [empresaId]);

  if (!empresaId) return <Card><p className="text-sm text-inksoft">Selecione uma empresa para ver o painel.</p></Card>;
  if (!dados) return <p className="text-sm text-inksoft">Carregando painel…</p>;

  const resultado = dados.dre.resultadoParcial;
  const maxLanc = Math.max(dados.lancamentos.m4, dados.lancamentos.m6, dados.lancamentos.m8, dados.lancamentos.m10, 1);

  return (
    <div>
      <Card>
        <div className="flex justify-between items-start flex-wrap gap-2">
          <div>
            <div className="text-xs uppercase tracking-wide text-inksoft">Painel geral</div>
            <strong className="text-lg">{nomeEmpresa}</strong>
          </div>
          <span className={`text-sm px-3 py-1 rounded-full border ${resultado >= 0 ? "text-ledger border-ledger" : "text-alert border-alert"}`}>
            {resultado >= 0 ? "Resultado: Lucro" : "Resultado: Prejuízo"} — R$ {fmt(Math.abs(resultado))}
          </span>
        </div>
      </Card>

      <Card>
        <strong className="block mb-3">Resultado financeiro</strong>
        <div className="grid grid-cols-2 gap-3">
          <div className="border border-paperline rounded-sm p-3"><div className="text-xs text-inksoft">Receita Bruta</div><div className="font-serif text-lg">R$ {fmt(dados.dre.receitaBruta)}</div></div>
          <div className="border border-paperline rounded-sm p-3"><div className="text-xs text-inksoft">Lucro Bruto</div><div className="font-serif text-lg">R$ {fmt(dados.dre.lucroBruto)}</div></div>
          <div className="border border-paperline rounded-sm p-3"><div className="text-xs text-inksoft">Provisão PECLD</div><div className="font-serif text-lg">R$ {fmt(dados.provisao.total)}</div></div>
          <div className="border border-paperline rounded-sm p-3"><div className="text-xs text-inksoft">Lucros Acumulados (DLPA)</div><div className="font-serif text-lg">R$ {fmt(dados.dlpa.saldoFinal)}</div></div>
        </div>
      </Card>

      <Card>
        <strong className="block mb-3">Lançamentos por módulo</strong>
        <BarraModulo label="4.0 — Operações com Mercadorias" valor={dados.lancamentos.m4} max={maxLanc} />
        <BarraModulo label="6.0 — Ativo Imobilizado" valor={dados.lancamentos.m6} max={maxLanc} />
        <BarraModulo label="8.0 — PECLD" valor={dados.lancamentos.m8} max={maxLanc} />
        <BarraModulo label="10.0 — Operações Financeiras" valor={dados.lancamentos.m10} max={maxLanc} />
      </Card>

      <Card>
        <strong className="block mb-3">Exercícios (nota média por bloco corrigido)</strong>
        <BarraNota label="1.0 — Princípios Contábeis" dados={dados.exercicios.m1} />
        <BarraNota label="2.0 — Regimes de Caixa e Competência" dados={dados.exercicios.m2} />
        <BarraNota label="3.0 — Pareamento do Plano de Contas" dados={dados.exercicios.m3} />
      </Card>

      <Card>
        <strong className="block mb-1">Estudos de caso</strong>
        <BadgeStatusCaso label="4.0 — Fechamento do mês" dados={dados.casos.m4} />
        <BadgeStatusCaso label="7.0 — Créditos vencidos" dados={dados.casos.m7} />
        <BadgeStatusCaso label="11.0 — Caso integrado" dados={dados.casos.m11} />
      </Card>
    </div>
  );
}

// ============================================================================
// Versão do professor — escolhe turma e aluno (empresa) antes de exibir.
// ============================================================================
export function DashboardProfessor({ perfil, turmas }) {
  const [turmaId, setTurmaId] = useState("");
  const [alunos, setAlunos] = useState(null);
  const [empresaId, setEmpresaId] = useState("");
  const [nomeEmpresa, setNomeEmpresa] = useState("");

  const minhasTurmas = (turmas || []).filter((t) => perfil.papel === "mestre" || t.professorUid === perfil.uid);

  useEffect(() => {
    setEmpresaId(""); setNomeEmpresa("");
    if (!turmaId) { setAlunos(null); return; }
    (async () => {
      const r = await window.storage.get(`empresas_${turmaId}`, true).catch(() => null);
      setAlunos(r ? JSON.parse(r.value) : []);
    })();
  }, [turmaId]);

  return (
    <div>
      <Card>
        <strong className="block mb-3">Escolha a empresa a ser verificada</strong>
        <div className="flex gap-2 flex-wrap">
          <select value={turmaId} onChange={(e) => setTurmaId(e.target.value)} className="border border-paperline rounded-sm px-3 py-2 text-sm">
            <option value="">Selecione a turma...</option>
            {minhasTurmas.map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}
          </select>
          <select value={empresaId} disabled={!alunos} onChange={(e) => {
            setEmpresaId(e.target.value);
            setNomeEmpresa(alunos.find((a) => a.id === e.target.value)?.nome || "");
          }} className="border border-paperline rounded-sm px-3 py-2 text-sm disabled:opacity-50">
            <option value="">{alunos ? "Selecione o aluno..." : "Selecione a turma primeiro"}</option>
            {(alunos || []).map((a) => <option key={a.id} value={a.id}>{a.aluno} — {a.nome}</option>)}
          </select>
        </div>
      </Card>
      <DashboardEmpresa empresaId={empresaId} nomeEmpresa={nomeEmpresa} />
    </div>
  );
}
