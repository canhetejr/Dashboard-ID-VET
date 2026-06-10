const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'arquivos_originais');
const stripHtml = (html) => html ? html.replace(/<[^>]+>/g, '').trim() : '';

const courses = [];

const centers = ['CCAS', 'CCS', 'CCSA', 'CEHLA', 'CES', 'CGJS', 'CTIC'];
centers.forEach(center => {
  const filePath = path.join(dir, `${center}.html`);
  if (fs.existsSync(filePath)) {
    const html = fs.readFileSync(filePath, 'utf8');
    const rows = html.split('<tr');
    rows.forEach(row => {
      const tds = [...row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)];
      if (tds.length >= 10) {
        const id = stripHtml(tds[0][1]);
        if (!/^\d+$/.test(id)) return;
        
        // Find the index that actually contains "CONCLUIDO" or "PENDENTE" for Status Conteudo
        // Actually, just skip tds[3] if it is empty. In the file, <td class="freezebar-cell"></td> is empty.
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
        
        courses.push({
          id, centro: center, nomeBreve, disciplina, statusConteudo, grad, turma, statusLayout, obsFabrica, mediador, statusMediacao, obsMediacao, link
        });
      }
    });
  }
});

console.log(`Parsed ${courses.length} courses`);
console.log(courses.slice(0, 1));

const tcc = courses.filter(c => c.disciplina.toUpperCase().includes('TCC') || c.disciplina.toUpperCase().includes('TRABALHO DE CONCLUS') || c.disciplina.toUpperCase().includes('MONOGRAFIA'));
console.log(`Found ${tcc.length} TCC`);

const estagio = courses.filter(c => c.disciplina.toUpperCase().includes('ESTÁGIO') || c.disciplina.toUpperCase().includes('ESTAGIO') || c.statusMediacao === 'ESTAGIO');
console.log(`Found ${estagio.length} Estágios`);

const ext = courses.filter(c => c.disciplina.toUpperCase().includes('EXTENSÃO') || c.disciplina.toUpperCase().includes('EXTENSO') || c.disciplina.toUpperCase().includes('EXTENSIONISTA') || c.statusMediacao === 'EXTENSÃO' || c.statusMediacao === 'EXTENSO');
console.log(`Found ${ext.length} Extensão`);
