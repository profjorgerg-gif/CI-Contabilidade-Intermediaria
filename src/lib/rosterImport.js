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
//   "João da Silva 2024001"       (um único espaço também funciona)
//   "João da Silva  2024001"      (dois espaços também funciona)
export function parseListaColada(texto) {
  const linhas = texto.split("\n").map((l) => l.trim()).filter(Boolean);
  const alunos = [];
  for (const linha of linhas) {
    const temSeparadorExplicito = /[,\-]/.test(linha);
    const partes = temSeparadorExplicito
      ? linha.split(/,|-/).map((p) => p.trim()).filter(Boolean)
      : linha.split(/\s+/).filter(Boolean);
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
//
// A lista final da turma é um MERGE com o que já existia — importar uma
// lista menor ou parcial não apaga alunos que já estavam cadastrados.
export async function criarEmpresasParaTurma({ turmaId, turmaNome, professorUid, professorNome, alunos }) {
  const existentesR = await window.storage.get(`empresas_${turmaId}`, true).catch(() => null);
  const existentes = existentesR ? JSON.parse(existentesR.value) : [];
  const porMatricula = new Map(existentes.map((e) => [e.matricula, e]));

  const empresasProcessadas = [];
  for (const aluno of alunos) {
    const existente = await buscarPorMatricula(aluno.matricula);
    const empresaId = existente ? existente.empresaId : gerarIdEmpresa();

    const empresa = {
      id: empresaId,
      nome: nomeEmpresaParaAluno(aluno.nome),
      aluno: aluno.nome,
      matricula: aluno.matricula,
      turmaId,
      criadaEm: Date.now(),
    };
    if (existente) {
      const antiga = await window.storage.get(`empresa_${empresaId}`, true);
      if (antiga) empresa.criadaEm = JSON.parse(antiga.value).criadaEm;
    }
    empresasProcessadas.push(empresa);
    porMatricula.set(aluno.matricula, empresa);

    await window.storage.set(`empresa_${empresaId}`, JSON.stringify(empresa), true);
    await window.storage.set(`matricula_${aluno.matricula}`, JSON.stringify({
      turmaId, turmaNome, nome: aluno.nome, empresaId, professorUid, professorNome,
    }), true);
  }

  const codigo = gerarCodigoTurma();
  await window.storage.set(`turma_por_codigo_${codigo}`, JSON.stringify({
    id: turmaId, nome: turmaNome, professorUid, professor: professorNome,
  }), true);

  const listaFinal = Array.from(porMatricula.values());
  await window.storage.set(`empresas_${turmaId}`, JSON.stringify(listaFinal), true);

  return { empresas: empresasProcessadas, codigo };
}

// Adiciona (ou atualiza) UM único aluno à turma, sem afetar os demais.
export async function adicionarAlunoATurma({ turmaId, turmaNome, professorUid, professorNome, nome, matricula }) {
  const { empresas } = await criarEmpresasParaTurma({
    turmaId, turmaNome, professorUid, professorNome, alunos: [{ nome, matricula }],
  });
  return empresas[0];
}

// Remove um aluno da turma. A empresa e os lançamentos dele NÃO são apagados
// (ficam preservados, só saem da lista da turma), e a matrícula deixa de
// resolver login — reimportar a mesma matrícula depois recria o vínculo.
export async function removerAlunoDaTurma(turmaId, empresaId, matricula) {
  const existentesR = await window.storage.get(`empresas_${turmaId}`, true).catch(() => null);
  const existentes = existentesR ? JSON.parse(existentesR.value) : [];
  const restantes = existentes.filter((e) => e.id !== empresaId);
  await window.storage.set(`empresas_${turmaId}`, JSON.stringify(restantes), true);
  await window.storage.delete(`matricula_${matricula}`, true).catch(() => {});
  return restantes;
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
