import React, { useEffect, useState } from "react";
import { Card, Botao } from "./ModuloUI";

// ============================================================================
// Exercício de pareamento (coluna 1 x coluna 2) — 5 blocos de 10 pares,
// nota de 0 a 10 por bloco (1 ponto por acerto). Usado no Módulo 3.0 para
// relacionar contas sintéticas com suas contas analíticas.
// `blocos`: [{ titulo, pares: [{ sintetica, analitica }] }]
// ============================================================================
export function ExercicioPareamento({ empresaId, moduleId, blocos }) {
  const chave = `${moduleId}_pareamento_${empresaId}`;
  const [blocoAtivo, setBlocoAtivo] = React.useState(0);
  const [respostas, setRespostas] = React.useState({});
  const [notas, setNotas] = React.useState({});
  const [corrigido, setCorrigido] = React.useState({});
  const [carregado, setCarregado] = React.useState(false);
  const [colunaB, setColunaB] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      const r = await window.storage.get(chave, true).catch(() => null);
      if (r) {
        const dados = JSON.parse(r.value);
        setRespostas(dados.respostas || {});
        setNotas(dados.notas || {});
        setCorrigido(dados.corrigido || {});
      }
      setCarregado(true);
    })();
  }, [chave]);

  React.useEffect(() => {
    // Embaralha a coluna B de forma estável por bloco (mesma ordem sempre)
    const bloco = blocos[blocoAtivo];
    const analiticas = bloco.pares.map((p) => p.analitica);
    let seed = blocoAtivo + 7;
    const embaralhada = [...analiticas];
    for (let i = embaralhada.length - 1; i > 0; i--) {
      seed = (seed * 9301 + 49297) % 233280;
      const j = Math.floor((seed / 233280) * (i + 1));
      [embaralhada[i], embaralhada[j]] = [embaralhada[j], embaralhada[i]];
    }
    setColunaB(embaralhada);
  }, [blocoAtivo]);

  const salvar = async (novoResp, novoNotas, novoCorrigido) => {
    await window.storage.set(chave, JSON.stringify({ respostas: novoResp, notas: novoNotas, corrigido: novoCorrigido }), true);
  };

  const escolher = (idx, valor) => {
    if (corrigido[`b${blocoAtivo}`]) return;
    const nova = { ...respostas, [`b${blocoAtivo}_${idx}`]: valor };
    setRespostas(nova);
    salvar(nova, notas, corrigido);
  };

  const corrigir = () => {
    const bloco = blocos[blocoAtivo];
    let acertos = 0;
    bloco.pares.forEach((p, idx) => {
      if (respostas[`b${blocoAtivo}_${idx}`] === p.analitica) acertos++;
    });
    const novoNotas = { ...notas, [`b${blocoAtivo}`]: acertos };
    const novoCorrigido = { ...corrigido, [`b${blocoAtivo}`]: true };
    setNotas(novoNotas); setCorrigido(novoCorrigido);
    salvar(respostas, novoNotas, novoCorrigido);
  };

  if (!carregado) return <p className="text-sm text-inksoft">Carregando…</p>;

  const bloco = blocos[blocoAtivo];
  const jaCorrigido = corrigido[`b${blocoAtivo}`];
  const respondidas = bloco.pares.filter((_, idx) => respostas[`b${blocoAtivo}_${idx}`]).length;

  return (
    <div>
      <div className="flex gap-2 flex-wrap mb-4">
        {blocos.map((b, i) => (
          <button key={i} onClick={() => setBlocoAtivo(i)}
            className={`text-xs px-3 py-1.5 rounded-sm border ${blocoAtivo === i ? "border-ledger bg-ledgersoft text-ledger" : "border-paperline text-inksoft"}`}>
            {b.titulo} {corrigido[`b${i}`] ? `— ${notas[`b${i}`]}/10` : ""}
          </button>
        ))}
      </div>
      <Card>
        <strong className="block mb-1">{bloco.titulo}</strong>
        <p className="text-xs text-inksoft mb-4">
          Relacione cada conta sintética (coluna 1) com a sua conta analítica correspondente (coluna 2). {respondidas}/10 respondidas
          {jaCorrigido && ` · Nota: ${notas[`b${blocoAtivo}`]}/10`}
        </p>
        <table className="w-full text-sm">
          <thead><tr className="text-left text-xs text-inksoft uppercase"><th>Coluna 1 — Conta sintética</th><th>Coluna 2 — Conta analítica</th></tr></thead>
          <tbody>
            {bloco.pares.map((p, idx) => {
              const escolhida = respostas[`b${blocoAtivo}_${idx}`];
              const certo = escolhida === p.analitica;
              return (
                <tr key={idx} className="border-t border-paperline">
                  <td className="py-2 pr-4">{p.sintetica}</td>
                  <td className="py-2">
                    <select value={escolhida || ""} onChange={(e) => escolher(idx, e.target.value)} disabled={jaCorrigido}
                      className={`border rounded-sm px-2 py-1.5 text-sm w-full ${jaCorrigido ? (certo ? "border-ledger bg-ledgersoft" : "border-alert") : "border-paperline"}`}>
                      <option value="">Selecione...</option>
                      {colunaB.map((a) => <option key={a} value={a}>{a}</option>)}
                    </select>
                    {jaCorrigido && !certo && <div className="text-xs text-ledger mt-1">Correto: {p.analitica}</div>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="pt-4">
          <Botao onClick={corrigir} disabled={jaCorrigido || respondidas < 10}>
            {jaCorrigido ? `Corrigido — nota ${notas[`b${blocoAtivo}`]}/10` : "Corrigir exercício"}
          </Botao>
          {!jaCorrigido && respondidas < 10 && <span className="text-xs text-inksoft ml-3">Responda todos os 10 pares para corrigir.</span>}
        </div>
      </Card>
    </div>
  );
}

// ============================================================================
// Exercício de múltipla escolha em blocos — 5 exercícios de 10 questões,
// nota de 0 a 10 por exercício (1 ponto por acerto), salvo por aluno.
// `blocos`: [{ titulo, questoes: [{ pergunta, opcoes: [...], correta: idx }] }]
// ============================================================================
export function ExercicioMultiplaEscolha({ empresaId, moduleId, blocos }) {
  const chave = `${moduleId}_exercicios_${empresaId}`;
  const [blocoAtivo, setBlocoAtivo] = useState(0);
  const [respostas, setRespostas] = useState({}); // { "b0_q0": idx }
  const [notas, setNotas] = useState({}); // { "b0": 7 }
  const [corrigido, setCorrigido] = useState({});
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    (async () => {
      const r = await window.storage.get(chave, true).catch(() => null);
      if (r) {
        const dados = JSON.parse(r.value);
        setRespostas(dados.respostas || {});
        setNotas(dados.notas || {});
        setCorrigido(dados.corrigido || {});
      }
      setCarregado(true);
    })();
  }, [chave]);

  const salvar = async (novoRespostas, novoNotas, novoCorrigido) => {
    await window.storage.set(chave, JSON.stringify({ respostas: novoRespostas, notas: novoNotas, corrigido: novoCorrigido }), true);
  };

  const escolher = (bIdx, qIdx, opIdx) => {
    if (corrigido[`b${bIdx}`]) return;
    const nova = { ...respostas, [`b${bIdx}_q${qIdx}`]: opIdx };
    setRespostas(nova);
    salvar(nova, notas, corrigido);
  };

  const corrigir = (bIdx) => {
    const bloco = blocos[bIdx];
    let acertos = 0;
    bloco.questoes.forEach((q, qIdx) => {
      if (respostas[`b${bIdx}_q${qIdx}`] === q.correta) acertos++;
    });
    const novoNotas = { ...notas, [`b${bIdx}`]: acertos };
    const novoCorrigido = { ...corrigido, [`b${bIdx}`]: true };
    setNotas(novoNotas); setCorrigido(novoCorrigido);
    salvar(respostas, novoNotas, novoCorrigido);
  };

  if (!carregado) return <p className="text-sm text-inksoft">Carregando…</p>;

  const bloco = blocos[blocoAtivo];
  const respondidasNoBloco = bloco.questoes.filter((_, qIdx) => respostas[`b${blocoAtivo}_q${qIdx}`] !== undefined).length;
  const jaCorrigido = corrigido[`b${blocoAtivo}`];

  return (
    <div>
      <div className="flex gap-2 flex-wrap mb-4">
        {blocos.map((b, i) => (
          <button key={i} onClick={() => setBlocoAtivo(i)}
            className={`text-xs px-3 py-1.5 rounded-sm border ${blocoAtivo === i ? "border-ledger bg-ledgersoft text-ledger" : "border-paperline text-inksoft"}`}>
            {b.titulo} {corrigido[`b${i}`] !== undefined && corrigido[`b${i}`] ? `— ${notas[`b${i}`]}/10` : ""}
          </button>
        ))}
      </div>

      <Card>
        <strong className="block mb-1">{bloco.titulo}</strong>
        <p className="text-xs text-inksoft mb-4">{respondidasNoBloco}/10 respondidas{jaCorrigido && ` · Nota: ${notas[`b${blocoAtivo}`]}/10`}</p>

        {bloco.questoes.map((q, qIdx) => {
          const respondida = respostas[`b${blocoAtivo}_q${qIdx}`];
          return (
            <div key={qIdx} className="border-t border-paperline py-3">
              <p className="text-sm mb-2"><strong>{qIdx + 1}.</strong> {q.pergunta}</p>
              <div className="space-y-1">
                {q.opcoes.map((op, opIdx) => {
                  let estilo = "border-paperline";
                  if (jaCorrigido) {
                    if (opIdx === q.correta) estilo = "border-ledger bg-ledgersoft";
                    else if (opIdx === respondida) estilo = "border-alert";
                  } else if (opIdx === respondida) {
                    estilo = "border-ledger bg-ledgersoft";
                  }
                  return (
                    <button key={opIdx} onClick={() => escolher(blocoAtivo, qIdx, opIdx)} disabled={jaCorrigido}
                      className={`w-full text-left text-sm px-3 py-1.5 rounded-sm border ${estilo} disabled:cursor-default`}>
                      {op}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        <div className="pt-3">
          <Botao onClick={() => corrigir(blocoAtivo)} disabled={jaCorrigido || respondidasNoBloco < 10}>
            {jaCorrigido ? `Corrigido — nota ${notas[`b${blocoAtivo}`]}/10` : "Corrigir exercício"}
          </Botao>
          {!jaCorrigido && respondidasNoBloco < 10 && <span className="text-xs text-inksoft ml-3">Responda todas as 10 questões para corrigir.</span>}
        </div>
      </Card>
    </div>
  );
}
