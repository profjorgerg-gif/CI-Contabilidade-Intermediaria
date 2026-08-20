// Conteúdo dos módulos (teoria em HTML, eventos dos simuladores, casos de estudo)
// extraído verbatim da versão vanilla (index.html) já aprovada pelo professor.

export const EMPRESA = {
  "nome": "Nova Aurora Comércio de Materiais de Construção Ltda.",
  "cnpjFicticio": "12.345.678/0001-90",
  "ramo": "Comércio varejista de materiais de construção",
  "regime": "Lucro Presumido — Regime Normal (não optante do Simples)",
  "descricao": "Empresa fictícia usada em todos os módulos práticos da disciplina. Compra mercadorias de fornecedores para revenda e concede prazo a parte dos clientes."
};

export const CONTAS_M4 = [
  {
    "codigo": "1.1.1.01",
    "nome": "Caixa Geral"
  },
  {
    "codigo": "1.1.1.02",
    "nome": "Bancos Conta Movimento"
  },
  {
    "codigo": "1.1.2.02",
    "nome": "Clientes"
  },
  {
    "codigo": "1.1.3.01",
    "nome": "Mercadorias para Revenda"
  },
  {
    "codigo": "1.1.2.11",
    "nome": "ICMS a Recuperar"
  },
  {
    "codigo": "2.1.1.01",
    "nome": "Duplicatas a Pagar"
  },
  {
    "codigo": "2.1.8.04",
    "nome": "ICMS"
  },
  {
    "codigo": "4.1.1.01",
    "nome": "Receita de Vendas de Mercadorias"
  },
  {
    "codigo": "4.2.06",
    "nome": "(-) Devoluções de Vendas"
  },
  {
    "codigo": "6.2.01",
    "nome": "Custo das Mercadorias Vendidas (CMV)"
  }
];
export const EVENTOS_M4 = [
  {
    "id": "e1",
    "titulo": "Compra a prazo, com ICMS a recuperar",
    "narrativa": "A Nova Aurora compra R$ 20.000 em mercadorias do fornecedor Ferragens Sul Ltda., a prazo (30 dias). A nota fiscal destaca ICMS de 18% (R$ 3.600), recuperável pela empresa."
  },
  {
    "id": "e2",
    "titulo": "Compra à vista, sem ICMS recuperável",
    "narrativa": "Compra à vista de R$ 5.000 em mercadorias, paga via banco. O fornecedor é optante do Simples Nacional, logo não há ICMS destacado a recuperar."
  },
  {
    "id": "e3",
    "titulo": "Venda a prazo — reconhecimento da receita",
    "narrativa": "Venda a prazo (recebimento em 60 dias) de mercadorias por R$ 12.000 à Construtora Ipê Ltda. Registre apenas o reconhecimento da receita de vendas."
  },
  {
    "id": "e4",
    "titulo": "Venda a prazo — baixa do CMV",
    "narrativa": "Para a mesma venda do evento anterior, o custo da mercadoria vendida foi de R$ 7.200. Registre a baixa do estoque e o reconhecimento do CMV."
  },
  {
    "id": "e5",
    "titulo": "Devolução de venda",
    "narrativa": "A Construtora Ipê devolveu parte da mercadoria vendida, no valor de R$ 1.500 (preço de venda). Registre a devolução de vendas (desconsidere, por ora, o efeito sobre o CMV)."
  },
  {
    "id": "e6",
    "titulo": "Devolução de compra",
    "narrativa": "A Nova Aurora devolveu ao fornecedor Ferragens Sul R$ 2.000 em mercadorias compradas no evento 1 (valor líquido de ICMS, para simplificar)."
  },
  {
    "id": "e7",
    "titulo": "Venda à vista, com recebimento em caixa",
    "narrativa": "Venda à vista de mercadorias por R$ 4.800, recebida em dinheiro (Caixa Geral). O custo da mercadoria vendida foi de R$ 2.900 — registre receita, CMV e baixa do estoque."
  },
  {
    "id": "e8",
    "titulo": "Recebimento de duplicata de cliente",
    "narrativa": "A Construtora Ipê Ltda. quitou R$ 6.000 da duplicata em aberto (venda do evento 3), com o valor depositado em conta bancária."
  },
  {
    "id": "e9",
    "titulo": "Pagamento a fornecedor",
    "narrativa": "A Nova Aurora pagou R$ 10.000 ao fornecedor Ferragens Sul, referente à compra a prazo do evento 1, via transferência bancária."
  },
  {
    "id": "e10",
    "titulo": "Compra a prazo de nova mercadoria, com ICMS",
    "narrativa": "Compra a prazo (45 dias) de R$ 8.500 em mercadorias de um novo fornecedor, com ICMS de 18% (R$ 1.530) destacado na nota e recuperável."
  }
];
export const TEORIA_M4_HTML = "\n  <div class=\"card\">\n    <strong style=\"display:block;margin-bottom:6px;\">Empresa fictícia do módulo</strong>\n    <p style=\"font-size:13.5px;color:var(--ink-soft);margin:0;\">\n      <strong>Nova Aurora Comércio de Materiais de Construção Ltda.</strong> — Comércio varejista de materiais de construção. CNPJ fictício 12.345.678/0001-90. Lucro Presumido — Regime Normal (não optante do Simples).\n      Empresa fictícia usada em todos os módulos práticos da disciplina. Compra mercadorias de fornecedores para revenda e concede prazo a parte dos clientes.\n    </p>\n  </div>\n  <div class=\"card\">\n    <strong style=\"display:block;margin-bottom:6px;\">O que são Operações com Mercadorias</strong>\n    <p style=\"font-size:13.5px;color:var(--ink-soft);\">\n      Envolvem a compra de mercadorias para revenda e sua posterior venda, incluindo devoluções e os tributos\n      incidentes (como o ICMS). Diferente de uma prestação de serviço, a operação com mercadorias gera dois\n      efeitos contábeis na venda: o reconhecimento da <em>receita</em> e a baixa do <em>custo</em> (CMV) — os dois\n      lançamentos aparecem separados nos eventos 3 e 4 do simulador abaixo.\n    </p>\n  </div>\n  <div class=\"card\">\n    <strong style=\"display:block;margin-bottom:6px;\">ICMS a Recuperar x ICMS a Recolher</strong>\n    <p style=\"font-size:13.5px;color:var(--ink-soft);\">\n      Na compra, o ICMS destacado na nota do fornecedor é um direito da empresa (ICMS a Recuperar, no Ativo).\n      Na venda, o ICMS devido é uma obrigação (ICMS a Recolher, no Passivo). A diferença entre os dois é o que,\n      de fato, será pago ao fisco no período — esse encontro de contas não é tratado neste módulo, mas fica\n      registrado no plano de contas para os módulos seguintes.\n    </p>\n  </div>\n  <div class=\"card\">\n    <strong style=\"display:block;margin-bottom:6px;\">Plano de contas usado neste módulo</strong>\n    <table class=\"mgmt\">\n      <thead><tr><th>Código</th><th>Conta</th></tr></thead>\n      <tbody><tr><td>1.1.1.01</td><td>Caixa Geral</td></tr><tr><td>1.1.1.02</td><td>Bancos Conta Movimento</td></tr><tr><td>1.1.2.02</td><td>Clientes</td></tr><tr><td>1.1.3.01</td><td>Mercadorias para Revenda</td></tr><tr><td>1.1.2.11</td><td>ICMS a Recuperar</td></tr><tr><td>2.1.1.01</td><td>Duplicatas a Pagar</td></tr><tr><td>2.1.8.04</td><td>ICMS</td></tr><tr><td>4.1.1.01</td><td>Receita de Vendas de Mercadorias</td></tr><tr><td>4.2.06</td><td>(-) Devoluções de Vendas</td></tr><tr><td>6.2.01</td><td>Custo das Mercadorias Vendidas (CMV)</td></tr></tbody>\n    </table>\n  </div>\n";
export const CASO_M4_HTML = "\n  <div class=\"card\">\n    <strong style=\"display:block;margin-bottom:6px;\">Estudo de caso — Fechamento do mês</strong>\n    <p style=\"font-size:13.5px;color:var(--ink-soft);\">\n      Depois de lançar os seis eventos na aba <em>Simulador de Lançamentos</em>, responda:\n    </p>\n    <ol style=\"font-size:13.5px;color:var(--ink-soft);padding-left:18px;\">\n      <li>Qual foi o saldo final da conta Estoque de Mercadorias após todos os eventos?</li>\n      <li>Qual foi a margem bruta da venda registrada nos eventos 3 e 4 (receita − CMV), sem considerar a devolução?</li>\n      <li>Como a devolução de venda (evento 5) afeta o resultado do período, mesmo sem alterar o CMV?</li>\n      <li>Se a Nova Aurora tivesse comprado do mesmo fornecedor do evento 2, mas optante do regime normal, o que mudaria no lançamento?</li>\n    </ol>\n    <p style=\"font-size:13px;color:var(--ink-soft);\">Use a tabela de <em>Saldo acumulado</em> do simulador como apoio para responder.</p>\n    <textarea id=\"respostaCasoM4\" placeholder=\"Digite suas respostas aqui...\" style=\"width:100%;min-height:140px;margin-top:10px;padding:10px;border:1px solid var(--paper-line);border-radius:2px;font-family:var(--sans);font-size:13.5px;\"></textarea>\n    <div style=\"margin-top:10px;\"><button class=\"action\" id=\"salvarRespostaCasoM4\">Salvar respostas</button></div>\n  </div>\n";

