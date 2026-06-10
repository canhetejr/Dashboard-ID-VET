const CENTERS = [
  {
    key: 'CCS',
    label: 'Ciências da Saúde',
    total: 297,
    conteudo: { ok: 295, pendente: 2 },
    mediacao: { ok: 280, pendente: 0, verificar: 15, andamento: 0, aguardando: 1, estagio: 0, naoOfertado: 1 }
  },
  {
    key: 'CCSA',
    label: 'Ciências Sociais Aplicadas',
    total: 222,
    conteudo: { ok: 216, pendente: 6 },
    mediacao: { ok: 133, pendente: 81, verificar: 6, andamento: 1, aguardando: 0, estagio: 1, naoOfertado: 0 }
  },
  {
    key: 'CEHLA',
    label: 'Ciências Exatas, Humanas, Letras e Artes',
    total: 661,
    conteudo: { ok: 646, pendente: 15 },
    mediacao: { ok: 307, pendente: 331, verificar: 19, andamento: 4, aguardando: 0, estagio: 0, naoOfertado: 0 }
  },
  {
    key: 'CES',
    label: 'Engenharias e Sustentabilidade',
    total: 186,
    conteudo: { ok: 186, pendente: 0 },
    mediacao: { ok: 90, pendente: 62, verificar: 2, andamento: 29, aguardando: 3, estagio: 0, naoOfertado: 0 }
  },
  {
    key: 'CGJS',
    label: 'Gestão, Jurídico e Segurança',
    total: 178,
    conteudo: { ok: 169, pendente: 9 },
    mediacao: { ok: 99, pendente: 59, verificar: 7, andamento: 11, aguardando: 2, estagio: 0, naoOfertado: 0 }
  },
  {
    key: 'CTIC',
    label: 'Tecnologia da Informação e Comunicação',
    total: 278,
    conteudo: { ok: 276, pendente: 2 },
    mediacao: { ok: 162, pendente: 115, verificar: 0, andamento: 1, aguardando: 0, estagio: 0, naoOfertado: 0 }
  }
];

const ENSALAMENTO = [
  { key: 'CCAS', label: 'Cidadania e Ação Social', ead: 155, semi: 69, tecs: 85 },
  { key: 'CCS', label: 'Ciências da Saúde', ead: 229, semi: 55, tecs: 547 },
  { key: 'CCSA', label: 'Ciências Sociais Aplicadas', ead: 602, semi: 0, tecs: 907 },
  { key: 'CEHLA', label: 'Ciências Exatas, Humanas, Letras e Artes', ead: 1344, semi: 599, tecs: 152 },
  { key: 'CES', label: 'Engenharias e Sustentabilidade', ead: 225, semi: 0, tecs: 395 },
  { key: 'CGJS', label: 'Gestão, Jurídico e Segurança', ead: 102, semi: 0, tecs: 725 },
  { key: 'CTIC', label: 'Tecnologia da Informação e Comunicação', ead: 439, semi: 6, tecs: 806 }
];

const PERIODO = '2025.1';

window.CENTERS = CENTERS;
window.ENSALAMENTO = ENSALAMENTO;
