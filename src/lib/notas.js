// ============================================================================
// Motor de notas — regra única e centralizada (item 9 do requisito):
//   notaConsiderada(exercício) = MAIOR valor entre nota original e nota da RP
//   médiaDoMódulo = média das notas consideradas
//   médiaFinal = média das médias dos módulos já iniciados
// Reaproveitado tanto pela tela do aluno ("Minhas Notas") quanto pela do
// professor (Turma → Aluno → mesmo demonstrativo).
// ============================================================================

export const MEDIA_MINIMA_APROVACAO = 6.0;

// Módulos com exercícios auto-corrigidos + Recuperação Paralela.
export const MODULOS_COM_RP = [
  { id: "m1", label: "1.0 — Princípios Contábeis e NBC", chaveExercicios: "exercicios", chaveRP: "rp" },
  { id: "m2", label: "2.0 — Regimes de Caixa e Competência", chaveExercicios: "exercicios", chaveRP: "rp" },
  { id: "m3", label: "3.0 — Plano de Contas (Pareamento)", chaveExercicios: "pareamento", chaveRP: "rp" },
];

// Módulos avaliados pelo professor (Estudo de Caso) — entram na Média Final,
// mas não têm Recuperação Paralela. (Módulo 11.0 não entra mais aqui desde
// que virou Relatórios — só o 7.0 continua com estudo de caso avaliado.)
export const MODULOS_CASO_AVALIADO = [
  { id: "m7", label: "7.0 — Créditos Vencidos e Não Liquidados" },
];

function situacao(media) {
  if (media === null) return "Não iniciado";
  return media >= MEDIA_MINIMA_APROVACAO ? "Aprovado" : "Em recuperação";
}

// Lê um bloco de exercícios (ou de RP) salvo no formato do motor de
// Exercicios.jsx: { respostas, notas: {b0: n, b1: n, ...}, corrigido }
async function lerNotasBlocos(empresaId, moduleId, chaveSufixo) {
  const r = await window.storage.get(`${moduleId}_${chaveSufixo}_${empresaId}`, true).catch(() => null);
  if (!r) return null;
  const dados = JSON.parse(r.value);
  return dados.notas || {};
}

// Calcula o demonstrativo de um módulo com exercícios + RP.
export async function calcularModuloComRP(empresaId, moduloConfig) {
  const notasExercicios = await lerNotasBlocos(empresaId, moduloConfig.id, moduloConfig.chaveExercicios);
  const notasRP = await lerNotasBlocos(empresaId, moduloConfig.id, moduloConfig.chaveRP);

  if (!notasExercicios || Object.keys(notasExercicios).length === 0) {
    return { id: moduloConfig.id, label: moduloConfig.label, iniciado: false, linhas: [], media: null, situacao: "Não iniciado" };
  }

  // A RP é um bloco único (b0); se não foi feita, vale 0 para efeito de
  // comparação (nunca reduz a nota original, só pode ajudar).
  const notaRP = notasRP && notasRP.b0 !== undefined ? notasRP.b0 : null;

  const chaves = Object.keys(notasExercicios).sort();
  const linhas = chaves.map((k, i) => {
    const original = notasExercicios[k];
    const considerada = notaRP !== null ? Math.max(original, notaRP) : original;
    return { exercicio: `Exercício ${i + 1}`, original, rp: notaRP, considerada };
  });

  const media = linhas.reduce((s, l) => s + l.considerada, 0) / linhas.length;

  return { id: moduloConfig.id, label: moduloConfig.label, iniciado: true, linhas, notaRP, media, situacao: situacao(media) };
}

// Calcula o demonstrativo de um módulo avaliado por Estudo de Caso (sem RP).
export async function calcularModuloCasoAvaliado(empresaId, moduloConfig) {
  const r = await window.storage.get(`${moduloConfig.id}_caso_avaliado_${empresaId}`, true).catch(() => null);
  if (!r) return { id: moduloConfig.id, label: moduloConfig.label, iniciado: false, media: null, situacao: "Não iniciado" };
  const dados = JSON.parse(r.value);
  if (dados.status !== "corrigido") {
    return { id: moduloConfig.id, label: moduloConfig.label, iniciado: true, media: null, situacao: "Aguardando correção" };
  }
  const media = dados.nota;
  return { id: moduloConfig.id, label: moduloConfig.label, iniciado: true, media, situacao: situacao(media) };
}

// Demonstrativo completo de uma empresa (aluno): todos os módulos avaliativos
// + Média Final (considerando só os módulos já iniciados).
export async function calcularDemonstrativoNotas(empresaId) {
  const comRP = await Promise.all(MODULOS_COM_RP.map((m) => calcularModuloComRP(empresaId, m)));
  const comCaso = await Promise.all(MODULOS_CASO_AVALIADO.map((m) => calcularModuloCasoAvaliado(empresaId, m)));

  const modulos = [...comRP, ...comCaso];
  const iniciados = modulos.filter((m) => m.iniciado && m.media !== null);
  const mediaFinal = iniciados.length > 0 ? iniciados.reduce((s, m) => s + m.media, 0) / iniciados.length : null;

  return { modulos, mediaFinal, situacaoFinal: situacao(mediaFinal) };
}