export const CONTAS_M6 = [
  {
    "codigo": "1.1.1.02",
    "nome": "Bancos Conta Movimento"
  },
  {
    "codigo": "1.2.3.03",
    "nome": "Veículos"
  },
  {
    "codigo": "1.2.3.07",
    "nome": "Equipamentos de Informática"
  },
  {
    "codigo": "1.2.3.53",
    "nome": "(-) Depreciação Acumulada Veículos"
  },
  {
    "codigo": "1.2.3.57",
    "nome": "(-) Depreciação Acumulada Equipamentos de Informática"
  },
  {
    "codigo": "2.1.1.01",
    "nome": "Duplicatas a Pagar"
  },
  {
    "codigo": "5.1.10",
    "nome": "Depreciação"
  },
  {
    "codigo": "5.4.01",
    "nome": "Perdas Diversas"
  },
  {
    "codigo": "4.4.04",
    "nome": "Ganho na Venda de Imobilizado"
  }
];
export const EVENTOS_M6 = [
  {
    "id": "e1",
    "titulo": "Compra de imobilizado à vista",
    "narrativa": "A Nova Aurora compra um veículo utilitário para entregas por R$ 60.000, pago à vista via banco."
  },
  {
    "id": "e2",
    "titulo": "Compra de imobilizado a prazo",
    "narrativa": "Compra de equipamentos de informática por R$ 15.000, a prazo, do fornecedor TechOffice Ltda."
  },
  {
    "id": "e3",
    "titulo": "Registro da depreciação anual — veículo",
    "narrativa": "Ao final do primeiro ano de uso, registre a depreciação anual do veículo (vida útil de 5 anos, sem valor residual, método linear). Use a aba Calculadora de Depreciação para obter o valor exato antes de lançar."
  },
  {
    "id": "e4",
    "titulo": "Venda de imobilizado com ganho",
    "narrativa": "Após 2 anos de uso, a empresa vende os equipamentos de informática do evento 2 (custo R$ 15.000, depreciação acumulada de R$ 6.000 até a data da venda) por R$ 10.000 à vista. Registre a baixa do bem, da depreciação acumulada, o recebimento e o resultado da alienação (ganho ou perda)."
  },
  {
    "id": "e5",
    "titulo": "Baixa por obsolescência",
    "narrativa": "Um computador antigo, já totalmente depreciado (custo R$ 3.000, depreciação acumulada R$ 3.000), é baixado por obsolescência, sem qualquer valor de venda."
  },
  {
    "id": "e6",
    "titulo": "Compra de mais um veículo, a prazo",
    "narrativa": "A Nova Aurora compra outro veículo utilitário por R$ 45.000, a prazo (90 dias) com a concessionária."
  },
  {
    "id": "e7",
    "titulo": "Depreciação do segundo ano — veículo",
    "narrativa": "Registre a depreciação do segundo ano do veículo do evento 1, usando o mesmo método linear (vida útil de 5 anos, sem valor residual)."
  },
  {
    "id": "e8",
    "titulo": "Venda de equipamento com perda",
    "narrativa": "A empresa vende um equipamento de informática (custo R$ 8.000, depreciação acumulada R$ 5.000) por R$ 2.500 à vista. Registre a baixa do bem, da depreciação acumulada, o recebimento e a perda na alienação."
  },
  {
    "id": "e9",
    "titulo": "Pagamento de parcela de veículo financiado",
    "narrativa": "Pagamento de R$ 15.000 ao fornecedor, referente à compra a prazo do evento 6, via transferência bancária."
  }
];
export const TEORIA_M6_HTML = "\n  <div class=\"card\">\n    <strong style=\"display:block;margin-bottom:6px;\">Ativo Imobilizado</strong>\n    <p style=\"font-size:13.5px;color:var(--ink-soft);\">\n      São os bens tangíveis de uso duradouro na atividade da empresa (veículos, máquinas, equipamentos, imóveis),\n      não destinados à venda. O valor desses bens é reconhecido no Ativo e vai sendo reduzido ao longo do tempo\n      pela <em>depreciação</em>, que reflete o desgaste ou a perda de utilidade econômica do bem.\n    </p>\n  </div>\n  <div class=\"card\">\n    <strong style=\"display:block;margin-bottom:6px;\">Depreciação Acumulada — uma conta redutora</strong>\n    <p style=\"font-size:13.5px;color:var(--ink-soft);\">\n      A depreciação não reduz diretamente a conta do bem; ela é acumulada numa conta redutora do Ativo\n      (Depreciação Acumulada). O valor contábil líquido do bem é sempre: <strong>custo − depreciação acumulada</strong>.\n      Isso permite que o histórico de custo original do bem continue visível no balanço.\n    </p>\n  </div>\n  <div class=\"card\">\n    <strong style=\"display:block;margin-bottom:6px;\">Método linear (cotas constantes)</strong>\n    <p style=\"font-size:13.5px;color:var(--ink-soft);\">\n      É o método mais usado na contabilidade intermediária: divide-se o valor depreciável (custo − valor residual)\n      pela vida útil estimada, gerando uma cota de depreciação igual a cada período. Use a aba\n      <em>Calculadora de Depreciação</em> para montar a tabela ano a ano de qualquer bem.\n    </p>\n  </div>\n  <div class=\"card\">\n    <strong style=\"display:block;margin-bottom:6px;\">Venda ou baixa do bem</strong>\n    <p style=\"font-size:13.5px;color:var(--ink-soft);\">\n      Na venda, comparam-se o valor recebido com o valor contábil líquido do bem (custo − depreciação acumulada\n      até a data). Se o valor recebido for maior, há <em>ganho</em> na alienação; se for menor, há <em>perda</em>.\n      Na baixa por obsolescência sem venda, todo o valor contábil líquido remanescente vira perda.\n    </p>\n  </div>\n  <div class=\"card\">\n    <strong style=\"display:block;margin-bottom:6px;\">Plano de contas usado neste módulo</strong>\n    <table class=\"mgmt\">\n      <thead><tr><th>Código</th><th>Conta</th></tr></thead>\n      <tbody><tr><td>1.1.1.02</td><td>Bancos Conta Movimento</td></tr><tr><td>1.2.3.03</td><td>Veículos</td></tr><tr><td>1.2.3.07</td><td>Equipamentos de Informática</td></tr><tr><td>1.2.3.53</td><td>(-) Depreciação Acumulada Veículos</td></tr><tr><td>1.2.3.57</td><td>(-) Depreciação Acumulada Equipamentos de Informática</td></tr><tr><td>2.1.1.01</td><td>Duplicatas a Pagar</td></tr><tr><td>5.1.10</td><td>Depreciação</td></tr><tr><td>5.4.01</td><td>Perdas Diversas</td></tr><tr><td>4.4.04</td><td>Ganho na Venda de Imobilizado</td></tr></tbody>\n    </table>\n  </div>\n";

