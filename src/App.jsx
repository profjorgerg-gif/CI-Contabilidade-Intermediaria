import React, { useEffect, useState } from "react";
import { LogOut, KeyRound, Building2, Users, GraduationCap, ShieldCheck } from "lucide-react";
import { auth, observarSessao, entrarComGoogle, sair, traduzErroAuth, CODIGO_MESTRE } from "./lib/firebaseAuth";
import { definirUsuarioAtual, configPronta } from "./lib/firebaseApp";
import { useSharedList } from "./lib/hooks";
import { criarEmpresasParaTurma, parseListaColada, buscarPorMatricula, buscarPorCodigoTurma, gerarCodigoTurma } from "./lib/rosterImport";
import { extrairListaDoPDF } from "./lib/rosterPdf";

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
// Login
// ============================================================================
function TelaLogin() {
  const [erro, setErro] = useState("");
  const [entrando, setEntrando] = useState(false);

  const entrar = async () => {
    setErro(""); setEntrando(true);
    try {
      await entrarComGoogle();
    } catch (err) {
      setErro(traduzErroAuth(err));
    }
    setEntrando(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="max-w-md w-full text-center">
        <div className="font-serif text-3xl mb-1">CI</div>
        <div className="text-xs uppercase tracking-wide text-inksoft mb-6">Contabilidade Intermediária</div>
        <Botao onClick={entrar} disabled={entrando}>
          {entrando ? "Entrando…" : "Continuar com Google"}
        </Botao>
        {erro && <p className="text-sm text-alert mt-3">{erro}</p>}
      </Card>
    </div>
  );
}

// ============================================================================
// Primeiro acesso: a pessoa ainda não tem perfil salvo — escolhe o papel.
// ============================================================================
function TelaEscolherPapel({ user, onDefinido }) {
  const [codigoMestre, setCodigoMestre] = useState("");
  const [salvando, setSalvando] = useState(false);

  const definirComoProfessor = async () => {
    setSalvando(true);
    const ehMestre = codigoMestre.trim() === CODIGO_MESTRE;
    const perfil = {
      uid: user.uid, nome: user.displayName, email: user.email,
      papel: ehMestre ? "mestre" : "professor", criadoEm: Date.now(),
    };
    await window.storage.set(`usuario_${user.uid}`, JSON.stringify(perfil), true);
    onDefinido(perfil);
    setSalvando(false);
  };

  const definirComoAluno = async () => {
    setSalvando(true);
    const perfil = { uid: user.uid, nome: user.displayName, email: user.email, papel: "aluno", criadoEm: Date.now() };
    await window.storage.set(`usuario_${user.uid}`, JSON.stringify(perfil), true);
    onDefinido(perfil);
    setSalvando(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="max-w-md w-full">
        <h1 className="font-serif text-2xl mb-1">Olá, {user.displayName}!</h1>
        <p className="text-sm text-inksoft mb-5">Como você vai usar a plataforma?</p>

        <div className="mb-5">
          <Campo label="Sou aluno(a)">
            <Botao onClick={definirComoAluno} disabled={salvando}>Entrar como aluno(a)</Botao>
          </Campo>
        </div>

        <div className="border-t border-paperline pt-4">
          <Campo label="Sou professor(a) — código de Usuário Mestre (opcional)">
            <Input value={codigoMestre} onChange={(e) => setCodigoMestre(e.target.value)} placeholder="Deixe em branco se não tiver" />
          </Campo>
          <Botao onClick={definirComoProfessor} secondary disabled={salvando}>Entrar como professor(a)</Botao>
        </div>
      </Card>
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
// Workspace do aluno (placeholder — os 11 módulos entram na Etapa 2)
// ============================================================================
function AlunoWorkspace({ registro, onSair }) {
  return (
    <div className="min-h-screen p-6 max-w-3xl mx-auto">
      <button onClick={onSair} className="flex items-center gap-2 text-sm text-inksoft mb-4"><LogOut size={15} /> Sair</button>
      <Card>
        <div className="flex items-center gap-2 text-ledger mb-2"><Building2 size={18} /><span className="text-xs uppercase tracking-wide">Sua empresa</span></div>
        <h1 className="font-serif text-2xl mb-1">{registro.nomeEmpresa}</h1>
        <p className="text-sm text-inksoft">Turma: {registro.turmaNome} · Matrícula: {registro.matricula}</p>
      </Card>
      <Card>
        <p className="text-sm text-inksoft">
          Infraestrutura da Etapa 1 concluída: login Google, matrícula, empresa individual e sincronização entre
          dispositivos já funcionam. Os 11 módulos de conteúdo (Teoria, simuladores, DRE, DLPA etc.) entram na
          Etapa 2, portados do protótipo em HTML único.
        </p>
      </Card>
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

  if (turmas === null) return <p className="text-sm text-inksoft">Carregando…</p>;

  const criarTurma = async () => {
    if (!nomeTurma.trim()) return;
    const nova = { id: Math.random().toString(36).slice(2, 10), nome: nomeTurma.trim(), professorUid: perfil.uid, professorNome: perfil.nome, criadaEm: Date.now() };
    await setTurmas([...(turmas || []), nova]);
    setNomeTurma("");
    setTurmaSelecionada(nova);
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
            <button key={t.id} onClick={() => { setTurmaSelecionada(t); setResultado(null); }}
              className={`w-full text-left border rounded-sm px-4 py-2 text-sm ${turmaSelecionada?.id === t.id ? "border-ledger bg-ledgersoft" : "border-paperline"}`}>
              {t.nome}
            </button>
          ))}
        </div>
      </Card>

      {turmaSelecionada && (
        <Card>
          <h2 className="font-serif text-xl mb-1">Importar alunos — {turmaSelecionada.nome}</h2>
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
              <table className="w-full text-sm">
                <thead><tr className="text-left text-xs text-inksoft uppercase"><th>Aluno</th><th>Matrícula</th><th>Empresa</th></tr></thead>
                <tbody>
                  {resultado.empresas.map((e) => (
                    <tr key={e.id} className="border-t border-paperline"><td className="py-1">{e.aluno}</td><td>{e.matricula}</td><td>{e.nome}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

// ============================================================================
// Dashboard do professor / Usuário Mestre
// ============================================================================
function ProfessorDashboard({ perfil, onSair }) {
  const [aba, setAba] = useState("turmas");
  const abas = [
    { id: "turmas", label: "Turmas", icon: Users },
    { id: "usuarios", label: "Usuários", icon: GraduationCap },
  ];
  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="font-serif text-xl">CI — Gestão</div>
          <div className="text-xs text-inksoft flex items-center gap-1">
            {perfil.papel === "mestre" && <ShieldCheck size={14} className="text-ledger" />}
            {perfil.nome} · {perfil.papel === "mestre" ? "Usuário Mestre" : "Professor(a)"}
          </div>
        </div>
        <button onClick={onSair} className="flex items-center gap-2 text-sm text-inksoft"><LogOut size={15} /> Sair</button>
      </div>
      <div className="flex gap-2 mb-6">
        {abas.map((a) => (
          <button key={a.id} onClick={() => setAba(a.id)}
            className={`px-4 py-2 text-sm rounded-sm border ${aba === a.id ? "border-ledger bg-ledgersoft text-ledger" : "border-paperline text-inksoft"}`}>
            {a.label}
          </button>
        ))}
      </div>
      {aba === "turmas" && <GestaoTurmasView perfil={perfil} />}
      {aba === "usuarios" && (
        <Card><p className="text-sm text-inksoft">Relatórios, Backup e Auditoria entram na Etapa 2, junto com os módulos.</p></Card>
      )}
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

  if (!configPronta) return <TelaConfigPendente />;
  if (user === undefined) return <p className="p-6 text-sm text-inksoft">Carregando…</p>;
  if (!user) return <TelaLogin />;
  if (perfil === undefined) return <p className="p-6 text-sm text-inksoft">Carregando…</p>;
  if (!perfil) return <TelaEscolherPapel user={user} onDefinido={setPerfil} />;

  if (perfil.papel === "professor" || perfil.papel === "mestre") {
    return <ProfessorDashboard perfil={perfil} onSair={sair} />;
  }

  // Aluno
  if (!registroAluno) {
    return (
      <TelaInformarMatricula
        perfil={perfil}
        onSair={sair}
        onEncontrado={async (r) => {
          const empresaSnap = await window.storage.get(`empresa_${r.empresaId}`, true);
          const empresa = empresaSnap ? JSON.parse(empresaSnap.value) : null;
          setRegistroAluno({ ...r, nomeEmpresa: empresa?.nome || "(empresa não encontrada)" });
        }}
      />
    );
  }
  return <AlunoWorkspace registro={registroAluno} onSair={sair} />;
}
