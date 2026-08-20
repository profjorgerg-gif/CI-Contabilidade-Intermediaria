import React, { useEffect, useState } from "react";
import {
  LogOut, KeyRound, Building2, Users, GraduationCap, ShieldCheck,
  LayoutGrid, FileBarChart, Save, History, BookOpen, LifeBuoy, Megaphone, Video, ChevronRight,
} from "lucide-react";
import { auth, observarSessao, entrarComGoogle, sair, traduzErroAuth, CODIGO_MESTRE } from "./lib/firebaseAuth";
import { definirUsuarioAtual, configPronta } from "./lib/firebaseApp";
import { useSharedList } from "./lib/hooks";
import { criarEmpresasParaTurma, parseListaColada, buscarPorMatricula, buscarPorCodigoTurma, gerarCodigoTurma, adicionarAlunoATurma, removerAlunoDaTurma } from "./lib/rosterImport";
import { extrairListaDoPDF } from "./lib/rosterPdf";
import { ModuleContent, MODULES } from "./components/ModuleRouter";
import { Suporte } from "./components/Suporte";
import { Novidades } from "./components/Novidades";
import { ManualProfessor, ManualAluno } from "./components/Manuais";
import { Relatorios } from "./components/Relatorios";
import { Correcoes } from "./components/Correcoes";
import { gerarBackupZip } from "./lib/backup";