export const TEORIA_M7_HTML = "\n  <div class=\"card\">\n    <strong style=\"display:block;margin-bottom:6px;\">O que são créditos vencidos e não liquidados</strong>\n    <p style=\"font-size:13.5px;color:var(--ink-soft);\">\n      São valores a receber (duplicatas, notas promissórias, cheques) cujo prazo de pagamento já passou e que\n      ainda não foram recebidos pela empresa. Enquanto o crédito está \"no prazo\", ele fica registrado normalmente\n      em Clientes (1.1.2.02); quando vence sem liquidação, ele continua contabilmente na mesma conta, mas passa a\n      exigir acompanhamento — é o primeiro sinal de que pode se tornar uma perda.\n    </p>\n  </div>\n  <div class=\"card\">\n    <strong style=\"display:block;margin-bottom:6px;\">Por que controlar por faixa de atraso (aging)</strong>\n    <p style=\"font-size:13.5px;color:var(--ink-soft);\">\n      Quanto mais tempo um título fica em atraso, menor a chance de recebimento. Por isso, empresas organizam\n      os créditos vencidos em faixas de atraso — por exemplo, até 30 dias, de 31 a 60, de 61 a 90 e acima de 90 dias —\n      e costumam aplicar percentuais de perda estimada maiores conforme a faixa piora. Essa é exatamente a lógica\n      usada no módulo seguinte para calcular a PECLD.\n    </p>\n  </div>\n  <div class=\"card\">\n    <strong style=\"display:block;margin-bottom:6px;\">Relação com o Módulo 8.0 (PECLD)</strong>\n    <p style=\"font-size:13.5px;color:var(--ink-soft);\">\n      Este módulo não gera lançamento contábil por si só — ele organiza a informação (quais clientes, quanto,\n      há quanto tempo em atraso) que será usada no Módulo 8.0 para calcular e lançar a Provisão para Perdas\n      Estimadas em Créditos de Liquidação Duvidosa. Use a tabela do Estudo de Caso abaixo como base.\n    </p>\n  </div>\n";
export const CREDITOS_M7 = [
  {
    "cliente": "Construtora Ipê Ltda.",
    "valor": 12000,
    "vencimento": "15/06/2026",
    "diasAtraso": 64,
    "faixa": "61 a 90 dias"
  },
  {
    "cliente": "Mercado Bom Preço Ltda.",
    "valor": 3200,
    "vencimento": "30/07/2026",
    "diasAtraso": 19,
    "faixa": "Até 30 dias"
  },
  {
    "cliente": "Serralheria Pontual Ltda.",
    "valor": 5400,
    "vencimento": "10/05/2026",
    "diasAtraso": 100,
    "faixa": "Mais de 90 dias"
  },
  {
    "cliente": "Auto Peças Rio Ltda.",
    "valor": 1800,
    "vencimento": "05/07/2026",
    "diasAtraso": 44,
    "faixa": "31 a 60 dias"
  }
];
export const CASO_M7_HTML = "\n  <div class=\"card\">\n    <strong style=\"display:block;margin-bottom:6px;\">Estudo de caso — Posição de créditos vencidos da Nova Aurora</strong>\n    <p style=\"font-size:13.5px;color:var(--ink-soft);margin:0 0 14px;\">\n      Em 18/08/2026, o setor financeiro da <strong>Nova Aurora Comércio de Materiais de Construção Ltda.</strong> levantou os títulos de clientes\n      vencidos e ainda não recebidos, incluindo a venda à Construtora Ipê registrada no Módulo 4.0:\n    </p>\n    <table class=\"mgmt\">\n      <thead><tr><th>Cliente</th><th>Valor do título</th><th>Vencimento</th><th>Dias em atraso</th><th>Faixa</th></tr></thead>\n      <tbody>\n        <tr><td>Construtora Ipê Ltda.</td><td>R$ 12.000,00</td><td>15/06/2026</td><td>64</td><td>61 a 90 dias</td></tr>\n      \n        <tr><td>Mercado Bom Preço Ltda.</td><td>R$ 3.200,00</td><td>30/07/2026</td><td>19</td><td>Até 30 dias</td></tr>\n      \n        <tr><td>Serralheria Pontual Ltda.</td><td>R$ 5.400,00</td><td>10/05/2026</td><td>100</td><td>Mais de 90 dias</td></tr>\n      \n        <tr><td>Auto Peças Rio Ltda.</td><td>R$ 1.800,00</td><td>05/07/2026</td><td>44</td><td>31 a 60 dias</td></tr>\n      </tbody>\n    </table>\n    <p style=\"font-size:13px;color:var(--ink-soft);margin-top:14px;\">Responda:</p>\n    <ol style=\"font-size:13.5px;color:var(--ink-soft);padding-left:18px;\">\n      <li>Qual é o valor total em atraso, somando todos os clientes?</li>\n      <li>Qual cliente representa o maior risco de perda, considerando o tempo de atraso?</li>\n      <li>Se a empresa aplicasse um percentual de perda estimada crescente por faixa (ex: 2% até 30 dias, 10% de 31 a 60, 30% de 61 a 90, 60% acima de 90), qual seria a provisão total? Guarde esse cálculo — ele será a base do Módulo 8.0.</li>\n    </ol>\n    <textarea id=\"respostaCasoM7\" placeholder=\"Digite suas respostas aqui...\" style=\"width:100%;min-height:140px;margin-top:10px;padding:10px;border:1px solid var(--paper-line);border-radius:2px;font-family:var(--sans);font-size:13.5px;\"></textarea>\n    <div style=\"margin-top:10px;\"><button class=\"action\" id=\"salvarRespostaCasoM7\">Salvar respostas</button></div>\n  </div>\n";

