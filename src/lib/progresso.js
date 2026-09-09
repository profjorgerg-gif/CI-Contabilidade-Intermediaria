import { MODULES } from "../data/moduleData";

// ============================================================================
// Progressão sequencial dos módulos — motor centralizado.
//
// Módulos com atividades avaliativas e/ou lançamentos passam pelo ciclo
// completo: liberado → aguardando_analise → aprovado (ou devolvido, voltando
// pro aluno corrigir e reenviar). Módulos sem atividade própria (DRE, DLPA,
// Relatórios — só exibem dados calculados dos outros módulos) são liberados
// automaticamente assim que alcançados na sequência, sem precisar de envio.
// ============================================================================
export const MODULOS_COM_SUBMISSAO = ["m1", "m2", "m3", "m4", "m6", "m7", "m8", "m10"];
export const ORDEM_MODULOS = MODULES.map((m) => m.id);

export const STATUS_LABEL = {
  bloqueado: "Bloqueado",
  liberado: "Liberado",
  aguardando_analise: "Aguardando análise do professor",
  devolvido: "Devolvido para correção",
  aprovado: "Aprovado",
};

async function lerProgressoBruto(empresaId) {
  const r = await window.storage.get(`progresso_modulos_${empresaId}`, true).catch(() => null);
  return r ? JSON.parse(r.value) : {};
}

async function salvarProgressoBruto(empresaId, bruto) {
  await window.storage.set(`progresso_modulos_${empresaId}`, JSON.stringify(bruto), true);
}

// Calcula o status EFETIVO de cada módulo, andando em ordem: um módulo só
// fica acessível se o anterior já estiver "aprovado". Módulos sem submissão
// são aprovados automaticamente assim que alcançados.
export function calcularStatusEfetivo(bruto) {
  const efetivo = {};
  let desbloqueadoAteAqui = true;

  for (const moduleId of ORDEM_MODULOS) {
    const temSubmissao = MODULOS_COM_SUBMISSAO.includes(moduleId);

    if (!desbloqueadoAteAqui) {
      efetivo[moduleId] = { status: "bloqueado" };
      continue;
    }

    if (!temSubmissao) {
      // Módulo "de passagem" (DRE, DLPA, Relatórios): liberado automaticamente.
      efetivo[moduleId] = { status: "aprovado" };
      continue;
    }

    const registro = bruto[moduleId] || { status: "liberado" };
    efetivo[moduleId] = registro;
    desbloqueadoAteAqui = registro.status === "aprovado";
  }

  return efetivo;
}

export async function carregarProgresso(empresaId) {
  const bruto = await lerProgressoBruto(empresaId);
  return calcularStatusEfetivo(bruto);
}

// Aluno conclui e envia o módulo para o professor analisar.
export async function enviarParaAnalise(empresaId, moduleId) {
  const bruto = await lerProgressoBruto(empresaId);
  bruto[moduleId] = { status: "aguardando_analise", enviadoEm: Date.now(), feedback: bruto[moduleId]?.feedback || "" };
  await salvarProgressoBruto(empresaId, bruto);
}

// Professor aprova (libera o próximo) ou devolve para correção, com feedback.
export async function avaliarModulo(empresaId, moduleId, { aprovado, feedback }) {
  const bruto = await lerProgressoBruto(empresaId);
  bruto[moduleId] = {
    status: aprovado ? "aprovado" : "devolvido",
    feedback: feedback || "",
    avaliadoEm: Date.now(),
    enviadoEm: bruto[moduleId]?.enviadoEm,
  };
  await salvarProgressoBruto(empresaId, bruto);
}
