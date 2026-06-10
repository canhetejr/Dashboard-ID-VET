import { CENTERS, ENSALAMENTO, COURSES, PERIODO } from './data.js';
import { renderCharts } from './charts.js';

// Setup de dados Iniciais Globais
document.getElementById('lbl-periodo').textContent = PERIODO;
document.getElementById('lbl-meta').innerHTML = `Atualizado automaticamente`;

// Elementos da Visão Geral
let totalIds = 0;
let contOk = 0;
let contPendente = 0;
let medOk = 0;
let medPendente = 0;

CENTERS.forEach(c => {
  totalIds += c.total;
  contOk += c.conteudo.ok;
  contPendente += c.conteudo.pendente;
  medOk += c.mediacao.ok;
  medPendente += (c.mediacao.pendente + c.mediacao.verificar + c.mediacao.andamento + c.mediacao.aguardando);
});

// Preencher KPI Cards da Visão Geral
document.getElementById('kpi-total-ids').textContent = totalIds.toLocaleString('pt-BR');
const contPerc = ((contOk / totalIds) * 100).toFixed(1);
document.getElementById('kpi-cont-perc').textContent = `${contPerc}%`;
document.getElementById('kpi-cont-sub').textContent = `${contOk} de ${totalIds}`;
const medPerc = ((medOk / totalIds) * 100).toFixed(1);
document.getElementById('kpi-med-perc').textContent = `${medPerc}%`;
document.getElementById('kpi-med-sub').textContent = `${medOk} de ${totalIds}`;
document.getElementById('kpi-med-pend').textContent = medPendente;

// Renderizar tabelas Visão Geral
const tbodyMed = document.querySelector('#tableMediacao tbody');
const tbodyCont = document.querySelector('#tableConteudo tbody');
tbodyMed.innerHTML = ''; tbodyCont.innerHTML = '';

CENTERS.forEach(c => {
  const perc = c.total === 0 ? 0 : Math.round((c.mediacao.ok / c.total) * 100);
  let colorVar = 'var(--color-red)';
  if (perc >= 85) colorVar = 'var(--color-green)';
  else if (perc >= 60) colorVar = 'var(--color-amber)';
  
  const trMed = document.createElement('tr');
  trMed.innerHTML = `
    <td>${c.key}</td>
    <td>${c.total}</td>
    <td>
      <div class="progress-cell">
        <div class="progress-bar-bg">
          <div class="progress-bar-fill" style="width: 0%; background-color: ${colorVar};" data-width="${perc}%"></div>
        </div>
        <span style="color: ${colorVar}; font-weight: 600; font-size: 13px;">${perc}%</span>
      </div>
    </td>
  `;
  tbodyMed.appendChild(trMed);

  const trCont = document.createElement('tr');
  const pend = c.conteudo.pendente;
  const pendHTML = pend === 0 ? `<span style="color: var(--color-green);">—</span>` : `<span style="color: var(--color-amber);">${pend}</span>`;
  trCont.innerHTML = `<td>${c.key}</td><td>${c.total}</td><td>${pendHTML}</td>`;
  tbodyCont.appendChild(trCont);
});

// Sub-cards Ensalamento
let sumEad = 0, sumSemi = 0, sumTecs = 0, sumTotal = 0;
ENSALAMENTO.forEach(e => {
  sumEad += e.ead; sumSemi += e.semi; sumTecs += e.tecs;
  sumTotal += (e.ead + e.semi + e.tecs);
});
document.getElementById('sub-ead').textContent = sumEad.toLocaleString('pt-BR');
document.getElementById('sub-semi').textContent = sumSemi.toLocaleString('pt-BR');
document.getElementById('sub-tecs').textContent = sumTecs.toLocaleString('pt-BR');
document.getElementById('sub-total').textContent = sumTotal.toLocaleString('pt-BR');


// ==========================================
// ROTEAMENTO (SPA) E NAVEGAÇÃO
// ==========================================

const mainNavItems = document.querySelectorAll('#main-nav .nav-item');
const views = document.querySelectorAll('.view-container');
const topbarTitle = document.getElementById('topbar-title');

// Sub-navegação interna (Mediação, Conteúdo, Ensalamento) na Visão Geral
const subNavItems = document.querySelectorAll('.sub-nav-item');
const tabPanes = document.querySelectorAll('.tab-pane');

subNavItems.forEach(item => {
  item.addEventListener('click', () => {
    subNavItems.forEach(i => i.classList.remove('active'));
    tabPanes.forEach(p => p.classList.remove('active'));
    item.classList.add('active');
    document.getElementById(item.dataset.pane).classList.add('active');
  });
});

