// ============================================================================
// Importação de turma + criação automática de empresa por aluno.
//
// O PPFCHH importa a lista via PDF (src/rosterPdf.js), mas o código-fonte
// desse arquivo não veio no backup (gap conhecido, registrado no LEIA-ME —
// só existe no repositório GitHub do PPFCHH). Aqui, para a CI, implementamos
// a importação por LISTA COLADA (uma linha por aluno), que é 100% autônoma
// e não depende de nenhum arquivo externo.
//
// Import por PDF pode ser adicionado depois (ex.: com a biblioteca pdf.js),
// reaproveitando esta mesma função criarEmpresasParaTurma() como núcleo —
// só mudaria a forma de extrair {nome, matricula} do arquivo.
// ============================================================================

export function gerarCodigoTurma() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

function gerarIdEmpresa() {
  return Math.random().toString(36).slice(2, 10);
}

// Aceita linhas como:
//   "João da Silva, 2024001"
//   "João da Silva - 2024001"
//   "João da Silva  2024001"   (nome + matrícula separados por espaços)
export function parseListaColada(texto) {
  const linhas = texto.split("\n").map((l) => l.trim()).filter(Boolean);
  const alunos = [];
  for (const linha of linhas) {
    const partes = linha.split(/,|-| {2,}/).map((p) => p.trim()).filter(Boolean);
    if (partes.length < 2) continue;
    const matricula = partes[partes.length - 1].replace(/\D/g, "");
    const nome = partes.slice(0, -1).join(" ").trim();
    if (!nome || !matricula) continue;
    alunos.push({ nome, matricula });
  }
  return alunos;
}

// Nome da empresa: nome completo do aluno + " LTDA", exatamente como pedido.
export function nomeEmpresaParaAluno(nomeAluno) {
  return `${nomeAluno.trim()} LTDA`;
}

// Cria (ou atualiza) uma turma, gera uma empresa fictícia por aluno, e grava
// os registros de busca por matrícula e por código de turma — tudo em uma
// única função, para ficar simples de chamar da tela de Gestão > Turmas.
export async function criarEmpresasParaTurma({ turmaId, turmaNome, professorUid, professorNome, alunos }) {
  const empresas = [];
  for (const aluno of alunos) {
    const empresaId = gerarIdEmpresa();
    const empresa = {
      id: empresaId,
      nome: nomeEmpresaParaAluno(aluno.nome),
      aluno: aluno.nome,
      matricula: aluno.matricula,
      turmaId,
      criadaEm: Date.now(),
    };
    empresas.push(empresa);

    await window.storage.set(`empresa_${empresaId}`, JSON.stringify(empresa), true);
    await window.storage.set(`matricula_${aluno.matricula}`, JSON.stringify({
      turmaId, turmaNome, nome: aluno.nome, empresaId, professorUid, professorNome,
    }), true);
  }

  const codigo = gerarCodigoTurma();
  await window.storage.set(`turma_por_codigo_${codigo}`, JSON.stringify({
    id: turmaId, nome: turmaNome, professorUid, professor: professorNome,
  }), true);

  await window.storage.set(`empresas_${turmaId}`, JSON.stringify(empresas), true);

  return { empresas, codigo };
}

// Busca a empresa (e a turma) de um aluno a partir da matrícula digitada —
// usada na tela de login do aluno, mesmo fluxo do PPFCHH (TelaInformarTurma).
export async function buscarPorMatricula(matricula) {
  const r = await window.storage.get(`matricula_${matricula.trim()}`, true);
  return r ? JSON.parse(r.value) : null;
}

export async function buscarPorCodigoTurma(codigo) {
  const r = await window.storage.get(`turma_por_codigo_${codigo.trim().toUpperCase()}`, true);
  return r ? JSON.parse(r.value) : null;
}
