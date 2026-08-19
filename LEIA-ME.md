# CI — Contabilidade Intermediária (Etapa 1: infraestrutura)

Este pacote é o início da migração da CI para a mesma arquitetura do projeto
PPFCHH (React + Firebase), com login Google, matrícula, empresa automática
por aluno e sincronização entre dispositivos.

## O que já funciona nesta etapa

- Login exclusivo por conta Google
- Primeiro acesso: pessoa escolhe se é professor(a) ou aluno(a) (com código
  de Usuário Mestre opcional para professor)
- Professor cria turma e cola a lista de alunos (`Nome completo, matrícula`)
  — uma empresa **"Nome Completo LTDA"** é criada automaticamente para cada
  aluno
- Aluno digita a matrícula e cai direto na própria empresa (sem precisar
  escolher entre uma lista — diferente do PPFCHH, aqui é 1 aluno = 1 empresa)
- Todos os dados ficam no Firestore (não mais no localStorage do navegador),
  então funcionam em qualquer dispositivo

## O que ainda NÃO está aqui (entra na Etapa 2)

- Os 11 módulos de conteúdo (Teoria, simuladores, plano de contas, DRE,
  DLPA etc.) — ainda estão só no protótipo em HTML único
- Relatórios, Backup e Auditoria (painel de Gestão) — só o esqueleto de
  Turmas e Usuários foi feito
- Importação de lista de alunos via PDF (por enquanto, é por lista colada)

## Passo a passo para colocar no ar

### 1. Criar o projeto no Firebase
1. Acesse [console.firebase.google.com](https://console.firebase.google.com)
   e crie um projeto novo (ex.: `ci-contabilidade-intermediaria`).
2. Em **Build → Authentication → Sign-in method**, ative o provedor
   **Google**.
3. Em **Build → Firestore Database**, crie o banco em modo produção,
   região `southamerica-east1`.
4. Em **Configurações do projeto → Geral → Seus apps**, clique em criar um
   app da Web (ícone `</>`) e copie o objeto de configuração que aparece.
5. Cole esses valores em `src/lib/firebaseApp.js`, substituindo os
   `"COLE_AQUI"`.

### 2. Regras de segurança do Firestore
No Firebase Console, em **Firestore Database → Regras**, use como ponto de
partida (ajustar depois conforme a necessidade):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /ci_dados/{docId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

Isso permite que qualquer pessoa **logada** (via Google) leia e escreva —
suficiente para começar, mas vale revisar antes de divulgar o link
amplamente (por exemplo, restringindo escrita de dados de gestão só a
professores).

### 3. Trocar o código de Usuário Mestre
Em `src/lib/firebaseAuth.js`, troque o valor de `CODIGO_MESTRE` por um
código só seu, antes de publicar.

### 4. Criar o repositório no GitHub
1. Crie um repositório novo (ex.: `CI-Contabilidade-Intermediaria`).
2. Suba todo o conteúdo desta pasta para ele.
3. Em `vite.config.js`, troque `NOME-DO-REPOSITORIO` pelo nome real do
   repositório.
4. No repositório, vá em **Settings → Pages** e configure a fonte como
   **GitHub Actions**.
5. Qualquer push na branch `main` vai publicar automaticamente (o workflow
   já está em `.github/workflows/deploy.yml`).

### 5. Testar localmente (opcional, antes de publicar)
Com Node.js instalado:
```
npm install
npm run dev
```

## Para continuar o desenvolvimento numa próxima conversa com o Claude

Anexe este `LEIA-ME.md` + a pasta `src/` inteira — isso dá contexto
suficiente para portar os 11 módulos (Etapa 2) a partir do protótipo em
HTML único já existente.
