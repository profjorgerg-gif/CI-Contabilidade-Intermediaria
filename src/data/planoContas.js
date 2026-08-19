// Plano de contas oficial (CEDUP Hermann Hering) — extraído da versão vanilla aprovada.
export const PLANO_CONTAS_OFICIAL = [
  {
    "codigo": "1",
    "nome": "ATIVO"
  },
  {
    "codigo": "1.1",
    "nome": "ATIVO CIRCULANTE"
  },
  {
    "codigo": "1.1.1",
    "nome": "Caixa e Equivalentes de Caixa"
  },
  {
    "codigo": "1.1.1.01",
    "nome": "Caixa Geral"
  },
  {
    "codigo": "1.1.1.02",
    "nome": "Bancos Conta Movimento"
  },
  {
    "codigo": "1.1.1.02.01",
    "nome": "Banco X"
  },
  {
    "codigo": "1.1.1.02.02",
    "nome": "Banco Y"
  },
  {
    "codigo": "1.1.1.03",
    "nome": "Aplicações de Liquidez Imediata"
  },
  {
    "codigo": "1.1.1.03.01",
    "nome": "Aplicação Banco X"
  },
  {
    "codigo": "1.1.1.03.02",
    "nome": "Aplicação Banco Y"
  },
  {
    "codigo": "1.1.1.04",
    "nome": "Cheques em Cobrança"
  },
  {
    "codigo": "1.1.1.05",
    "nome": "Numerários em Trânsito",
    "obs": "Conta analítica do ativo que representa valores em deslocamento entre caixas, bancos ou unidades da empresa, ainda não disponibilizados no destino final. Possui natureza devedora e caráter temporário até sua efetiva conciliação."
  },
  {
    "codigo": "1.1.1.06",
    "nome": "Caixa Filial"
  },
  {
    "codigo": "1.1.1.07",
    "nome": "Fundo Fixo de Caixa"
  },
  {
    "codigo": "1.1.2",
    "nome": "Valores a Receber"
  },
  {
    "codigo": "1.1.2.01",
    "nome": "Duplicatas a Receber"
  },
  {
    "codigo": "1.1.2.02",
    "nome": "Clientes"
  },
  {
    "codigo": "1.1.2.03",
    "nome": "Notas Promissórias"
  },
  {
    "codigo": "1.1.2.04",
    "nome": "Cartões de Crédito a Receber"
  },
  {
    "codigo": "1.1.2.05",
    "nome": "Cheques a Receber"
  },
  {
    "codigo": "1.1.2.06",
    "nome": "Adiantamento a Fornecedores"
  },
  {
    "codigo": "1.1.2.07",
    "nome": "Adiantamento a Empregados"
  },
  {
    "codigo": "1.1.2.08",
    "nome": "Empréstimos a Coligadas (CP)"
  },
  {
    "codigo": "1.1.2.09",
    "nome": "Juros a Receber"
  },
  {
    "codigo": "1.1.2.10",
    "nome": "Aluguéis a Receber"
  },
  {
    "codigo": "1.1.2.11",
    "nome": "ICMS a Recuperar",
    "obs": "Conta analítica do ativo que representa créditos tributários a serem recuperados pela empresa junto ao fisco, originados de operações como compras e retenções. Possui natureza devedora e recebe lançamentos diretamente."
  },
  {
    "codigo": "1.1.2.12",
    "nome": "ICMS-ST a Recuperar"
  },
  {
    "codigo": "1.1.2.13",
    "nome": "IPI a Recuperar"
  },
  {
    "codigo": "1.1.2.14",
    "nome": "PIS a Recuperar"
  },
  {
    "codigo": "1.1.2.15",
    "nome": "COFINS a Recuperar"
  },
  {
    "codigo": "1.1.2.16",
    "nome": "IRRF a Compensar"
  },
  {
    "codigo": "1.1.2.17",
    "nome": "Adiantamento a Sócios"
  },
  {
    "codigo": "1.1.2.18",
    "nome": "Dividendos a Receber"
  },
  {
    "codigo": "1.1.2.19",
    "nome": "Juros sobre Capital Próprio a Receber"
  },
  {
    "codigo": "1.1.2.99",
    "nome": "(-) Provisão para Créditos de Liquidação Duvidosa",
    "redutora": true,
    "obs": "Conta analítica redutora do ativo utilizada para ajustar o valor realizável dos créditos, representando perdas estimadas. Possui natureza credora e reduz o saldo das contas principais."
  },
  {
    "codigo": "1.1.3",
    "nome": "Estoques"
  },
  {
    "codigo": "1.1.3.01",
    "nome": "Mercadorias para Revenda"
  },
  {
    "codigo": "1.1.3.02",
    "nome": "Mercadorias em Trânsito"
  },
  {
    "codigo": "1.1.3.03",
    "nome": "Mercadorias em Poder de Terceiros"
  },
  {
    "codigo": "1.1.3.04",
    "nome": "Matérias-Primas"
  },
  {
    "codigo": "1.1.3.05",
    "nome": "Material Secundário"
  },
  {
    "codigo": "1.1.3.06",
    "nome": "Produtos em Elaboração"
  },
  {
    "codigo": "1.1.3.07",
    "nome": "Produtos Acabados"
  },
  {
    "codigo": "1.1.3.08",
    "nome": "Material de Expediente"
  },
  {
    "codigo": "1.1.3.09",
    "nome": "Serviços em Andamento"
  },
  {
    "codigo": "1.1.3.10",
    "nome": "Material de Consumo"
  },
  {
    "codigo": "1.1.3.11",
    "nome": "Embalagens"
  },
  {
    "codigo": "1.1.3.12",
    "nome": "Almoxarifado"
  },
  {
    "codigo": "1.1.3.99",
    "nome": "(-) Perdas / Ajuste de Estoques",
    "redutora": true,
    "obs": "Conta analítica redutora do ativo vinculada aos estoques, utilizada para ajustar seu valor ao realizável, refletindo perdas, obsolescência ou desvalorização. Possui natureza credora e reduz o saldo das contas de estoque."
  },
  {
    "codigo": "1.1.4",
    "nome": "Despesas Antecipadas",
    "obs": "Conta analítica do ativo que representa pagamentos realizados antecipadamente pela empresa, cujos benefícios serão apropriados como despesa ao longo do tempo. Possui natureza devedora e segue o regime de competência."
  },
  {
    "codigo": "1.1.4.01",
    "nome": "Seguros a Apropriar"
  },
  {
    "codigo": "1.1.4.02",
    "nome": "Assinaturas e Licenças"
  },
  {
    "codigo": "1.1.4.03",
    "nome": "Aluguéis Antecipados"
  },
  {
    "codigo": "1.2",
    "nome": "ATIVO NÃO CIRCULANTE"
  },
  {
    "codigo": "1.2.1",
    "nome": "Realizável a Longo Prazo"
  },
  {
    "codigo": "1.2.1.01",
    "nome": "Clientes LP"
  },
  {
    "codigo": "1.2.1.02",
    "nome": "Títulos a Receber"
  },
  {
    "codigo": "1.2.1.03",
    "nome": "Depósitos Judiciais"
  },
  {
    "codigo": "1.2.1.04",
    "nome": "Empréstimos a Coligadas"
  },
  {
    "codigo": "1.2.1.05",
    "nome": "Tributos Diferidos"
  },
  {
    "codigo": "1.2.2",
    "nome": "Investimentos"
  },
  {
    "codigo": "1.2.2.01",
    "nome": "Ações de Controladas"
  },
  {
    "codigo": "1.2.2.02",
    "nome": "Ações de Coligadas"
  },
  {
    "codigo": "1.2.2.03",
    "nome": "Outras Participações"
  },
  {
    "codigo": "1.2.3",
    "nome": "Imobilizado"
  },
  {
    "codigo": "1.2.3.01",
    "nome": "Edificações"
  },
  {
    "codigo": "1.2.3.02",
    "nome": "Móveis e Utensílios"
  },
  {
    "codigo": "1.2.3.03",
    "nome": "Veículos"
  },
  {
    "codigo": "1.2.3.04",
    "nome": "Ferramentas"
  },
  {
    "codigo": "1.2.3.05",
    "nome": "Máquinas e Equipamentos"
  },
  {
    "codigo": "1.2.3.06",
    "nome": "Reflorestamentos"
  },
  {
    "codigo": "1.2.3.07",
    "nome": "Equipamentos de Informática"
  },
  {
    "codigo": "1.2.3.08",
    "nome": "Instalações"
  },
  {
    "codigo": "1.2.3.09",
    "nome": "Terrenos"
  },
  {
    "codigo": "1.2.3.51",
    "nome": "(-) Depreciação Acumulada Edificações",
    "redutora": true,
    "obs": "Conta analítica redutora do ativo imobilizado utilizada para registrar a perda de valor dos bens ao longo do tempo, decorrente do uso, desgaste ou obsolescência. Possui natureza credora e reduz o valor contábil dos ativos imobilizados."
  },
  {
    "codigo": "1.2.3.52",
    "nome": "(-) Depreciação Acumulada Móveis",
    "redutora": true
  },
  {
    "codigo": "1.2.3.53",
    "nome": "(-) Depreciação Acumulada Veículos",
    "redutora": true
  },
  {
    "codigo": "1.2.3.54",
    "nome": "(-) Depreciação Acumulada Ferramentas",
    "redutora": true
  },
  {
    "codigo": "1.2.3.55",
    "nome": "(-) Depreciação Acumulada Máquinas",
    "redutora": true
  },
  {
    "codigo": "1.2.3.56",
    "nome": "(-) Exaustão Acumulada",
    "redutora": true,
    "obs": "Conta analítica redutora do ativo imobilizado utilizada para registrar a perda de valor de recursos naturais exploráveis ao longo do tempo, como florestas, jazidas ou reservas minerais. Possui natureza credora e reduz o valor contábil dos ativos sujeitos à exaustão."
  },
  {
    "codigo": "1.2.3.57",
    "nome": "(-) Depreciação Acumulada Equipamentos de Informática",
    "redutora": true,
    "adicionada": true,
    "obs": "Conta incluída pela plataforma: o plano original previa redutoras de depreciação para Edificações, Móveis, Veículos, Ferramentas e Máquinas, mas não para Equipamentos de Informática (1.2.3.07), que também é um bem depreciável."
  },
  {
    "codigo": "1.2.4",
    "nome": "Intangível"
  },
  {
    "codigo": "1.2.4.01",
    "nome": "Fundo de Comércio"
  },
  {
    "codigo": "1.2.4.02",
    "nome": "Marcas e Patentes"
  },
  {
    "codigo": "1.2.4.03",
    "nome": "Softwares"
  },
  {
    "codigo": "1.2.4.04",
    "nome": "Direitos Autorais"
  },
  {
    "codigo": "1.2.4.05",
    "nome": "Licenças"
  },
  {
    "codigo": "1.2.4.99",
    "nome": "(-) Amortização Acumulada",
    "redutora": true
  },
  {
    "codigo": "2",
    "nome": "PASSIVO"
  },
  {
    "codigo": "2.1",
    "nome": "PASSIVO CIRCULANTE"
  },
  {
    "codigo": "2.1.1",
    "nome": "Fornecedores"
  },
  {
    "codigo": "2.1.1.01",
    "nome": "Duplicatas a Pagar"
  },
  {
    "codigo": "2.1.1.02",
    "nome": "Fornecedores Diversos"
  },
  {
    "codigo": "2.1.2",
    "nome": "Contas a Pagar"
  },
  {
    "codigo": "2.1.2.01",
    "nome": "Convênios a Pagar"
  },
  {
    "codigo": "2.1.2.02",
    "nome": "Plano de Saúde Funcionários"
  },
  {
    "codigo": "2.1.3",
    "nome": "Obrigações Trabalhistas"
  },
  {
    "codigo": "2.1.3.01",
    "nome": "Salários a Pagar"
  },
  {
    "codigo": "2.1.3.02",
    "nome": "Pró-Labore a Pagar"
  },
  {
    "codigo": "2.1.3.03",
    "nome": "Férias a Pagar"
  },
  {
    "codigo": "2.1.3.04",
    "nome": "13º Salário a Pagar"
  },
  {
    "codigo": "2.1.4",
    "nome": "Encargos Sociais"
  },
  {
    "codigo": "2.1.4.01",
    "nome": "INSS Folha"
  },
  {
    "codigo": "2.1.4.02",
    "nome": "INSS Retido PJ"
  },
  {
    "codigo": "2.1.4.03",
    "nome": "FGTS a Recolher"
  },
  {
    "codigo": "2.1.5",
    "nome": "Provisão de Férias"
  },
  {
    "codigo": "2.1.5.01",
    "nome": "Provisão de Férias"
  },
  {
    "codigo": "2.1.5.02",
    "nome": "Encargos sobre Férias"
  },
  {
    "codigo": "2.1.6",
    "nome": "Provisão 13º Salário"
  },
  {
    "codigo": "2.1.6.01",
    "nome": "Provisão 13º"
  },
  {
    "codigo": "2.1.6.02",
    "nome": "Encargos 13º"
  },
  {
    "codigo": "2.1.7",
    "nome": "Dividendos"
  },
  {
    "codigo": "2.1.7.01",
    "nome": "Dividendos a Pagar"
  },
  {
    "codigo": "2.1.7.02",
    "nome": "Dividendos Intermediários"
  },
  {
    "codigo": "2.1.8",
    "nome": "Tributos a Recolher"
  },
  {
    "codigo": "2.1.8.01",
    "nome": "IRPJ"
  },
  {
    "codigo": "2.1.8.02",
    "nome": "CSLL"
  },
  {
    "codigo": "2.1.8.03",
    "nome": "IPI"
  },
  {
    "codigo": "2.1.8.04",
    "nome": "ICMS"
  },
  {
    "codigo": "2.1.8.05",
    "nome": "PIS"
  },
  {
    "codigo": "2.1.8.06",
    "nome": "COFINS"
  },
  {
    "codigo": "2.1.8.07",
    "nome": "PIS Importação"
  },
  {
    "codigo": "2.1.8.08",
    "nome": "COFINS Importação"
  },
  {
    "codigo": "2.1.8.09",
    "nome": "ISS"
  },
  {
    "codigo": "2.1.8.10",
    "nome": "IRRF a Recolher"
  },
  {
    "codigo": "2.1.8.11",
    "nome": "INSS Retido Empregados"
  },
  {
    "codigo": "2.1.8.12",
    "nome": "Simples Nacional a Recolher"
  },
  {
    "codigo": "2.1.9",
    "nome": "Empréstimos e Financiamentos"
  },
  {
    "codigo": "2.1.9.01",
    "nome": "Empréstimos Bancários"
  },
  {
    "codigo": "2.1.9.02",
    "nome": "Financiamentos"
  },
  {
    "codigo": "2.1.9.99",
    "nome": "(-) Encargos a Transcorrer",
    "redutora": true,
    "obs": "Conta analítica redutora do passivo utilizada para registrar encargos financeiros ainda não incorridos, relacionados a empréstimos ou financiamentos. Possui natureza devedora e reduz o valor das obrigações até sua apropriação pelo regime de competência."
  },
  {
    "codigo": "2.1.10",
    "nome": "Desconto de Duplicatas"
  },
  {
    "codigo": "2.1.10.01",
    "nome": "Duplicatas Descontadas"
  },
  {
    "codigo": "2.1.10.99",
    "nome": "(-) Encargos",
    "redutora": true
  },
  {
    "codigo": "2.2",
    "nome": "PASSIVO NÃO CIRCULANTE"
  },
  {
    "codigo": "2.2.1",
    "nome": "Adiantamento de Sócios"
  },
  {
    "codigo": "2.2.2",
    "nome": "Adiantamento de Acionistas"
  },
  {
    "codigo": "2.2.3",
    "nome": "Empréstimos de Coligadas"
  },
  {
    "codigo": "2.2.4",
    "nome": "Empréstimos de Controladas"
  },
  {
    "codigo": "3",
    "nome": "PATRIMÔNIO LÍQUIDO"
  },
  {
    "codigo": "3.1",
    "nome": "Capital Social",
    "obs": "Conta do patrimônio líquido que representa os recursos investidos pelos sócios ou acionistas na empresa. Inclui o capital subscrito e a parcela ainda não integralizada, evidenciando a origem própria dos recursos da entidade."
  },
  {
    "codigo": "3.1.01",
    "nome": "Capital Subscrito"
  },
  {
    "codigo": "3.1.02",
    "nome": "(-) Capital a Integralizar",
    "redutora": true
  },
  {
    "codigo": "3.2",
    "nome": "Reservas de Capital"
  },
  {
    "codigo": "3.2.01",
    "nome": "Ágio na Emissão"
  },
  {
    "codigo": "3.2.02",
    "nome": "Doações/Subvenções"
  },
  {
    "codigo": "3.2.03",
    "nome": "Prêmios Debêntures"
  },
  {
    "codigo": "3.3",
    "nome": "Ajustes de Avaliação"
  },
  {
    "codigo": "3.3.01",
    "nome": "Ativos"
  },
  {
    "codigo": "3.3.02",
    "nome": "Passivos"
  },
  {
    "codigo": "3.4",
    "nome": "Reservas de Lucros",
    "obs": "Conta do patrimônio líquido formada pela destinação de lucros apurados pela empresa, conforme previsão legal ou estatutária. Tem a finalidade de reforçar a estrutura patrimonial, suportar investimentos, incentivar expansão e atender finalidades específicas."
  },
  {
    "codigo": "3.4.01",
    "nome": "Reserva Legal"
  },
  {
    "codigo": "3.4.02",
    "nome": "Incentivos Fiscais"
  },
  {
    "codigo": "3.4.03",
    "nome": "Reserva Estatutária"
  },
  {
    "codigo": "3.4.04",
    "nome": "Reserva para Expansão"
  },
  {
    "codigo": "3.4.05",
    "nome": "Reserva de Lucros a Realizar"
  },
  {
    "codigo": "3.5",
    "nome": "(-) Ações em Tesouraria",
    "redutora": true,
    "obs": "Contas do patrimônio líquido que refletem ajustes e variações no capital próprio da empresa. As ações em tesouraria e os prejuízos acumulados possuem natureza redutora, enquanto o resultado do exercício evidencia o lucro ou prejuízo apurado no período."
  },
  {
    "codigo": "3.6",
    "nome": "(-) Prejuízos Acumulados",
    "redutora": true
  },
  {
    "codigo": "3.9",
    "nome": "Resultado do Exercício"
  },
  {
    "codigo": "4",
    "nome": "RECEITAS"
  },
  {
    "codigo": "4.1",
    "nome": "RECEITAS OPERACIONAIS"
  },
  {
    "codigo": "4.1.1",
    "nome": "Receita Bruta de Vendas"
  },
  {
    "codigo": "4.1.1.01",
    "nome": "Receita de Vendas de Mercadorias"
  },
  {
    "codigo": "4.1.1.02",
    "nome": "Receita de Vendas de Produtos"
  },
  {
    "codigo": "4.1.1.03",
    "nome": "Receita de Prestação de Serviços"
  },
  {
    "codigo": "4.2",
    "nome": "(-) DEDUÇÕES DA RECEITA",
    "redutora": true,
    "obs": "Conta analítica redutora da receita bruta, utilizada para registrar tributos, descontos e abatimentos incidentes sobre as vendas, com o objetivo de apurar a receita líquida. Possui natureza devedora e reduz o valor das receitas operacionais."
  },
  {
    "codigo": "4.2.01",
    "nome": "ICMS sobre Vendas"
  },
  {
    "codigo": "4.2.02",
    "nome": "PIS/COFINS sobre Vendas"
  },
  {
    "codigo": "4.2.03",
    "nome": "ISS sobre Serviços"
  },
  {
    "codigo": "4.2.04",
    "nome": "Descontos Incondicionais"
  },
  {
    "codigo": "4.2.05",
    "nome": "Abatimentos"
  },
  {
    "codigo": "4.2.06",
    "nome": "(-) Devoluções de Vendas",
    "redutora": true,
    "adicionada": true,
    "obs": "Conta incluída pela plataforma: o plano original não trazia uma conta específica para devolução de mercadorias vendidas dentro das Deduções da Receita, apesar de ser central no módulo de Operações com Mercadorias."
  },
  {
    "codigo": "4.3",
    "nome": "RECEITAS FINANCEIRAS"
  },
  {
    "codigo": "4.3.01",
    "nome": "Juros Ativos"
  },
  {
    "codigo": "4.3.02",
    "nome": "Rendimentos de Aplicações Financeiras"
  },
  {
    "codigo": "4.3.03",
    "nome": "Descontos Obtidos"
  },
  {
    "codigo": "4.3.04",
    "nome": "Variações Cambiais Ativas"
  },
  {
    "codigo": "4.4",
    "nome": "OUTRAS RECEITAS"
  },
  {
    "codigo": "4.4.01",
    "nome": "Receitas de Aluguéis"
  },
  {
    "codigo": "4.4.02",
    "nome": "Venda de Sucatas"
  },
  {
    "codigo": "4.4.03",
    "nome": "Dividendos Recebidos"
  },
  {
    "codigo": "4.4.04",
    "nome": "Ganho na Venda de Imobilizado"
  },
  {
    "codigo": "4.4.05",
    "nome": "Resultado Positivo da Equivalência Patrimonial"
  },
  {
    "codigo": "4.5",
    "nome": "Ganhos de Capital"
  },
  {
    "codigo": "4.5.01",
    "nome": "Ganho na Venda de Imobilizado"
  },
  {
    "codigo": "4.6",
    "nome": "Resultado de Investimentos"
  },
  {
    "codigo": "4.6.01",
    "nome": "Dividendos Recebidos"
  },
  {
    "codigo": "4.6.02",
    "nome": "Resultado Positivo da Equivalência Patrimonial"
  },
  {
    "codigo": "5",
    "nome": "DESPESAS"
  },
  {
    "codigo": "5.1",
    "nome": "Despesas Administrativas"
  },
  {
    "codigo": "5.1.01",
    "nome": "Honorários da Diretoria"
  },
  {
    "codigo": "5.1.02",
    "nome": "Salários Administrativos"
  },
  {
    "codigo": "5.1.03",
    "nome": "Encargos Sociais Administrativos"
  },
  {
    "codigo": "5.1.04",
    "nome": "Energia Elétrica"
  },
  {
    "codigo": "5.1.05",
    "nome": "Telefone e Internet"
  },
  {
    "codigo": "5.1.06",
    "nome": "Serviços de Terceiros"
  },
  {
    "codigo": "5.1.07",
    "nome": "Seguros"
  },
  {
    "codigo": "5.1.08",
    "nome": "Manutenção e Reparos"
  },
  {
    "codigo": "5.1.09",
    "nome": "Material de Escritório"
  },
  {
    "codigo": "5.1.10",
    "nome": "Depreciação"
  },
  {
    "codigo": "5.1.11",
    "nome": "Amortização"
  },
  {
    "codigo": "5.1.12",
    "nome": "Exaustão"
  },
  {
    "codigo": "5.1.13",
    "nome": "Despesa com PECLD (Perdas Estimadas em Créditos de Liquidação Duvidosa)",
    "adicionada": true,
    "obs": "Conta incluída pela plataforma: o plano original tinha a conta redutora do ativo (1.1.2.99 Provisão para Créditos de Liquidação Duvidosa), mas não uma despesa dedicada para a contrapartida da constituição dessa provisão — essencial para o módulo 8.0 (PECLD)."
  },
  {
    "codigo": "5.2",
    "nome": "Despesas Comerciais"
  },
  {
    "codigo": "5.2.01",
    "nome": "Propaganda e Publicidade"
  },
  {
    "codigo": "5.2.02",
    "nome": "Comissões sobre Vendas"
  },
  {
    "codigo": "5.2.03",
    "nome": "Fretes sobre Vendas"
  },
  {
    "codigo": "5.2.04",
    "nome": "Despesas com Vendas"
  },
  {
    "codigo": "5.3",
    "nome": "Despesas Financeiras"
  },
  {
    "codigo": "5.3.01",
    "nome": "Juros Passivos"
  },
  {
    "codigo": "5.3.02",
    "nome": "Variações Cambiais Passivas"
  },
  {
    "codigo": "5.3.03",
    "nome": "Descontos Concedidos"
  },
  {
    "codigo": "5.4",
    "nome": "Outras Despesas"
  },
  {
    "codigo": "5.4.01",
    "nome": "Perdas Diversas"
  },
  {
    "codigo": "5.4.02",
    "nome": "Resultado Negativo da Equivalência Patrimonial"
  },
  {
    "codigo": "6",
    "nome": "CUSTOS"
  },
  {
    "codigo": "6.1",
    "nome": "Custos de Produção"
  },
  {
    "codigo": "6.1.01",
    "nome": "Materiais Aplicados"
  },
  {
    "codigo": "6.1.02",
    "nome": "Salários da Produção"
  },
  {
    "codigo": "6.1.03",
    "nome": "Encargos Sociais da Produção"
  },
  {
    "codigo": "6.1.04",
    "nome": "Benefícios a Funcionários"
  },
  {
    "codigo": "6.1.05",
    "nome": "Energia Elétrica Produção"
  },
  {
    "codigo": "6.1.06",
    "nome": "Combustíveis e Lubrificantes"
  },
  {
    "codigo": "6.1.07",
    "nome": "Depreciação da Produção"
  },
  {
    "codigo": "6.1.08",
    "nome": "Manutenção Industrial"
  },
  {
    "codigo": "6.2",
    "nome": "Custos das Vendas (CMV / CPV / CSV)"
  },
  {
    "codigo": "6.2.01",
    "nome": "Custo das Mercadorias Vendidas (CMV)"
  },
  {
    "codigo": "6.2.02",
    "nome": "Custo dos Produtos Vendidos (CPV)"
  },
  {
    "codigo": "6.2.03",
    "nome": "Custo dos Serviços Vendidos (CSV)"
  },
  {
    "codigo": "7",
    "nome": "RESULTADO"
  },
  {
    "codigo": "7.1",
    "nome": "Apuração e Encerramento do Resultado"
  },
  {
    "codigo": "7.1.01",
    "nome": "ARE – Apuração do Resultado do Exercício"
  },
  {
    "codigo": "7.1.02",
    "nome": "Encerramento das Receitas"
  },
  {
    "codigo": "7.1.03",
    "nome": "Encerramento das Despesas"
  },
  {
    "codigo": "7.1.04",
    "nome": "Encerramento dos Custos"
  },
  {
    "codigo": "7.1.05",
    "nome": "Resultado Bruto do Exercício"
  },
  {
    "codigo": "7.1.06",
    "nome": "Resultado Operacional"
  },
  {
    "codigo": "7.1.07",
    "nome": "Resultado Antes do Resultado Financeiro"
  },
  {
    "codigo": "7.1.08",
    "nome": "Resultado Antes do IRPJ e da CSLL"
  },
  {
    "codigo": "7.1.09",
    "nome": "Resultado Antes das Participações"
  },
  {
    "codigo": "7.1.10",
    "nome": "Resultado Líquido do Exercício"
  },
  {
    "codigo": "7.1.11",
    "nome": "Lucros Acumulados"
  },
  {
    "codigo": "7.1.12",
    "nome": "Prejuízos Acumulados"
  },
  {
    "codigo": "7.2",
    "nome": "Tributos sobre o Lucro"
  },
  {
    "codigo": "7.2.01",
    "nome": "IRPJ sobre o Lucro"
  },
  {
    "codigo": "7.2.02",
    "nome": "CSLL sobre o Lucro"
  },
  {
    "codigo": "7.2.03",
    "nome": "Provisão para IRPJ"
  },
  {
    "codigo": "7.2.04",
    "nome": "Provisão para CSLL"
  },
  {
    "codigo": "7.2.05",
    "nome": "IRPJ Corrente"
  },
  {
    "codigo": "7.2.06",
    "nome": "CSLL Corrente"
  },
  {
    "codigo": "7.2.07",
    "nome": "IRPJ Diferido"
  },
  {
    "codigo": "7.2.08",
    "nome": "CSLL Diferida"
  },
  {
    "codigo": "7.2.09",
    "nome": "Ajuste de IRPJ do Exercício"
  },
  {
    "codigo": "7.2.10",
    "nome": "Ajuste de CSLL do Exercício"
  },
  {
    "codigo": "7.3",
    "nome": "Participações sobre o Resultado"
  },
  {
    "codigo": "7.3.01",
    "nome": "Participações de Empregados"
  },
  {
    "codigo": "7.3.02",
    "nome": "Participações de Administradores"
  },
  {
    "codigo": "7.3.03",
    "nome": "Participações de Debenturistas"
  },
  {
    "codigo": "7.3.04",
    "nome": "Participações de Partes Beneficiárias"
  },
  {
    "codigo": "7.3.05",
    "nome": "Fundo de Assistência ou Previdência de Empregados"
  },
  {
    "codigo": "7.3.06",
    "nome": "Outras Participações sobre o Lucro"
  },
  {
    "codigo": "7.4",
    "nome": "Destinação do Resultado"
  },
  {
    "codigo": "7.4.01",
    "nome": "Lucros Acumulados"
  },
  {
    "codigo": "7.4.02",
    "nome": "Prejuízos Acumulados"
  },
  {
    "codigo": "7.4.03",
    "nome": "Reserva Legal"
  },
  {
    "codigo": "7.4.04",
    "nome": "Reserva Estatutária"
  },
  {
    "codigo": "7.4.05",
    "nome": "Reserva para Contingências"
  },
  {
    "codigo": "7.4.06",
    "nome": "Reserva de Incentivos Fiscais"
  },
  {
    "codigo": "7.4.07",
    "nome": "Reserva de Lucros a Realizar"
  },
  {
    "codigo": "7.4.08",
    "nome": "Reserva para Expansão"
  },
  {
    "codigo": "7.4.09",
    "nome": "Dividendos Propostos"
  },
  {
    "codigo": "7.4.10",
    "nome": "Dividendos a Distribuir"
  },
  {
    "codigo": "7.4.11",
    "nome": "Juros sobre Capital Próprio"
  },
  {
    "codigo": "7.4.12",
    "nome": "Reversão de Reservas"
  },
  {
    "codigo": "7.4.13",
    "nome": "Absorção de Prejuízos"
  },
  {
    "codigo": "7.4.14",
    "nome": "Transferência para Reservas"
  },
  {
    "codigo": "7.4.15",
    "nome": "Transferência do Lucro para o Patrimônio Líquido"
  },
  {
    "codigo": "7.5",
    "nome": "Ajustes e Complementos do Resultado"
  },
  {
    "codigo": "7.5.01",
    "nome": "Ajustes de Exercícios Anteriores"
  },
  {
    "codigo": "7.5.02",
    "nome": "Reversão de Ajustes de Exercícios Anteriores"
  },
  {
    "codigo": "7.5.03",
    "nome": "Ajustes de Avaliação Patrimonial no Resultado"
  },
  {
    "codigo": "7.5.04",
    "nome": "Efeitos de Mudança de Critério Contábil"
  },
  {
    "codigo": "7.5.05",
    "nome": "Efeitos de Retificação de Erros"
  },
  {
    "codigo": "7.5.06",
    "nome": "Ajustes de Encerramento"
  },
  {
    "codigo": "7.5.07",
    "nome": "Ajustes Finais de Apuração"
  },
  {
    "codigo": "7.5.08",
    "nome": "Reclassificações para Resultado"
  },
  {
    "codigo": "7.5.09",
    "nome": "Compensação de Prejuízos do Exercício"
  },
  {
    "codigo": "7.5.10",
    "nome": "Transferência do Resultado para Lucros/Prejuízos Acumulados"
  },
  {
    "codigo": "8",
    "nome": "CONTAS DE COMPENSAÇÃO"
  },
  {
    "codigo": "8.1",
    "nome": "Garantias Prestadas"
  },
  {
    "codigo": "8.2",
    "nome": "Garantias Recebidas"
  },
  {
    "codigo": "8.3",
    "nome": "Bens de Terceiros"
  },
  {
    "codigo": "8.4",
    "nome": "Bens da Empresa em Poder de Terceiros"
  },
  {
    "codigo": "8.5",
    "nome": "Contratos"
  },
  {
    "codigo": "8.6",
    "nome": "Responsabilidades Eventuais"
  }
];

export const NATUREZA_GRUPO = {
  "1": "Devedora",
  "2": "Credora",
  "3": "Credora",
  "4": "Credora",
  "5": "Devedora",
  "6": "Devedora",
  "7": "Variável"
};

export const NOME_GRUPO = {
  "1": "Ativo",
  "2": "Passivo",
  "3": "Patrimônio Líquido",
  "4": "Receitas",
  "5": "Despesas",
  "6": "Custos",
  "7": "Resultado",
  "8": "Contas de Compensação"
};

export function nivelDoCodigo(codigo){ return codigo.split('.').length; }
export function grupoDoCodigo(codigo){ return codigo.split('.')[0]; }
export function contasAnaliticas(){ return PLANO_CONTAS_OFICIAL.filter(c => nivelDoCodigo(c.codigo) >= 4); }
