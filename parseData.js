const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'arquivos_originais');

const centersMap = {
  'CCAS': { label: 'Cidadania e Ação Social', total: 0, conteudo: { ok: 0, pendente: 0 }, mediacao: { ok: 0, pendente: 0, verificar: 0, andamento: 0, aguardando: 0, estagio: 0, naoOfertado: 0 } },
  'CCS': { label: 'Ciências da Saúde', total: 0, conteudo: { ok: 0, pendente: 0 }, mediacao: { ok: 0, pendente: 0, verificar: 0, andamento: 0, aguardando: 0, estagio: 0, naoOfertado: 0 } },
  'CCSA': { label: 'Ciências Sociais Aplicadas', total: 0, conteudo: { ok: 0, pendente: 0 }, mediacao: { ok: 0, pendente: 0, verificar: 0, andamento: 0, aguardando: 0, estagio: 0, naoOfertado: 0 } },
  'CEHLA': { label: 'Engenharias, Humanidades e Letras', total: 0, conteudo: { ok: 0, pendente: 0 }, mediacao: { ok: 0, pendente: 0, verificar: 0, andamento: 0, aguardando: 0, estagio: 0, naoOfertado: 0 } },
  'CES': { label: 'Centro de Excelência em Saúde', total: 0, conteudo: { ok: 0, pendente: 0 }, mediacao: { ok: 0, pendente: 0, verificar: 0, andamento: 0, aguardando: 0, estagio: 0, naoOfertado: 0 } },
  'CGJS': { label: 'Gestão e Jurídico', total: 0, conteudo: { ok: 0, pendente: 0 }, mediacao: { ok: 0, pendente: 0, verificar: 0, andamento: 0, aguardando: 0, estagio: 0, naoOfertado: 0 } },
  'CTIC': { label: 'Tecnologia da Informação', total: 0, conteudo: { ok: 0, pendente: 0 }, mediacao: { ok: 0, pendente: 0, verificar: 0, andamento: 0, aguardando: 0, estagio: 0, naoOfertado: 0 } }
};

const ensalamentoMap = {
  'CCAS': { ead: 0, semi: 0, tecs: 0 },
  'CCS': { ead: 0, semi: 0, tecs: 0 },
  'CCSA': { ead: 0, semi: 0, tecs: 0 },
  'CEHLA': { ead: 0, semi: 0, tecs: 0 },
  'CES': { ead: 0, semi: 0, tecs: 0 },
  'CGJS': { ead: 0, semi: 0, tecs: 0 },
  'CTIC': { ead: 0, semi: 0, tecs: 0 }
};

// Parse center files
Object.keys(centersMap).forEach(center => {
  const filePath = path.join(dir, `${center}.html`);
  if (fs.existsSync(filePath)) {
    const html = fs.readFileSync(filePath, 'utf8');
    
    // Each row is a <tr>
    const rows = html.split('<tr');
    rows.forEach(row => {
      // Find spans that contain status
      const matches = [...row.matchAll(/<span[^>]*>(CONCLUIDO|PENDENTE|VERIFICAR|ANDAMENTO|AGUARDANDO|ESTAGIO|NAO_OFERTADO|VETERANOS|INGRESSANTES)<\/span>/g)];
      
      if (matches.length >= 2) {
        // Filter out VETERANOS/INGRESSANTES
        const statuses = matches.map(m => m[1]).filter(s => s !== 'VETERANOS' && s !== 'INGRESSANTES');
        
        if (statuses.length >= 2) {
          const conteudo = statuses[0];
          const mediacao = statuses[1];
          
          centersMap[center].total++;
          
          if (conteudo === 'CONCLUIDO') centersMap[center].conteudo.ok++;
          else if (conteudo === 'PENDENTE') centersMap[center].conteudo.pendente++;
          
          if (mediacao === 'CONCLUIDO') centersMap[center].mediacao.ok++;
          else if (mediacao === 'PENDENTE') centersMap[center].mediacao.pendente++;
          else if (mediacao === 'VERIFICAR') centersMap[center].mediacao.verificar++;
          else if (mediacao === 'ANDAMENTO') centersMap[center].mediacao.andamento++;
          else if (mediacao === 'AGUARDANDO') centersMap[center].mediacao.aguardando++;
          else if (mediacao === 'ESTAGIO') centersMap[center].mediacao.estagio++;
          else if (mediacao === 'NAO_OFERTADO') centersMap[center].mediacao.naoOfertado++;
        }
      }
    });
  }
});

// Parse ENSALAMENTO
const ensalamentoPath = path.join(dir, 'ENSALAMENTO.html');
if (fs.existsSync(ensalamentoPath)) {
  const html = fs.readFileSync(ensalamentoPath, 'utf8');
  const rows = html.split('<tr');
  rows.forEach(row => {
    let mod = null;
    let center = null;
    
    if (row.includes('GRAD EAD')) mod = 'ead';
    else if (row.includes('GRAD SEMIPRESENCIAL')) mod = 'semi';
    else if (row.includes('GRAD TECNOLOGOS')) mod = 'tecs';
    
    if (row.includes('(CCAS)')) center = 'CCAS';
    else if (row.includes('(CCS)')) center = 'CCS';
    else if (row.includes('(CCSA)')) center = 'CCSA';
    else if (row.includes('(CEHLA)')) center = 'CEHLA';
    else if (row.includes('(CES)')) center = 'CES';
    else if (row.includes('(CGJS)')) center = 'CGJS';
    else if (row.includes('(CTIC)')) center = 'CTIC';
    
    if (mod && center) {
      ensalamentoMap[center][mod]++;
    }
  });
}

// Generate data.js format
const centersArr = Object.keys(centersMap).map(k => ({
  key: k,
  label: centersMap[k].label,
  total: centersMap[k].total,
  conteudo: centersMap[k].conteudo,
  mediacao: centersMap[k].mediacao
}));

const ensalamentoArr = Object.keys(ensalamentoMap).map(k => ({
  key: k,
  label: centersMap[k].label,
  ead: ensalamentoMap[k].ead,
  semi: ensalamentoMap[k].semi,
  tecs: ensalamentoMap[k].tecs
}));

let out = `export const CENTERS = ${JSON.stringify(centersArr, null, 2)};\n\n`;
out += `export const ENSALAMENTO = ${JSON.stringify(ensalamentoArr, null, 2)};\n\n`;
out += `export const PERIODO = '2025.1';\n\n`;
out += `window.CENTERS = CENTERS;\nwindow.ENSALAMENTO = ENSALAMENTO;\nwindow.PERIODO = PERIODO;\n`;

fs.writeFileSync(path.join(__dirname, 'data.js'), out);
console.log('data.js generated successfully.');
