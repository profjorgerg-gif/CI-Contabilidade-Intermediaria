// ============================================================================
// Cálculos financeiros encadeados (DRE → DLPA, provisão PECLD, depreciação),
// portados das funções calcularDREM5/calcularDLPAM9/calcularProvisaoM8/
// tabelaDepreciacaoLinear do protótipo vanilla aprovado — mesma lógica,
// agora lendo os lançamentos de uma empresa específica no Firestore.
// ============================================================================

async function saldoContaEmpresa(empresaId, moduleId, nomeConta) {
  const r = await window.storage.get(`${moduleId}_lancamentos_${empresaId}`, true).catch(() => null);
  const lancamentos = r ? JSON.parse(r.value) : [];
  let d = 0, c = 0;
  lancamentos.forEach((l) => l.linhas.forEach((li) => {
    if (li.conta === nomeConta) {
      const v = parseFloat((li.valor + "").replace(",", ".")) || 0;
      if (li.tipo === "D") d += v; else c += v;
    }
  }));
  return { debito: d, credito: c };
}

// DRE simplificada — igual ao Módulo 5.0 do protótipo: Receita Bruta,
// Devoluções e CMV vêm do Módulo 4.0; Depreciação vem do Módulo 6.0.
export async function calcularDRE(empresaId) {
  const receitaBruta = (await saldoContaEmpresa(empresaId, "m4", "Receita de Vendas de Mercadorias")).credito;
  const deducoes = (await saldoContaEmpresa(empresaId, "m4", "(-) Devoluções de Vendas")).debito;
  const cmv = (await saldoContaEmpresa(empresaId, "m4", "Custo das Mercadorias Vendidas (CMV)")).debito;
  const depreciacao = (await saldoContaEmpresa(empresaId, "m6", "Depreciação")).debito;

  const receitaLiquida = receitaBruta - deducoes;
  const lucroBruto = receitaLiquida - cmv;
  const resultadoParcial = lucroBruto - depreciacao;

  return { receitaBruta, deducoes, receitaLiquida, cmv, lucroBruto, depreciacao, resultadoParcial };
}

// DLPA — usa o resultado parcial da DRE como Lucro Líquido do Exercício.
export async function calcularDLPA(empresaId, { saldoInicial, pctReservaLegal, pctDividendos }) {
  const dre = await calcularDRE(empresaId);
  const lucroLiquido = dre.resultadoParcial;
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
