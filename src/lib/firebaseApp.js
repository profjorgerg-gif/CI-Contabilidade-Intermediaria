// ============================================================================
// Inicialização do Firebase + API de armazenamento (window.storage)
// ============================================================================
// Este arquivo NÃO existia no backup do PPFCHH (gap conhecido, registrado no
// LEIA-ME dele). Foi escrito aqui do zero para a CI, replicando o padrão
// window.storage.get/set/delete/list usado no PPFCHH (useSharedList,
// useSharedObject) — a mesma interface que os artifacts do Claude usam,
// implementada aqui sobre o Firestore de verdade.
//
// PASSO A PASSO PARA CONFIGURAR (fora deste chat):
// 1. Acesse https://console.firebase.google.com e crie um projeto novo,
//    dedicado só à CI (ex.: "ci-contabilidade-intermediaria").
// 2. Em Build > Authentication > Sign-in method, ative o provedor "Google".
// 3. Em Build > Firestore Database, crie o banco (modo produção), região
//    southamerica-east1 (mesma região do PPFCHH, para ficar mais rápido
//    a partir do Brasil).
// 4. Em Configurações do projeto > Geral > Seus apps, crie um "app da Web"
//    e copie o objeto de configuração para FIREBASE_CONFIG abaixo.
// ============================================================================
import { initializeApp } from "firebase/app";
import {
  getFirestore, doc, getDoc, setDoc, deleteDoc,
  collection, query, where, getDocs,
} from "firebase/firestore";

// TODO: substitua pelos valores reais do SEU projeto Firebase (passo 4 acima).
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAr0NTZmDWj8KjoQKB-c-ke8XPtijDjeQ4",
  authDomain: "ci-contabilidade-intermediaria.firebaseapp.com",
  projectId: "ci-contabilidade-intermediaria",
  storageBucket: "ci-contabilidade-intermediaria.firebasestorage.app",
  messagingSenderId: "262467574757",
  appId: "1:262467574757:web:03c30c5f2330077c9e6d0c",
};

const configPronta = FIREBASE_CONFIG.apiKey !== "COLE_AQUI";

export const app = configPronta ? initializeApp(FIREBASE_CONFIG) : null;
const db = app ? getFirestore(app) : null;

// Nome da coleção única do Firestore onde tudo fica guardado, chave a chave —
// mesma lógica de "banco chave-valor" do PPFCHH, mais simples de administrar
// do que modelar uma coleção por tipo de dado.
const COLECAO = "ci_dados";

// Uma chave "shared" (visível para qualquer usuário autenticado — turmas,
// matrículas, planos de contas) fica em ci_dados/{chave}. Uma chave pessoal
// (dados só do próprio usuário) fica em ci_dados/{uid}__{chave}, isolando por
// usuário logado.
function chaveDocumento(chave, shared, uid) {
  return shared ? chave : `${uid || "anon"}__${chave}`;
}

function criarWindowStorage(getUid) {
  return {
    async get(chave, shared = false) {
      if (!db) throw new Error("Firebase não configurado (veja firebaseApp.js).");
      const ref = doc(db, COLECAO, chaveDocumento(chave, shared, getUid()));
      const snap = await getDoc(ref);
      if (!snap.exists()) return null;
      const dados = snap.data();
      return { key: chave, value: dados.value, shared };
    },
    async set(chave, valor, shared = false) {
      if (!db) throw new Error("Firebase não configurado (veja firebaseApp.js).");
      const ref = doc(db, COLECAO, chaveDocumento(chave, shared, getUid()));
      await setDoc(ref, { key: chave, value: valor, shared, atualizadoEm: Date.now() });
      return { key: chave, value: valor, shared };
    },
    async delete(chave, shared = false) {
      if (!db) throw new Error("Firebase não configurado (veja firebaseApp.js).");
      const ref = doc(db, COLECAO, chaveDocumento(chave, shared, getUid()));
      await deleteDoc(ref);
      return { key: chave, deleted: true, shared };
    },
    async list(prefixo = "", shared = false) {
      if (!db) throw new Error("Firebase não configurado (veja firebaseApp.js).");
      // Firestore não tem "LIKE" nativo — usamos um truque de intervalo de
      // string (prefixo <= key < prefixo + caractere alto) para simular
      // busca por prefixo sem precisar baixar a coleção inteira.
      const col = collection(db, COLECAO);
      const inicio = shared ? prefixo : `${getUid() || "anon"}__${prefixo}`;
      const fim = inicio + "\uf8ff";
      const q = query(col, where("__name__", ">=", inicio), where("__name__", "<", fim));
      const snap = await getDocs(q);
      const chaves = [];
      snap.forEach((d) => chaves.push(d.data().key));
      return { keys: chaves, prefix: prefixo, shared };
    },
  };
}

// Precisa ser chamado uma vez, depois que sabemos o uid da pessoa logada
// (veja src/lib/firebaseAuth.js), para que as chamadas pessoais (shared=false)
// fiquem isoladas por usuário.
let uidAtual = null;
export function definirUsuarioAtual(uid) {
  uidAtual = uid;
}

if (typeof window !== "undefined") {
  window.storage = criarWindowStorage(() => uidAtual);
}

export { configPronta };
