import React from "react";
import { Card, Botao } from "./ModuloUI";
import { imprimirComoPdf } from "../lib/imprimir";

// ============================================================================
// Conteúdo do manual definido uma única vez, como dados — renderizado tanto
// como JSX (visualização dentro do app) quanto como HTML (impressão/PDF),
// no mesmo padrão visual usado nos manuais dos projetos irmãos: seções com
// barra lateral colorida, passos numerados em círculo, e caixas de destaque
// para avisos importantes.
// ============================================================================
function secao(numero, titulo, badge) { return { tipo: "secao", numero, titulo, badge }; }
function p(texto) { return { tipo: "p", texto }; }
function passo(numero, titulo, texto) { return { tipo: "passo", numero, titulo, texto }; }
function nota(titulo, texto) { return { tipo: "nota", titulo, texto }; }
function termo(nome, texto) { return { tipo: "termo", nome, texto }; }

const MANUAL_ALUNO = [
  secao("1", "Login e Primeiro Acesso"),
  p("A plataforma usa login exclusivo com conta Google — não existe cadastro com e-mail e senha."),
  passo(1, "Escolha o perfil", "Na tela inicial, escolha \"Aluno(a)\" antes de clicar em \"Continuar com Google\". Pode ser qualquer conta Google que você tiver."),
  passo(2, "Informe a matrícula", "Depois do login, digite a matrícula que o professor informou. A plataforma reconhece automaticamente sua turma e a empresa que já foi criada para você."),
  nota("Se a matrícula não for reconhecida", "Confira com o professor se a lista de alunos da turma já foi importada. Sem isso, a matrícula ainda não existe no sistema."),

  secao("2", "Sua Empresa"),
  p("Ao entrar pela primeira vez, uma empresa fictícia com o seu nome completo seguido de \"LTDA\" já foi criada automaticamente para você (ex.: \"Maria da Silva LTDA\"). Todos os lançamentos que você fizer, do Módulo 4.0 em diante, pertencem a essa mesma empresa — é ela que aparece no Dashboard, na DRE e nos Relatórios."),

  secao("3", "Os 11 Módulos"),
  p("Os módulos aparecem no menu à esquerda, na sequência: Princípios Contábeis, Regimes de Caixa e Competência, Plano de Contas, Operações com Mercadorias, DRE, Ativo Imobilizado, Créditos Vencidos, PECLD, DLPA, Operações Financeiras e Relatórios."),
  passo(1, "Teoria primeiro", "Quase todo módulo começa com uma aba de Teoria — leia antes de ir para a parte prática, principalmente na primeira vez que usar aquele módulo."),
  passo(2, "Parte prática", "Dependendo do módulo, a parte prática pode ser um Simulador de Lançamentos, uma Calculadora, Exercícios com nota, ou um Estudo de Caso."),
  nota("Os módulos usam a mesma empresa", "Diferente de módulos isolados, cada lançamento que você faz continua valendo nos módulos seguintes — a DRE do Módulo 5.0, por exemplo, é montada automaticamente a partir do que você lançou nos Módulos 4.0, 6.0, 8.0 e 10.0."),

  secao("4", "Plano de Contas (Módulo 3.0)"),
  p("Duas abas: \"Estrutura Hierárquica\" explica os níveis de conta (Grupo, Subgrupo, Sintética, Analítica) e a natureza de cada grupo. \"Consulta ao Plano de Contas\" traz as 295 contas oficiais da disciplina, pesquisável por nome ou código e filtrável por grupo."),
  nota("Contas com o ícone \"i\"", "Algumas contas têm uma observação específica do plano oficial — passe o cursor sobre o ícone \"i\" ao lado do nome da conta para ler."),

  secao("5", "Simulador de Lançamentos"),
  p("Usado nos Módulos 4.0, 6.0, 8.0 e 10.0. Cada evento guiado traz uma situação (ex.: \"compra de mercadorias a prazo\") para você montar o lançamento."),
  passo(1, "Monte as linhas", "Escolha a conta, se é débito ou crédito, e o valor de cada linha do lançamento."),
  passo(2, "Lance quando balancear", "O botão \"Lançar\" só fica disponível quando o total de débitos é igual ao total de créditos — a plataforma não deixa lançar partidas desbalanceadas."),
  passo(3, "Crie lançamentos extras se precisar", "Além dos eventos guiados, você pode clicar em \"+ Novo lançamento\" para registrar quantas operações adicionais quiser, no mesmo formato."),

  secao("6", "Exercícios e Notas"),
  p("Os Módulos 1.0, 2.0 e 3.0 têm exercícios avaliativos: 50 questões cada, divididas em 5 blocos de 10."),
  passo(1, "Responda o bloco inteiro", "É preciso responder as 10 questões do bloco antes de poder corrigir."),
  passo(2, "Corrija e veja a nota", "Ao clicar em \"Corrigir exercício\", a nota (0 a 10) aparece na hora, com a resposta certa destacada em cada questão."),
  nota("A correção é definitiva", "Depois de corrigido, o bloco fica bloqueado para edição — revise suas respostas antes de corrigir."),

  secao("7", "DRE, DLPA e Relatórios"),
  p("O Módulo 5.0 monta a Demonstração do Resultado do Exercício (DRE) completa, com todas as contas oficiais — mesmo as que ainda não tiveram movimento. Use o checkbox \"Simplificar DRE\" para ocultar as linhas zeradas."),
  p("O Módulo 9.0 (DLPA) usa o Lucro Líquido calculado na DRE como ponto de partida — você só precisa preencher o saldo inicial de Lucros Acumulados e os percentuais de Reserva Legal e Dividendos."),
  p("O Módulo 11.0 (Relatórios) reúne tudo: Livro Diário, Livro Razão, Balancete, Posição de Estoques, Operações Financeiras, a mesma DRE do Módulo 5.0, e o Balanço Patrimonial — todos com botão de imprimir/salvar."),

  secao("8", "Dashboard"),
  p("Um painel visual com a situação geral da sua empresa: resultado (lucro ou prejuízo), indicadores financeiros, quantos lançamentos você já fez em cada módulo, sua nota média nos exercícios, e o status dos estudos de caso avaliados."),

  secao("9", "Estudos de Caso Avaliados"),
  p("Os Módulos 7.0 e 11.0 pedem uma resposta escrita que é corrigida pelo professor, com nota de 0 a 10."),
  passo(1, "Escreva e salve rascunho", "Você pode salvar um rascunho quantas vezes precisar, sem enviar."),
  passo(2, "Envie para correção", "Quando estiver pronto, clique em \"Enviar para correção\" — o texto trava para edição a partir daí."),
  passo(3, "Aguarde o retorno", "Assim que o professor corrigir, a nota e um comentário (se houver) aparecem na mesma tela."),

  secao("10", "Central de Suporte"),
  p("Use o menu Suporte para abrir um chamado, classificando como Suporte de Desenvolvimento (problema técnico, tela travando) ou Suporte Pedagógico (dúvida sobre o conteúdo)."),
  passo(1, "Escolha o destino", "Você pode enviar para o Professor ou, se necessário, para o Administrador."),
  passo(2, "Acompanhe o status", "Cada chamado recebe um código (ex.: CH-0001) e mostra o status: Aberto, Em análise, Em desenvolvimento ou Encerrado."),

  secao("11", "Novidades e Atualizações"),
  p("O histórico de versões da plataforma fica disponível no menu do professor — sempre que uma atualização é feita, uma nova versão é registrada ali, da mais recente para a mais antiga."),

  secao("12", "Perguntas Frequentes"),
  passo("?", "Esqueci com qual conta Google eu entrei", "Peça ao professor para conferir, no painel de Usuários, qual e-mail está vinculado à sua matrícula."),
  passo("?", "Por que meu lançamento não pode ser feito?", "O botão \"Lançar\" só libera quando o total de débitos é igual ao total de créditos — confira se todas as linhas foram preenchidas corretamente."),
  passo("?", "Posso corrigir um exercício de novo?", "Não — depois de corrigido, o bloco fica bloqueado. Se precisar refazer, fale com o professor."),
  passo("?", "A DRE não está batendo com o que eu esperava", "Volte aos módulos de lançamento (4.0, 6.0, 8.0 ou 10.0) e confira se todas as contas usadas estão corretas — a DRE é recalculada automaticamente a cada alteração."),

  secao("13", "Glossário Contábil"),
  termo("Débito e Crédito", "Os dois lados de todo lançamento contábil. A soma dos débitos precisa ser sempre igual à soma dos créditos."),
  termo("Conta Analítica", "Conta que recebe lançamento diretamente (o nível mais detalhado do plano de contas)."),
  termo("Conta Sintética", "Conta de agrupamento, que soma o saldo de suas contas analíticas — não recebe lançamento direto."),
  termo("Conta Redutora", "Conta que diminui o valor de outra (ex.: Depreciação Acumulada reduz o valor do Ativo Imobilizado)."),
  termo("CMV", "Custo das Mercadorias Vendidas — o custo de aquisição das mercadorias que já foram vendidas no período."),
  termo("DRE", "Demonstração do Resultado do Exercício — mostra como a receita se transforma em lucro ou prejuízo."),
  termo("DLPA", "Demonstração de Lucros ou Prejuízos Acumulados — mostra a movimentação do resultado acumulado da empresa."),
  termo("PECLD", "Provisão para Perdas Estimadas em Créditos de Liquidação Duvidosa — reconhecimento antecipado de perdas prováveis com clientes."),
  termo("Balanço Patrimonial", "Demonstração que mostra o Ativo de um lado e o Passivo + Patrimônio Líquido do outro — os dois lados sempre precisam fechar no mesmo valor."),
];

