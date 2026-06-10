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

const stripHtml = (html) => html ? html.replace(/<[^>]+>/g, '').trim() : '';

const courses = [];

// 1. Process courses and centers
Object.keys(centersMap).forEach(center => {
  const filePath = path.join(dir, `${center}.html`);
  if (fs.existsSync(filePath)) {
    const html = fs.readFileSync(filePath, 'utf8');
    const rows = html.split('<tr');
    
    rows.forEach(row => {
      const tds = [...row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)];
      if (tds.length >= 10) {
        const id = stripHtml(tds[0][1]);
        if (!/^\d+$/.test(id)) return;
        
        let offset = 0;
        if (tds[3] && tds[3][0].includes('freezebar-cell')) {
          offset = 1;
        }

        const nomeBreve = stripHtml(tds[1][1]);
        const disciplina = stripHtml(tds[2][1]);
        const statusConteudo = stripHtml(tds[3 + offset][1]);
        const grad = stripHtml(tds[4 + offset][1]);
        const turma = stripHtml(tds[5 + offset][1]);
        const statusLayout = stripHtml(tds[6 + offset][1]);
        const obsFabrica = stripHtml(tds[7 + offset][1]);
        const mediador = stripHtml(tds[8 + offset][1]);
        const statusMediacao = stripHtml(tds[9 + offset][1]);
        const obsMediacao = tds[10 + offset] ? stripHtml(tds[10 + offset][1]) : '';
        const linkHTML = tds[11 + offset] ? tds[11 + offset][1] : '';
        const linkMatch = linkHTML.match(/href="([^"]+)"/);
        const link = linkMatch ? linkMatch[1] : '';
        
        // Populate courses array
        courses.push({
          id, centro: center, nomeBreve, disciplina, statusConteudo, grad, turma, statusLayout, obsFabrica, mediador, statusMediacao, obsMediacao, link
        });

        // Populate centers map (only if not VETERANOS or INGRESSANTES as statuses)
        // Wait, the status is specifically statusConteudo and statusMediacao
        centersMap[center].total++;
        
        if (statusConteudo === 'CONCLUIDO') centersMap[center].conteudo.ok++;
        else if (statusConteudo === 'PENDENTE') centersMap[center].conteudo.pendente++;
        
        if (statusMediacao === 'CONCLUIDO') centersMap[center].mediacao.ok++;
        else if (statusMediacao === 'PENDENTE') centersMap[center].mediacao.pendente++;
        else if (statusMediacao === 'VERIFICAR') centersMap[center].mediacao.verificar++;
        else if (statusMediacao === 'ANDAMENTO') centersMap[center].mediacao.andamento++;
        else if (statusMediacao === 'AGUARDANDO') centersMap[center].mediacao.aguardando++;
        else if (statusMediacao === 'ESTAGIO') centersMap[center].mediacao.estagio++;
        else if (statusMediacao === 'NAO_OFERTADO') centersMap[center].mediacao.naoOfertado++;
      }
    });
  }
});

// 1.5 Process TCC courses
const tccDir = path.join(dir, 'TCC');
if (fs.existsSync(tccDir)) {
  const tccFiles = fs.readdirSync(tccDir).filter(f => f.endsWith('.html'));
  tccFiles.forEach(file => {
    const html = fs.readFileSync(path.join(tccDir, file), 'utf8');
    const rows = html.split('<tr');
    
    rows.forEach(row => {
      const tds = [...row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)];
      if (tds.length >= 8) {
        const id = stripHtml(tds[0][1]);
        if (!/^\d+$/.test(id)) return;
        
        const nomeBreve = stripHtml(tds[1][1]);
        const disciplina = stripHtml(tds[2][1]);
        
        let center = 'CTIC'; // Default fallback
        let mediador = 'Sem Atribuição';
        let statusMediacao = 'PENDENTE';
        
        tds.forEach(t => {
          const val = stripHtml(t[1]).trim();
          if (centersMap[val]) center = val;
          else if (val.includes('|')) mediador = val;
          else if (['CONCLUIDO', 'PENDENTE', 'ANDAMENTO', 'VERIFICAR'].includes(val) && statusMediacao === 'PENDENTE') {
             statusMediacao = val;
          }
        });
        
        const linkMatch = row.match(/href="([^"]+)"/);
        const link = linkMatch ? linkMatch[1] : '';
        
        courses.push({
          id, centro: center, nomeBreve, disciplina, 
          statusConteudo: 'CONCLUIDO', grad: 'TCC', turma: 'TCC', 
          statusLayout: 'CONCLUIDO', obsFabrica: '', 
          mediador, statusMediacao, obsMediacao: '', link
        });
        
        if (centersMap[center]) {
          centersMap[center].total++;
          centersMap[center].conteudo.ok++;
          
          if (statusMediacao === 'CONCLUIDO') centersMap[center].mediacao.ok++;
          else if (statusMediacao === 'PENDENTE') centersMap[center].mediacao.pendente++;
          else if (statusMediacao === 'ANDAMENTO') centersMap[center].mediacao.andamento++;
          else if (statusMediacao === 'VERIFICAR') centersMap[center].mediacao.verificar++;
        }
      }
    });
  });
}

// 2. Process Ensalamento
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

// 3. Output Generation
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
out += `export const COURSES = ${JSON.stringify(courses, null, 2)};\n\n`;
out += `export const PERIODO = '2025.1';\n\n`;
out += `window.CENTERS = CENTERS;\nwindow.ENSALAMENTO = ENSALAMENTO;\nwindow.COURSES = COURSES;\nwindow.PERIODO = PERIODO;\n`;

fs.writeFileSync(path.join(__dirname, 'data.js'), out);
console.log('data.js generated successfully.');
