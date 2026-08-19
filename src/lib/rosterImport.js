// ============================================================================
// Importação de turma + criação automática de empresa por aluno.
//
// Duas formas de importar: PDF (Professor On-line, via src/lib/rosterPdf.js)
// ou lista colada manualmente — ambas alimentam a mesma função abaixo.
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
// os registros de busca por matrícula e por código de turma.
//
// A MATRÍCULA É A CHAVE QUE PREVALECE: se um aluno já foi importado antes
// (mesma matrícula), a empresa existente dele é REAPROVEITADA — só o nome é
// atualizado, se tiver mudado. Isso evita que reimportar um PDF atualizado
// crie uma empresa duplicada e "perca" os lançamentos que o aluno já fez.
export async function criarEmpresasParaTurma({ turmaId, turmaNome, professorUid, professorNome, alunos }) {
  const empresas = [];
  for (const aluno of alunos) {
    const existente = await buscarPorMatricula(aluno.matricula);
    const empresaId = existente ? existente.empresaId : gerarIdEmpresa();

    const empresa = {
      id: empresaId,
      nome: nomeEmpresaParaAluno(aluno.nome),
      aluno: aluno.nome,
      matricula: aluno.matricula,
      turmaId,
      criadaEm: existente ? undefined : Date.now(),
      reimportadaEm: existente ? Date.now() : undefined,
    };
    // Preserva a data de criação original se a empresa já existia.
    if (existente) {
      const antiga = await window.storage.get(`empresa_${empresaId}`, true);
      if (antiga) empresa.criadaEm = JSON.parse(antiga.value).criadaEm;
    }
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
// usada na tela de login do aluno.
export async function buscarPorMatricula(matricula) {
  const r = await window.storage.get(`matricula_${matricula.trim()}`, true);
  return r ? JSON.parse(r.value) : null;
}

export async function buscarPorCodigoTurma(codigo) {
  const r = await window.storage.get(`turma_por_codigo_${codigo.trim().toUpperCase()}`, true);
  return r ? JSON.parse(r.value) : null;
}
