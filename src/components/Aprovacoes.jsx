import React, { useEffect, useState } from "react";
import { useSharedList } from "../lib/hooks";
import { carregarProgresso, avaliarModulo, MODULOS_COM_SUBMISSAO, STATUS_LABEL } from "../lib/progresso";
import { MODULES } from "./ModuleRouter";
import { Card, Botao } from "./ModuloUI";

const COR_STATUS = {
  bloqueado: "text-inksoft border-paperline",
  liberado: "text-inksoft border-paperline",
  aguardando_analise: "text-debit border-debit",
  devolvido: "text-alert border-alert",
  aprovado: "text-ledger border-ledger",
};

function LinhaModulo({ empresaId, modulo, status, onAtualizado }) {
  const [feedback, setFeedback] = useState(status?.feedback || "");
  const [salvando, setSalvando] = useState(false);
  const [aberto, setAberto] = useState(false);

  const avaliar = async (aprovado) => {
    setSalvando(true);
    await avaliarModulo(empresaId, modulo.id, { aprovado, feedback });
    setSalvando(false);
    onAtualizado();
  };

  const st = status?.status || "bloqueado";
  const podeAvaliar = st === "aguardando_analise";

  return (
    <div className="border-t border-paperline py-3">
      <button onClick={() => setAberto(!aberto)} className="w-full flex justify-between items-center text-left">
        <span className="text-sm"><span className="font-mono text-xs text-debit mr-2">{modulo.code}</span>{modulo.title}</span>
        <span className={`text-xs px-2 py-0.5 rounded-full border ${COR_STATUS[st]}`}>{STATUS_LABEL[st]}</span>
      </button>
      {aberto && podeAvaliar && (
        <div className="mt-3 pl-2 border-l-2 border-paperline">
          <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Feedback para o aluno (correções, ajustes, elogios...)"
            className="w-full min-h-[70px] border border-paperline rounded-sm px-3 py-2 text-sm mb-2" />
          <div className="flex gap-2">
            <Botao onClick={() => avaliar(true)} disabled={salvando}>Aprovar e liberar próximo módulo</Botao>
            <Botao secondary onClick={() => avaliar(false)} disabled={salvando}>Devolver para correção</Botao>
          </div>
        </div>
      )}
      {aberto && st === "devolvido" && status.feedback && (
        <p className="mt-2 pl-2 border-l-2 border-alert text-sm text-inksoft">Feedback enviado: {status.feedback}</p>
      )}
    </div>
  );
}

export function Aprovacoes({ perfil }) {
  const [turmas] = useSharedList("turmas");
  const [turmaId, setTurmaId] = useState("");
  const [alunos, setAlunos] = useState(null);
  const [empresaId, setEmpresaId] = useState("");
  const [progresso, setProgresso] = useState(null);

  const minhasTurmas = (turmas || []).filter((t) => perfil.papel === "mestre" || t.professorUid === perfil.uid);
  const modulosComSubmissao = MODULES.filter((m) => MODULOS_COM_SUBMISSAO.includes(m.id));

  useEffect(() => {
    setEmpresaId(""); setProgresso(null);
    if (!turmaId) { setAlunos(null); return; }
    (async () => {
      const r = await window.storage.get(`empresas_${turmaId}`, true).catch(() => null);
      setAlunos(r ? JSON.parse(r.value) : []);
    })();
  }, [turmaId]);

  const carregar = async (id) => {
    setProgresso(await carregarProgresso(id));
  };

  return (
    <div>
      <Card>
        <strong className="block mb-3">Aprovação de Módulos</strong>
        <div className="flex gap-2 flex-wrap">
          <select value={turmaId} onChange={(e) => setTurmaId(e.target.value)} className="border border-paperline rounded-sm px-3 py-2 text-sm">
            <option value="">Selecione a turma...</option>
            {minhasTurmas.map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}
          </select>
          <select value={empresaId} disabled={!alunos} onChange={(e) => { setEmpresaId(e.target.value); if (e.target.value) carregar(e.target.value); }}
            className="border border-paperline rounded-sm px-3 py-2 text-sm disabled:opacity-50">
            <option value="">{alunos ? "Selecione o aluno..." : "Selecione a turma primeiro"}</option>
            {(alunos || []).map((a) => <option key={a.id} value={a.id}>{a.aluno} — {a.nome}</option>)}
          </select>
        </div>
      </Card>

      {progresso && (
        <Card>
          <p className="text-xs text-inksoft mb-2">Clique em um módulo com status "Aguardando análise do professor" para avaliar.</p>
          {modulosComSubmissao.map((m) => (
            <LinhaModulo key={m.id} empresaId={empresaId} modulo={m} status={progresso[m.id]} onAtualizado={() => carregar(empresaId)} />
          ))}
        </Card>
      )}
    </div>
  );
}