// Função para renderizar uma lista filtrada no View-Detalhe
function renderDetalheView(title, filterFn) {
  const filtered = COURSES.filter(filterFn);
  
  topbarTitle.textContent = title;
  
  let total = filtered.length;
  let cOk = 0;
  let mOk = 0;
  let mPendente = 0;
  
  const tbody = document.querySelector('#tableDetalhe tbody');
  tbody.innerHTML = '';
  
  filtered.forEach(c => {
    if (c.statusConteudo === 'CONCLUIDO') cOk++;
    if (c.statusMediacao === 'CONCLUIDO') mOk++;
    if (['PENDENTE','VERIFICAR','ANDAMENTO','AGUARDANDO'].includes(c.statusMediacao)) mPendente++;

    const cColor = c.statusConteudo === 'CONCLUIDO' ? 'var(--color-green)' : (c.statusConteudo === 'PENDENTE' ? 'var(--color-amber)' : 'var(--color-muted)');
    const mColor = c.statusMediacao === 'CONCLUIDO' ? 'var(--color-green)' : (['PENDENTE','VERIFICAR','ANDAMENTO','AGUARDANDO'].includes(c.statusMediacao) ? 'var(--color-red)' : 'var(--color-muted)');

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${c.id}</td>
      <td title="${c.nomeBreve}"><strong>${c.disciplina}</strong><br><small style="color:var(--color-muted)">${c.grad} - ${c.turma}</small></td>
      <td>${c.centro}</td>
      <td><span style="color: ${cColor}; font-weight:600;">${c.statusConteudo || '-'}</span></td>
      <td><span style="color: ${mColor}; font-weight:600;">${c.statusMediacao || '-'}</span></td>
      <td>${c.link ? `<a href="${c.link}" target="_blank" style="color:var(--color-blue); text-decoration:none;">Acessar</a>` : '-'}</td>
    `;
    tbody.appendChild(tr);
  });

  // Atualizar KPIs detalhe
  document.getElementById('detalhe-total').textContent = total;
  const percC = total === 0 ? 0 : Math.round((cOk/total)*100);
  const percM = total === 0 ? 0 : Math.round((mOk/total)*100);
  
  document.getElementById('detalhe-cont-perc').textContent = `${percC}%`;
  document.getElementById('detalhe-cont-sub').textContent = `${cOk} concluídos`;
  
  document.getElementById('detalhe-med-perc').textContent = `${percM}%`;
  document.getElementById('detalhe-med-sub').textContent = `${mOk} concluídos`;
  
  document.getElementById('detalhe-med-pend').textContent = mPendente;
}

// Lidar com clique na Sidebar Principal
mainNavItems.forEach(navBtn => {
  navBtn.addEventListener('click', () => {
    // UI state update
    mainNavItems.forEach(b => b.classList.remove('active'));
    navBtn.classList.add('active');
    
    views.forEach(v => v.classList.remove('active'));
    
    const viewId = navBtn.dataset.view;
    
    if (viewId === 'visao-geral') {
      document.getElementById('view-visao-geral').classList.add('active');
      topbarTitle.textContent = 'Visão Geral Institucional';
    } else {
      document.getElementById('view-detalhe').classList.add('active');
      
      // Checar se é centro ou prog
      if (viewId.startsWith('centro-')) {
        const centroId = viewId.split('-')[1]; // ex: CCAS
        renderDetalheView(`Centro: ${centroId}`, (c) => c.centro === centroId);
      } 
      else if (viewId === 'prog-TCC') {
        renderDetalheView('Programa: Trabalho de Conclusão (TCC)', (c) => 
          c.disciplina.toUpperCase().includes('TCC') || 
          c.disciplina.toUpperCase().includes('TRABALHO DE CONCLUS') || 
          c.disciplina.toUpperCase().includes('MONOGRAFIA')
        );
      }
      else if (viewId === 'prog-ESTAGIO') {
        renderDetalheView('Programa: Estágios Supervisionados', (c) => 
          c.disciplina.toUpperCase().includes('ESTÁGIO') || 
          c.disciplina.toUpperCase().includes('ESTAGIO') || 
          c.statusMediacao === 'ESTAGIO'
        );
      }
      else if (viewId === 'prog-EXTENSAO') {
        renderDetalheView('Programa: Atividades de Extensão', (c) => 
          c.disciplina.toUpperCase().includes('EXTENSÃO') || 
          c.disciplina.toUpperCase().includes('EXTENSO') || 
          c.disciplina.toUpperCase().includes('EXTENSIONISTA') || 
          c.statusMediacao === 'EXTENSÃO' || 
          c.statusMediacao === 'EXTENSO'
        );
      }
    }
  });
});

// Inicia com os gráficos originais
renderCharts();

// Animação progress bars da Visão Geral
setTimeout(() => {
  document.querySelectorAll('.progress-bar-fill').forEach(bar => {
    bar.style.width = bar.getAttribute('data-width');
  });
}, 100);
