// ============================================================================
// Cálculos financeiros encadeados (DRE → DLPA, provisão PECLD, depreciação),
// portados das funções calcularDREM5/calcularDLPAM9/calcularProvisaoM8/
// tabelaDepreciacaoLinear do protótipo vanilla aprovado — mesma lógica,
// agora lendo os lançamentos de uma empresa específica no Firestore.
// ============================================================================
import { PLANO_CONTAS_OFICIAL } from "../data/planoContas";
import { CONTAS_M4, CONTAS_M6, CONTAS_M8, CONTAS_M10 } from "../data/moduleData";

// Módulos que geram lançamentos reais na empresa do aluno.
const MODULOS_COM_LANCAMENTO = ["m4", "m6", "m8", "m10"];

// Contas que os simuladores da própria plataforma usam para lançamento —
// algumas (como "Bancos Conta Movimento") têm subcontas no plano oficial
// completo (Banco X/Banco Y), mas os módulos lançam direto nelas, sem usar
// essas subcontas. Por isso não dá para decidir "quem recebe lançamento"
// só pela posição na árvore do plano — essas contas entram na lista mesmo
// não sendo "folha".
const CONTAS_CURRICULARES = new Set(
  [...CONTAS_M4, ...CONTAS_M6, ...CONTAS_M8, ...CONTAS_M10].map((c) => c.nome)
);

async function todosLancamentosDaEmpresa(empresaId) {
  const todos = [];
  for (const moduleId of MODULOS_COM_LANCAMENTO) {
    const r = await window.storage.get(`${moduleId}_lancamentos_${empresaId}`, true).catch(() => null);
    if (r) todos.push(...JSON.parse(r.value).map((l) => ({ ...l, _modulo: moduleId })));
  }
  return todos;
}

// Uma conta é "receptora de lançamento" (analítica) quando nenhuma outra
// conta do plano é filha dela — isso é mais confiável do que contar níveis
// no código, porque a profundidade do plano oficial não é uniforme (Ativo
// tem 4 níveis, mas Despesas/Deduções têm só 2-3).
function ehContaQueRecebeLancamento(conta) {
  if (CONTAS_CURRICULARES.has(conta.nome)) return true;
  return !PLANO_CONTAS_OFICIAL.some((c) => c.codigo !== conta.codigo && c.codigo.startsWith(conta.codigo + "."));
}

function contasComPrefixo(prefixo) {
  return PLANO_CONTAS_OFICIAL
    .filter((c) => c.codigo === prefixo || c.codigo.startsWith(prefixo + "."))
    .filter(ehContaQueRecebeLancamento);
}

function saldoDaConta(todosLancamentos, nomeConta, tipoNatureza) {
  let d = 0, c = 0;
  todosLancamentos.forEach((l) => l.linhas.forEach((li) => {
    if (li.conta === nomeConta) {
      const v = parseFloat((li.valor + "").replace(",", ".")) || 0;
      if (li.tipo === "D") d += v; else c += v;
    }
  }));
  return tipoNatureza === "D" ? d - c : c - d;
}

// Natureza é sempre a do GRUPO FUNCIONAL como um todo (ex.: toda a "Dedução
// da Receita" é tratada como devedora), não a de cada conta individualmente.
// Isso é mais robusto do que depender da flag "redutora" conta a conta —
// uma conta redutora (ex.: Depreciação Acumulada) é lançada ao contrário do
// normal do grupo, então naturalmente sai com saldo negativo e reduz o
// total corretamente, sem precisar de tratamento especial.
function linhasDoGrupo(prefixo, todosLancamentos, natureza) {
  return contasComPrefixo(prefixo).map((c) => ({ ...c, saldo: saldoDaConta(todosLancamentos, c.nome, natureza) }));
}

const somaGrupo = (linhas) => linhas.reduce((s, l) => s + l.saldo, 0);

