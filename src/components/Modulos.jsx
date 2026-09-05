import React, { useEffect, useState } from "react";
import { PLANO_CONTAS_OFICIAL, NOME_GRUPO, nivelDoCodigo, grupoDoCodigo } from "../data/planoContas";
import {
  CREDITOS_M7, M8_PERCENTUAIS_PADRAO, M9_DADOS_PADRAO,
  EVENTOS_M2,
} from "../data/moduleData";
import { calcularDRECompleta, calcularDLPA, calcularProvisaoPECLD, tabelaDepreciacaoLinear } from "../lib/calculosFinanceiros";
import { fmt } from "../lib/simuladorEngine";
import { Card, Botao } from "./ModuloUI";

// ============================================================================
// Módulo 3.0 — Consulta ao Plano de Contas (pesquisável/filtrável)
// ============================================================================
export function ConsultaPlanoContas() {
  const [busca, setBusca] = useState("");
  const [grupo, setGrupo] = useState("");

  const linhas = PLANO_CONTAS_OFICIAL.filter((c) => {
    const bateBusca = !busca || c.nome.toLowerCase().includes(busca.toLowerCase()) || c.codigo.includes(busca);
    const bateGrupo = !grupo || grupoDoCodigo(c.codigo) === grupo;
    return bateBusca && bateGrupo;
  });

  return (
    <Card>
      <div className="flex gap-2 flex-wrap mb-4">
        <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar por nome ou código..."
          className="flex-[2] min-w-[220px] border border-paperline rounded-sm px-3 py-2 text-sm" />
        <select value={grupo} onChange={(e) => setGrupo(e.target.value)} className="flex-1 min-w-[180px] border border-paperline rounded-sm px-3 py-2 text-sm">
          <option value="">Todos os grupos</option>
          {Object.keys(NOME_GRUPO).map((g) => <option key={g} value={g}>{g} — {NOME_GRUPO[g]}</option>)}
        </select>
      </div>
      <table className="w-full text-sm">
        <thead><tr className="text-left text-xs text-inksoft uppercase"><th className="w-28">Código</th><th>Conta</th><th className="w-28">Tipo</th></tr></thead>
        <tbody>
          {linhas.map((c) => {
            const nivel = nivelDoCodigo(c.codigo);
            const indent = (nivel - 1) * 16;
            const isAnalitica = nivel >= 4;
            const cor = c.redutora ? "text-alert" : isAnalitica ? "text-ink" : "text-inksoft";
            return (
              <tr key={c.codigo} className="border-t border-paperline">
                <td className="font-mono text-xs text-inksoft py-1">{c.codigo}</td>
                <td style={{ paddingLeft: indent + 10 }} className={`${nivel <= 3 ? "font-semibold" : ""} ${cor}`}>
                  {c.nome}
                  {c.obs && <span title={c.obs} className="ml-2 text-[11px] border border-ledger text-ledger rounded-full px-1.5 cursor-help">i</span>}
                  {c.adicionada && <span className="ml-2 text-[10px] border border-debit text-debit rounded-full px-1.5">incluída</span>}
                </td>
                <td className="text-xs text-inksoft">{isAnalitica ? "Analítica" : nivel === 3 ? "Sintética" : "Agrupamento"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}

// ============================================================================
// Módulo 6.0 — Calculadora de Depreciação (por bem, persistida por empresa)
// ============================================================================
export function CalculadoraDepreciacao({ empresaId }) {
  const chave = `m6_bens_${empresaId}`;
  const [bens, setBens] = useState(null);
  const [nome, setNome] = useState(""); const [valor, setValor] = useState(""); const [residual, setResidual] = useState(""); const [vidaUtil, setVidaUtil] = useState("");

  useEffect(() => {
    (async () => {
      const r = await window.storage.get(chave, true).catch(() => null);
      setBens(r ? JSON.parse(r.value) : []);
    })();
  }, [chave]);

  const salvar = async (novos) => { setBens(novos); await window.storage.set(chave, JSON.stringify(novos), true); };

  const adicionar = () => {
    const v = parseFloat(valor.replace(",", ".")) || 0;
    const r = parseFloat(residual.replace(",", ".")) || 0;
    const vu = parseInt(vidaUtil) || 0;
    if (!nome.trim() || v <= 0 || vu <= 0) return;
    salvar([...(bens || []), { nome: nome.trim(), valor: v, residual: r, vidaUtil: vu }]);
    setNome(""); setValor(""); setResidual(""); setVidaUtil("");
  };

  const remover = (idx) => { const novos = [...bens]; novos.splice(idx, 1); salvar(novos); };

  if (bens === null) return <p className="text-sm text-inksoft">Carregando…</p>;

  return (
    <div>
      <Card>
        <strong className="block mb-3">Novo bem — método linear</strong>
        <div className="flex gap-2 flex-wrap">
          <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome do bem" className="flex-[2] min-w-[160px] border border-paperline rounded-sm px-3 py-2 text-sm" />
          <input value={valor} onChange={(e) => setValor(e.target.value)} placeholder="Valor (R$)" inputMode="decimal" className="flex-1 min-w-[110px] border border-paperline rounded-sm px-3 py-2 text-sm" />
          <input value={residual} onChange={(e) => setResidual(e.target.value)} placeholder="Valor residual (R$)" inputMode="decimal" className="flex-1 min-w-[130px] border border-paperline rounded-sm px-3 py-2 text-sm" />
          <input value={vidaUtil} onChange={(e) => setVidaUtil(e.target.value)} placeholder="Vida útil (anos)" inputMode="numeric" className="flex-1 min-w-[120px] border border-paperline rounded-sm px-3 py-2 text-sm" />
        </div>
        <div className="mt-3"><Botao onClick={adicionar}>Calcular e salvar tabela</Botao></div>
      </Card>

      {bens.length === 0 ? (
        <Card><p className="text-sm text-inksoft">Nenhum bem calculado ainda.</p></Card>
      ) : bens.map((b, idx) => {
        const linhas = tabelaDepreciacaoLinear(b.valor, b.residual, b.vidaUtil);
        return (
          <Card key={idx}>
            <div className="flex justify-between items-baseline">
              <strong>{b.nome}</strong>
              <button onClick={() => remover(idx)} className="text-xs border border-paperline rounded-sm px-2 py-1 text-inksoft">Remover</button>
            </div>
            <p className="text-xs text-inksoft my-2">
              Valor: R$ {fmt(b.valor)} · Residual: R$ {fmt(b.residual)} · Vida útil: {b.vidaUtil} anos · Cota anual: R$ {fmt(linhas[0]?.cota || 0)}
            </p>
            <table className="w-full text-sm">
              <thead><tr className="text-left text-xs text-inksoft uppercase"><th>Ano</th><th>Depreciação do ano</th><th>Acumulada</th><th>Valor líquido</th></tr></thead>
              <tbody>{linhas.map((l) => (
                <tr key={l.ano} className="border-t border-paperline"><td>{l.ano}</td><td>R$ {fmt(l.cota)}</td><td>R$ {fmt(l.acumulada)}</td><td>R$ {fmt(l.liquido)}</td></tr>
              ))}</tbody>
            </table>
          </Card>
        );
      })}
    </div>
  );
}

// ============================================================================
// Módulo 8.0 — Calculadora de Provisão PECLD
// ============================================================================
export function CalculadoraProvisao({ empresaId }) {
  const chave = `m8_percentuais_${empresaId}`;
  const [pct, setPct] = useState(null);

  useEffect(() => {
    (async () => {
      const r = await window.storage.get(chave, true).catch(() => null);
      setPct(r ? JSON.parse(r.value) : { ...M8_PERCENTUAIS_PADRAO });
    })();
  }, [chave]);

  const atualizar = async (faixa, valor) => {
    const novo = { ...pct, [faixa]: parseFloat(valor) || 0 };
    setPct(novo);
    await window.storage.set(chave, JSON.stringify(novo), true);
  };

  if (pct === null) return <p className="text-sm text-inksoft">Carregando…</p>;

  const { linhas, total } = calcularProvisaoPECLD(CREDITOS_M7, pct);

  return (
    <div>
      <Card>
        <strong className="block mb-3">Percentual de perda estimada por faixa de atraso</strong>
        <div className="flex gap-4 flex-wrap">
          {Object.keys(pct).map((faixa) => (
            <div key={faixa} className="min-w-[140px]">
              <label className="text-xs text-inksoft block mb-1">{faixa}</label>
              <input value={pct[faixa]} onChange={(e) => atualizar(faixa, e.target.value)} inputMode="numeric"
                className="w-[70px] border border-paperline rounded-sm px-2 py-1.5 text-sm" /> %
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <strong className="block mb-3">Cálculo da provisão — clientes do Módulo 7.0</strong>
        <table className="w-full text-sm">
          <thead><tr className="text-left text-xs text-inksoft uppercase"><th>Cliente</th><th>Valor</th><th>Faixa</th><th>% aplicado</th><th>Provisão</th></tr></thead>
          <tbody>{linhas.map((l) => (
            <tr key={l.cliente} className="border-t border-paperline"><td className="py-1">{l.cliente}</td><td>R$ {fmt(l.valor)}</td><td>{l.faixa}</td><td>{l.pct}%</td><td>R$ {fmt(l.provisao)}</td></tr>
          ))}</tbody>
        </table>
        <p className="text-sm mt-3"><strong>Provisão total a constituir: R$ {fmt(total)}</strong></p>
        <p className="text-xs text-inksoft">Use esse valor na aba Lançamentos para registrar a constituição da PECLD.</p>
      </Card>
    </div>
  );
}

// ============================================================================
// Módulo 5.0 — DRE (montagem automática a partir dos módulos 4.0 e 6.0)
// ============================================================================
// ============================================================================
// Visualização da DRE completa — reaproveitada nos Módulos 5.0 e 11.0.
// Mostra todas as contas de cada grupo, mesmo com saldo zero; a opção
// "Simplificar DRE" oculta as linhas zeradas.
// ============================================================================
export function VisualizacaoDRE({ dre }) {
  const [simplificar, setSimplificar] = useState(false);

  return (
    <Card>
      <div className="flex justify-between items-center mb-3">
        <strong>Demonstração do Resultado do Exercício</strong>
        <label className="flex items-center gap-2 text-xs text-inksoft">
          <input type="checkbox" checked={simplificar} onChange={(e) => setSimplificar(e.target.checked)} />
          Simplificar DRE
        </label>
      </div>
      <table className="w-full text-sm">
        <tbody>
          {dre.grupos.map((g, i) => {
            if (g.subtotal) {
              return (
                <tr key={i} className="border-t border-paperline">
                  <td className="py-1.5"><strong>{g.subtotal}</strong></td>
                  <td className={`text-right ${g.valor < 0 ? "text-alert" : ""}`}><strong>R$ {fmt(g.valor)}</strong></td>
                </tr>
              );
            }
            const linhasVisiveis = simplificar ? g.linhas.filter((l) => l.saldo !== 0) : g.linhas;
            if (simplificar && linhasVisiveis.length === 0) return null;
            return (
              <React.Fragment key={i}>
                <tr className="border-t border-paperline"><td colSpan={2} className="pt-2 pb-0.5 text-xs uppercase tracking-wide text-inksoft">{g.titulo}</td></tr>
                {linhasVisiveis.map((l) => (
                  <tr key={l.codigo}>
                    <td className="pl-4 text-inksoft">{l.codigo} — {l.nome}</td>
                    <td className="text-right">R$ {fmt(l.saldo)}</td>
                  </tr>
                ))}
                <tr><td className="pl-4 text-xs text-inksoft">Subtotal</td><td className="text-right text-xs text-inksoft">R$ {fmt(g.total)}</td></tr>
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}

export function MontagemDRE({ empresaId }) {
  const [dre, setDre] = useState(null);
  useEffect(() => { calcularDRECompleta(empresaId).then(setDre); }, [empresaId]);
  if (!dre) return <p className="text-sm text-inksoft">Carregando…</p>;
  const semDados = dre.totalReceitaBruta === 0;
  return (
    <div>
      {semDados && (
        <Card><p className="text-sm text-inksoft">Nenhum dado encontrado ainda. Volte ao Módulo 4.0 e lance os eventos de venda para ver a DRE ser montada automaticamente aqui.</p></Card>
      )}
      <VisualizacaoDRE dre={dre} />
      {!semDados && (
        <div className="text-xs text-inksoft bg-ledgersoft border-l-2 border-ledger px-3 py-2">
          <strong>Analise o resultado acima.</strong> Os valores fazem sentido para a operação da Nova Aurora?
          Se algum número parecer incorreto ou incompleto, volte aos módulos de lançamento (4.0, 6.0, 8.0 ou
          10.0) para corrigir ou completar os lançamentos — a DRE aqui é recalculada automaticamente a cada
          alteração.
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Módulo 9.0 — DLPA (encadeada a partir da DRE)
// ============================================================================
export function MontagemDLPA({ empresaId }) {
  const chave = `m9_dlpa_${empresaId}`;
  const [params, setParams] = useState(null);
  const [dlpa, setDlpa] = useState(null);

  useEffect(() => {
    (async () => {
      const r = await window.storage.get(chave, true).catch(() => null);
      setParams(r ? JSON.parse(r.value) : { ...M9_DADOS_PADRAO });
    })();
  }, [chave]);

  useEffect(() => {
    if (params) calcularDLPA(empresaId, params).then(setDlpa);
  }, [params, empresaId]);

  const atualizar = async (campo, valor) => {
    const novo = { ...params, [campo]: parseFloat((valor + "").replace(",", ".")) || 0 };
    setParams(novo);
    await window.storage.set(chave, JSON.stringify(novo), true);
  };

  if (!params || !dlpa) return <p className="text-sm text-inksoft">Carregando…</p>;

  return (
    <div>
      <Card>
        <strong className="block mb-3">Parâmetros</strong>
        <p className="text-xs text-inksoft mb-3">
          Analise as etapas anteriores (Módulo 5.0 — Lucro Líquido do Exercício) e preencha os parâmetros abaixo
          para montar a DLPA da empresa.
        </p>
        <div className="flex gap-4 flex-wrap">
          <div><label className="text-xs text-inksoft block mb-1">Saldo inicial de Lucros Acumulados (R$)</label>
            <input value={params.saldoInicial} onChange={(e) => atualizar("saldoInicial", e.target.value)} className="w-[140px] border border-paperline rounded-sm px-2 py-1.5 text-sm" /></div>
          <div><label className="text-xs text-inksoft block mb-1">% Reserva Legal</label>
            <input value={params.pctReservaLegal} onChange={(e) => atualizar("pctReservaLegal", e.target.value)} className="w-[70px] border border-paperline rounded-sm px-2 py-1.5 text-sm" /></div>
          <div><label className="text-xs text-inksoft block mb-1">% Dividendos Propostos</label>
            <input value={params.pctDividendos} onChange={(e) => atualizar("pctDividendos", e.target.value)} className="w-[70px] border border-paperline rounded-sm px-2 py-1.5 text-sm" /></div>
        </div>
      </Card>
      <Card>
        <strong className="block mb-3">DLPA</strong>
        <table className="w-full text-sm">
          <tbody>
            <tr><td>Saldo inicial de Lucros Acumulados</td><td>R$ {fmt(params.saldoInicial)}</td></tr>
            <tr><td>(+) Lucro Líquido do Exercício (da DRE — Módulo 5.0)</td><td>R$ {fmt(dlpa.lucroLiquido)}</td></tr>
            <tr><td>(-) Constituição de Reserva Legal</td><td>R$ {fmt(dlpa.reservaLegal)}</td></tr>
            <tr><td>(-) Dividendos Propostos</td><td>R$ {fmt(dlpa.dividendos)}</td></tr>
            <tr className="border-t border-paperline"><td><strong>= Saldo Final de Lucros Acumulados</strong></td><td><strong>R$ {fmt(dlpa.saldoFinal)}</strong></td></tr>
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ============================================================================
// Módulo 2.0 — Exercício de classificação (Regime de Caixa x Competência)
// ============================================================================
export function ExercicioRegimes() {
  const [selecoes, setSelecoes] = useState({});
  const [revelados, setRevelados] = useState({});

  return (
    <Card>
      <strong className="block mb-3">Classifique cada evento</strong>
      <p className="text-xs text-inksoft mb-3">Escolha o regime antes de revelar a resposta.</p>
      {EVENTOS_M2.map((ev) => {
        const escolha = selecoes[ev.id] || "";
        const revelado = revelados[ev.id];
        const acertou = escolha === ev.resposta;
        return (
          <div key={ev.id} className="border-t border-paperline py-3">
            <p className="text-sm mb-2">{ev.evento}</p>
            <select value={escolha} onChange={(e) => setSelecoes((s) => ({ ...s, [ev.id]: e.target.value }))} className="border border-paperline rounded-sm px-2 py-1.5 text-sm mr-2">
              <option value="">Selecione...</option>
              <option>Caixa</option><option>Competência</option><option>Nenhum dos dois</option>
            </select>
            <button onClick={() => setRevelados((r) => ({ ...r, [ev.id]: true }))} className="text-xs border border-ledger text-ledger rounded-sm px-3 py-1.5">Ver resposta</button>
            {revelado && (
              <div className="text-sm text-inksoft mt-2 bg-ledgersoft border-l-2 border-ledger px-3 py-2">
                {escolha ? (acertou ? <strong className="text-ledger">✓ Correto. </strong> : <strong className="text-alert">✗ Resposta correta: {ev.resposta}. </strong>) : <strong>Resposta correta: {ev.resposta}. </strong>}
                {ev.explicacao}
              </div>
            )}
          </div>
        );
      })}
    </Card>
  );
}
