import React, { useEffect, useState } from "react";
import { PLANO_CONTAS_OFICIAL } from "../data/planoContas";
import { todosLancamentosDaEmpresa, calcularDRECompleta, calcularBalancoPatrimonial } from "../lib/calculosFinanceiros";
import { fmt } from "../lib/simuladorEngine";
import { imprimirComoPdf } from "../lib/imprimir";
import { Card, Botao } from "./ModuloUI";
import { VisualizacaoDRE } from "./Modulos";

const NOME_MODULO = { m4: "4.0 — Operações com Mercadorias", m6: "6.0 — Ativo Imobilizado", m8: "8.0 — PECLD", m10: "10.0 — Operações Financeiras" };

function valorLinha(li) { return parseFloat((li.valor + "").replace(",", ".")) || 0; }

function tabelaParaHtml(titulo, colunas, linhas) {
  return `
    <h1>${titulo}</h1>
    <table>
      <thead><tr>${colunas.map((c) => `<th>${c}</th>`).join("")}</tr></thead>
      <tbody>${linhas.map((l) => `<tr>${l.map((v) => `<td>${v}</td>`).join("")}</tr>`).join("")}</tbody>
    </table>
  `;
}

// ============================================================================
// Livro Diário — todos os lançamentos, em ordem cronológica.
// ============================================================================
function LivroDiario({ empresaId }) {
  const [todos, setTodos] = useState(null);
  useEffect(() => { todosLancamentosDaEmpresa(empresaId).then(setTodos); }, [empresaId]);
  if (!todos) return <p className="text-sm text-inksoft">Carregando…</p>;

  const ordenados = [...todos].sort((a, b) => a.timestamp - b.timestamp);
  const imprimir = () => {
    const linhas = [];
    ordenados.forEach((l) => l.linhas.forEach((li) => {
      linhas.push([new Date(l.timestamp).toLocaleDateString("pt-BR"), NOME_MODULO[l._modulo], li.tipo, li.conta, `R$ ${fmt(valorLinha(li))}`]);
    }));
    imprimirComoPdf("Livro Diário", tabelaParaHtml("Livro Diário", ["Data", "Módulo", "D/C", "Conta", "Valor"], linhas));
  };
  return (
    <Card>
      <div className="flex justify-between items-center mb-3">
        <strong>Livro Diário</strong>
        <Botao secondary onClick={imprimir}>Imprimir / Salvar</Botao>
      </div>
      {ordenados.length === 0 ? <p className="text-sm text-inksoft">Nenhum lançamento registrado ainda.</p> : (
        <div className="space-y-3">
          {ordenados.map((l, i) => (
            <div key={i} className="border-t border-paperline pt-2">
              <div className="text-xs text-inksoft mb-1">{new Date(l.timestamp).toLocaleString("pt-BR")} · Módulo {NOME_MODULO[l._modulo]}</div>
              {l.linhas.map((li, j) => (
                <div key={j} className="text-sm pl-3">{li.tipo === "D" ? "Débito" : "Crédito"}: {li.conta} — R$ {fmt(valorLinha(li))}</div>
              ))}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

// ============================================================================
// Livro Razão — por conta, cada movimento e saldo acumulado (razonete).
// ============================================================================
function LivroRazao({ empresaId }) {
  const [todos, setTodos] = useState(null);
  const [contaSelecionada, setContaSelecionada] = useState("");
  useEffect(() => { todosLancamentosDaEmpresa(empresaId).then(setTodos); }, [empresaId]);
  if (!todos) return <p className="text-sm text-inksoft">Carregando…</p>;

  const nomesUsados = [...new Set(todos.flatMap((l) => l.linhas.map((li) => li.conta)))].sort();

  const movimentos = (nome) => {
    const eventos = [];
    todos.forEach((l) => l.linhas.forEach((li) => {
      if (li.conta === nome) eventos.push({ timestamp: l.timestamp, modulo: l._modulo, tipo: li.tipo, valor: valorLinha(li) });
    }));
    eventos.sort((a, b) => a.timestamp - b.timestamp);
    let saldo = 0;
    return eventos.map((e) => {
      saldo += e.tipo === "D" ? e.valor : -e.valor;
      return { ...e, saldoAcumulado: saldo };
    });
  };

  const imprimir = () => {
    if (!contaSelecionada) return;
    const linhas = movimentos(contaSelecionada).map((m) => [
      new Date(m.timestamp).toLocaleDateString("pt-BR"), NOME_MODULO[m.modulo], m.tipo, `R$ ${fmt(m.valor)}`, `R$ ${fmt(m.saldoAcumulado)}`,
    ]);
    imprimirComoPdf(`Livro Razão — ${contaSelecionada}`, tabelaParaHtml(`Livro Razão — ${contaSelecionada}`, ["Data", "Módulo", "D/C", "Valor", "Saldo"], linhas));
  };

  return (
    <Card>
      <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
        <strong>Livro Razão</strong>
        <div className="flex gap-2">
          <select value={contaSelecionada} onChange={(e) => setContaSelecionada(e.target.value)} className="border border-paperline rounded-sm px-3 py-2 text-sm">
            <option value="">Selecione uma conta...</option>
            {nomesUsados.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
          <Botao secondary onClick={imprimir} disabled={!contaSelecionada}>Imprimir / Salvar</Botao>
        </div>
      </div>
      {!contaSelecionada ? (
        <p className="text-sm text-inksoft">Selecione uma conta para ver os lançamentos e o saldo acumulado.</p>
      ) : (
        <table className="w-full text-sm">
          <thead><tr className="text-left text-xs text-inksoft uppercase"><th>Data</th><th>Módulo</th><th>D/C</th><th>Valor</th><th>Saldo</th></tr></thead>
          <tbody>
            {movimentos(contaSelecionada).map((m, i) => (
              <tr key={i} className="border-t border-paperline">
                <td className="py-1">{new Date(m.timestamp).toLocaleDateString("pt-BR")}</td>
                <td>{NOME_MODULO[m.modulo]}</td>
                <td>{m.tipo === "D" ? "Débito" : "Crédito"}</td>
                <td>R$ {fmt(m.valor)}</td>
                <td><strong>R$ {fmt(Math.abs(m.saldoAcumulado))} {m.saldoAcumulado >= 0 ? "(D)" : "(C)"}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Card>
  );
}

// ============================================================================
// Balancete — todas as contas com movimento, débito/crédito acumulados e saldo.
// ============================================================================
function calcularBalancete(todos) {
  const porConta = {};
  todos.forEach((l) => l.linhas.forEach((li) => {
    if (!porConta[li.conta]) porConta[li.conta] = { debito: 0, credito: 0 };
    const v = valorLinha(li);
    if (li.tipo === "D") porConta[li.conta].debito += v; else porConta[li.conta].credito += v;
  }));
  return Object.entries(porConta).map(([nome, { debito, credito }]) => {
    const info = PLANO_CONTAS_OFICIAL.find((c) => c.nome === nome) || { codigo: "—", nome };
    const saldo = debito - credito;
    return { ...info, debito, credito, saldo };
  }).sort((a, b) => a.codigo.localeCompare(b.codigo));
}

function Balancete({ empresaId }) {
  const [todos, setTodos] = useState(null);
  useEffect(() => { todosLancamentosDaEmpresa(empresaId).then(setTodos); }, [empresaId]);
  if (!todos) return <p className="text-sm text-inksoft">Carregando…</p>;

  const linhas = calcularBalancete(todos);
  const totalDebito = linhas.reduce((s, l) => s + l.debito, 0);
  const totalCredito = linhas.reduce((s, l) => s + l.credito, 0);

  const imprimir = () => {
    const dados = linhas.map((l) => [l.codigo, l.nome, `R$ ${fmt(l.debito)}`, `R$ ${fmt(l.credito)}`, `R$ ${fmt(Math.abs(l.saldo))} ${l.saldo >= 0 ? "(D)" : "(C)"}`]);
    imprimirComoPdf("Balancete", tabelaParaHtml("Balancete", ["Código", "Conta", "Débitos", "Créditos", "Saldo"], dados));
  };

  return (
    <Card>
      <div className="flex justify-between items-center mb-3">
        <strong>Balancete</strong>
        <Botao secondary onClick={imprimir}>Imprimir / Salvar</Botao>
      </div>
      {linhas.length === 0 ? <p className="text-sm text-inksoft">Nenhuma conta com movimento ainda.</p> : (
        <table className="w-full text-sm">
          <thead><tr className="text-left text-xs text-inksoft uppercase"><th>Código</th><th>Conta</th><th>Débitos</th><th>Créditos</th><th>Saldo</th></tr></thead>
          <tbody>
            {linhas.map((l) => (
              <tr key={l.nome} className="border-t border-paperline">
                <td className="font-mono text-xs text-inksoft py-1">{l.codigo}</td>
                <td>{l.nome}</td><td>R$ {fmt(l.debito)}</td><td>R$ {fmt(l.credito)}</td>
                <td><strong>R$ {fmt(Math.abs(l.saldo))} {l.saldo >= 0 ? "(D)" : "(C)"}</strong></td>
              </tr>
            ))}
            <tr className="border-t-2 border-ink"><td colSpan={2}><strong>Totais</strong></td><td><strong>R$ {fmt(totalDebito)}</strong></td><td><strong>R$ {fmt(totalCredito)}</strong></td><td></td></tr>
          </tbody>
        </table>
      )}
    </Card>
  );
}

// ============================================================================
// Posição de Estoques
// ============================================================================
function PosicaoEstoques({ empresaId }) {
  const [todos, setTodos] = useState(null);
  useEffect(() => { todosLancamentosDaEmpresa(empresaId).then(setTodos); }, [empresaId]);
  if (!todos) return <p className="text-sm text-inksoft">Carregando…</p>;

  const movimentos = [];
  todos.forEach((l) => l.linhas.forEach((li) => {
    if (li.conta === "Mercadorias para Revenda") movimentos.push({ timestamp: l.timestamp, tipo: li.tipo, valor: valorLinha(li) });
  }));
  const totalEntradas = movimentos.filter((m) => m.tipo === "D").reduce((s, m) => s + m.valor, 0);
  const totalSaidas = movimentos.filter((m) => m.tipo === "C").reduce((s, m) => s + m.valor, 0);
  const saldo = totalEntradas - totalSaidas;

  return (
    <Card>
      <strong className="block mb-3">Posição de Estoques — Mercadorias para Revenda</strong>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
        <div className="border border-paperline rounded-sm p-3"><div className="text-xs text-inksoft">Entradas (compras)</div><div className="font-serif text-lg">R$ {fmt(totalEntradas)}</div></div>
        <div className="border border-paperline rounded-sm p-3"><div className="text-xs text-inksoft">Saídas (CMV/devoluções)</div><div className="font-serif text-lg">R$ {fmt(totalSaidas)}</div></div>
        <div className="border border-paperline rounded-sm p-3"><div className="text-xs text-inksoft">Saldo em estoque</div><div className="font-serif text-lg">R$ {fmt(saldo)}</div></div>
      </div>
      <p className="text-xs text-inksoft">Baseado nos lançamentos do Módulo 4.0 (Operações com Mercadorias).</p>
    </Card>
  );
}

// ============================================================================
// Operações Financeiras — resumo dos lançamentos do Módulo 10.0
// ============================================================================
function OperacoesFinanceirasResumo({ empresaId }) {
  const [todos, setTodos] = useState(null);
  useEffect(() => { todosLancamentosDaEmpresa(empresaId).then(setTodos); }, [empresaId]);
  if (!todos) return <p className="text-sm text-inksoft">Carregando…</p>;

  const doMod = todos.filter((l) => l._modulo === "m10");
  const linhas = calcularBalancete(doMod);
  return (
    <Card>
      <strong className="block mb-3">Operações Financeiras — resumo do Módulo 10.0</strong>
      {linhas.length === 0 ? <p className="text-sm text-inksoft">Nenhum lançamento no Módulo 10.0 ainda.</p> : (
        <table className="w-full text-sm">
          <thead><tr className="text-left text-xs text-inksoft uppercase"><th>Conta</th><th>Débitos</th><th>Créditos</th><th>Saldo</th></tr></thead>
          <tbody>
            {linhas.map((l) => (
              <tr key={l.nome} className="border-t border-paperline">
                <td className="py-1">{l.nome}</td><td>R$ {fmt(l.debito)}</td><td>R$ {fmt(l.credito)}</td>
                <td><strong>R$ {fmt(Math.abs(l.saldo))} {l.saldo >= 0 ? "(D)" : "(C)"}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Card>
  );
}

// ============================================================================
// DRE — reaproveita o mesmo cálculo e visual do Módulo 5.0.
// ============================================================================
function DRETab({ empresaId }) {
  const [dre, setDre] = useState(null);
  useEffect(() => { calcularDRECompleta(empresaId).then(setDre); }, [empresaId]);
  if (!dre) return <p className="text-sm text-inksoft">Carregando…</p>;
  return <VisualizacaoDRE dre={dre} />;
}

// ============================================================================
// Balanço Patrimonial
// ============================================================================
function LinhasBP({ titulo, linhas, total }) {
  const visiveis = linhas.filter((l) => l.saldo !== 0);
  if (visiveis.length === 0) return null;
  return (
    <>
      <tr><td colSpan={2} className="pt-2 text-xs uppercase tracking-wide text-inksoft">{titulo}</td></tr>
      {visiveis.map((l) => (
        <tr key={l.codigo}><td className="pl-4 text-inksoft">{l.codigo} — {l.nome}</td><td className="text-right">R$ {fmt(l.saldo)}</td></tr>
      ))}
      <tr><td className="pl-4 text-xs text-inksoft">Subtotal</td><td className="text-right text-xs text-inksoft">R$ {fmt(total)}</td></tr>
    </>
  );
}

function BalancoPatrimonial({ empresaId }) {
  const [bp, setBp] = useState(null);
  useEffect(() => {
    calcularDRECompleta(empresaId).then((dre) => {
      calcularBalancoPatrimonial(empresaId, dre.lucroLiquido).then(setBp);
    });
  }, [empresaId]);
  if (!bp) return <p className="text-sm text-inksoft">Carregando…</p>;

  const imprimir = () => {
    const html = `
      <h1>Balanço Patrimonial</h1>
      <h2>Ativo</h2>
      <table><tbody>
        ${bp.ativoCirculante.concat(bp.ativoNaoCirculante).filter((l) => l.saldo !== 0).map((l) => `<tr><td>${l.codigo} — ${l.nome}</td><td>R$ ${fmt(l.saldo)}</td></tr>`).join("")}
        <tr class="subtotal"><td>Total do Ativo</td><td>R$ ${fmt(bp.totalAtivo)}</td></tr>
      </tbody></table>
      <h2>Passivo + Patrimônio Líquido</h2>
      <table><tbody>
        ${bp.passivoCirculante.concat(bp.passivoNaoCirculante).filter((l) => l.saldo !== 0).map((l) => `<tr><td>${l.codigo} — ${l.nome}</td><td>R$ ${fmt(l.saldo)}</td></tr>`).join("")}
        ${bp.patrimonioLiquido.filter((l) => l.saldo !== 0).map((l) => `<tr><td>${l.codigo} — ${l.nome}</td><td>R$ ${fmt(l.saldo)}</td></tr>`).join("")}
        <tr><td>Resultado do Exercício (apurado na DRE)</td><td>R$ ${fmt(bp.lucroLiquido)}</td></tr>
        <tr class="subtotal"><td>Total do Passivo + PL</td><td>R$ ${fmt(bp.totalPassivoMaisPL)}</td></tr>
      </tbody></table>
    `;
    imprimirComoPdf("Balanço Patrimonial", html);
  };

  return (
    <Card>
      <div className="flex justify-between items-center mb-3">
        <strong>Balanço Patrimonial</strong>
        <Botao secondary onClick={imprimir}>Imprimir / Salvar</Botao>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <strong className="text-sm block mb-2">Ativo</strong>
          <table className="w-full text-sm">
            <tbody>
              <LinhasBP titulo="Ativo Circulante" linhas={bp.ativoCirculante} total={bp.totalAtivoCirculante} />
              <LinhasBP titulo="Ativo Não Circulante" linhas={bp.ativoNaoCirculante} total={bp.totalAtivoNaoCirculante} />
              <tr className="border-t-2 border-ink"><td><strong>Total do Ativo</strong></td><td className="text-right"><strong>R$ {fmt(bp.totalAtivo)}</strong></td></tr>
            </tbody>
          </table>
        </div>
        <div>
          <strong className="text-sm block mb-2">Passivo + Patrimônio Líquido</strong>
          <table className="w-full text-sm">
            <tbody>
              <LinhasBP titulo="Passivo Circulante" linhas={bp.passivoCirculante} total={bp.totalPassivoCirculante} />
              <LinhasBP titulo="Passivo Não Circulante" linhas={bp.passivoNaoCirculante} total={bp.totalPassivoNaoCirculante} />
              <LinhasBP titulo="Patrimônio Líquido" linhas={bp.patrimonioLiquido} total={bp.patrimonioLiquido.reduce((s, l) => s + l.saldo, 0)} />
              <tr><td className="pl-4 text-inksoft">Resultado do Exercício (apurado na DRE)</td><td className="text-right">R$ {fmt(bp.lucroLiquido)}</td></tr>
              <tr className="border-t-2 border-ink"><td><strong>Total do Passivo + PL</strong></td><td className="text-right"><strong>R$ {fmt(bp.totalPassivoMaisPL)}</strong></td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-xs text-inksoft mt-4">
        O Resultado do Exercício é o Lucro (ou Prejuízo) Líquido apurado na aba DRE, somado automaticamente ao
        Patrimônio Líquido — sem isso, o Balanço não fecharia, já que os lançamentos de resultado (receitas e
        despesas) não têm uma conta própria no Balanço.
      </p>
      {Math.abs(bp.diferenca) > 0.01 && (
        <p className="text-xs text-alert mt-2">Atenção: o Balanço não está fechando (diferença de R$ {fmt(Math.abs(bp.diferenca))}). Confira se todos os lançamentos foram feitos corretamente.</p>
      )}
    </Card>
  );
}

// ============================================================================
// Módulo 11.0 — Relatórios (array de 7 painéis, na mesma ordem das abas)
// ============================================================================
export function paineisModulo11(empresaId) {
  return [
    <LivroDiario empresaId={empresaId} />,
    <LivroRazao empresaId={empresaId} />,
    <Balancete empresaId={empresaId} />,
    <PosicaoEstoques empresaId={empresaId} />,
    <OperacoesFinanceirasResumo empresaId={empresaId} />,
    <DRETab empresaId={empresaId} />,
    <BalancoPatrimonial empresaId={empresaId} />,
  ];
}
