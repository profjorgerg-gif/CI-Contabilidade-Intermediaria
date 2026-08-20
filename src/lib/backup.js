import JSZip from "jszip";

function agora() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}h${pad(d.getMinutes())}m${pad(d.getSeconds())}s`;
}

// Gera e baixa Backup_CI_<data>_<hora>.zip, contendo um JSON com os dados
// compartilhados acessíveis (turmas e chamados). Cada aluno já pode exportar
// seus próprios dados de módulo separadamente; este backup cobre a camada
// de gestão, que é o que professor/administrador tipicamente precisa.
export async function gerarBackupZip() {
  const zip = new JSZip();
  const dados = { geradoEm: new Date().toISOString() };

  for (const chave of ["turmas", "chamados"]) {
    const r = await window.storage.get(chave, true).catch(() => null);
    dados[chave] = r ? JSON.parse(r.value) : [];
  }

  zip.file("backup.json", JSON.stringify(dados, null, 2));
  const blob = await zip.generateAsync({ type: "blob" });

  const nomeArquivo = `Backup_CI_${agora()}.zip`;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = nomeArquivo;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);

  return nomeArquivo;
}
