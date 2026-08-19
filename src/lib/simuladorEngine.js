// ============================================================================
// Motor genérico de simulador de lançamentos (partidas dobradas), em React.
// Equivalente ao motor vanilla (registrarSimulador/renderSimulador) do
// protótipo aprovado, mas com o estado de lançamentos persistido no
// Firestore, isolado por empresa (empresaId) em vez de localStorage global.
// ============================================================================
import { useState, useEffect, useCallback } from "react";

export function fmt(v) {
  return (Number.isFinite(v) ? v : 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function novaLinha(tipo) { return { conta: "", tipo, valor: "" }; }

// empresaId + moduleId identificam de forma única os lançamentos de um aluno
// num módulo. Os dados ficam em ci_dados/{moduleId}_lancamentos_{empresaId}.
export function useSimulador(empresaId, moduleId, contas) {
  const chave = `${moduleId}_lancamentos_${empresaId}`;
  const [lancamentos, setLancamentos] = useState(null);
  const [draft, setDraft] = useState({});

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await window.storage.get(chave, true);
        if (alive) setLancamentos(r ? JSON.parse(r.value) : []);
      } catch {
        if (alive) setLancamentos([]);
      }
    })();
    return () => { alive = false; };
  }, [chave]);

  const draftDoEvento = useCallback((eventoId) => {
    return draft[eventoId] || [novaLinha("D"), novaLinha("C")];
  }, [draft]);

  const atualizarLinha = (eventoId, idx, campo, valor) => {
    setDraft((d) => {
      const linhas = [...(d[eventoId] || [novaLinha("D"), novaLinha("C")])];
      linhas[idx] = { ...linhas[idx], [campo]: valor };
      return { ...d, [eventoId]: linhas };
    });
  };

  const adicionarLinha = (eventoId, tipo) => {
    setDraft((d) => {
      const linhas = [...(d[eventoId] || [novaLinha("D"), novaLinha("C")]), novaLinha(tipo)];
      return { ...d, [eventoId]: linhas };
    });
  };

  const removerLinha = (eventoId, idx) => {
    setDraft((d) => {
      let linhas = [...(d[eventoId] || [novaLinha("D"), novaLinha("C")])];
      linhas.splice(idx, 1);
      if (linhas.length === 0) linhas = [novaLinha("D"), novaLinha("C")];
      return { ...d, [eventoId]: linhas };
    });
  };

  const totaisDoEvento = (eventoId) => {
    const linhas = draftDoEvento(eventoId);
    let d = 0, c = 0;
    linhas.forEach((l) => {
      const v = parseFloat((l.valor + "").replace(",", ".")) || 0;
      if (l.tipo === "D") d += v; else c += v;
    });
    return { debito: d, credito: c };
  };

  const lancar = async (eventoId) => {
    const totais = totaisDoEvento(eventoId);
    if (totais.debito !== totais.credito || totais.debito === 0) return;
    const linhas = draftDoEvento(eventoId).filter((l) => l.conta && l.valor);
    const novo = [...(lancamentos || []), { eventoId, linhas, timestamp: Date.now() }];
    setLancamentos(novo);
    setDraft((d) => ({ ...d, [eventoId]: [novaLinha("D"), novaLinha("C")] }));
    await window.storage.set(chave, JSON.stringify(novo), true);
  };

  const historicoDoEvento = (eventoId) => (lancamentos || []).filter((l) => l.eventoId === eventoId);

  const saldoConta = (nomeConta) => {
    let d = 0, c = 0;
    (lancamentos || []).forEach((l) => l.linhas.forEach((li) => {
      if (li.conta === nomeConta) {
        const v = parseFloat((li.valor + "").replace(",", ".")) || 0;
        if (li.tipo === "D") d += v; else c += v;
      }
    }));
    return { debito: d, credito: c };
  };

  const saldoAcumulado = () => {
    return contas.map((c) => {
      const s = saldoConta(c.nome);
      const liquido = s.debito - s.credito;
      return { ...c, debito: s.debito, credito: s.credito, liquido };
    }).filter((c) => c.debito !== 0 || c.credito !== 0);
  };

  return {
    carregando: lancamentos === null,
    draftDoEvento, atualizarLinha, adicionarLinha, removerLinha,
    totaisDoEvento, lancar, historicoDoEvento, saldoConta, saldoAcumulado,
  };
}