// ============================================================================
// Componentes pequenos de UI (mesmo espírito visual do index.html da CI)
// ============================================================================
function Card({ children, className = "" }) {
  return <div className={`bg-white border border-paperline rounded-sm p-6 mb-4 ${className}`}>{children}</div>;
}
function Botao({ children, onClick, secondary, disabled, ...rest }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-sm text-sm font-medium disabled:opacity-40 ${
        secondary ? "border border-ledger text-ledger hover:bg-ledgersoft" : "bg-ledger text-white hover:bg-[#1F3E30]"
      }`}
      {...rest}
    >
      {children}
    </button>
  );
}
function Campo({ label, children }) {
  return (
    <div className="mb-3">
      <label className="block text-xs uppercase tracking-wide text-inksoft mb-1">{label}</label>
      {children}
    </div>
  );
}
function Input(props) {
  return <input {...props} className="w-full border border-paperline rounded-sm px-3 py-2 text-sm" />;
}

// ============================================================================
// Tela de configuração pendente — aparece se firebaseApp.js ainda não foi
// preenchido com as credenciais reais do projeto Firebase.
// ============================================================================
// ============================================================================
// Modal de confirmação ao sair — substitui o window.confirm() nativo (fácil
// de clicar sem perceber) por uma escolha explícita dentro do próprio app.
// ============================================================================
function ModalConfirmarSaida({ onFecharSemSair, onSairSemBackup, onSairComBackup }) {
  const [gerando, setGerando] = useState(false);
  const [erro, setErro] = useState("");

  const confirmarComBackup = async () => {
    setGerando(true); setErro("");
    try {
      await gerarBackupZip();
      onSairComBackup();
    } catch {
      setErro("Não foi possível gerar o backup. Você pode sair sem backup ou tentar de novo.");
      setGerando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ background: "rgba(20,32,31,0.6)" }}>
      <div className="max-w-sm w-full rounded-md p-6" style={{ background: "#1E302E", border: "1px solid #33443F" }}>
        <strong style={{ color: "#EDEAE0" }} className="block mb-2">Sair do sistema</strong>
        <p className="text-sm mb-5" style={{ color: "#93A39F" }}>Deseja realizar o backup dos dados antes de sair?</p>
        {erro && <p className="text-xs mb-3" style={{ color: "#E08A8A" }}>{erro}</p>}
        <div className="flex flex-col gap-2">
          <button onClick={confirmarComBackup} disabled={gerando}
            className="text-sm rounded px-4 py-2.5 disabled:opacity-50" style={{ background: "#C79A56", color: "#2C1E0E", fontWeight: 500 }}>
            {gerando ? "Gerando backup…" : "Sim, gerar backup e sair"}
          </button>
          <button onClick={onSairSemBackup} disabled={gerando}
            className="text-sm rounded px-4 py-2.5" style={{ border: "1px solid #33443F", color: "#EDEAE0" }}>
            Não, só sair
          </button>
          <button onClick={onFecharSemSair} disabled={gerando}
            className="text-xs mt-1" style={{ color: "#6E7E7A" }}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

function TelaConfigPendente() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="max-w-lg">
        <h1 className="font-serif text-2xl mb-2">Configuração pendente</h1>
        <p className="text-sm text-inksoft mb-3">
          O Firebase ainda não foi configurado. Edite <code className="bg-ledgersoft px-1">src/lib/firebaseApp.js</code>{" "}
          e substitua os valores de <code className="bg-ledgersoft px-1">FIREBASE_CONFIG</code> pelos do seu projeto
          (Console do Firebase → Configurações do projeto → Seus apps).
        </p>
        <p className="text-xs text-inksoft">Veja o passo a passo completo nos comentários do próprio arquivo.</p>
      </Card>
    </div>
  );
}

// ============================================================================
// Login — visual aprovado (fundo verde-ink escuro, cartão sem branco puro),
// com escolha de perfil ANTES do login, igual à referência do PPFCHH.
// ============================================================================
function TelaLogin({ user, onConcluido }) {
  const [perfilEscolhido, setPerfilEscolhido] = useState("aluno");
  const [codigoMestre, setCodigoMestre] = useState("");
  const [erro, setErro] = useState("");
  const [entrando, setEntrando] = useState(false);

  const continuar = async () => {
    setErro(""); setEntrando(true);
    try {
      let u = user;
      if (!u) u = await entrarComGoogle();
      definirUsuarioAtual(u.uid);

      const existente = await window.storage.get(`usuario_${u.uid}`, true).catch(() => null);
      let perfil;
      if (existente) {
        perfil = JSON.parse(existente.value);
      } else {
        const ehMestre = perfilEscolhido === "professor" && codigoMestre.trim() === CODIGO_MESTRE;
        perfil = {
          uid: u.uid, nome: u.displayName, email: u.email,
          papel: ehMestre ? "mestre" : perfilEscolhido, criadoEm: Date.now(),
        };
        await window.storage.set(`usuario_${u.uid}`, JSON.stringify(perfil), true);
      }
      onConcluido(u, perfil);
    } catch (err) {
      setErro(traduzErroAuth(err));
    }
    setEntrando(false);
  };

  return (
    <div style={{ background: "#14201F" }} className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-lg w-full rounded-lg p-9" style={{ background: "#1A2827" }}>
        <div className="flex items-center gap-2 mb-2">
          <GraduationCap size={16} style={{ color: "#C79A56" }} />
          <span className="text-xs tracking-wide" style={{ color: "#C79A56" }}>CEDUP HERMANN HERING</span>
        </div>
        <h1 className="font-serif text-3xl mb-2" style={{ color: "#EDEAE0" }}>CI — Contabilidade Intermediária</h1>
        <p className="text-sm mb-6" style={{ color: "#93A39F" }}>
          Onze módulos guiados, da teoria ao lançamento, dentro da mesma empresa fictícia — resultado real acumulado a cada etapa.
        </p>

        <div className="rounded-md p-5" style={{ background: "#1E302E", border: "1px solid #33443F" }}>
          <div className="text-xs uppercase tracking-wide mb-3" style={{ color: "#93A39F" }}>Perfil de acesso</div>
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setPerfilEscolhido("aluno")}
              className="flex-1 text-sm rounded px-3 py-2"
              style={perfilEscolhido === "aluno"
                ? { background: "#C79A56", color: "#2C1E0E", fontWeight: 500 }
                : { border: "1px solid #33443F", color: "#93A39F" }}
            >
              Aluno(a)
            </button>
            <button
              onClick={() => setPerfilEscolhido("professor")}
              className="flex-1 text-sm rounded px-3 py-2"
              style={perfilEscolhido === "professor"
                ? { background: "#C79A56", color: "#2C1E0E", fontWeight: 500 }
                : { border: "1px solid #33443F", color: "#93A39F" }}
            >
              Professor(a)
            </button>
          </div>

          {perfilEscolhido === "professor" && (
            <input
              value={codigoMestre} onChange={(e) => setCodigoMestre(e.target.value)}
              placeholder="Código de Usuário Mestre (opcional)"
              className="w-full text-sm rounded px-3 py-2 mb-4"
              style={{ background: "#14201F", border: "1px solid #33443F", color: "#EDEAE0" }}
            />
          )}

          <p className="text-xs mb-4" style={{ color: "#6E7E7A" }}>
            Só é usado na primeira vez que esta conta entra no sistema. Depois disso, o perfil só pode ser alterado por um Usuário Mestre, no painel de Usuários.
          </p>

          <button
            onClick={continuar} disabled={entrando}
            className="w-full text-sm rounded px-3 py-2.5 flex items-center justify-center gap-2 disabled:opacity-50"
            style={{ background: "#2E4643", border: "1px solid #45605B", color: "#EDEAE0" }}
          >
            {entrando ? "Entrando…" : "Continuar com Google"}
          </button>
          {erro && <p className="text-sm mt-3" style={{ color: "#E08A8A" }}>{erro}</p>}
          <p className="text-[10px] text-center mt-3" style={{ color: "#6E7E7A" }}>Autenticado via Firebase — somente conta Google.</p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Fluxo do aluno: informar matrícula → cair direto na própria empresa
// (diferente do PPFCHH, que tem um passo de "escolher empresa" entre uma
// lista — na CI a empresa já é 1-para-1 com o aluno, criada na importação).
// ============================================================================
function TelaInformarMatricula({ perfil, onSair, onEncontrado }) {
  const [valor, setValor] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [erro, setErro] = useState("");

  const buscar = async () => {
    setErro(""); setBuscando(true);
    const termo = valor.trim();
    try {
      const porMatricula = await buscarPorMatricula(termo);
      if (porMatricula) { onEncontrado(porMatricula); setBuscando(false); return; }

      const porCodigo = await buscarPorCodigoTurma(termo);
      if (porCodigo) {
        setErro("Turma encontrada, mas sua matrícula ainda não foi importada pelo professor. Peça para importar a lista antes de continuar.");
        setBuscando(false);
        return;
      }
      setErro("Não encontramos essa matrícula. Confira com o professor.");
    } catch {
      setErro("Não foi possível concluir. Tente novamente.");
    }
    setBuscando(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="max-w-md w-full">
        <button onClick={onSair} className="flex items-center gap-2 text-sm text-inksoft mb-4"><LogOut size={15} /> Sair</button>
        <h1 className="font-serif text-xl mb-1">Olá, {perfil.nome}!</h1>
        <p className="text-sm text-inksoft mb-4">Informe sua matrícula para entrar na sua empresa.</p>
        <Campo label="Matrícula">
          <div className="flex gap-2">
            <Input value={valor} onChange={(e) => setValor(e.target.value)} placeholder="Ex.: 2024001" />
            <Botao onClick={buscar} disabled={buscando || !valor.trim()}>{buscando ? "Buscando…" : "Entrar"}</Botao>
          </div>
        </Campo>
        {erro && <p className="text-sm text-alert">{erro}</p>}
      </Card>
    </div>
  );
}

// ============================================================================
// Workspace do aluno — navegação pelos 11 módulos + conteúdo real,
// portado do protótipo em HTML único já aprovado.
// ============================================================================
function AlunoWorkspace({ registro, perfil, onSair }) {
  const [paginaAtiva, setPaginaAtiva] = useState("m1"); // id de módulo, "suporte" ou "manual"

  const conteudo = () => {
    if (paginaAtiva === "suporte") {
      return <Suporte perfil={perfil} contexto={{ empresaId: registro.empresaId, professorUid: registro.professorUid, professorNome: registro.professorNome }} />;
    }
    if (paginaAtiva === "manual") return <ManualAluno />;
    return <ModuleContent moduleId={paginaAtiva} empresaId={registro.empresaId} />;
  };

  return (
    <div className="min-h-screen grid" style={{ gridTemplateColumns: "260px 1fr" }}>
      <nav className="bg-white border-r border-paperline p-5 overflow-y-auto">
        <div className="mb-4">
          <div className="font-serif text-lg">{registro.nomeEmpresa}</div>
          <div className="text-xs text-inksoft">{registro.turmaNome}</div>
        </div>
        <div className="space-y-0.5 mb-4">
          {MODULES.map((m) => (
            <button key={m.id} onClick={() => setPaginaAtiva(m.id)}
              className={`w-full text-left flex items-start gap-2 px-2 py-2 text-[13px] leading-snug rounded-sm border-l-2 ${
                paginaAtiva === m.id ? "border-ledger bg-ledgersoft font-semibold text-ledger" : "border-transparent text-ink hover:bg-ledgersoft"
              }`}>
              <span className="font-mono text-[11px] text-debit shrink-0 pt-px">{m.code}</span>
              <span className="flex-1">{m.title}</span>
            </button>
          ))}
        </div>
        <div className="space-y-1 mb-4 border-t border-paperline pt-3">
          <button onClick={() => setPaginaAtiva("suporte")}
            className={`w-full text-left flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm ${paginaAtiva === "suporte" ? "bg-ledgersoft text-ledger font-semibold" : "text-ink hover:bg-ledgersoft"}`}>
            <LifeBuoy size={14} /> Suporte
          </button>
          <button onClick={() => setPaginaAtiva("manual")}
            className={`w-full text-left flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm ${paginaAtiva === "manual" ? "bg-ledgersoft text-ledger font-semibold" : "text-ink hover:bg-ledgersoft"}`}>
            <BookOpen size={14} /> Manual do Aluno
          </button>
        </div>
        <button onClick={onSair} className="flex items-center gap-2 text-sm text-inksoft border-t border-paperline pt-4 w-full"><LogOut size={15} /> Sair</button>
      </nav>
      <main className="p-8 max-w-3xl">
        {conteudo()}
      </main>
    </div>
  );
}

// ============================================================================
// Gestão > Turmas (professor/mestre) — criar turma + colar lista de alunos
// ============================================================================
function GestaoTurmasView({ perfil }) {
  const [turmas, setTurmas] = useSharedList("turmas");
  const [nomeTurma, setNomeTurma] = useState("");
  const [listaColada, setListaColada] = useState("");
  const [turmaSelecionada, setTurmaSelecionada] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [processando, setProcessando] = useState(false);
  const [modoImportacao, setModoImportacao] = useState("pdf"); // "pdf" | "colar"
  const [erroPdf, setErroPdf] = useState("");
  const [nomePdfCarregado, setNomePdfCarregado] = useState("");
  const [alunosDaTurma, setAlunosDaTurma] = useState(null);
  const [buscaAluno, setBuscaAluno] = useState("");
  const [novoNome, setNovoNome] = useState("");
  const [novaMatricula, setNovaMatricula] = useState("");
  const [salvandoAluno, setSalvandoAluno] = useState(false);
  const [erroAluno, setErroAluno] = useState("");

  const carregarAlunos = async (turmaId) => {
    setAlunosDaTurma(null);
    const r = await window.storage.get(`empresas_${turmaId}`, true).catch(() => null);
    setAlunosDaTurma(r ? JSON.parse(r.value) : []);
  };

  const selecionarTurma = (t) => {
    setTurmaSelecionada(t); setResultado(null); setBuscaAluno(""); setErroAluno("");
    carregarAlunos(t.id);
  };

  const adicionarUmAluno = async () => {
    setErroAluno("");
    if (!novoNome.trim() || !novaMatricula.trim()) { setErroAluno("Preencha nome e matrícula."); return; }
    setSalvandoAluno(true);
    try {
      await adicionarAlunoATurma({
        turmaId: turmaSelecionada.id, turmaNome: turmaSelecionada.nome,
        professorUid: perfil.uid, professorNome: perfil.nome,
        nome: novoNome.trim(), matricula: novaMatricula.replace(/\D/g, ""),
      });
      setNovoNome(""); setNovaMatricula("");
      await carregarAlunos(turmaSelecionada.id);
    } catch {
      setErroAluno("Não foi possível salvar este aluno. Tente novamente.");
    }
    setSalvandoAluno(false);
  };

  const removerUmAluno = async (aluno) => {
    if (!window.confirm(`Remover ${aluno.aluno} (matrícula ${aluno.matricula}) desta turma?\n\nOs lançamentos que ele já fez continuam guardados, mas ele deixa de conseguir entrar por essa matrícula.`)) return;
    await removerAlunoDaTurma(turmaSelecionada.id, aluno.id, aluno.matricula);
    await carregarAlunos(turmaSelecionada.id);
  };

  if (turmas === null) return <p className="text-sm text-inksoft">Carregando…</p>;

  const criarTurma = async () => {
    if (!nomeTurma.trim()) return;
    const nova = { id: Math.random().toString(36).slice(2, 10), nome: nomeTurma.trim(), professorUid: perfil.uid, professorNome: perfil.nome, criadaEm: Date.now() };
    await setTurmas([...(turmas || []), nova]);
    setNomeTurma("");
    selecionarTurma(nova);
  };

  const processarPdf = async (file) => {
    setErroPdf(""); setProcessando(true); setNomePdfCarregado(file.name);
    try {
      const { turmaNomeSugerido, alunos } = await extrairListaDoPDF(file);
      setListaColada(alunos.map((a) => `${a.nome}, ${a.matricula}`).join("\n"));
      if (turmaNomeSugerido && !nomeTurma.trim() && !turmaSelecionada) {
        setNomeTurma(turmaNomeSugerido);
      }
    } catch (err) {
      setErroPdf(err.message || "Não foi possível ler este PDF.");
    }
    setProcessando(false);
  };

  const importar = async () => {
    if (!turmaSelecionada) return;
    setProcessando(true);
    const alunos = parseListaColada(listaColada);
    const { empresas, codigo } = await criarEmpresasParaTurma({
      turmaId: turmaSelecionada.id, turmaNome: turmaSelecionada.nome,
      professorUid: perfil.uid, professorNome: perfil.nome, alunos,
    });
    setResultado({ empresas, codigo });
    await carregarAlunos(turmaSelecionada.id);
    setProcessando(false);
  };

  return (
    <div>
      <Card>
        <h2 className="font-serif text-xl mb-4">Nova turma</h2>
        <div className="flex gap-2">
          <Input value={nomeTurma} onChange={(e) => setNomeTurma(e.target.value)} placeholder="Nome da turma (ex.: 3º Contabilidade A)" />
          <Botao onClick={criarTurma}>Criar</Botao>
        </div>
        <p className="text-xs text-inksoft mt-2">Dica: se você carregar um PDF antes de criar a turma, o nome sugerido aparece aqui automaticamente.</p>
      </Card>

      <Card>
        <h2 className="font-serif text-xl mb-4">Turmas existentes</h2>
        {(turmas || []).length === 0 && <p className="text-sm text-inksoft">Nenhuma turma criada ainda.</p>}
        <div className="space-y-2">
          {(turmas || []).map((t) => (
            <button key={t.id} onClick={() => selecionarTurma(t)}
              className={`w-full text-left border rounded-sm px-4 py-2 text-sm ${turmaSelecionada?.id === t.id ? "border-ledger bg-ledgersoft" : "border-paperline"}`}>
              {t.nome}
            </button>
          ))}
        </div>
      </Card>

      {turmaSelecionada && (
        <Card>
          <h2 className="font-serif text-xl mb-1">Alunos — {turmaSelecionada.nome}</h2>
          {alunosDaTurma === null ? (
            <p className="text-sm text-inksoft">Carregando…</p>
          ) : (
            <>
              {alunosDaTurma.length === 0 ? (
                <p className="text-sm text-inksoft mb-3">Nenhum aluno importado ainda nesta turma.</p>
              ) : (
                <>
                  <input
                    value={buscaAluno} onChange={(e) => setBuscaAluno(e.target.value)}
                    placeholder="Buscar por nome ou matrícula..."
                    className="w-full border border-paperline rounded-sm px-3 py-2 text-sm mb-3"
                  />
                  <table className="w-full text-sm mb-2">
                    <thead><tr className="text-left text-xs text-inksoft uppercase"><th>Aluno</th><th>Matrícula</th><th>Empresa</th><th></th></tr></thead>
                    <tbody>
                      {alunosDaTurma
                        .filter((a) => !buscaAluno || a.aluno.toLowerCase().includes(buscaAluno.toLowerCase()) || a.matricula.includes(buscaAluno))
                        .map((a) => (
                          <tr key={a.id} className="border-t border-paperline">
                            <td className="py-1.5">{a.aluno}</td><td>{a.matricula}</td><td>{a.nome}</td>
                            <td><button onClick={() => removerUmAluno(a)} className="text-xs text-alert border border-alert rounded-sm px-2 py-1">Remover</button></td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  <p className="text-xs text-inksoft mb-4">{alunosDaTurma.length} aluno(s) nesta turma.</p>
                </>
              )}

              <div className="border-t border-paperline pt-3">
                <strong className="text-sm block mb-2">Adicionar um aluno a esta turma</strong>
                <div className="flex gap-2 flex-wrap">
                  <input value={novoNome} onChange={(e) => setNovoNome(e.target.value)} placeholder="Nome completo"
                    className="flex-[2] min-w-[180px] border border-paperline rounded-sm px-3 py-2 text-sm" />
                  <input value={novaMatricula} onChange={(e) => setNovaMatricula(e.target.value)} placeholder="Matrícula"
                    className="flex-1 min-w-[120px] border border-paperline rounded-sm px-3 py-2 text-sm" />
                  <Botao onClick={adicionarUmAluno} disabled={salvandoAluno}>{salvandoAluno ? "Salvando…" : "Adicionar"}</Botao>
                </div>
                {erroAluno && <p className="text-sm text-alert mt-2">{erroAluno}</p>}
              </div>
            </>
          )}
        </Card>
      )}

      {turmaSelecionada && (
        <Card>
          <h2 className="font-serif text-xl mb-1">Importar / atualizar alunos — {turmaSelecionada.nome}</h2>
          <p className="text-xs text-inksoft mb-4">
            A <strong>matrícula é a chave que prevalece</strong>: se um aluno já foi importado antes (mesma
            matrícula), a empresa dele é reaproveitada — nada se perde, só o nome é atualizado se tiver mudado.
          </p>

          <div className="flex gap-2 mb-4">
            <button onClick={() => setModoImportacao("pdf")} className={`px-3 py-1.5 text-sm rounded-sm border ${modoImportacao === "pdf" ? "border-ledger bg-ledgersoft text-ledger" : "border-paperline text-inksoft"}`}>Carregar PDF</button>
            <button onClick={() => setModoImportacao("colar")} className={`px-3 py-1.5 text-sm rounded-sm border ${modoImportacao === "colar" ? "border-ledger bg-ledgersoft text-ledger" : "border-paperline text-inksoft"}`}>Colar lista</button>
          </div>

          {modoImportacao === "pdf" && (
            <div className="mb-4">
              <p className="text-xs text-inksoft mb-2">
                Aceita o PDF "Estudantes da Turma" exportado do Professor On-line (SED-SC). Depois de carregado, a
                lista aparece abaixo para você conferir antes de importar.
              </p>
              <input
                type="file" accept="application/pdf"
                onChange={(e) => e.target.files[0] && processarPdf(e.target.files[0])}
                className="text-sm"
              />
              {nomePdfCarregado && !erroPdf && <p className="text-xs text-ledger mt-2">Arquivo lido: {nomePdfCarregado}</p>}
              {erroPdf && <p className="text-sm text-alert mt-2">{erroPdf}</p>}
            </div>
          )}

          {modoImportacao === "colar" && (
            <p className="text-xs text-inksoft mb-2">
              Cole uma linha por aluno: <code className="bg-ledgersoft px-1">Nome completo, matrícula</code>.
            </p>
          )}

          <textarea
            value={listaColada}
            onChange={(e) => setListaColada(e.target.value)}
            placeholder={"Maria da Silva, 2024001\nJoão Pereira, 2024002"}
            className="w-full min-h-[140px] border border-paperline rounded-sm px-3 py-2 text-sm font-mono mb-3"
          />
          <Botao onClick={importar} disabled={processando || !listaColada.trim()}>
            {processando ? "Importando…" : "Importar e criar empresas"}
          </Botao>

          {resultado && (
            <div className="mt-4 border-t border-paperline pt-4">
              <p className="text-sm mb-2">
                <strong>{resultado.empresas.length}</strong> empresa(s) processada(s). Código alternativo da turma:{" "}
                <code className="bg-ledgersoft px-2 py-0.5">{resultado.codigo}</code>
              </p>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

// ============================================================================
// Placeholder simples para itens ainda não implementados, no visual escuro.
// ============================================================================
function EmConstrucao({ titulo }) {
  return (
    <div className="rounded-md p-6" style={{ background: "#1E302E", border: "1px solid #33443F" }}>
      <strong style={{ color: "#EDEAE0" }} className="block mb-1">{titulo}</strong>
      <p className="text-sm" style={{ color: "#93A39F" }}>Esta área ainda está em construção.</p>
    </div>
  );
}

const ITENS_GESTAO = [
  { id: "turmas", label: "Turmas", icon: Building2 },
  { id: "usuarios", label: "Usuários", icon: Users },
  { id: "relatorios", label: "Relatórios", icon: FileBarChart },
  { id: "correcoes", label: "Correções", icon: FileBarChart },
  { id: "backup", label: "Backup", icon: Save },
  { id: "auditoria", label: "Auditoria", icon: History },
];
const ITENS_MANUAIS = [
  { id: "manual-professor", label: "Manual do Professor", icon: BookOpen },
  { id: "manual-aluno", label: "Manual do Aluno", icon: GraduationCap },
];
const ITENS_OUTROS = [
  { id: "suporte", label: "Suporte", icon: LifeBuoy },
  { id: "novidades", label: "Novidades", icon: Megaphone },
  { id: "tutoriais", label: "Tutoriais", icon: Video },
];

function ItemMenu({ ativo, icon: Icon, label, onClick }) {
  return (
    <button onClick={onClick}
      className="w-full flex items-start gap-2.5 text-sm px-3 py-2 rounded-md text-left leading-snug"
      style={ativo ? { background: "#2E4643", color: "#EDEAE0" } : { color: "#93A39F" }}>
      <Icon size={16} className="shrink-0 mt-0.5" style={{ color: ativo ? "#C79A56" : "#6E7E7A" }} />
      <span className="flex-1">{label}</span>
    </button>
  );
}
function TituloGrupo({ children }) {
  return <div className="text-[11px] uppercase tracking-wide px-3 mt-4 mb-1" style={{ color: "#5C6E69" }}>{children}</div>;
}

// ============================================================================
// Dashboard do professor / Usuário Mestre — menu lateral completo
// ============================================================================
// ============================================================================
// Permite que uma conta já cadastrada como Professor(a) vire Usuário Mestre
// depois do primeiro acesso — necessário porque o código de Mestre só era
// pedido na criação do perfil, e contas criadas antes disso ficam sem opção.
// ============================================================================
function PromoverParaMestre({ perfil }) {
  const [aberto, setAberto] = useState(false);
  const [codigo, setCodigo] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  const confirmar = async () => {
    setErro("");
    if (codigo.trim() !== CODIGO_MESTRE) { setErro("Código incorreto."); return; }
    setEnviando(true);
    const perfilAtualizado = { ...perfil, papel: "mestre" };
    await window.storage.set(`usuario_${perfil.uid}`, JSON.stringify(perfilAtualizado), true);
    window.location.reload();
  };

  if (!aberto) {
    return (
      <button onClick={() => setAberto(true)} className="w-full text-left text-xs px-3 py-2 mt-2" style={{ color: "#5C6E69" }}>
        Sou o Usuário Mestre
      </button>
    );
  }
  return (
    <div className="px-3 py-2 mt-2 rounded-md" style={{ background: "#14201F", border: "1px solid #33443F" }}>
      <input value={codigo} onChange={(e) => setCodigo(e.target.value)} placeholder="Código de Usuário Mestre"
        className="w-full text-xs rounded px-2 py-1.5 mb-2" style={{ background: "#1E302E", border: "1px solid #33443F", color: "#EDEAE0" }} />
      {erro && <p className="text-[11px] mb-2" style={{ color: "#E08A8A" }}>{erro}</p>}
      <button onClick={confirmar} disabled={enviando} className="text-xs rounded px-3 py-1.5 w-full" style={{ background: "#C79A56", color: "#2C1E0E" }}>
        {enviando ? "Confirmando…" : "Confirmar"}
      </button>
    </div>
  );
}

function ProfessorDashboard({ perfil, onSair }) {
  const [turmas] = useSharedList("turmas");
  const [pagina, setPagina] = useState("inicio");
  const [alunosDisponiveis, setAlunosDisponiveis] = useState([]);
  const [gerandoBackup, setGerandoBackup] = useState(false);
  const [nomeUltimoBackup, setNomeUltimoBackup] = useState("");

  useEffect(() => {
    if (pagina !== "suporte" || !turmas) return;
    (async () => {
      const minhas = turmas.filter((t) => perfil.papel === "mestre" || t.professorUid === perfil.uid);
      const listas = await Promise.all(minhas.map(async (t) => {
        const r = await window.storage.get(`empresas_${t.id}`, true).catch(() => null);
        return r ? JSON.parse(r.value) : [];
      }));
      setAlunosDisponiveis(listas.flat());
    })();
  }, [pagina, turmas, perfil]);

  const fazerBackupManual = async () => {
    setGerandoBackup(true);
    try {
      const nome = await gerarBackupZip();
      setNomeUltimoBackup(nome);
    } catch {
      window.alert("Não foi possível gerar o backup agora.");
    }
    setGerandoBackup(false);
  };

  const conteudo = () => {
    if (pagina === "turmas") return <GestaoTurmasView perfil={perfil} />;
    if (pagina === "usuarios") return <EmConstrucao titulo="Usuários" />;
    if (pagina === "relatorios") return <Relatorios perfil={perfil} />;
    if (pagina === "correcoes") return <Correcoes perfil={perfil} />;
    if (pagina === "backup") return (
      <div className="rounded-md p-6" style={{ background: "#1E302E", border: "1px solid #33443F" }}>
        <strong style={{ color: "#EDEAE0" }} className="block mb-2">Backup</strong>
        <p className="text-sm mb-4" style={{ color: "#93A39F" }}>
          Gera um arquivo <code>Backup_CI_&lt;data&gt;_&lt;hora&gt;.zip</code> com os dados de turmas e chamados.
          O mesmo aviso também aparece automaticamente sempre que você sai do sistema.
        </p>
        <button onClick={fazerBackupManual} disabled={gerandoBackup} className="text-sm rounded px-4 py-2 disabled:opacity-50"
          style={{ background: "#C79A56", color: "#2C1E0E", fontWeight: 500 }}>
          {gerandoBackup ? "Gerando…" : "Gerar backup agora"}
        </button>
        {nomeUltimoBackup && <p className="text-xs mt-3" style={{ color: "#93A39F" }}>Baixado: {nomeUltimoBackup}</p>}
      </div>
    );
    if (pagina === "auditoria") return <EmConstrucao titulo="Auditoria" />;
    if (pagina === "manual-professor") return <ManualProfessor />;
    if (pagina === "manual-aluno") return <ManualAluno />;
    if (pagina === "suporte") return <Suporte perfil={perfil} contexto={{ alunosDisponiveis }} />;
    if (pagina === "novidades") return <Novidades />;
    if (pagina === "tutoriais") return <EmConstrucao titulo="Tutoriais" />;

    // Início
    return (
      <div>
        <div className="text-xs uppercase tracking-wide mb-1" style={{ color: "#C79A56" }}>Curso Técnico em Administração e Contabilidade</div>
        <h1 className="font-serif text-3xl mb-3" style={{ color: "#EDEAE0" }}>Painel do(a) {perfil.papel === "mestre" ? "Usuário Mestre" : "Professor(a)"}</h1>
        <p className="text-sm mb-6 max-w-2xl" style={{ color: "#93A39F" }}>
          Bem-vindo(a), {perfil.nome}. Crie turmas, importe alunos e acompanhe a plataforma de cada empresa fictícia — tudo em um só lugar.
        </p>
        <div className="flex gap-3 mb-6">
          <button onClick={() => setPagina("turmas")} className="text-sm rounded px-4 py-2" style={{ background: "#C79A56", color: "#2C1E0E", fontWeight: 500 }}>Ir para Turmas</button>
          <button onClick={() => setPagina("relatorios")} className="text-sm rounded px-4 py-2" style={{ border: "1px solid #33443F", color: "#EDEAE0" }}>Ver relatórios</button>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="rounded-md p-4" style={{ background: "#1E302E", border: "1px solid #33443F" }}>
            <div className="text-[11px] uppercase" style={{ color: "#93A39F" }}>Turmas criadas</div>
            <div className="font-serif text-2xl" style={{ color: "#C79A56" }}>{turmas === null ? "…" : turmas.length}</div>
          </div>
          <div className="rounded-md p-4" style={{ background: "#1E302E", border: "1px solid #33443F" }}>
            <div className="text-[11px] uppercase" style={{ color: "#93A39F" }}>Itens de gestão</div>
            <div className="font-serif text-2xl" style={{ color: "#C79A56" }}>{ITENS_GESTAO.length} módulos</div>
          </div>
          <div className="rounded-md p-4" style={{ background: "#1E302E", border: "1px solid #33443F" }}>
            <div className="text-[11px] uppercase" style={{ color: "#93A39F" }}>Papel</div>
            <div className="text-base font-medium" style={{ color: "#EDEAE0" }}>{perfil.papel === "mestre" ? "Usuário Mestre" : "Professor(a)"}</div>
          </div>
        </div>

        <div className="rounded-md p-5" style={{ background: "#1E302E", border: "1px solid #33443F" }}>
          <strong className="flex items-center gap-2 mb-3" style={{ color: "#EDEAE0" }}><LayoutGrid size={16} style={{ color: "#C79A56" }} />Índice de Gestão</strong>
          <div className="grid grid-cols-2 gap-2">
            {ITENS_GESTAO.map((item, i) => (
              <button key={item.id} onClick={() => setPagina(item.id)}
                className="flex items-center gap-3 text-sm rounded px-3 py-3"
                style={{ background: "#14201F", border: "1px solid #33443F", color: "#EDEAE0" }}>
                <span className="text-xs rounded-full w-6 h-6 flex items-center justify-center" style={{ border: "1px solid #C79A56", color: "#C79A56" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <item.icon size={15} style={{ color: "#93A39F" }} />
                <span className="flex-1 text-left">{item.label}</span>
                <ChevronRight size={15} style={{ color: "#5C6E69" }} />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ background: "#14201F" }} className="min-h-screen grid" >
      <div style={{ display: "grid", gridTemplateColumns: "250px 1fr" }}>
        <nav className="p-4" style={{ background: "#182524", borderRight: "1px solid #26332F" }}>
          <div className="flex items-center gap-2 px-3 py-2 mb-1">
            <GraduationCap size={18} style={{ color: "#C79A56" }} />
            <div>
              <div className="text-sm font-medium" style={{ color: "#EDEAE0" }}>Painel do Professor</div>
              <div className="text-[11px]" style={{ color: "#6E7E7A" }}>{perfil.nome}</div>
            </div>
          </div>
          <ItemMenu ativo={pagina === "inicio"} icon={LayoutGrid} label="Início" onClick={() => setPagina("inicio")} />

          <TituloGrupo>Gestão</TituloGrupo>
          {ITENS_GESTAO.map((item) => (
            <ItemMenu key={item.id} ativo={pagina === item.id} icon={item.icon} label={item.label} onClick={() => setPagina(item.id)} />
          ))}

          <TituloGrupo>Manuais</TituloGrupo>
          {ITENS_MANUAIS.map((item) => (
            <ItemMenu key={item.id} ativo={pagina === item.id} icon={item.icon} label={item.label} onClick={() => setPagina(item.id)} />
          ))}

          <TituloGrupo>Outros</TituloGrupo>
          {ITENS_OUTROS.map((item) => (
            <ItemMenu key={item.id} ativo={pagina === item.id} icon={item.icon} label={item.label} onClick={() => setPagina(item.id)} />
          ))}

          {perfil.papel !== "mestre" && <PromoverParaMestre perfil={perfil} />}

          <button onClick={onSair} className="w-full flex items-center gap-2.5 text-sm px-3 py-2 mt-4 rounded-md" style={{ color: "#93A39F", borderTop: "1px solid #26332F" }}>
            <LogOut size={15} /> Sair
          </button>
        </nav>
        <main className="p-8 overflow-y-auto">{conteudo()}</main>
      </div>
    </div>
  );
}

// ============================================================================
// App raiz — observa sessão, roteia por papel
// ============================================================================
export default function App() {
  const [user, setUser] = useState(undefined);
  const [perfil, setPerfil] = useState(undefined);
  const [registroAluno, setRegistroAluno] = useState(null);
  const [pedindoSaida, setPedindoSaida] = useState(false);

  useEffect(() => {
    if (!configPronta) return;
    const unsub = observarSessao(async (u) => {
      setUser(u || null);
      if (!u) { setPerfil(null); return; }
      definirUsuarioAtual(u.uid);
      const r = await window.storage.get(`usuario_${u.uid}`, true).catch(() => null);
      setPerfil(r ? JSON.parse(r.value) : null);
    });
    return unsub;
  }, []);

  const pedirSaida = () => setPedindoSaida(true);
  const executarSaida = async () => { setPedindoSaida(false); await sair(); };

  const modalSaida = pedindoSaida && (
    <ModalConfirmarSaida
      onFecharSemSair={() => setPedindoSaida(false)}
      onSairSemBackup={executarSaida}
      onSairComBackup={executarSaida}
    />
  );

  if (!configPronta) return <TelaConfigPendente />;
  if (user === undefined) return <p className="p-6 text-sm text-inksoft">Carregando…</p>;
  if (user && perfil === undefined) return <p className="p-6 text-sm text-inksoft">Carregando…</p>;
  if (!user || !perfil) {
    return (
      <TelaLogin
        user={user}
        onConcluido={(u, p) => { setUser(u); setPerfil(p); }}
      />
    );
  }

  if (perfil.papel === "professor" || perfil.papel === "mestre") {
    return <>
      <ProfessorDashboard perfil={perfil} onSair={pedirSaida} />
      {modalSaida}
    </>;
  }

  // Aluno
  if (!registroAluno) {
    return <>
      <TelaInformarMatricula
        perfil={perfil}
        onSair={pedirSaida}
        onEncontrado={async (r) => {
          const empresaSnap = await window.storage.get(`empresa_${r.empresaId}`, true);
          const empresa = empresaSnap ? JSON.parse(empresaSnap.value) : null;
          setRegistroAluno({ ...r, nomeEmpresa: empresa?.nome || "(empresa não encontrada)" });
        }}
      />
      {modalSaida}
    </>;
  }
  return <>
    <AlunoWorkspace registro={registroAluno} perfil={perfil} onSair={pedirSaida} />
    {modalSaida}
  </>;
}