// DRE completa — mostra TODAS as contas de cada grupo (mesmo com saldo zero),
// varrendo os lançamentos de todos os módulos que geram lançamento na
// empresa do aluno (4.0, 6.0, 8.0 e 10.0), não só 4.0 e 6.0 como antes.
export async function calcularDRECompleta(empresaId) {
  const todos = await todosLancamentosDaEmpresa(empresaId);

  const receitaBruta = linhasDoGrupo("4.1.1", todos, "C");
  const deducoes = linhasDoGrupo("4.2", todos, "D");
  const custos = linhasDoGrupo("6.2", todos, "D");
  const despesasAdmin = linhasDoGrupo("5.1", todos, "D");
  const despesasComerciais = linhasDoGrupo("5.2", todos, "D");
  const receitasFinanceiras = linhasDoGrupo("4.3", todos, "C");
  const outrasReceitas = linhasDoGrupo("4.4", todos, "C");
  const despesasFinanceiras = linhasDoGrupo("5.3", todos, "D");
  const outrasDespesas = linhasDoGrupo("5.4", todos, "D");
  const irpj = PLANO_CONTAS_OFICIAL.find((c) => c.codigo === "7.2.01");
  const csll = PLANO_CONTAS_OFICIAL.find((c) => c.codigo === "7.2.02");
  const irpjCsll = [
    { ...irpj, saldo: saldoDaConta(todos, irpj.nome, "D") },
    { ...csll, saldo: saldoDaConta(todos, csll.nome, "D") },
  ];

  const totalReceitaBruta = somaGrupo(receitaBruta);
  const totalDeducoes = somaGrupo(deducoes);
  const receitaLiquida = totalReceitaBruta - totalDeducoes;
  const totalCustos = somaGrupo(custos);
  const lucroBruto = receitaLiquida - totalCustos;
  const totalDespesasAdmin = somaGrupo(despesasAdmin);
  const totalDespesasComerciais = somaGrupo(despesasComerciais);
  const resultadoOperacional = lucroBruto - totalDespesasAdmin - totalDespesasComerciais;
  const totalReceitasFin = somaGrupo(receitasFinanceiras);
  const totalOutrasReceitas = somaGrupo(outrasReceitas);
  const totalDespesasFin = somaGrupo(despesasFinanceiras);
  const totalOutrasDespesas = somaGrupo(outrasDespesas);
  const resultadoFinanceiro = (totalReceitasFin + totalOutrasReceitas) - (totalDespesasFin + totalOutrasDespesas);
  const resultadoAntesIRPJ = resultadoOperacional + resultadoFinanceiro;
  const totalIRPJCSLL = somaGrupo(irpjCsll);
  const lucroLiquido = resultadoAntesIRPJ - totalIRPJCSLL;

  return {
    grupos: [
      { titulo: "Receita Bruta de Vendas", linhas: receitaBruta, total: totalReceitaBruta },
      { titulo: "(-) Deduções da Receita", linhas: deducoes, total: totalDeducoes },
      { subtotal: "= Receita Líquida", valor: receitaLiquida },
      { titulo: "(-) Custos", linhas: custos, total: totalCustos },
      { subtotal: "= Lucro Bruto", valor: lucroBruto },
      { titulo: "(-) Despesas Administrativas", linhas: despesasAdmin, total: totalDespesasAdmin },
      { titulo: "(-) Despesas Comerciais", linhas: despesasComerciais, total: totalDespesasComerciais },
      { subtotal: "= Resultado Operacional", valor: resultadoOperacional },
      { titulo: "Receitas Financeiras", linhas: receitasFinanceiras, total: totalReceitasFin },
      { titulo: "Outras Receitas", linhas: outrasReceitas, total: totalOutrasReceitas },
      { titulo: "(-) Despesas Financeiras", linhas: despesasFinanceiras, total: totalDespesasFin },
      { titulo: "(-) Outras Despesas", linhas: outrasDespesas, total: totalOutrasDespesas },
      { subtotal: "= Resultado Antes do IRPJ/CSLL", valor: resultadoAntesIRPJ },
      { titulo: "(-) IRPJ e CSLL", linhas: irpjCsll, total: totalIRPJCSLL },
      { subtotal: "= Lucro Líquido do Exercício", valor: lucroLiquido },
    ],
    totalReceitaBruta, lucroBruto, resultadoOperacional, resultadoFinanceiro, lucroLiquido,
  };
}