export const TEORIA_M8_HTML = "\n  <div class=\"card\">\n    <strong style=\"display:block;margin-bottom:6px;\">O que é a PECLD</strong>\n    <p style=\"font-size:13.5px;color:var(--ink-soft);\">\n      É o reconhecimento antecipado, por estimativa, das perdas prováveis com clientes que podem não pagar.\n      Em vez de esperar a certeza da perda para baixar o crédito, a empresa constitui uma provisão — respeitando\n      o princípio da prudência — que reduz o valor dos créditos no balanço sem eliminar o direito de cobrança.\n    </p>\n  </div>\n  <div class=\"card\">\n    <strong style=\"display:block;margin-bottom:6px;\">Como se calcula</strong>\n    <p style=\"font-size:13.5px;color:var(--ink-soft);\">\n      O método mais comum na contabilidade intermediária é aplicar um percentual de perda estimada sobre cada\n      faixa de atraso (aging), como as que você já viu no Módulo 7.0: quanto maior o atraso, maior o percentual.\n      A soma da provisão de todos os clientes é o valor total a constituir.\n    </p>\n  </div>\n  <div class=\"card\">\n    <strong style=\"display:block;margin-bottom:6px;\">Lançamento de constituição</strong>\n    <p style=\"font-size:13.5px;color:var(--ink-soft);\">\n      Débito em <strong>Despesa com PECLD</strong> (5.1.13) e crédito em <strong>(-) Provisão para Créditos de\n      Liquidação Duvidosa</strong> (1.1.2.99), pelo valor total calculado. A despesa afeta o resultado do\n      período; a provisão reduz o saldo de Clientes no balanço (é uma conta redutora do ativo).\n    </p>\n  </div>\n  <div class=\"card\">\n    <strong style=\"display:block;margin-bottom:6px;\">Reversão da provisão</strong>\n    <p style=\"font-size:13.5px;color:var(--ink-soft);\">\n      Se um cliente que tinha provisão constituída acaba pagando, a parcela da provisão referente a ele deixa\n      de ser necessária. O lançamento é o inverso: débito em Provisão para Créditos de Liquidação Duvidosa e\n      crédito em Despesa com PECLD (reduzindo a despesa do período, quando a reversão ocorre antes do fechamento).\n    </p>\n  </div>\n";
export const CONTAS_M8 = [
  {
    "codigo": "5.1.13",
    "nome": "Despesa com PECLD (Perdas Estimadas em Créditos de Liquidação Duvidosa)"
  },
  {
    "codigo": "1.1.2.99",
    "nome": "(-) Provisão para Créditos de Liquidação Duvidosa"
  }
];
export const EVENTOS_M8 = [
  {
    "id": "e1",
    "titulo": "Constituição da provisão",
    "narrativa": "Com base no total calculado na aba Calculadora de Provisão, registre a constituição da PECLD: débito em Despesa com PECLD e crédito em Provisão para Créditos de Liquidação Duvidosa, pelo valor total apurado."
  },
  {
    "id": "e2",
    "titulo": "Reversão parcial — recebimento da Auto Peças Rio Ltda.",
    "narrativa": "Após a constituição, a Auto Peças Rio Ltda. quitou integralmente o título de R$ 1.800,00 que estava na faixa \"31 a 60 dias\". Reverta a parcela da provisão constituída para esse cliente (valor = R$ 1.800,00 × percentual aplicado à faixa \"31 a 60 dias\")."
  },
  {
    "id": "e3",
    "titulo": "Reversão parcial — recebimento do Mercado Bom Preço Ltda.",
    "narrativa": "O Mercado Bom Preço Ltda. também quitou o título de R$ 3.200,00 (faixa \"Até 30 dias\"). Reverta a parcela da provisão constituída para esse cliente."
  },
  {
    "id": "e4",
    "titulo": "Constituição adicional — novo cliente inadimplente",
    "narrativa": "Um novo cliente, não incluído na tabela original, entrou em atraso com um título de R$ 4.000,00 na faixa \"61 a 90 dias\". Calcule e registre a constituição da provisão adicional para esse valor (use o mesmo percentual da faixa \"61 a 90 dias\" definido na Calculadora de Provisão)."
  }
];
export const M8_PERCENTUAIS_PADRAO = {
  "Até 30 dias": 2,
  "31 a 60 dias": 10,
  "61 a 90 dias": 30,
  "Mais de 90 dias": 60
};

