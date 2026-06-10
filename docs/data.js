// Dados mockados para a Visão Geral Institucional

const KPI_DATA = {
  respostas: '36.151',
  disciplinas: '1.289',
  centros: '7',
  media: '4.68',
  favoravel: '93.9%',
  neutro: '4.2%',
  desfavoravel: '1.9%'
};

// 1. Distribuição de Respostas (Discordo Totalmente, Parcialmente, Indiferente, Concordo Parcialmente, Concordo Totalmente)
const DISTRIBUICAO = [
  { label: 'Respostas', data: [1.9, 2.0, 4.2, 10.5, 81.4] } 
];

// 2. Média por Pergunta (Q1 a Q6)
const PERGUNTAS = {
  labels: ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'],
  data: [4.8, 4.75, 4.78, 4.75, 4.6, 4.65]
};

// 3. Média Likert por Centro
const MEDIA_CENTRO = {
  labels: ['CCAS', 'CCS', 'CCSA', 'CEHLA', 'CES', 'CGJS', 'CTIC'],
  data: [4.7, 4.8, 4.65, 4.75, 4.85, 4.5, 4.6]
};

// 4. Favorabilidade por Centro (%)
const FAVORAVEL_CENTRO = {
  labels: ['CCAS', 'CCS', 'CCSA', 'CEHLA', 'CES', 'CGJS', 'CTIC'],
  data: [94.5, 96.0, 91.5, 95.0, 97.5, 89.0, 92.5]
};

window.KPI_DATA = KPI_DATA;
window.DISTRIBUICAO = DISTRIBUICAO;
window.PERGUNTAS = PERGUNTAS;
window.MEDIA_CENTRO = MEDIA_CENTRO;
window.FAVORAVEL_CENTRO = FAVORAVEL_CENTRO;
