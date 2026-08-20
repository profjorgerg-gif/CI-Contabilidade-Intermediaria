import React, { useState } from "react";
import { useSharedList } from "../lib/hooks";
import { Card, Botao } from "./ModuloUI";

const TIPOS = { desenvolvimento: "Suporte de Desenvolvimento", pedagogico: "Suporte Pedagógico" };
export const STATUS = {
  aberto: { label: "Aberto", cor: "#8A5A2B" },
  em_analise: { label: "Em análise", cor: "#5B6B6C" },
  em_desenvolvimento: { label: "Em desenvolvimento", cor: "#28513F" },
  encerrado: { label: "Encerrado", cor: "#9C3B3B" },
};

function gerarId() { return Math.random().toString(36).slice(2, 10); }

function Badge({ status }) {
  const s = STATUS[status] || STATUS.aberto;
  return <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ color: s.cor, border: `1px solid ${s.cor}` }}>{s.label}</span>;
}

// ============================================================================
// Formulário de novo chamado — o destino disponível depende do perfil.
// ============================================================================
function NovoChamado({ perfil, contexto, onCriado }) {
  const [tipo, setTipo] = useState("pedagogico");
  const [destino, setDestino] = useState(perfil.papel === "aluno" ? "professor" : "aluno");
  const [empresaDestino, setEmpresaDestino] = useState("");
  const [assunto, setAssunto] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [enviando, setEnviando] = useState(false);

  const podeEnviar = assunto.trim() && mensagem.trim() && (destino !== "aluno" || empresaDestino);

  const enviar = async () => {
    if (!podeEnviar) return;
    setEnviando(true);

    let destinoPerfil, destinoUid = null, destinoNome, alunoEmpresaId = null;
    if (perfil.papel === "aluno") {
      alunoEmpresaId = contexto.empresaId;
      if (destino === "professor") { destinoPerfil = "professor"; destinoUid = contexto.professorUid; destinoNome = contexto.professorNome; }
      else { destinoPerfil = "mestre"; destinoNome = "Usuário Mestre"; }
    } else {
      if (destino === "aluno") {
        const aluno = contexto.alunosDisponiveis.find((a) => a.id === empresaDestino);
        destinoPerfil = "aluno"; alunoEmpresaId = empresaDestino; destinoNome = aluno?.aluno || "Aluno";
      } else { destinoPerfil = "mestre"; destinoNome = "Usuário Mestre"; }
    }

    const chamado = {
      id: gerarId(), tipo,
      origemPerfil: perfil.papel, origemUid: perfil.uid, origemNome: perfil.nome,
      destinoPerfil, destinoUid, destinoNome, alunoEmpresaId,
      assunto: assunto.trim(), status: "aberto", criadoEm: Date.now(),
      mensagens: [{ autorPerfil: perfil.papel, autorNome: perfil.nome, texto: mensagem.trim(), timestamp: Date.now() }],
    };
    await onCriado(chamado);
    setAssunto(""); setMensagem(""); setEmpresaDestino("");
    setEnviando(false);
  };

  return (
    <Card>
      <strong className="block mb-3">Novo chamado</strong>
      <div className="flex gap-3 flex-wrap mb-3">
        <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="border border-paperline rounded-sm px-3 py-2 text-sm">
          {Object.entries(TIPOS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select value={destino} onChange={(e) => setDestino(e.target.value)} className="border border-paperline rounded-sm px-3 py-2 text-sm">
          {perfil.papel === "aluno" ? (
            <><option value="professor">Enviar para o Professor</option><option value="mestre">Enviar para o Administrador</option></>
          ) : (
            <><option value="aluno">Enviar para um Aluno</option><option value="mestre">Enviar para o Administrador</option></>
          )}
        </select>
        {perfil.papel === "professor" && destino === "aluno" && (
          <select value={empresaDestino} onChange={(e) => setEmpresaDestino(e.target.value)} className="border border-paperline rounded-sm px-3 py-2 text-sm">
            <option value="">Selecione o aluno...</option>
            {(contexto.alunosDisponiveis || []).map((a) => <option key={a.id} value={a.id}>{a.aluno} — {a.matricula}</option>)}
          </select>
        )}
      </div>
      <input value={assunto} onChange={(e) => setAssunto(e.target.value)} placeholder="Assunto"
        className="w-full border border-paperline rounded-sm px-3 py-2 text-sm mb-3" />
      <textarea value={mensagem} onChange={(e) => setMensagem(e.target.value)} placeholder="Descreva o que você precisa..."
        className="w-full min-h-[90px] border border-paperline rounded-sm px-3 py-2 text-sm mb-3" />
      <Botao onClick={enviar} disabled={!podeEnviar || enviando}>{enviando ? "Enviando…" : "Abrir chamado"}</Botao>
    </Card>
  );
}

// ============================================================================
// Uma linha de chamado, expansível, com thread e (se permitido) status.
// ============================================================================
function LinhaChamado({ chamado, perfil, podeAlterarStatus, onResponder, onAlterarStatus }) {
  const [aberto, setAberto] = useState(false);
  const [resposta, setResposta] = useState("");
  const [enviando, setEnviando] = useState(false);

  const responder = async () => {
    if (!resposta.trim()) return;
    setEnviando(true);
    await onResponder(chamado.id, { autorPerfil: perfil.papel, autorNome: perfil.nome, texto: resposta.trim(), timestamp: Date.now() });
    setResposta(""); setEnviando(false);
  };

  return (
    <div className="border-t border-paperline py-3">
      <button onClick={() => setAberto(!aberto)} className="w-full text-left flex justify-between items-center gap-3">
        <div>
          <div className="text-sm font-medium">{chamado.assunto}</div>
          <div className="text-xs text-inksoft">{TIPOS[chamado.tipo]} · de {chamado.origemNome} para {chamado.destinoNome} · {new Date(chamado.criadoEm).toLocaleString("pt-BR")}</div>
        </div>
        <Badge status={chamado.status} />
      </button>

      {aberto && (
        <div className="mt-3 pl-2 border-l-2 border-paperline space-y-2">
          {chamado.mensagens.map((m, i) => (
            <div key={i} className="text-sm">
              <span className="text-xs text-inksoft">{m.autorNome} · {new Date(m.timestamp).toLocaleString("pt-BR")}</span>
              <p>{m.texto}</p>
            </div>
          ))}

          {chamado.status !== "encerrado" && (
            <div className="pt-2">
              <textarea value={resposta} onChange={(e) => setResposta(e.target.value)} placeholder="Responder..."
                className="w-full min-h-[60px] border border-paperline rounded-sm px-3 py-2 text-sm mb-2" />
              <div className="flex gap-2 items-center flex-wrap">
                <Botao onClick={responder} disabled={enviando || !resposta.trim()} className="text-xs">Responder</Botao>
                {podeAlterarStatus && (
                  <select value={chamado.status} onChange={(e) => onAlterarStatus(chamado.id, e.target.value)} className="border border-paperline rounded-sm px-2 py-1.5 text-xs">
                    {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Componente principal — muda de comportamento conforme o perfil.
// contexto: para aluno, {empresaId, professorUid, professorNome};
//           para professor, {alunosDisponiveis: [...]}
// ============================================================================
export function Suporte({ perfil, contexto }) {
  const [chamados, setChamados] = useSharedList("chamados");
  const [filtro, setFiltro] = useState("todos");

  if (chamados === null) return <p className="text-sm text-inksoft">Carregando…</p>;

  const criar = async (chamado) => { await setChamados([...(chamados || []), chamado]); };
  const responder = async (id, msg) => {
    await setChamados(chamados.map((c) => c.id === id ? { ...c, mensagens: [...c.mensagens, msg] } : c));
  };
  const alterarStatus = async (id, status) => {
    await setChamados(chamados.map((c) => c.id === id ? { ...c, status } : c));
  };

  let visiveis;
  if (perfil.papel === "mestre") {
    visiveis = chamados;
  } else if (perfil.papel === "professor") {
    visiveis = chamados.filter((c) => c.origemUid === perfil.uid || (c.destinoPerfil === "professor" && c.destinoUid === perfil.uid));
  } else {
    visiveis = chamados.filter((c) => c.alunoEmpresaId === contexto.empresaId);
  }

  if (perfil.papel === "mestre" && filtro !== "todos") {
    visiveis = visiveis.filter((c) => c.status === filtro);
  }
  visiveis = [...visiveis].sort((a, b) => b.criadoEm - a.criadoEm);

  const podeAlterarStatus = (c) =>
    perfil.papel === "mestre" || (perfil.papel === "professor" && c.destinoPerfil === "professor" && c.destinoUid === perfil.uid);

  return (
    <div>
      {perfil.papel !== "mestre" && <NovoChamado perfil={perfil} contexto={contexto} onCriado={criar} />}

      <Card>
        <div className="flex justify-between items-center mb-3">
          <strong>{perfil.papel === "mestre" ? "Todos os chamados" : "Meus chamados"}</strong>
          {perfil.papel === "mestre" && (
            <select value={filtro} onChange={(e) => setFiltro(e.target.value)} className="border border-paperline rounded-sm px-2 py-1.5 text-xs">
              <option value="todos">Todos</option>
              {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          )}
        </div>
        {visiveis.length === 0 ? (
          <p className="text-sm text-inksoft">Nenhum chamado encontrado.</p>
        ) : (
          visiveis.map((c) => (
            <LinhaChamado key={c.id} chamado={c} perfil={perfil} podeAlterarStatus={podeAlterarStatus(c)}
              onResponder={responder} onAlterarStatus={alterarStatus} />
          ))
        )}
      </Card>
    </div>
  );
}