export const TEORIA_M5_HTML = "\n  <div class=\"card\">\n    <strong style=\"display:block;margin-bottom:6px;\">Estrutura da DRE</strong>\n    <p style=\"font-size:13.5px;color:var(--ink-soft);\">\n      A Demonstração do Resultado do Exercício apura o lucro ou prejuízo do período, partindo da receita bruta\n      até o resultado líquido, seguindo uma sequência obrigatória de grupos (Lei 6.404/76):\n    </p>\n    <table class=\"mgmt\">\n      <tbody>\n        <tr><td>Receita Bruta de Vendas</td><td></td></tr>\n        <tr><td>(-) Deduções da Receita</td><td>impostos, devoluções, abatimentos</td></tr>\n        <tr><td>= Receita Líquida</td><td></td></tr>\n        <tr><td>(-) CMV / CPV / CSV</td><td>custo do que foi vendido</td></tr>\n        <tr><td>= Lucro Bruto</td><td></td></tr>\n        <tr><td>(-) Despesas Operacionais</td><td>administrativas, comerciais, depreciação</td></tr>\n        <tr><td>+/- Resultado Financeiro</td><td>receitas financeiras − despesas financeiras</td></tr>\n        <tr><td>= Resultado Antes do IRPJ/CSLL</td><td></td></tr>\n        <tr><td>(-) IRPJ e CSLL</td><td></td></tr>\n        <tr><td>= Lucro Líquido do Exercício</td><td></td></tr>\n      </tbody>\n    </table>\n  </div>\n  <div class=\"card\">\n    <strong style=\"display:block;margin-bottom:6px;\">Neste módulo</strong>\n    <p style=\"font-size:13.5px;color:var(--ink-soft);\">\n      A aba <em>Montagem da DRE</em> não usa números fictícios: ela lê diretamente os lançamentos que você já\n      fez nos módulos 4.0 (Operações com Mercadorias) e 6.0 (Ativo Imobilizado) para a Nova Aurora, e monta a\n      parte da DRE que já dá para calcular com esses dados — do Resultado Bruto até a Despesa de Depreciação.\n      As demais despesas, o resultado financeiro e o IRPJ/CSLL entrarão em módulos futuros.\n    </p>\n  </div>\n";

export const TEORIA_M9_HTML = "\n  <div class=\"card\">\n    <strong style=\"display:block;margin-bottom:6px;\">O que é a DLPA</strong>\n    <p style=\"font-size:13.5px;color:var(--ink-soft);\">\n      A Demonstração de Lucros ou Prejuízos Acumulados evidencia a movimentação do resultado ao longo do\n      exercício: parte do saldo inicial de lucros (ou prejuízos) acumulados, soma o lucro líquido apurado na\n      DRE, e deduz as destinações desse lucro — reservas e dividendos — chegando ao saldo final.\n    </p>\n  </div>\n  <div class=\"card\">\n    <strong style=\"display:block;margin-bottom:6px;\">Destinações mais comuns</strong>\n    <p style=\"font-size:13.5px;color:var(--ink-soft);\">\n      A <strong>Reserva Legal</strong> (3.4.01) é obrigatória por lei para sociedades por ações, geralmente 5% do\n      lucro líquido, até o limite de 20% do capital social. Os <strong>Dividendos Propostos</strong> (7.4.09)\n      representam a parcela do lucro destinada aos sócios/acionistas. O que sobra permanece como Lucros\n      Acumulados (3.9 / 7.1.11) para o próximo exercício.\n    </p>\n  </div>\n";
export const M9_DADOS_PADRAO = {
  "saldoInicial": 18500,
  "pctReservaLegal": 5,
  "pctDividendos": 25
};

