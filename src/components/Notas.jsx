import React, { useEffect, useState } from "react";
import { useSharedList } from "../lib/hooks";
import { calcularDemonstrativoNotas, MEDIA_MINIMA_APROVACAO } from "../lib/notas";
import { fmt } from "../lib/simuladorEngine";
import { Card } from "./ModuloUI";

function fmtNota(n) { return n === null || n === undefined ? "—" : n.toFixed(1); }

function BadgeSituacao({ situacao }) {
  const cor = situacao === "Aprovado" ? "#7FBF9E" : situacao === "Em recuperação" ? "#E08A8A" : "#93A39F";
  return <span className="text-xs px-2 py-0.5 rounded-full border" style={{ borderColor: cor, color: cor }}>{situacao}</span>;
}

function TabelaModuloComRP({ modulo }) {
  if (!modulo.iniciado) {
    return <p className="text-sm" style={{ color: "#93A39F" }}>Ainda não iniciado.</p>;
  }
  return (
    <table className="w-full text-sm">
      <thead><tr className="text-left text-xs uppercase" style={{ color: "#93A39F" }}>
        <th>Exercício</th><th>Nota Original</th><th>Nota RP</th><th>Nota Considerada</th>
      </tr></thead>
      <tbody>
        {modulo.linhas.map((l) => (
          <tr key={l.exercicio} className="border-t" style={{ borderColor: "#33443F" }}>
            <td className="py-1">{l.exercicio}</td>
            <td>{fmtNota(l.original)}</td>
            <td>{l.rp !== null ? fmtNota(l.rp) : "—"}</td>
            <td><strong style={{ color: l.considerada > l.original ? "#7FBF9E" : "inherit" }}>{fmtNota(l.considerada)}</strong></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function DemonstrativoNotas({ empresaId, nomeEmpresa }) {
  const [demo, setDemo] = useState(null);
  useEffect(() => { setDemo(null); if (empresaId) calcularDemonstrativoNotas(empresaId).then(setDemo); }, [empresaId]);

  if (!empresaId) return <Card><p className="text-sm" style={{ color: "#93A39F" }}>Selecione uma empresa para ver o demonstrativo.</p></Card>;
  if (!demo) return <p className="text-sm" style={{ color: "#93A39F" }}>Carregando…</p>;

  return (
    <div>
      {nomeEmpresa && (
        <Card>
          <div className="text-xs uppercase tracking-wide" style={{ color: "#93A39F" }}>Demonstrativo de Notas</div>
          <strong className="text-lg">{nomeEmpresa}</strong>
        </Card>
      )}

      {demo.modulos.map((m) => (
        <Card key={m.id}>
          <div className="flex justify-between items-center mb-2">
            <strong>{m.label}</strong>
            <div className="flex items-center gap-2">
              {m.media !== null && <span className="text-sm">Média: <strong>{fmtNota(m.media)}</strong></span>}
              <BadgeSituacao situacao={m.situacao} />
            </div>
          </div>
          {"linhas" in m ? <TabelaModuloComRP modulo={m} /> : (
            m.iniciado
              ? <p className="text-sm" style={{ color: "#93A39F" }}>Nota atribuída pelo professor no estudo de caso avaliado.</p>
              : <p className="text-sm" style={{ color: "#93A39F" }}>Ainda não iniciado.</p>
          )}
        </Card>
      ))}

      <Card>
        <div className="flex justify-between items-center">
          <strong>Média Final</strong>
          <div className="flex items-center gap-2">
            <span className="text-lg font-serif">{fmtNota(demo.mediaFinal)}</span>
            <BadgeSituacao situacao={demo.situacaoFinal} />
          </div>
        </div>
        <p className="text-xs mt-2" style={{ color: "#6E7E7A" }}>
          Considera apenas os módulos avaliativos já iniciados. Média mínima para aprovação: {fmt(MEDIA_MINIMA_APROVACAO)}.
        </p>
      </Card>
    </div>
  );
}

export function DemonstrativoProfessor({ perfil }) {
  const [turmas] = useSharedList("turmas");
  const [turmaId, setTurmaId] = useState("");
  const [alunos, setAlunos] = useState(null);
  const [empresaId, setEmpresaId] = useState("");
  const [nomeEmpresa, setNomeEmpresa] = useState("");
  const [consolidado, setConsolidado] = useState(null);

  const minhasTurmas = (turmas || []).filter((t) => perfil.papel === "mestre" || t.professorUid === perfil.uid);

  useEffect(() => {
    setEmpresaId(""); setNomeEmpresa(""); setConsolidado(null);
    if (!turmaId) { setAlunos(null); return; }
    (async () => {
      const r = await window.storage.get(`empresas_${turmaId}`, true).catch(() => null);
      const lista = r ? JSON.parse(r.value) : [];
      setAlunos(lista);
      const linhas = await Promise.all(lista.map(async (a) => {
        const demo = await calcularDemonstrativoNotas(a.id);
        return { aluno: a.aluno, matricula: a.matricula, mediaFinal: demo.mediaFinal, situacao: demo.situacaoFinal };
      }));
      setConsolidado(linhas);
    })();
  }, [turmaId]);

  return (
    <div>
      <Card>
        <strong className="block mb-3">Demonstrativo de Notas — escolha turma e aluno</strong>
        <div className="flex gap-2 flex-wrap">
          <select value={turmaId} onChange={(e) => setTurmaId(e.target.value)} className="border rounded-sm px-3 py-2 text-sm" style={{ borderColor: "#33443F" }}>
            <option value="">Selecione a turma...</option>
            {minhasTurmas.map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}
          </select>
          <select value={empresaId} disabled={!alunos} onChange={(e) => {
            setEmpresaId(e.target.value);
            setNomeEmpresa(alunos.find((a) => a.id === e.target.value)?.nome || "");
          }} className="border rounded-sm px-3 py-2 text-sm disabled:opacity-50" style={{ borderColor: "#33443F" }}>
            <option value="">{alunos ? "Selecione o aluno..." : "Selecione a turma primeiro"}</option>
            {(alunos || []).map((a) => <option key={a.id} value={a.id}>{a.aluno} — {a.nome}</option>)}
          </select>
        </div>
      </Card>

      {empresaId && <DemonstrativoNotas empresaId={empresaId} nomeEmpresa={nomeEmpresa} />}

      {consolidado && !empresaId && (
        <Card>
          <strong className="block mb-3">Visão consolidada da turma</strong>
          {consolidado.length === 0 ? <p className="text-sm" style={{ color: "#93A39F" }}>Nenhum aluno nesta turma ainda.</p> : (
            <table className="w-full text-sm">
              <thead><tr className="text-left text-xs uppercase" style={{ color: "#93A39F" }}><th>Aluno</th><th>Matrícula</th><th>Média Final</th><th>Situação</th></tr></thead>
              <tbody>
                {consolidado.map((c) => (
                  <tr key={c.matricula} className="border-t" style={{ borderColor: "#33443F" }}>
                    <td className="py-1">{c.aluno}</td><td>{c.matricula}</td>
                    <td>{fmtNota(c.mediaFinal)}</td><td><BadgeSituacao situacao={c.situacao} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      )}
    </div>
  );
}