const MANUAL_PROFESSOR = [
  secao("1", "Login e Primeiro Acesso"),
  passo(1, "Escolha o perfil", "Na tela inicial, escolha \"Professor(a) / Admin\" antes de clicar em \"Continuar com Google\"."),
  passo(2, "Código de Usuário Mestre (opcional)", "Se você for o Administrador da plataforma, informe o código no campo que aparece — isso só é pedido no primeiro acesso."),
  nota("Conta já cadastrada como Professor(a)?", "Se sua conta já existia antes de você precisar virar Administrador, use o link \"Sou o Usuário Mestre\" no rodapé do menu lateral para se promover, digitando o código."),

  secao("2", "Turmas e Importação de Alunos"),
  p("Em Gestão → Turmas, crie a turma e importe os alunos — por PDF (o arquivo \"Estudantes da Turma\" do Professor On-line/SED-SC) ou colando uma lista manualmente."),
  passo(1, "Crie a turma", "Digite o nome e clique em Criar. Se carregar um PDF antes, o nome sugerido já aparece automaticamente."),
  passo(2, "Importe os alunos", "Uma empresa \"Nome Completo LTDA\" é criada automaticamente para cada aluno."),
  passo(3, "Ajuste quando precisar", "Você pode adicionar um aluno novo ou remover um aluno da turma a qualquer momento, sem precisar reimportar a lista inteira."),
  nota("A matrícula é a chave que prevalece", "Reimportar a mesma matrícula nunca duplica nem apaga os dados que o aluno já lançou — só atualiza o nome, se tiver mudado."),

  secao("3", "Correções"),
  p("Em Gestão → Correções, veja os estudos de caso enviados pelos alunos (Módulos 7.0 e 11.0), separados por turma. Atribua uma nota de 0 a 10 e, se quiser, um comentário."),

  secao("4", "Relatórios e Dashboard"),
  p("Em Gestão → Relatórios, acompanhe por turma quantos lançamentos cada aluno já fez e se respondeu os estudos de caso. Em Dashboard, escolha uma turma e um aluno específico para ver o painel visual completo daquela empresa."),

  secao("5", "Suporte"),
  p("Chamados endereçados a você (Professor) aparecem na sua lista de \"Meus chamados\". Como Usuário Mestre, você vê todos os chamados da plataforma, com filtro por status (Todos, Abertos, Em análise, Em desenvolvimento, Encerrados)."),

  secao("6", "Backup"),
  p("Em Gestão → Backup, gere a qualquer momento um arquivo Backup_CI_<data>_<hora>.zip com os dados de turmas e chamados. O mesmo aviso também aparece automaticamente sempre que você sai do sistema."),
];