export const TEORIA_M1_HTML = "\n  <div class=\"card\">\n    <strong style=\"display:block;margin-bottom:6px;\">Por que existem princípios contábeis</strong>\n    <p style=\"font-size:13.5px;color:var(--ink-soft);\">\n      Os princípios contábeis dão consistência e comparabilidade às demonstrações — sem eles, cada empresa\n      registraria seus eventos de um jeito diferente, e ninguém conseguiria comparar um balanço com outro.\n      Eles estão consolidados na NBC TG Estrutura Conceitual, emitida pelo Conselho Federal de Contabilidade.\n    </p>\n  </div>\n  <div class=\"card\">\n    <strong style=\"display:block;margin-bottom:6px;\">Principais princípios</strong>\n    <table class=\"mgmt\">\n      <thead><tr><th>Princípio</th><th>O que estabelece</th></tr></thead>\n      <tbody>\n        <tr><td>Entidade</td><td>O patrimônio da empresa não se confunde com o de seus sócios.</td></tr>\n        <tr><td>Continuidade</td><td>Assume-se que a empresa vai continuar operando, salvo evidência em contrário.</td></tr>\n        <tr><td>Oportunidade</td><td>Os eventos devem ser registrados tempestivamente, na sua totalidade.</td></tr>\n        <tr><td>Registro pelo Valor Original</td><td>Os elementos patrimoniais são registrados pelos valores de entrada, em moeda.</td></tr>\n        <tr><td>Competência</td><td>Receitas e despesas são reconhecidas quando ocorrem, independente de recebimento/pagamento. É a base do Módulo 2.0.</td></tr>\n        <tr><td>Prudência</td><td>Diante de incerteza, opta-se pela alternativa que não superestime ativos nem subestime obrigações — base da PECLD, no Módulo 8.0.</td></tr>\n      </tbody>\n    </table>\n  </div>\n  <div class=\"card\">\n    <strong style=\"display:block;margin-bottom:6px;\">Normas Brasileiras de Contabilidade (NBC)</strong>\n    <p style=\"font-size:13.5px;color:var(--ink-soft);\">\n      São editadas pelo CFC e se dividem em NBC TG (contabilidade geral, convergente com as IFRS) e outras séries\n      técnicas. A <strong>NBC TG Estrutura Conceitual</strong> traz os princípios acima; a\n      <strong>NBC TG 26</strong> trata da apresentação das demonstrações contábeis (o formato da DRE, do Balanço\n      e da DLPA que você vai montar nos módulos seguintes).\n    </p>\n  </div>\n  <p style=\"font-size:12px;color:var(--ink-soft);\">\n    Referências: CFC — NBC TG Estrutura Conceitual (2019) e NBC TG 26 (2016); Lei nº 6.404/1976.\n  </p>\n";

export const TEORIA_M2_HTML = "\n  <div class=\"card\">\n    <strong style=\"display:block;margin-bottom:6px;\">Regime de Caixa</strong>\n    <p style=\"font-size:13.5px;color:var(--ink-soft);\">\n      Reconhece receitas e despesas apenas quando há efetivo recebimento ou pagamento em dinheiro. É simples,\n      mas distorce o resultado do período: uma venda a prazo feita em dezembro e recebida em fevereiro só\n      \"existiria\" contabilmente em fevereiro.\n    </p>\n  </div>\n  <div class=\"card\">\n    <strong style=\"display:block;margin-bottom:6px;\">Regime de Competência</strong>\n    <p style=\"font-size:13.5px;color:var(--ink-soft);\">\n      Reconhece receitas e despesas no período em que ocorrem, independentemente do recebimento ou pagamento.\n      É o regime <strong>obrigatório</strong> para fins contábeis e fiscais (exceto para optantes do Simples\n      Nacional, que podem apurar por caixa para fins tributários). Foi o regime usado em todos os lançamentos\n      dos Módulos 4.0 e 6.0 — a receita da venda a prazo à Construtora Ipê, por exemplo, foi reconhecida na\n      data da venda, não na data do recebimento.\n    </p>\n  </div>\n";
export const EVENTOS_M2 = [
  {
    "id": "ev1",
    "evento": "Venda a prazo realizada em 20/03, recebimento previsto para 20/05.",
    "resposta": "Competência",
    "explicacao": "A receita é reconhecida em 20/03 (data da venda), quando o direito de receber é constituído — independente de o dinheiro só entrar em maio."
  },
  {
    "id": "ev2",
    "evento": "Pagamento do aluguel do mês de março, feito em 05/04.",
    "resposta": "Competência",
    "explicacao": "A despesa pertence a março (mês do benefício/uso do imóvel), mesmo com o pagamento ocorrendo em abril."
  },
  {
    "id": "ev3",
    "evento": "Recebimento de um empréstimo bancário de R$ 50.000, sem nenhum efeito de receita ou despesa.",
    "resposta": "Nenhum dos dois",
    "explicacao": "Entrada de caixa por empréstimo não é receita — é um passivo (obrigação). Não há reconhecimento de resultado neste evento, em nenhum dos regimes."
  },
  {
    "id": "ev4",
    "evento": "Uma empresa optante do Simples Nacional decide apurar seu imposto apenas quando o dinheiro efetivamente entra no caixa.",
    "resposta": "Caixa",
    "explicacao": "É uma das poucas exceções em que o regime de caixa é aceito — para fins de apuração tributária no Simples Nacional, não para a contabilidade societária."
  },
  {
    "id": "ev5",
    "evento": "Depreciação de um veículo, reconhecida mensalmente mesmo sem qualquer desembolso naquele mês.",
    "resposta": "Competência",
    "explicacao": "A despesa de depreciação é reconhecida pela competência: reflete o desgaste do bem ao longo do tempo, sem qualquer saída de caixa associada ao lançamento em si."
  }
];

