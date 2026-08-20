import React, { useEffect, useState } from "react";
import { useSharedList } from "../lib/hooks";
import { Card, Botao } from "./ModuloUI";

const MODULOS_AVALIADOS = [
  { id: "m7", label: "7.0 — Créditos Vencidos e Não Liquidados" },
  { id: "m11", label: "11.0 — Estudos de Caso" },
];

async function carregarCaso(empresaId, moduleId) {
  const r = await window.storage.get(`${moduleId}_caso_avaliado_${empresaId}`, true).catch(() => null);
  return r ? JSON.parse(r.value) : null;
}

function CartaoCorrecao({ aluno, moduleId, moduleLabel, caso, onSalvo }) {
  const [nota, setNota] = useState(caso.nota ?? "");
  const [feedback, setFeedback] = useState(caso.feedback ?? "");
  const [salvando, setSalvando] = useState(false);
  const [aberto, setAberto] = useState(false);

  const salvar = async () => {
    setSalvando(true);
    const novo = { ...caso, nota: parseFloat(nota) || 0, feedback, status: "corrigido", corrigidoEm: Date.now() };
    await window.storage.set(`${moduleId}_caso_avaliado_${aluno.id}`, JSON.stringify(novo), true);
    setSalvando(false);
    onSalvo();
  };

  return (
    <Card>
      <div className="flex justify-between items-start">
        <div>
          <strong>{aluno.aluno}</strong>
          <span className="text-xs text-inksoft ml-2">{moduleLabel} · matrícula {aluno.matricula}</span>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full border ${caso.status === "corrigido" ? "border-ledger text-ledger" : "border-debit text-debit"}`}>
          {caso.status === "corrigido" ? `Corrigido — ${caso.nota}/10` : "Aguardando correção"}
        </span>
      </div>
      <button onClick={() => setAberto(!aberto)} className="text-xs text-ledger mt-2">{aberto ? "Ocultar resposta" : "Ver resposta"}</button>
      {aberto && (
        <div className="mt-3 border-t border-paperline pt-3">
          <p className="text-sm whitespace-pre-wrap mb-3">{caso.texto}</p>
          <div className="flex gap-2 items-center flex-wrap">
            <input value={nota} onChange={(e) => setNota(e.target.value)} placeholder="Nota (0-10)" inputMode="decimal"
              className="w-24 border border-paperline rounded-sm px-2 py-1.5 text-sm" />
            <input value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Comentário para o aluno (opcional)"
              className="flex-1 min-w-[220px] border border-paperline rounded-sm px-2 py-1.5 text-sm" />
            <Botao onClick={salvar} disabled={salvando || nota === ""}>{salvando ? "Salvando…" : "Salvar correção"}</Botao>
          </div>
        </div>
      )}
    </Card>
  );
}

export function Correcoes({ perfil }) {
  const [turmas] = useSharedList("turmas");
  const [turmaId, setTurmaId] = useState("");
  const [entradas, setEntradas] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [refresh, setRefresh] = useState(0);

  const minhasTurmas = (turmas || []).filter((t) => perfil.papel === "mestre" || t.professorUid === perfil.uid);

  useEffect(() => {
    if (!turmaId) { setEntradas(null); return; }
    (async () => {
      setCarregando(true);
      const r = await window.storage.get(`empresas_${turmaId}`, true).catch(() => null);
      const alunos = r ? JSON.parse(r.value) : [];
      const lista = [];
      for (const aluno of alunos) {
        for (const mod of MODULOS_AVALIADOS) {
          const caso = await carregarCaso(aluno.id, mod.id);
          if (caso && (caso.status === "enviado" || caso.status === "corrigido")) {
            lista.push({ aluno, moduleId: mod.id, moduleLabel: mod.label, caso });
          }
        }
      }
      lista.sort((a, b) => (a.caso.status === "enviado" ? -1 : 1));
      setEntradas(lista);
      setCarregando(false);
    })();
  }, [turmaId, refresh]);

  return (
    <div>
      <Card>
        <strong className="block mb-3">Correções pendentes</strong>
        <select value={turmaId} onChange={(e) => setTurmaId(e.target.value)} className="border border-paperline rounded-sm px-3 py-2 text-sm">
          <option value="">Selecione uma turma...</option>
          {minhasTurmas.map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}
        </select>
      </Card>
      {carregando && <Card><p className="text-sm text-inksoft">Carregando…</p></Card>}
      {entradas && !carregando && (
        entradas.length === 0
          ? <Card><p className="text-sm text-inksoft">Nenhum estudo de caso enviado ainda nesta turma.</p></Card>
          : entradas.map((e, i) => (
            <CartaoCorrecao key={i} aluno={e.aluno} moduleId={e.moduleId} moduleLabel={e.moduleLabel} caso={e.caso}
              onSalvo={() => setRefresh((r) => r + 1)} />
          ))
      )}
    </div>
  );
}
