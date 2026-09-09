import React, { useEffect, useState } from "react";
import { useSharedList } from "../lib/hooks";
import { calcularStatusEfetivo, avaliarModulo, MODULOS_COM_SUBMISSAO, ORDEM_MODULOS } from "../lib/progresso";
import { MODULES, ModuleContent } from "./ModuleRouter";
import { Card, Botao } from "./ModuloUI";

async function lerProgressoBruto(empresaId) {
  const r = await window.storage.get(`progresso_modulos_${empresaId}`, true).catch(() => null);
  return r ? JSON.parse(r.value) : {};
}

async function lerCasoAvaliado(empresaId, moduleId) {
  const r = await window.storage.get(`${moduleId}_caso_avaliado_${empresaId}`, true).catch(() => null);
  return r ? JSON.parse(r.value) : null;
}

const LABEL_MODULO = Object.fromEntries(MODULES.map((m) => [m.id, `${m.code} — ${m.title}`]));

function PainelRevisao({ item, onResolvido, onFechar }) {
  const [feedback, setFeedback] = useState("");
  const [nota, setNota] = useState("");
  const [caso, setCaso] = useState(undefined); // undefined = carregando; null = não é módulo de caso
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    setFeedback(""); setNota(""); setCaso(undefined);
    if (item.moduleId === "m7") {
      lerCasoAvaliado(item.empresaId, item.moduleId).then(setCaso);
    } else {
      setCaso(null);
    }
  }, [item]);

  const resolver = async (aprovado) => {
    setSalvando(true);
    if (item.moduleId === "m7" && caso) {
      const novoCaso = aprovado
        ? { ...caso, status: "corrigido", nota: parseFloat(nota) || 0, feedback, corrigidoEm: Date.now() }
        : { ...caso, status: "devolvido", feedback };
      await window.storage.set(`m7_caso_avaliado_${item.empresaId}`, JSON.stringify(novoCaso), true);
    }
    await avaliarModulo(item.empresaId, item.moduleId, { aprovado, feedback });
    setSalvando(false);
    onResolvido();
  };

  return (
    <Card>
      <div className="flex justify-between items-start mb-3 flex-wrap gap-2">
        <div>
          <strong className="block">{item.aluno}</strong>
          <span className="text-xs text-inksoft">{item.turmaNome} · {LABEL_MODULO[item.moduleId]} · enviado em {new Date(item.enviadoEm).toLocaleString("pt-BR")}</span>
        </div>
        <button onClick={onFechar} className="text-xs text-inksoft">Fechar</button>
      </div>

      <div className="border border-paperline rounded-sm p-3 mb-3 max-h-[420px] overflow-y-auto">
        {caso === undefined && <p className="text-sm text-inksoft">Carregando…</p>}
        {caso === null && <ModuleContent moduleId={item.moduleId} empresaId={item.empresaId} />}
        {caso && <p className="text-sm whitespace-pre-wrap">{caso.texto}</p>}
      </div>

      {item.moduleId === "m7" && (
        <input value={nota} onChange={(e) => setNota(e.target.value)} placeholder="Nota (0-10)" inputMode="decimal"
          className="w-28 border border-paperline rounded-sm px-2 py-1.5 text-sm mb-2" />
      )}
      <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Feedback para o aluno (correções, ajustes, elogios...)"
        className="w-full min-h-[80px] border border-paperline rounded-sm px-3 py-2 text-sm mb-3" />
      <div className="flex gap-2">
        <Botao onClick={() => resolver(true)} disabled={salvando}>Aprovar e liberar próximo módulo</Botao>
        <Botao secondary onClick={() => resolver(false)} disabled={salvando}>Devolver para ajustes</Botao>
      </div>
    </Card>
  );
}

export function AtividadesRecebidas({ perfil }) {
  const [turmas] = useSharedList("turmas");
  const [pendentes, setPendentes] = useState(null);
  const [selecionado, setSelecionado] = useState(null);

  const carregar = async () => {
    const minhasTurmas = (turmas || []).filter((t) => perfil.papel === "mestre" || t.professorUid === perfil.uid);
    const lista = [];
    for (const turma of minhasTurmas) {
      const rAlunos = await window.storage.get(`empresas_${turma.id}`, true).catch(() => null);
      const alunos = rAlunos ? JSON.parse(rAlunos.value) : [];
      for (const aluno of alunos) {
        const bruto = await lerProgressoBruto(aluno.id);
        const efetivo = calcularStatusEfetivo(bruto);
        for (const moduleId of ORDEM_MODULOS) {
          if (!MODULOS_COM_SUBMISSAO.includes(moduleId)) continue;
          if (efetivo[moduleId]?.status === "aguardando_analise") {
            lista.push({
              empresaId: aluno.id, aluno: aluno.aluno, turmaNome: turma.nome,
              moduleId, enviadoEm: bruto[moduleId]?.enviadoEm || 0,
            });
          }
        }
      }
    }
    lista.sort((a, b) => b.enviadoEm - a.enviadoEm);
    setPendentes(lista);
    setSelecionado(null);
  };

  useEffect(() => { if (turmas) carregar(); }, [turmas]);

  return (
    <div>
      <Card>
        <div className="flex justify-between items-center">
          <strong>Atividades Recebidas</strong>
          <span className="text-xs text-inksoft">{pendentes ? `${pendentes.length} aguardando análise` : "Carregando…"}</span>
        </div>
      </Card>

      {pendentes && pendentes.length === 0 && (
        <Card><p className="text-sm text-inksoft">Nenhuma atividade aguardando análise no momento.</p></Card>
      )}

      {pendentes && pendentes.map((item, i) => (
        <Card key={i} className={selecionado === i ? "border-ledger" : ""}>
          <button onClick={() => setSelecionado(selecionado === i ? null : i)} className="w-full flex justify-between items-center text-left">
            <div>
              <strong className="text-sm">{item.aluno}</strong>
              <div className="text-xs text-inksoft">{item.turmaNome} · {LABEL_MODULO[item.moduleId]}</div>
            </div>
            <span className="text-xs text-debit">{new Date(item.enviadoEm).toLocaleString("pt-BR")}</span>
          </button>
          {selecionado === i && (
            <div className="mt-3">
              <PainelRevisao item={item} onResolvido={carregar} onFechar={() => setSelecionado(null)} />
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