export const TEORIA_M10_HTML = "\n  <div class=\"card\">\n    <strong style=\"display:block;margin-bottom:6px;\">Aplicações financeiras</strong>\n    <p style=\"font-size:13.5px;color:var(--ink-soft);\">\n      Recursos que a empresa não está usando no giro do negócio podem ser aplicados (CDB, fundos, etc.) para\n      gerar rendimento. O valor aplicado sai de Bancos e vai para Aplicações de Liquidez Imediata; o rendimento\n      é reconhecido como Receita Financeira (Juros Ativos) pelo regime de competência, ainda que o resgate só\n      ocorra depois.\n    </p>\n  </div>\n  <div class=\"card\">\n    <strong style=\"display:block;margin-bottom:6px;\">Empréstimos e financiamentos</strong>\n    <p style=\"font-size:13.5px;color:var(--ink-soft);\">\n      O valor recebido de um empréstimo bancário é um passivo — não é receita. Os juros cobrados pelo banco,\n      por outro lado, são Despesa Financeira, reconhecida ao longo do tempo, independentemente da data de\n      pagamento.\n    </p>\n  </div>\n  <div class=\"card\">\n    <strong style=\"display:block;margin-bottom:6px;\">Descontos financeiros</strong>\n    <p style=\"font-size:13.5px;color:var(--ink-soft);\">\n      Diferente do desconto comercial (que reduz o preço de venda), o desconto financeiro remunera o pagamento\n      antecipado. Quem concede o desconto reconhece uma Despesa Financeira (Descontos Concedidos); quem recebe\n      reconhece uma Receita Financeira (Descontos Obtidos).\n    </p>\n  </div>\n";
export const CONTAS_M10 = [
  {
    "codigo": "1.1.1.02",
    "nome": "Bancos Conta Movimento"
  },
  {
    "codigo": "1.1.1.03",
    "nome": "Aplicações de Liquidez Imediata"
  },
  {
    "codigo": "4.3.01",
    "nome": "Juros Ativos"
  },
  {
    "codigo": "2.1.9.01",
    "nome": "Empréstimos Bancários"
  },
  {
    "codigo": "5.3.01",
    "nome": "Juros Passivos"
  },
  {
    "codigo": "4.3.03",
    "nome": "Descontos Obtidos"
  },
  {
    "codigo": "5.3.03",
    "nome": "Descontos Concedidos"
  },
  {
    "codigo": "2.1.1.01",
    "nome": "Duplicatas a Pagar"
  }
];
export const EVENTOS_M10 = [
  {
    "id": "e1",
    "titulo": "Aplicação financeira",
    "narrativa": "A Nova Aurora aplica R$ 30.000 do saldo em banco numa aplicação de liquidez imediata."
  },
  {
    "id": "e2",
    "titulo": "Rendimento da aplicação",
    "narrativa": "Ao final do mês, a aplicação rendeu R$ 450 em juros, ainda não resgatados."
  },
  {
    "id": "e3",
    "titulo": "Contratação de empréstimo bancário",
    "narrativa": "A empresa contrata um empréstimo bancário de R$ 40.000, com o valor creditado diretamente em conta."
  },
  {
    "id": "e4",
    "titulo": "Reconhecimento de juros sobre o empréstimo",
    "narrativa": "No primeiro mês do empréstimo, incidem R$ 800 de juros, ainda não pagos ao banco (regime de competência)."
  },
  {
    "id": "e5",
    "titulo": "Desconto financeiro concedido a fornecedor",
    "narrativa": "A Nova Aurora paga antecipadamente uma duplicata de R$ 5.000 a um fornecedor e recebe R$ 150 de desconto financeiro pela antecipação."
  },
  {
    "id": "e6",
    "titulo": "Resgate parcial da aplicação",
    "narrativa": "A empresa resgata R$ 10.000 da aplicação de liquidez imediata do evento 1, transferindo o valor de volta para a conta bancária."
  },
  {
    "id": "e7",
    "titulo": "Pagamento de parcela do empréstimo, com juros",
    "narrativa": "Pagamento de R$ 5.000 de amortização do empréstimo do evento 3, mais R$ 800 de juros já reconhecidos no evento 4, tudo via banco."
  },
  {
    "id": "e8",
    "titulo": "Desconto financeiro obtido de cliente",
    "narrativa": "Um cliente pagou uma duplicata de R$ 3.000 antecipadamente, e a Nova Aurora concedeu R$ 90 de desconto financeiro — mas do ponto de vista de quem recebe um desconto ao antecipar pagamento a fornecedor, registre também R$ 60 de desconto obtido em outra operação com fornecedor."
  },
  {
    "id": "e9",
    "titulo": "Nova aplicação financeira",
    "narrativa": "A empresa aplica mais R$ 15.000 do saldo bancário em uma nova aplicação de liquidez imediata."
  }
];

