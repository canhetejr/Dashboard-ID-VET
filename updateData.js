const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const credentials = require('./credentials.json');

const centersMapTemplate = {
  'CCAS': { label: 'Cidadania e Ação Social', total: 0, conteudo: { ok: 0, pendente: 0 }, mediacao: { ok: 0, pendente: 0, verificar: 0, andamento: 0, aguardando: 0, estagio: 0, naoOfertado: 0 } },
  'CCS': { label: 'Ciências da Saúde', total: 0, conteudo: { ok: 0, pendente: 0 }, mediacao: { ok: 0, pendente: 0, verificar: 0, andamento: 0, aguardando: 0, estagio: 0, naoOfertado: 0 } },
  'CCSA': { label: 'Ciências Sociais Aplicadas', total: 0, conteudo: { ok: 0, pendente: 0 }, mediacao: { ok: 0, pendente: 0, verificar: 0, andamento: 0, aguardando: 0, estagio: 0, naoOfertado: 0 } },
  'CEHLA': { label: 'Engenharias, Humanidades e Letras', total: 0, conteudo: { ok: 0, pendente: 0 }, mediacao: { ok: 0, pendente: 0, verificar: 0, andamento: 0, aguardando: 0, estagio: 0, naoOfertado: 0 } },
  'CES': { label: 'Centro de Excelência em Saúde', total: 0, conteudo: { ok: 0, pendente: 0 }, mediacao: { ok: 0, pendente: 0, verificar: 0, andamento: 0, aguardando: 0, estagio: 0, naoOfertado: 0 } },
  'CGJS': { label: 'Gestão e Jurídico', total: 0, conteudo: { ok: 0, pendente: 0 }, mediacao: { ok: 0, pendente: 0, verificar: 0, andamento: 0, aguardando: 0, estagio: 0, naoOfertado: 0 } },
  'CTIC': { label: 'Tecnologia da Informação', total: 0, conteudo: { ok: 0, pendente: 0 }, mediacao: { ok: 0, pendente: 0, verificar: 0, andamento: 0, aguardando: 0, estagio: 0, naoOfertado: 0 } }
};

const ensalamentoMapTemplate = {
  'CCAS': { ead: 0, semi: 0, tecs: 0 },
  'CCS': { ead: 0, semi: 0, tecs: 0 },
  'CCSA': { ead: 0, semi: 0, tecs: 0 },
  'CEHLA': { ead: 0, semi: 0, tecs: 0 },
  'CES': { ead: 0, semi: 0, tecs: 0 },
  'CGJS': { ead: 0, semi: 0, tecs: 0 },
  'CTIC': { ead: 0, semi: 0, tecs: 0 }
};

function normalizeStatus(status) {
  if (!status) return 'PENDENTE';
  const s = status.toUpperCase().trim();
  if (s.includes('CONCLUIDO') || s.includes('CONCLUÍDO')) return 'CONCLUIDO';
  if (s.includes('ANDAMENTO')) return 'ANDAMENTO';
  if (s.includes('VERIFICAR')) return 'VERIFICAR';
  if (s.includes('AGUARDANDO')) return 'AGUARDANDO';
  if (s.includes('ESTAGIO') || s.includes('ESTÁGIO')) return 'ESTAGIO';
  if (s.includes('NAO') || s.includes('NÃO')) return 'NAO_OFERTADO';
  return 'PENDENTE';
}

function extractCenter(nomeBreve, centroCol) {
  if (centroCol && centersMapTemplate[centroCol.toUpperCase().trim()]) {
    return centroCol.toUpperCase().trim();
  }
  if (!nomeBreve) return 'CTIC'; // fallback
  const parts = nomeBreve.split('-');
  const possible = parts[0].toUpperCase().trim();
  if (centersMapTemplate[possible]) return possible;
  return 'CTIC'; // Default fallback
}

