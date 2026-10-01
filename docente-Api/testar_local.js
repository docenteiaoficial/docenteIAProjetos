/**
 * DocenteIA — Teste Local (Windows)
 * 
 * Simula exatamente o que a API faria ao receber um pedido do professor.
 * Roda sem n8n, sem WhatsApp, sem Evolution API.
 * 
 * USO:
 *   node testar_local.js
 * 
 * O DOCX gerado abre automaticamente no Word.
 */

const { gerarDocx } = require('./gerador_v3');
const fs   = require('fs');
const path = require('path');
const { exec } = require('child_process');

// ─── Configure aqui o pedido que quer testar ──────────────────────────────────
// Troque o objeto abaixo para testar disciplinas diferentes
// Exemplos prontos no final do arquivo — copie e cole aqui

const ATIVIDADE_TESTE = {
  conteudo: 'Multiplicação',
  disciplina: 'Matemática',
  serie: '3º Ano',
  habilidade_bncc: 'EF03MA07',
  dica_inicial: 'Multiplicar é somar grupos iguais! Ex: 3 × 4 = 4 + 4 + 4 = 12',
  pixabay_key: '',        // deixe vazio por enquanto — testa sem imagem Pixabay
  modo_acessivel: false,
  niveis: [
    {
      numero: 1,
      titulo: 'Com grupos de objetos',
      questoes: [
        {
          numero: 1,
          enunciado: 'A professora colocou laranjas em cestas. Cada cesta tem 3 laranjas e ela tem 2 cestas. Quantas laranjas ao todo?',
          tipo_ilustracao: 'grupos',
          ilustracao_params: { emoji: 'laranja', grupos: 2, por_grupo: 3 },
          linha_resposta: '2 × 3 = ____'
        },
        {
          numero: 2,
          enunciado: 'Pedro tem 4 caixas de lápis. Em cada caixa há 5 lápis. Quantos lápis no total?',
          tipo_ilustracao: 'grupos',
          ilustracao_params: { emoji: 'lapis', grupos: 4, por_grupo: 5 },
          linha_resposta: '4 × 5 = ____'
        }
      ]
    },
    {
      numero: 2,
      titulo: 'Com reta numérica',
      questoes: [
        {
          numero: 3,
          enunciado: 'Use a reta numérica: Maria pula de 3 em 3 e dá 4 saltos. Onde ela para?',
          tipo_ilustracao: 'reta_numerica',
          ilustracao_params: { inicio: 0, fim: 15, passo: 3 },
          linha_resposta: '4 × 3 = ____'
        },
        {
          numero: 4,
          enunciado: 'Dê 5 saltos de 2 em 2 a partir do zero. Em que número você chega?',
          tipo_ilustracao: 'reta_numerica',
          ilustracao_params: { inicio: 0, fim: 12, passo: 2 },
          linha_resposta: '5 × 2 = ____'
        }
      ]
    },
    {
      numero: 3,
      titulo: 'Situação-problema',
      questoes: [
        {
          numero: 5,
          enunciado: 'A escola tem 6 turmas. Cada turma recebeu 8 cadernos. Quantos cadernos no total? Escreva a conta.',
          tipo_ilustracao: 'grupos',
          ilustracao_params: { emoji: 'livro', grupos: 6, por_grupo: 8 },
          linha_resposta: '____ × ____ = ____',
          linhas_resposta: 2
        },
        {
          numero: 6,
          enunciado: 'DESAFIO: Uma fazenda tem 7 galinheiros com 9 galinhas cada. Quantos ovos em uma semana?',
          tipo_ilustracao: null,
          linha_resposta: 'Dia: ____ × ____ = ____   |   Semana: ____ × 7 = ____',
          linhas_resposta: 3
        }
      ]
    }
  ],
  gabarito: [
    { numero: 1, resposta: '6' },
    { numero: 2, resposta: '20' },
    { numero: 3, resposta: '12' },
    { numero: 4, resposta: '10' },
    { numero: 5, resposta: '48' },
    { numero: 6, resposta: '63 por dia; 441 por semana' }
  ]
};

