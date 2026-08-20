import React, { useEffect, useState } from "react";
import { useSharedList } from "../lib/hooks";
import { Card } from "./ModuloUI";

async function contarLancamentos(empresaId, moduleId) {
  const r = await window.storage.get(`${moduleId}_lancamentos_${empresaId}`, true).catch(() => null);
  return r ? JSON.parse(r.value).length : 0;
}
async function temResposta(empresaId, moduleId) {
  const r = await window.storage.get(`${moduleId}_resposta_caso_${empresaId}`, true).catch(() => null);
  return !!(r && JSON.parse(r.value || "").trim?.());
}

async function carregarAtividade(aluno) {
  const [m4, m6, m8, m10, c4, c7, c11] = await Promise.all([
    contarLancamentos(aluno.id, "m4"),
    contarLancamentos(aluno.id, "m6"),
    contarLancamentos(aluno.id, "m8"),
    contarLancamentos(aluno.id, "m10"),
    temResposta(aluno.id, "m4"),
    temResposta(aluno.id, "m7"),
    temResposta(aluno.id, "m11"),
  ]);
  return { ...aluno, m4, m6, m8, m10, c4, c7, c11 };
}

function Check({ ok }) {
  return ok ? <span className="text-ledger">✓</span> : <span className="text-inksoft">—</span>;
}

export function Relatorios({ perfil }) {
  const [turmas] = useSharedList("turmas");
  const [turmaId, setTurmaId] = useState("");
  const [atividade, setAtividade] = useState(null);
  const [carregando, setCarregando] = useState(false);

  const minhasTurmas = (turmas || []).filter((t) => perfil.papel === "mestre" || t.professorUid === perfil.uid);

  useEffect(() => {
    if (!turmaId) { setAtividade(null); return; }
    (async () => {
      setCarregando(true);
      const r = await window.storage.get(`empresas_${turmaId}`, true).catch(() => null);
      const alunos = r ? JSON.parse(r.value) : [];
      const dados = await Promise.all(alunos.map(carregarAtividade));
      setAtividade(dados);
      setCarregando(false);
    })();
  }, [turmaId]);

  return (
    <div>
      <Card>
        <strong className="block mb-3">Relatório de acompanhamento por turma</strong>
        <select value={turmaId} onChange={(e) => setTurmaId(e.target.value)} className="border border-paperline rounded-sm px-3 py-2 text-sm">
          <option value="">Selecione uma turma...</option>
          {minhasTurmas.map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}
        </select>
      </Card>

      {carregando && <Card><p className="text-sm text-inksoft">Carregando dados dos alunos…</p></Card>}

      {atividade && !carregando && (
        <Card>
          {atividade.length === 0 ? (
            <p className="text-sm text-inksoft">Nenhum aluno nesta turma ainda.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-inksoft uppercase">
                  <th>Aluno</th><th>Matrícula</th>
                  <th title="Lançamentos no Módulo 4.0">Lanç. 4.0</th>
                  <th title="Lançamentos no Módulo 6.0">Lanç. 6.0</th>
                  <th title="Lançamentos no Módulo 8.0">Lanç. 8.0</th>
                  <th title="Lançamentos no Módulo 10.0">Lanç. 10.0</th>
                  <th title="Respondeu o Estudo de Caso 4.0">Caso 4.0</th>
                  <th title="Respondeu o Estudo de Caso 7.0">Caso 7.0</th>
                  <th title="Respondeu o Estudo de Caso 11.0">Caso 11.0</th>
                </tr>
              </thead>
              <tbody>
                {atividade.map((a) => (
                  <tr key={a.id} className="border-t border-paperline">
                    <td className="py-1.5">{a.aluno}</td><td>{a.matricula}</td>
                    <td>{a.m4}</td><td>{a.m6}</td><td>{a.m8}</td><td>{a.m10}</td>
                    <td><Check ok={a.c4} /></td><td><Check ok={a.c7} /></td><td><Check ok={a.c11} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <p className="text-xs text-inksoft mt-3">
            Relatório em implantação gradativa — mostra os indicadores já disponíveis nos módulos com simulador
            e estudo de caso. Novos indicadores (acessos, progresso por módulo) serão adicionados conforme
            forem sendo registrados pela plataforma.
          </p>
        </Card>
      )}
    </div>
  );
}