// Balanço Patrimonial — Ativo de um lado, Passivo + Patrimônio Líquido do
// outro. O Resultado do Exercício (3.9) é injetado no PL a partir do lucro
// líquido já calculado na DRE (o aluno não faz lançamento de encerramento
// manualmente neste estágio da disciplina).
export async function calcularBalancoPatrimonial(empresaId, lucroLiquido) {
  const todos = await todosLancamentosDaEmpresa(empresaId);

  const ativoCirculante = linhasDoGrupo("1.1", todos, "D");
  const ativoNaoCirculante = linhasDoGrupo("1.2", todos, "D");
  const passivoCirculante = linhasDoGrupo("2.1", todos, "C");
  const passivoNaoCirculante = linhasDoGrupo("2.2", todos, "C");
  const patrimonioLiquido = linhasDoGrupo("3", todos, "C").filter((c) => c.codigo !== "3.9");

  const totalAtivoCirculante = somaGrupo(ativoCirculante);
  const totalAtivoNaoCirculante = somaGrupo(ativoNaoCirculante);
  const totalAtivo = totalAtivoCirculante + totalAtivoNaoCirculante;

  const totalPassivoCirculante = somaGrupo(passivoCirculante);
  const totalPassivoNaoCirculante = somaGrupo(passivoNaoCirculante);
  const totalPLContas = somaGrupo(patrimonioLiquido);
  const totalPatrimonioLiquido = totalPLContas + lucroLiquido;
  const totalPassivoMaisPL = totalPassivoCirculante + totalPassivoNaoCirculante + totalPatrimonioLiquido;

  return {
    ativoCirculante, ativoNaoCirculante, totalAtivoCirculante, totalAtivoNaoCirculante, totalAtivo,
    passivoCirculante, passivoNaoCirculante, totalPassivoCirculante, totalPassivoNaoCirculante,
    patrimonioLiquido, lucroLiquido, totalPatrimonioLiquido,
    totalPassivoMaisPL,
    diferenca: totalAtivo - totalPassivoMaisPL,
  };
}

export { todosLancamentosDaEmpresa, contasComPrefixo, saldoDaConta };

// DLPA — usa o Lucro Líquido do Exercício da DRE completa como ponto de partida.
export async function calcularDLPA(empresaId, { saldoInicial, pctReservaLegal, pctDividendos }) {
  const dre = await calcularDRECompleta(empresaId);
  const lucroLiquido = dre.lucroLiquido;
  const reservaLegal = Math.max(lucroLiquido, 0) * pctReservaLegal / 100;
  const dividendos = Math.max(lucroLiquido, 0) * pctDividendos / 100;
  const saldoFinal = saldoInicial + lucroLiquido - reservaLegal - dividendos;
  return { lucroLiquido, reservaLegal, dividendos, saldoFinal };
}

// Provisão PECLD — aplica percentuais por faixa de atraso sobre os créditos
// vencidos (CREDITOS_M7, dado estático do Módulo 7.0, igual para todos).
export function calcularProvisaoPECLD(creditosM7, percentuais) {
  let total = 0;
  const linhas = creditosM7.map((c) => {
    const pct = percentuais[c.faixa] ?? 0;
    const provisao = (c.valor * pct) / 100;
    total += provisao;
    return { ...c, pct, provisao };
  });
  return { linhas, total };
}

// Tabela de depreciação linear (cotas constantes) — Módulo 6.0.
export function tabelaDepreciacaoLinear(valor, residual, vidaUtil) {
  const depreciavel = Math.max(valor - residual, 0);
  const cotaAnual = vidaUtil > 0 ? depreciavel / vidaUtil : 0;
  const linhas = [];
  let acumulada = 0;
  for (let ano = 1; ano <= vidaUtil; ano++) {
    acumulada += cotaAnual;
    linhas.push({ ano, cota: cotaAnual, acumulada, liquido: valor - acumulada });
  }
  return linhas;
}