async function fetchGoogleSheetsData() {
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  const spreadsheetId = '1EyZasTZEH9UosnzWAcWwM-v0l-YPH77K_kzKx8wS_K0';

  const response = await sheets.spreadsheets.get({ spreadsheetId });
  const sheetTitles = response.data.sheets.map(s => s.properties.title).filter(t => t !== 'LINKS');

  let dataByTab = {};

  for (const title of sheetTitles) {
    const range = `${title}!A:P`;
    let data;
    try {
      data = await sheets.spreadsheets.values.get({ spreadsheetId, range });
    } catch (e) {
      console.log(`Failed to fetch sheet ${title}`);
      continue;
    }

    const rows = data.data.values;
    if (!rows || rows.length < 2) continue; // Skip if no data or only headers

    const headers = rows[0].map(h => h ? h.toUpperCase().trim() : '');

    // Busca flexível de colunas — aceita variações como "ID A", "NOME BREVE A", "LINK MOODLE", etc.
    function findCol(headers, ...candidates) {
      for (const candidate of candidates) {
        const idx = headers.findIndex(h => h === candidate || h.startsWith(candidate + ' ') || h.startsWith(candidate));
        if (idx !== -1) return idx;
      }
      return -1;
    }

    const idIdx = findCol(headers, 'ID');
    const nomeBreveIdx = findCol(headers, 'NOME BREVE');
    const disciplinaIdx = findCol(headers, 'DISCIPLINA');
    const statusConteudoIdx = findCol(headers, 'STATUS CONTEUDO', 'STATUS CONTEÚDO');
    const gradIdx = findCol(headers, 'GRAD', 'OFERTA');
    const turmaIdx = findCol(headers, 'TURMA');
    const statusLayoutIdx = findCol(headers, 'STATUS LAYOUT');
    const centroIdx = findCol(headers, 'CENTRO');
    const obsFabricaIdx = findCol(headers, 'OBSERVAÇÃO FABRICA', 'OBSERVACAO FABRICA', 'OBS FABRICA');
    
    let mediadorIdx = findCol(headers, 'MEDIADOR', 'TUTOR');
    
    let statusMediacaoIdx = findCol(headers, 'STATUS MEDIAÇÃO', 'STATUS MEDIACAO', 'STATUS TUTORIA');
    
    let obsMediacaoIdx = findCol(headers, 'OBSERVAÇÃO MEDIAÇÃO', 'OBSERVACAO MEDIAÇÃO', 'OBSERVAÇÃO  MEDIAÇÃO', 'OBSERVAÇÃO TUTORIA');

    let linkIdx = findCol(headers, 'LINK');

    let courses = [];
    const centersMap = JSON.parse(JSON.stringify(centersMapTemplate));
    const ensalamentoMap = JSON.parse(JSON.stringify(ensalamentoMapTemplate));

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row || row.length === 0 || !row[0]) continue;
      
      const id = row[idIdx] || '';
      if (!id || id === '#REF!') continue; // Skip invalid IDs

      const nomeBreve = row[nomeBreveIdx] || '';
      const centroCol = centroIdx !== -1 ? row[centroIdx] : '';
      const center = extractCenter(nomeBreve, centroCol);

      const disciplina = row[disciplinaIdx] || '';
      const statusConteudoStr = row[statusConteudoIdx] || '';
      const statusConteudo = normalizeStatus(statusConteudoStr);

      const grad = row[gradIdx] || '';
      const turma = row[turmaIdx] || '';
      const statusLayout = row[statusLayoutIdx] || '';
      const obsFabrica = obsFabricaIdx !== -1 ? (row[obsFabricaIdx] || '') : '';
      const mediador = mediadorIdx !== -1 ? (row[mediadorIdx] || '') : '';
      
      const statusMediacaoStr = statusMediacaoIdx !== -1 ? (row[statusMediacaoIdx] || '') : '';
      const statusMediacao = normalizeStatus(statusMediacaoStr);
      
      const obsMediacao = obsMediacaoIdx !== -1 ? (row[obsMediacaoIdx] || '') : '';
      
      let link = linkIdx !== -1 ? (row[linkIdx] || '') : '';
      if (!link) {
         link = `https://moodle.unicv.edu.br/course/view.php?id=${id}`;
      } else if (!link.startsWith('http')) {
         link = `https://moodle.unicv.edu.br/course/view.php?id=${id}`;
      }

      courses.push({
        id, centro: center, nomeBreve, disciplina, statusConteudo, grad, turma, statusLayout, obsFabrica, mediador, statusMediacao, obsMediacao, link
      });

      if (centersMap[center]) {
        centersMap[center].total++;
        
        if (statusConteudo === 'CONCLUIDO') centersMap[center].conteudo.ok++;
        else centersMap[center].conteudo.pendente++;
        
        if (statusMediacao === 'CONCLUIDO') centersMap[center].mediacao.ok++;
        else if (statusMediacao === 'PENDENTE') centersMap[center].mediacao.pendente++;
        else if (statusMediacao === 'VERIFICAR') centersMap[center].mediacao.verificar++;
        else if (statusMediacao === 'ANDAMENTO') centersMap[center].mediacao.andamento++;
        else if (statusMediacao === 'AGUARDANDO') centersMap[center].mediacao.aguardando++;
        else if (statusMediacao === 'ESTAGIO') centersMap[center].mediacao.estagio++;
        else if (statusMediacao === 'NAO_OFERTADO') centersMap[center].mediacao.naoOfertado++;
      }

      let mod = null;
      const gradUp = grad.toUpperCase();
      if (gradUp.includes('EAD')) mod = 'ead';
      else if (gradUp.includes('SEMI') || gradUp.includes('HÍBRIDO') || gradUp.includes('HIBRIDO')) mod = 'semi';
      else if (gradUp.includes('TEC') || gradUp.includes('TECNÓLOGOS') || gradUp.includes('TECNOLOGOS')) mod = 'tecs';
      
      if (mod && centersMap[center]) {
        ensalamentoMap[center][mod]++;
      }
    }

    // Convert maps to arrays
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

    dataByTab[title] = {
      CENTERS: centersArr,
      ENSALAMENTO: ensalamentoArr,
      COURSES: courses,
      PERIODO: title
    };
  }

  const DATA_BY_TAB = JSON.stringify(dataByTab, null, 2);
  let out = `const DATA_BY_TAB = ${DATA_BY_TAB};\n`;
  fs.writeFileSync(path.join(__dirname, 'data.js'), out);
  console.log('data.js generated successfully based on Google Sheets, separated by tabs.');
}

fetchGoogleSheetsData().catch(console.error);
