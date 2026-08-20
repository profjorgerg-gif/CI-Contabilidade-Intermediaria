import React from "react";
import { useSimulador, fmt } from "../lib/simuladorEngine";

export function Card({ children, className = "" }) {
  return <div className={`bg-white border border-paperline rounded-sm p-6 mb-4 ${className}`}>{children}</div>;
}

// Renderiza o HTML de teoria já escrito e aprovado (extraído verbatim do
// protótipo vanilla). dangerouslySetInnerHTML é seguro aqui porque o
// conteúdo vem de constantes do próprio código-fonte, não de input externo.
export function TeoriaCard({ html }) {
  return <div className="teoria-conteudo" dangerouslySetInnerHTML={{ __html: html }} />;
}

export function Botao({ children, onClick, secondary, disabled, className = "" }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-sm text-sm font-medium disabled:opacity-40 ${
        secondary ? "border border-ledger text-ledger hover:bg-ledgersoft" : "bg-ledger text-white hover:bg-[#1F3E30]"
      } ${className}`}
    >
      {children}
    </button>
  );
}

// ============================================================================
// Simulador de Lançamentos — versão React do motor genérico vanilla.
// ============================================================================
export function SimuladorLancamentos({ empresaId, moduleId, contas, eventos, notaEmpresa }) {
  const sim = useSimulador(empresaId, moduleId, contas);
  const [criandoLivre, setCriandoLivre] = React.useState(false);
  const [tituloLivre, setTituloLivre] = React.useState("");
  const [narrativaLivre, setNarrativaLivre] = React.useState("");

  if (sim.carregando) return <p className="text-sm text-inksoft">Carregando lançamentos…</p>;

  const todosEventos = [...eventos, ...sim.eventosExtras];

  const criarLivre = async () => {
    if (!tituloLivre.trim()) return;
    await sim.adicionarEventoLivre(tituloLivre.trim(), narrativaLivre.trim());
    setTituloLivre(""); setNarrativaLivre(""); setCriandoLivre(false);
  };

  return (
    <div>
      {notaEmpresa && (
        <div className="text-xs text-inksoft bg-ledgersoft border-l-2 border-ledger px-3 py-2 mb-4" dangerouslySetInnerHTML={{ __html: notaEmpresa }} />
      )}
      {todosEventos.map((ev) => {
        const linhas = sim.draftDoEvento(ev.id);
        const totais = sim.totaisDoEvento(ev.id);
        const balanceado = totais.debito === totais.credito && totais.debito > 0;
        const historico = sim.historicoDoEvento(ev.id);
        return (
          <Card key={ev.id}>
            <div className="flex justify-between items-start">
              <strong className="block mb-1">{ev.titulo}</strong>
              {ev.id.startsWith("livre_") && (
                <button onClick={() => sim.removerEventoLivre(ev.id)} className="text-xs text-alert border border-alert rounded-sm px-2 py-1">Remover</button>
              )}
            </div>
            <p className="text-sm text-inksoft mb-3">{ev.narrativa}</p>

            <table className="w-full text-sm mb-3">
              <thead>
                <tr className="text-left text-xs text-inksoft uppercase">
                  <th className="pb-1">Conta</th><th className="w-20">D/C</th><th className="w-32">Valor (R$)</th><th className="w-9"></th>
                </tr>
              </thead>
              <tbody>
                {linhas.map((l, i) => (
                  <tr key={i} className="border-t border-paperline">
                    <td className="py-1">
                      <select
                        value={l.conta}
                        onChange={(e) => sim.atualizarLinha(ev.id, i, "conta", e.target.value)}
                        className="w-full border border-paperline rounded-sm px-2 py-1"
                      >
                        <option value="">Selecione...</option>
                        {contas.map((c) => <option key={c.codigo} value={c.nome}>{c.codigo} — {c.nome}</option>)}
                      </select>
                    </td>
                    <td>
                      <select
                        value={l.tipo}
                        onChange={(e) => sim.atualizarLinha(ev.id, i, "tipo", e.target.value)}
                        className="border border-paperline rounded-sm px-2 py-1"
                      >
                        <option value="D">Débito</option>
                        <option value="C">Crédito</option>
                      </select>
                    </td>
                    <td>
                      <input
                        value={l.valor}
                        onChange={(e) => sim.atualizarLinha(ev.id, i, "valor", e.target.value)}
                        placeholder="0,00" inputMode="decimal"
                        className="w-full border border-paperline rounded-sm px-2 py-1"
                      />
                    </td>
                    <td>
                      <button onClick={() => sim.removerLinha(ev.id, i)} className="border border-paperline rounded-sm px-2 text-inksoft">×</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between items-center flex-wrap gap-3 mb-3">
              <div className="flex gap-2">
                <button onClick={() => sim.adicionarLinha(ev.id, "D")} className="text-xs border border-ledger text-ledger rounded-sm px-3 py-1">+ linha a débito</button>
                <button onClick={() => sim.adicionarLinha(ev.id, "C")} className="text-xs border border-ledger text-ledger rounded-sm px-3 py-1">+ linha a crédito</button>
              </div>
              <div className="text-sm">
                Débitos: <strong>R$ {fmt(totais.debito)}</strong> · Créditos: <strong>R$ {fmt(totais.credito)}</strong>{" "}
                {balanceado ? <span className="text-ledger">✓ balanceado</span> : <span className="text-alert">✗ débito ≠ crédito</span>}
              </div>
            </div>
            <Botao onClick={() => sim.lancar(ev.id)} disabled={!balanceado}>Lançar</Botao>

            {historico.length > 0 && (
              <div className="mt-3 pt-3 border-t border-paperline space-y-1">
                {historico.map((r, i) => (
                  <div key={i} className="text-xs text-inksoft">
                    Lançado em {new Date(r.timestamp).toLocaleString("pt-BR")} —{" "}
                    {r.linhas.map((l, j) => `${l.tipo}: ${l.conta} R$ ${fmt(parseFloat((l.valor + "").replace(",", ".")) || 0)}`).join(" | ")}
                  </div>
                ))}
              </div>
            )}
          </Card>
        );
      })}

      <Card>
        <strong className="block mb-2">Adicionar lançamento</strong>
        <p className="text-xs text-inksoft mb-3">Crie quantos lançamentos adicionais precisar, além dos eventos guiados acima.</p>
        {!criandoLivre ? (
          <Botao secondary onClick={() => setCriandoLivre(true)}>+ Novo lançamento</Botao>
        ) : (
          <div>
            <input value={tituloLivre} onChange={(e) => setTituloLivre(e.target.value)} placeholder="Título do lançamento"
              className="w-full border border-paperline rounded-sm px-3 py-2 text-sm mb-2" />
            <textarea value={narrativaLivre} onChange={(e) => setNarrativaLivre(e.target.value)} placeholder="Descrição da operação (opcional)"
              className="w-full min-h-[60px] border border-paperline rounded-sm px-3 py-2 text-sm mb-2" />
            <div className="flex gap-2">
              <Botao onClick={criarLivre} disabled={!tituloLivre.trim()}>Criar lançamento</Botao>
              <Botao secondary onClick={() => { setCriandoLivre(false); setTituloLivre(""); setNarrativaLivre(""); }}>Cancelar</Botao>
            </div>
          </div>
        )}
      </Card>

      <Card>
        <strong className="block mb-3">Saldo acumulado (todos os eventos lançados)</strong>
        {sim.saldoAcumulado().length === 0 ? (
          <p className="text-sm text-inksoft">Ainda não há lançamentos registrados. Complete os eventos acima.</p>
        ) : (
          <table className="w-full text-sm">
            <thead><tr className="text-left text-xs text-inksoft uppercase"><th>Conta</th><th>Débitos</th><th>Créditos</th><th>Saldo</th></tr></thead>
            <tbody>
              {sim.saldoAcumulado().map((c) => (
                <tr key={c.codigo} className="border-t border-paperline">
                  <td className="py-1">{c.codigo} — {c.nome}</td>
                  <td>R$ {fmt(c.debito)}</td>
                  <td>R$ {fmt(c.credito)}</td>
                  <td><strong>R$ {fmt(Math.abs(c.liquido))} {c.liquido >= 0 ? "(D)" : "(C)"}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}

// ============================================================================
// Estudo de Caso — texto + pergunta(s) + resposta salva no Firestore.
// ============================================================================
// ============================================================================
// Estudo de Caso AVALIADO — o aluno escreve e envia para correção; o
// professor atribui nota de 0 a 10 e um retorno em texto. Usado nos módulos
// que pedem correção do professor (7.0 e 11.0).
// ============================================================================
export function EstudoDeCasoAvaliado({ empresaId, moduleId, html, extra }) {
  const chave = `${moduleId}_caso_avaliado_${empresaId}`;
  const [dados, setDados] = React.useState(null);
  const [texto, setTexto] = React.useState("");
  const [status, setStatus] = React.useState("");

  React.useEffect(() => {
    (async () => {
      const r = await window.storage.get(chave, true).catch(() => null);
      const valor = r ? JSON.parse(r.value) : { texto: "", status: "rascunho" };
      setDados(valor);
      setTexto(valor.texto || "");
    })();
  }, [chave]);

  const salvarRascunho = async () => {
    const novo = { ...dados, texto, status: "rascunho" };
    setDados(novo);
    await window.storage.set(chave, JSON.stringify(novo), true);
    setStatus("Salvo ✓");
    setTimeout(() => setStatus(""), 1400);
  };

  const enviar = async () => {
    if (!texto.trim()) return;
    const novo = { ...dados, texto, status: "enviado", enviadoEm: Date.now() };
    setDados(novo);
    await window.storage.set(chave, JSON.stringify(novo), true);
  };

  if (!dados) return <p className="text-sm text-inksoft">Carregando…</p>;

  const bloqueado = dados.status === "enviado" || dados.status === "corrigido";

  return (
    <Card>
      {extra}
      <div className="teoria-conteudo" dangerouslySetInnerHTML={{ __html: html }} />
      <textarea
        value={texto} onChange={(e) => setTexto(e.target.value)} disabled={bloqueado}
        placeholder="Digite sua resposta aqui..."
        className="w-full min-h-[160px] mt-3 border border-paperline rounded-sm px-3 py-2 text-sm disabled:bg-paper"
      />
      {!bloqueado && (
        <div className="mt-2 flex items-center gap-3">
          <Botao secondary onClick={salvarRascunho}>Salvar rascunho</Botao>
          <Botao onClick={enviar} disabled={!texto.trim()}>Enviar para correção</Botao>
          {status && <span className="text-xs text-ledger">{status}</span>}
        </div>
      )}
      {dados.status === "enviado" && (
        <p className="text-sm text-inksoft mt-3 bg-ledgersoft border-l-2 border-ledger px-3 py-2">
          Enviado para o professor em {new Date(dados.enviadoEm).toLocaleString("pt-BR")}. Aguardando correção.
        </p>
      )}
      {dados.status === "corrigido" && (
        <div className="text-sm mt-3 bg-ledgersoft border-l-2 border-ledger px-3 py-2">
          <strong>Nota: {dados.nota}/10</strong>
          {dados.feedback && <p className="mt-1 text-inksoft">{dados.feedback}</p>}
        </div>
      )}
    </Card>
  );
}

// ============================================================================
// Estudo de Caso — texto + pergunta(s) + resposta salva no Firestore.
// (versão simples, sem envio para correção — usada no Módulo 4.0)
// ============================================================================
export function EstudoDeCaso({ empresaId, moduleId, html }) {
  const chave = `${moduleId}_resposta_caso_${empresaId}`;
  const [resposta, setResposta] = React.useState("");
  const [carregado, setCarregado] = React.useState(false);
  const [status, setStatus] = React.useState("");

  React.useEffect(() => {
    (async () => {
      const r = await window.storage.get(chave, true).catch(() => null);
      if (r) setResposta(JSON.parse(r.value));
      setCarregado(true);
    })();
  }, [chave]);

  const salvar = async () => {
    await window.storage.set(chave, JSON.stringify(resposta), true);
    setStatus("Salvo ✓");
    setTimeout(() => setStatus(""), 1400);
  };

  return (
    <Card>
      <div className="teoria-conteudo" dangerouslySetInnerHTML={{ __html: html }} />
      {carregado && (
        <>
          <textarea
            value={resposta}
            onChange={(e) => setResposta(e.target.value)}
            placeholder="Digite suas respostas aqui..."
            className="w-full min-h-[140px] mt-3 border border-paperline rounded-sm px-3 py-2 text-sm"
          />
          <div className="mt-2 flex items-center gap-3">
            <Botao onClick={salvar}>Salvar respostas</Botao>
            {status && <span className="text-xs text-ledger">{status}</span>}
          </div>
        </>
      )}
    </Card>
  );
}
