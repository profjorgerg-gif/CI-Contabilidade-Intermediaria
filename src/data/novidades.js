// Histórico de versões da plataforma CI — da mais recente para a mais antiga.
// Atualize esta lista a cada nova entrega.
export const VERSOES = [
  {
    versao: "2.3.0",
    data: "2026-08-19",
    descricao: [
      "Implantado o módulo de Suporte (Desenvolvimento e Pedagógico), com histórico de chamados e status.",
      "Turmas agora mostram a lista completa de alunos (nome e matrícula) ao serem selecionadas.",
      "Adicionado o menu Novidades e Atualizações com o histórico de versões.",
      "Adicionado backup automático ao sair do sistema, com download em .zip.",
      "Início dos Relatórios de acompanhamento por turma.",
    ],
  },
  {
    versao: "2.2.0",
    data: "2026-08-19",
    descricao: [
      "Nova tela de login, com escolha de perfil (Aluno/Professor) antes da autenticação Google.",
      "Painel do Professor reformulado com menu lateral completo (Gestão, Manuais, Outros).",
    ],
  },
  {
    versao: "2.1.0",
    data: "2026-08-19",
    descricao: [
      "Correção do caminho de publicação (GitHub Pages) que causava tela em branco.",
      "Importação de turma via PDF (Professor On-line / SED-SC), com extração automática de nome e matrícula.",
      "Matrícula passou a ser a chave que prevalece: reimportar não duplica nem apaga dados de um aluno já cadastrado.",
    ],
  },
  {
    versao: "2.0.0",
    data: "2026-08-19",
    descricao: [
      "Migração da plataforma para React + Firebase, com login Google real e dados sincronizados entre dispositivos.",
      "Portados os 11 módulos de conteúdo (teoria, simuladores, plano de contas, DRE, DLPA) do protótipo original.",
    ],
  },
  {
    versao: "1.0.0",
    data: "2026-08-18",
    descricao: [
      "Primeira versão da plataforma, em HTML único com armazenamento local: 11 módulos, plano de contas oficial (295 contas) e empresa fictícia Nova Aurora.",
    ],
  },
];
