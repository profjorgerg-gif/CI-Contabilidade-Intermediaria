// ============================================================================
// Importação de turma via PDF — extrai turma, nome e matrícula de um
// "Estudantes da Turma.pdf" exportado do Professor On-line (SED-SC).
// ============================================================================
import * as pdfjsLib from "pdfjs-dist";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

let workerConfigurado = false;
function garantirWorkerConfigurado() {
  if (!workerConfigurado) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
    workerConfigurado = true;
  }
}

function agruparEmLinhas(items) {
  const linhas = [];
  for (const it of items) {
    const texto = it.str.trim();
    if (!texto) continue;
    const y = it.transform[5];
    const x = it.transform[4];
    let linha = linhas.find((l) => Math.abs(l.y - y) < 3);
    if (!linha) { linha = { y, itens: [] }; linhas.push(linha); }
    if (!linha.itens.some((i) => i.texto === texto && Math.abs(i.x - x) < 1)) {
      linha.itens.push({ x, texto });
    }
  }
  linhas.sort((a, b) => b.y - a.y);
  return linhas.map((l) =>
    l.itens.sort((a, b) => a.x - b.x).map((i) => i.texto).join(" ").replace(/\s+/g, " ").trim()
  );
}

const REGEX_ALUNO = /^(\d{1,3})\s+(.+?)\s+(\d{6,12})\s+(\d{2}\/\d{2}\/\d{2,4})$/;
const REGEX_TURMA = /\b\d{3,5}-[A-Za-zÀ-ú0-9]+-\d+\s*-\s*.+/;

function extrairAlunos(linhasTexto) {
  const alunos = [];
  for (const linha of linhasTexto) {
    const m = linha.match(REGEX_ALUNO);
    if (m) alunos.push({ nome: m[2].trim(), matricula: m[3].trim() });
  }
  return alunos;
}

function extrairNomeTurma(linhasTexto) {
  for (const linha of linhasTexto) {
    const m = linha.match(REGEX_TURMA);
    if (m) return m[0].trim();
  }
  return null;
}

export async function extrairListaDoPDF(file) {
  garantirWorkerConfigurado();
  const buffer = await file.arrayBuffer();
  const doc = await pdfjsLib.getDocument({ data: new Uint8Array(buffer) }).promise;

  let todasLinhas = [];
  for (let n = 1; n <= doc.numPages; n++) {
    const page = await doc.getPage(n);
    const content = await page.getTextContent();
    todasLinhas = todasLinhas.concat(agruparEmLinhas(content.items));
  }

  const alunos = extrairAlunos(todasLinhas);
  const turmaNomeSugerido = extrairNomeTurma(todasLinhas);

  if (alunos.length === 0) {
    throw new Error("Não foi possível reconhecer alunos neste PDF. Confira se é o mesmo formato do Professor On-line (SED-SC).");
  }

  return { turmaNomeSugerido, alunos };
}