export const ESTRUTURA_M3_HTML = "\n  <div class=\"card\">\n    <strong style=\"display:block;margin-bottom:8px;\">Estrutura hierárquica</strong>\n    <p style=\"font-size:13.5px;color:var(--ink-soft);margin:0 0 10px;\">\n      1 → Ativo &nbsp;·&nbsp; 2 → Passivo &nbsp;·&nbsp; 3 → Patrimônio Líquido &nbsp;·&nbsp;\n      4 → Receitas &nbsp;·&nbsp; 5 → Despesas &nbsp;·&nbsp; 6 → Custos &nbsp;·&nbsp; 7 → Resultado\n    </p>\n    <table class=\"mgmt\">\n      <thead><tr><th>Nível</th><th>Código exemplo</th><th>Significado</th></tr></thead>\n      <tbody>\n        <tr><td>1</td><td>1</td><td>Grupo</td></tr>\n        <tr><td>2</td><td>1.1</td><td>Subgrupo</td></tr>\n        <tr><td>3</td><td>1.1.1</td><td>Conta sintética (agrupamento — não recebe lançamento)</td></tr>\n        <tr><td>4</td><td>1.1.1.01</td><td>Conta analítica (recebe lançamento)</td></tr>\n        <tr><td>5</td><td>1.1.1.02.01</td><td>Subconta analítica (recebe lançamento)</td></tr>\n      </tbody>\n    </table>\n  </div>\n  <div class=\"card\">\n    <strong style=\"display:block;margin-bottom:8px;\">Natureza das contas por grupo</strong>\n    <table class=\"mgmt\">\n      <thead><tr><th>Grupo</th><th>Natureza</th></tr></thead>\n      <tbody><tr><td>Ativo</td><td>Devedora</td></tr><tr><td>Passivo</td><td>Credora</td></tr><tr><td>Patrimônio Líquido</td><td>Credora</td></tr><tr><td>Receitas</td><td>Credora</td></tr><tr><td>Despesas</td><td>Devedora</td></tr><tr><td>Custos</td><td>Devedora</td></tr><tr><td>Resultado</td><td>Variável</td></tr></tbody>\n    </table>\n  </div>\n  <div class=\"card\">\n    <strong style=\"display:block;margin-bottom:8px;\">Observações</strong>\n    <ul style=\"font-size:13.5px;color:var(--ink-soft);padding-left:18px;margin:0;\">\n      <li>Quanto mais números, maior o nível de detalhamento.</li>\n      <li>Os lançamentos contábeis ocorrem apenas nas contas analíticas ou subcontas (níveis 4 e 5).</li>\n      <li>As contas superiores (níveis 1 a 3) são apenas de agrupamento (sintéticas) e não recebem lançamento direto.</li>\n      <li>Ativo, Despesas e Custos → natureza devedora.</li>\n      <li>Passivo, Patrimônio Líquido e Receitas → natureza credora.</li>\n      <li>Contas redutoras (marcadas com \"(-)\") têm natureza inversa à do grupo principal a que pertencem.</li>\n    </ul>\n  </div>\n  <div class=\"card\">\n    <strong style=\"display:block;margin-bottom:8px;\">Contas incluídas pela plataforma</strong>\n    <p style=\"font-size:13.5px;color:var(--ink-soft);margin:0 0 8px;\">\n      Três contas foram adicionadas ao plano original para cobrir lacunas identificadas nos módulos práticos.\n      Elas aparecem marcadas com a etiqueta <span style=\"font-size:10px;color:var(--debit);border:1px solid var(--debit);border-radius:8px;padding:0 6px;\">incluída</span> na aba de Consulta:\n    </p>\n    <ul style=\"font-size:13.5px;color:var(--ink-soft);padding-left:18px;margin:0;\">\n      <li><strong>1.2.3.57 (-) Depreciação Acumulada Equipamentos de Informática</strong> — o plano tinha redutora para Edificações, Móveis, Veículos, Ferramentas e Máquinas, mas não para Equipamentos de Informática.</li>\n      <li><strong>4.2.06 (-) Devoluções de Vendas</strong> — as Deduções da Receita não tinham uma conta específica de devolução, central no módulo de Operações com Mercadorias.</li>\n      <li><strong>5.1.13 Despesa com PECLD</strong> — havia a conta redutora do ativo (1.1.2.99), mas nenhuma despesa dedicada para a contrapartida da constituição da provisão.</li>\n    </ul>\n  </div>\n  <p style=\"font-size:12px;color:var(--ink-soft);\">\n    Fonte: Plano de Contas Didático — Curso Técnico em Contabilidade, CEDUP Hermann Hering, Prof. Esp. Jorge Lima Cardoso. Material de uso exclusivamente educacional.\n  </p>\n";

export const MODULES = [
  {
    "id": "m1",
    "code": "1.0",
    "title": "Princípios Contábeis e NBC",
    "desc": "Base conceitual: princípios de contabilidade e Normas Brasileiras de Contabilidade que sustentam todos os demais módulos.",
    "tabs": [
      "Teoria",
      "Exercícios"
    ]
  },
  {
    "id": "m2",
    "code": "2.0",
    "title": "Regimes de Caixa e Competência",
    "desc": "Diferença entre reconhecer eventos pelo regime de caixa e pelo regime de competência, e seus efeitos no resultado.",
    "tabs": [
      "Teoria",
      "Exercícios"
    ]
  },
  {
    "id": "m3",
    "code": "3.0",
    "title": "Plano de Contas",
    "desc": "Estrutura hierárquica do plano de contas oficial da disciplina e consulta completa a todas as contas.",
    "tabs": [
      "Estrutura Hierárquica",
      "Consulta ao Plano de Contas",
      "Exercícios de Pareamento"
    ]
  },
  {
    "id": "m4",
    "code": "4.0",
    "title": "Operações com Mercadorias",
    "desc": "Compra, venda, devolução e tributos incidentes sobre operações com mercadorias.",
    "tabs": [
      "Teoria",
      "Simulador de Lançamentos",
      "Estudo de Caso"
    ]
  },
  {
    "id": "m5",
    "code": "5.0",
    "title": "Demonstrativo do Resultado do Exercício (DRE)",
    "desc": "Montagem da DRE a partir dos lançamentos já feitos pelo aluno nos módulos anteriores.",
    "tabs": [
      "Teoria",
      "Montagem da DRE"
    ]
  },
  {
    "id": "m6",
    "code": "6.0",
    "title": "Ativo Imobilizado",
    "desc": "Compra, venda, depreciação e amortização de bens do ativo imobilizado.",
    "tabs": [
      "Teoria",
      "Calculadora de Depreciação",
      "Lançamentos"
    ]
  },
  {
    "id": "m7",
    "code": "7.0",
    "title": "Créditos Vencidos e Não Liquidados",
    "desc": "Tratamento contábil de créditos em atraso e não recebidos.",
    "tabs": [
      "Teoria",
      "Estudo de Caso"
    ]
  },
  {
    "id": "m8",
    "code": "8.0",
    "title": "PECLD — Provisão para Perdas Estimadas em Créditos de Liquidação Duvidosa",
    "desc": "Cálculo e lançamento da constituição e reversão da provisão, com base no histórico de inadimplência.",
    "tabs": [
      "Teoria",
      "Calculadora de Provisão",
      "Lançamentos"
    ]
  },
  {
    "id": "m9",
    "code": "9.0",
    "title": "Demonstração de Lucros ou Prejuízos Acumulados (DLPA)",
    "desc": "Montagem da DLPA a partir do lucro apurado na DRE e eventos como reservas e dividendos.",
    "tabs": [
      "Teoria",
      "Montagem da DLPA"
    ]
  },
  {
    "id": "m10",
    "code": "10.0",
    "title": "Operações Financeiras",
    "desc": "Aplicações, empréstimos, juros e descontos e seus lançamentos contábeis.",
    "tabs": [
      "Teoria",
      "Exercícios"
    ]
  },
  {
    "id": "m11",
    "code": "11.0",
    "title": "Estudos de Caso",
    "desc": "Casos integrados cobrindo múltiplos temas da disciplina em uma mesma empresa fictícia.",
    "tabs": [
      "Casos"
    ]
  }
];
