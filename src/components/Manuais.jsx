import React from "react";
import { Card, Botao } from "./ModuloUI";

// Abre uma janela só com o conteúdo do manual e aciona a impressão do
// navegador — a pessoa escolhe "Salvar como PDF" como destino, gerando um
// arquivo PDF de verdade sem precisar de nenhuma biblioteca extra.
function imprimirComoPdf(titulo, html) {
  const janela = window.open("", "_blank");
  janela.document.write(`
    <html><head><title>${titulo}</title>
    <style>
      body{font-family:Georgia,serif;color:#1C2B2D;max-width:720px;margin:40px auto;line-height:1.5;}
      h1{font-size:22px;} h2{font-size:16px;border-bottom:1px solid #DCD6C6;padding-bottom:4px;margin-top:28px;}
      li{margin-bottom:4px;font-size:14px;}
    </style></head><body>${html}</body></html>
  `);
  janela.document.close();
  janela.focus();
  setTimeout(() => janela.print(), 300);
}

const CONTEUDO_PROFESSOR = `
  <h1>Manual do Professor — CI Contabilidade Intermediária</h1>
  <h2>1. Entrando na plataforma</h2>
  <ul>
    <li>Na tela inicial, selecione o perfil <strong>Professor(a)</strong> antes de clicar em "Continuar com Google".</li>
    <li>No primeiro acesso, se você for o Usuário Mestre, informe o código correspondente no campo opcional.</li>
    <li>Nos acessos seguintes, seu perfil já fica salvo — não é preciso escolher de novo.</li>
  </ul>
  <h2>2. Criando uma turma</h2>
  <ul>
    <li>No menu Gestão → Turmas, digite o nome da turma e clique em "Criar".</li>
    <li>Selecione a turma criada para importar os alunos.</li>
  </ul>
  <h2>3. Importando alunos</h2>
  <ul>
    <li><strong>Por PDF:</strong> carregue o arquivo "Estudantes da Turma" exportado do Professor On-line (SED-SC). O sistema extrai nome e matrícula automaticamente.</li>
    <li><strong>Por lista colada:</strong> escreva uma linha por aluno, no formato "Nome completo, matrícula".</li>
    <li>Uma empresa fictícia "Nome Completo LTDA" é criada automaticamente para cada aluno.</li>
    <li>A matrícula é a chave que prevalece: reimportar a lista não duplica alunos nem apaga o que eles já fizeram.</li>
  </ul>
  <h2>4. Consultando alunos</h2>
  <ul>
    <li>Ao selecionar uma turma, a lista completa de alunos (nome e matrícula) aparece automaticamente, com busca.</li>
  </ul>
  <h2>5. Suporte</h2>
  <ul>
    <li>Use o menu Suporte para abrir chamados para um aluno específico ou para o Administrador.</li>
    <li>Classifique o chamado como Suporte de Desenvolvimento (problemas técnicos) ou Suporte Pedagógico (dúvidas de conteúdo).</li>
    <li>Alunos que abrirem chamados endereçados a você aparecerão na mesma lista — você pode responder e encerrar.</li>
  </ul>
`;

const CONTEUDO_ALUNO = `
  <h1>Manual do Aluno — CI Contabilidade Intermediária</h1>
  <h2>1. Entrando na plataforma</h2>
  <ul>
    <li>Na tela inicial, selecione o perfil <strong>Aluno(a)</strong> antes de clicar em "Continuar com Google".</li>
    <li>Depois de entrar com sua conta Google, digite a matrícula informada pelo seu professor.</li>
    <li>Você será direcionado direto para a sua empresa fictícia — algo como "Seu Nome LTDA".</li>
  </ul>
  <h2>2. Navegando pelos módulos</h2>
  <ul>
    <li>Os 11 módulos aparecem no menu à esquerda, na sequência: Princípios Contábeis, Regimes, Plano de Contas, Operações com Mercadorias, DRE, Ativo Imobilizado, Créditos, PECLD, DLPA, Operações Financeiras e Estudos de Caso.</li>
    <li>Cada módulo tem abas — normalmente Teoria e uma parte prática (Simulador, Calculadora ou Estudo de Caso).</li>
  </ul>
  <h2>3. Usando o simulador de lançamentos</h2>
  <ul>
    <li>Escolha a conta, se é débito ou crédito, e o valor de cada linha.</li>
    <li>O botão "Lançar" só fica disponível quando o total de débitos é igual ao total de créditos.</li>
    <li>Seus lançamentos ficam salvos automaticamente — a DRE e a DLPA são montadas a partir deles.</li>
  </ul>
  <h2>4. Suporte</h2>
  <ul>
    <li>Use o menu Suporte para tirar dúvidas com o seu professor ou, se necessário, com o Administrador.</li>
    <li>Classifique como Suporte de Desenvolvimento (problema técnico, tela travando etc.) ou Suporte Pedagógico (dúvida sobre o conteúdo).</li>
  </ul>
`;

export function ManualProfessor() {
  return (
    <Card>
      <div className="flex justify-between items-center mb-3">
        <strong>Manual do Professor</strong>
        <Botao secondary onClick={() => imprimirComoPdf("Manual do Professor", CONTEUDO_PROFESSOR)}>Baixar PDF</Botao>
      </div>
      <div className="text-sm" dangerouslySetInnerHTML={{ __html: CONTEUDO_PROFESSOR }} />
    </Card>
  );
}

export function ManualAluno() {
  return (
    <Card>
      <div className="flex justify-between items-center mb-3">
        <strong>Manual do Aluno</strong>
        <Botao secondary onClick={() => imprimirComoPdf("Manual do Aluno", CONTEUDO_ALUNO)}>Baixar PDF</Botao>
      </div>
      <div className="text-sm" dangerouslySetInnerHTML={{ __html: CONTEUDO_ALUNO }} />
    </Card>
  );
}