// ─── Executa o teste ──────────────────────────────────────────────────────────
async function main() {
  console.log('\n🚀 DocenteIA — Gerador de Atividades (Teste Local)');
  console.log('═'.repeat(50));
  console.log(`📚 Conteúdo:   ${ATIVIDADE_TESTE.conteudo}`);
  console.log(`🎓 Série:      ${ATIVIDADE_TESTE.serie}`);
  console.log(`📝 Disciplina: ${ATIVIDADE_TESTE.disciplina}`);
  console.log(`♿ Acessível:  ${ATIVIDADE_TESTE.modo_acessivel ? 'SIM' : 'Não'}`);
  console.log('─'.repeat(50));
  console.log('⏳ Gerando atividade com ilustrações...\n');

  try {
    const resultado = await gerarDocx(ATIVIDADE_TESTE);

    // Salva o DOCX na pasta atual
    const nomeArquivo = resultado.nome;
    const caminho = path.join(__dirname, nomeArquivo);
    fs.writeFileSync(caminho, Buffer.from(resultado.base64, 'base64'));

    console.log('✅ DOCX gerado com sucesso!');
    console.log(`📄 Arquivo: ${nomeArquivo}`);
    console.log(`📏 Tamanho: ${(Buffer.from(resultado.base64,'base64').length / 1024).toFixed(1)} KB`);
    console.log(`📋 BNCC:    ${resultado.habilidade}`);
    console.log('\n🔓 Abrindo no Word...');

    // Abre automaticamente no Word (Windows)
    exec(`start "" "${caminho}"`, (err) => {
      if (err) {
        console.log(`\n⚠️  Não consegui abrir automaticamente.`);
        console.log(`   Abra manualmente o arquivo: ${caminho}`);
      }
    });

  } catch (err) {
    console.error('\n❌ Erro ao gerar atividade:');
    console.error(err.message);
    console.error('\nVerifique se rodou: npm install');
  }
}

main();

// ─── EXEMPLOS PRONTOS PARA TESTAR ────────────────────────────────────────────
// Copie um dos objetos abaixo e cole no lugar de ATIVIDADE_TESTE acima