function ManualJSX({ itens }) {
  return (
    <div className="space-y-1">
      <div className="border rounded-sm px-4 py-3 mb-5" style={{ borderColor: "#33443F", background: "#182524" }}>
        <strong className="text-xs uppercase tracking-wide" style={{ color: "#93A39F" }}>Sumário</strong>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 mt-2">
          {itens.filter((i) => i.tipo === "secao").map((s) => (
            <a key={s.numero} href={`#sec-${s.numero}`} className="text-sm py-0.5 block hover:underline" style={{ color: "#C79A56" }}>
              {s.numero}. {s.titulo}
            </a>
          ))}
        </div>
      </div>

      {itens.map((item, i) => {
        if (item.tipo === "secao") {
          return (
            <div key={i} id={`sec-${item.numero}`} className="pt-4 mt-2" style={{ borderLeft: "4px solid #C79A56", paddingLeft: 12 }}>
              <strong className="text-base">{item.numero}. {item.titulo}</strong>
              {item.badge && <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full border" style={{ borderColor: "#C79A56", color: "#C79A56" }}>{item.badge}</span>}
            </div>
          );
        }
        if (item.tipo === "p") return <p key={i} className="text-sm mb-2" style={{ color: "#D8DEDB" }}>{item.texto}</p>;
        if (item.tipo === "passo") {
          return (
            <div key={i} className="flex gap-3 mb-2">
              <div className="shrink-0 w-6 h-6 rounded-full border flex items-center justify-center text-xs mt-0.5" style={{ borderColor: "#C79A56", color: "#C79A56" }}>{item.numero}</div>
              <div>
                <strong className="block text-sm">{item.titulo}</strong>
                <p className="text-sm" style={{ color: "#93A39F" }}>{item.texto}</p>
              </div>
            </div>
          );
        }
        if (item.tipo === "nota") {
          return (
            <div key={i} className="rounded-sm px-3 py-2 text-sm my-3" style={{ border: "1px solid #C79A56", background: "rgba(199,154,86,0.08)" }}>
              <strong>{item.titulo}: </strong><span style={{ color: "#D8DEDB" }}>{item.texto}</span>
            </div>
          );
        }
        if (item.tipo === "termo") {
          return (
            <div key={i} className="mb-2">
              <strong className="text-sm">{item.nome}</strong>
              <p className="text-sm" style={{ color: "#93A39F" }}>{item.texto}</p>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

function manualParaHtml(titulo, itens) {
  const sumario = itens.filter((i) => i.tipo === "secao")
    .map((s) => `<div style="font-size:13px;color:#8A5A2B;">${s.numero}. ${s.titulo}</div>`).join("");

  const corpo = itens.map((item) => {
    if (item.tipo === "secao") return `<h2 style="border-left:4px solid #C79A56;padding-left:10px;">${item.numero}. ${item.titulo}</h2>`;
    if (item.tipo === "p") return `<p>${item.texto}</p>`;
    if (item.tipo === "passo") return `<p><strong>${item.numero}. ${item.titulo}</strong><br/>${item.texto}</p>`;
    if (item.tipo === "nota") return `<p style="border:1px solid #C79A56;padding:8px 10px;background:#FBF3E7;"><strong>${item.titulo}:</strong> ${item.texto}</p>`;
    if (item.tipo === "termo") return `<p><strong>${item.nome}</strong><br/>${item.texto}</p>`;
    return "";
  }).join("");

  return `
    <h1>${titulo}</h1>
    <p style="color:#5B6B6C;">CEDUP Hermann Hering — Curso Técnico em Contabilidade · CI Contabilidade Intermediária</p>
    <h2>Sumário</h2>
    ${sumario}
    ${corpo}
  `;
}

export function ManualProfessor() {
  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <div>
          <strong className="block">Manual do Professor</strong>
          <span className="text-xs" style={{ color: "#93A39F" }}>CI — Contabilidade Intermediária</span>
        </div>
        <Botao secondary onClick={() => imprimirComoPdf("Manual do Professor", manualParaHtml("Manual do Professor", MANUAL_PROFESSOR))}>Baixar PDF</Botao>
      </div>
      <ManualJSX itens={MANUAL_PROFESSOR} />
    </Card>
  );
}

export function ManualAluno() {
  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <div>
          <strong className="block">Manual do Aluno</strong>
          <span className="text-xs" style={{ color: "#93A39F" }}>CI — Contabilidade Intermediária</span>
        </div>
        <Botao secondary onClick={() => imprimirComoPdf("Manual do Aluno", manualParaHtml("Manual do Aluno", MANUAL_ALUNO))}>Baixar PDF</Botao>
      </div>
      <ManualJSX itens={MANUAL_ALUNO} />
    </Card>
  );
}