/*
// ── GEOMETRIA ─────────────────────────────────────────────────────────────────
{
  conteudo: 'Figuras Geométricas',
  disciplina: 'Matemática',
  serie: '4º Ano',
  habilidade_bncc: 'EF04MA17',
  dica_inicial: 'As formas geométricas estão em todo lugar ao nosso redor!',
  pixabay_key: '',
  modo_acessivel: false,
  niveis: [
    { numero: 1, titulo: 'Identificando formas', questoes: [
      { numero: 1, enunciado: 'Observe o triângulo abaixo. Quantos lados ele tem?', tipo_ilustracao: 'geometria', ilustracao_params: { forma: 'triangulo' }, alternativas: ['A) 2 lados','B) 3 lados','C) 4 lados','D) 5 lados'] },
      { numero: 2, enunciado: 'Qual figura tem 4 lados iguais?', tipo_ilustracao: 'geometria', ilustracao_params: { forma: 'quadrado' }, alternativas: ['A) Triângulo','B) Círculo','C) Quadrado','D) Pentágono'] }
    ]},
    { numero: 2, titulo: 'Completando', questoes: [
      { numero: 3, enunciado: 'Desenhe e nomeie 3 figuras geométricas diferentes que você vê na sala de aula.', tipo_ilustracao: null, linhas_resposta: 4 }
    ]},
    { numero: 3, titulo: 'Situação-problema', questoes: [
      { numero: 4, enunciado: 'Uma placa de trânsito triangular tem cada lado medindo 40 cm. Qual é o perímetro total?', tipo_ilustracao: 'geometria', ilustracao_params: { forma: 'triangulo' }, linha_resposta: '____ + ____ + ____ = ____ cm' }
    ]}
  ],
  gabarito: [{ numero: 1, resposta: 'B' },{ numero: 2, resposta: 'C' },{ numero: 4, resposta: '120 cm' }]
}

// ── FÍSICA — CIRCUITOS ────────────────────────────────────────────────────────
{
  conteudo: 'Circuitos Elétricos',
  disciplina: 'Física',
  serie: '9º Ano',
  habilidade_bncc: 'EF09CI03',
  dica_inicial: 'A corrente elétrica é o fluxo ordenado de elétrons!',
  pixabay_key: '',
  modo_acessivel: false,
  niveis: [
    { numero: 1, titulo: 'Componentes do circuito', questoes: [
      { numero: 1, enunciado: 'Identifique os componentes do circuito em série:', tipo_ilustracao: 'circuito', ilustracao_params: { tipo: 'serie' }, alternativas: ['A) Bateria, resistor, lâmpada e chave','B) Motor e capacitor','C) Apenas fios e bateria','D) Gerador e transformador'] },
      { numero: 2, enunciado: 'Observe o circuito em paralelo. O que acontece se uma lâmpada queimar?', tipo_ilustracao: 'circuito', ilustracao_params: { tipo: 'paralelo' }, linhas_resposta: 3 }
    ]},
    { numero: 2, titulo: 'Modelo atômico', questoes: [
      { numero: 3, enunciado: 'Observe o modelo de Bohr e identifique onde ficam os elétrons:', tipo_ilustracao: 'atomo', ilustracao_params: { modelo: 'bohr' }, alternativas: ['A) No núcleo','B) Nas órbitas ao redor do núcleo','C) Fora do átomo','D) Junto aos prótons'] }
    ]},
    { numero: 3, titulo: 'Situação-problema', questoes: [
      { numero: 4, enunciado: 'Uma residência tem 3 lâmpadas em paralelo de 60W cada. Qual é a potência total consumida?', tipo_ilustracao: null, linha_resposta: '____ × 60W = ____ W', linhas_resposta: 2 }
    ]}
  ],
  gabarito: [{ numero: 1, resposta: 'A' },{ numero: 3, resposta: 'B' },{ numero: 4, resposta: '180W' }]
}

// ── EDUCAÇÃO ESPECIAL ─────────────────────────────────────────────────────────
{
  conteudo: 'Rotina Diária',
  disciplina: 'Educação Especial',
  serie: 'AEE',
  habilidade_bncc: 'DNEE',
  dica_inicial: 'Vamos aprender juntos, passo a passo!',
  pixabay_key: '',
  modo_acessivel: true,
  niveis: [
    { numero: 1, titulo: 'Como você está?', questoes: [
      { numero: 1, enunciado: 'Como você está se sentindo HOJE?', tipo_ilustracao: 'grade_pictogramas', ilustracao_params: { conceitos: ['feliz','triste','sim','nao'] }, alternativas: ['( ) FELIZ','( ) TRISTE'] },
      { numero: 2, enunciado: 'Você tomou café da manhã hoje?', tipo_ilustracao: 'grade_pictogramas', ilustracao_params: { conceitos: ['sim','nao','comer','beber'] }, alternativas: ['( ) SIM','( ) NÃO'] }
    ]},
    { numero: 2, titulo: 'Minha rotina', questoes: [
      { numero: 3, enunciado: 'Aponte a imagem que mostra o que você faz de MANHÃ:', tipo_ilustracao: 'grade_pictogramas', ilustracao_params: { conceitos: ['escola','casa','brincar','dormir'] }, alternativas: ['( ) ESCOLA','( ) CASA','( ) BRINCAR','( ) DORMIR'] }
    ]},
    { numero: 3, titulo: 'Preciso de ajuda', questoes: [
      { numero: 4, enunciado: 'Quando você precisa de ajuda, o que você faz?', tipo_ilustracao: 'grade_pictogramas', ilustracao_params: { conceitos: ['ajuda','sim','nao','banheiro'] }, linhas_resposta: 2 }
    ]}
  ],
  gabarito: []
}

// ── INGLÊS ────────────────────────────────────────────────────────────────────
{
  conteudo: 'School Objects',
  disciplina: 'Língua Inglesa',
  serie: '5º Ano',
  habilidade_bncc: 'EF05LI01',
  dica_inicial: "Let's learn English together! Vamos aprender inglês!",
  pixabay_key: '',
  modo_acessivel: false,
  niveis: [
    { numero: 1, titulo: 'Vocabulary', questoes: [
      { numero: 1, enunciado: 'Match the word with the picture:', tipo_ilustracao: 'vocabulario', ilustracao_params: { palavras: [{en:'Pencil',pt:'Lápis',emoji:'✏️'},{en:'Book',pt:'Livro',emoji:'📚'},{en:'Ruler',pt:'Régua',emoji:'📏'},{en:'Eraser',pt:'Borracha',emoji:'🧹'},{en:'Backpack',pt:'Mochila',emoji:'🎒'},{en:'Scissors',pt:'Tesoura',emoji:'✂️'}] } },
      { numero: 2, enunciado: 'Read the dialogue and answer: What is Tom\'s name?', tipo_ilustracao: 'dialogo', ilustracao_params: { falas: [{personagem:'Ana',texto:'Hi! What is your name?',lado:'esquerda'},{personagem:'Tom',texto:'My name is Tom. Nice to meet you!',lado:'direita'},{personagem:'Ana',texto:'Nice to meet you too, Tom!',lado:'esquerda'}] }, alternativas: ['A) Ana','B) Tom','C) Maria','D) John'] }
    ]},
    { numero: 2, titulo: 'Complete the sentence', questoes: [
      { numero: 3, enunciado: 'Complete: I use a ________ to write in my notebook.', tipo_ilustracao: null, alternativas: ['A) book','B) pencil','C) ruler','D) eraser'] }
    ]},
    { numero: 3, titulo: 'Free writing', questoes: [
      { numero: 4, enunciado: 'Write 3 school objects you have in your backpack (in English):', tipo_ilustracao: null, linhas_resposta: 3 }
    ]}
  ],
  gabarito: [{ numero: 2, resposta: 'B) Tom' },{ numero: 3, resposta: 'B) pencil' }]
}

// ── EDUCAÇÃO FÍSICA ───────────────────────────────────────────────────────────
{
  conteudo: 'Esportes Coletivos',
  disciplina: 'Educação Física',
  serie: '6º Ano',
  habilidade_bncc: 'EF67EF01',
  dica_inicial: 'Os esportes coletivos desenvolvem trabalho em equipe e respeito!',
  pixabay_key: '',
  modo_acessivel: false,
  niveis: [
    { numero: 1, titulo: 'Conhecendo as quadras', questoes: [
      { numero: 1, enunciado: 'Observe a quadra de futebol. Qual é o objetivo do jogo?', tipo_ilustracao: 'quadra', ilustracao_params: { esporte: 'futebol' }, alternativas: ['A) Marcar pontos arremessando a bola na cesta','B) Marcar gols dentro do gol adversário','C) Passar a bola por cima da rede','D) Bater na bola com a raquete'] },
      { numero: 2, enunciado: 'Quantos jogadores existem em cada time de vôlei?', tipo_ilustracao: 'quadra', ilustracao_params: { esporte: 'volei' }, alternativas: ['A) 5 jogadores','B) 6 jogadores','C) 7 jogadores','D) 11 jogadores'] }
    ]},
    { numero: 2, titulo: 'Tabela de campeonato', questoes: [
      { numero: 3, enunciado: 'Analise a tabela do campeonato e responda: qual time está em primeiro lugar?', tipo_ilustracao: 'tabela_pontos', ilustracao_params: { times: [{nome:'Leões',vitorias:4,derrotas:1,pontos:12},{nome:'Tigres',vitorias:3,derrotas:2,pontos:9},{nome:'Águias',vitorias:2,derrotas:3,pontos:6},{nome:'Lobos',vitorias:1,derrotas:4,pontos:3}] }, alternativas: ['A) Tigres','B) Águias','C) Leões','D) Lobos'] }
    ]},
    { numero: 3, titulo: 'Reflexão', questoes: [
      { numero: 4, enunciado: 'Explique a importância do trabalho em equipe nos esportes coletivos:', tipo_ilustracao: null, linhas_resposta: 4 }
    ]}
  ],
  gabarito: [{ numero: 1, resposta: 'B' },{ numero: 2, resposta: 'B' },{ numero: 3, resposta: 'C) Leões' }]
}
*/
