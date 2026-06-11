import { CENTERS, ENSALAMENTO, COURSES, PERIODO } from './data.js';
import { renderCharts } from './charts.js';

// Setup de dados Iniciais Globais
document.getElementById('lbl-periodo').textContent = PERIODO;
document.getElementById('lbl-meta').innerHTML = `Período: ${PERIODO}`;

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



// Renderizar Programas Especiais
let tccCount = 0;
let estagioCount = 0;
let extensaoCount = 0;

COURSES.forEach(c => {
  const dUpper = c.disciplina.toUpperCase();
  const mStatus = c.statusMediacao;
  
  if (dUpper.includes('TCC') || dUpper.includes('TRABALHO DE CONCLUS') || dUpper.includes('MONOGRAFIA')) {
    tccCount++;
  }
  else if (dUpper.includes('ESTÁGIO') || dUpper.includes('ESTAGIO') || mStatus === 'ESTAGIO') {
    estagioCount++;
  }
  else if (dUpper.includes('EXTENSÃO') || dUpper.includes('EXTENSO') || dUpper.includes('EXTENSIONISTA') || mStatus === 'EXTENSÃO' || mStatus === 'EXTENSO') {
    extensaoCount++;
  }
});

const progsContainer = document.getElementById('special-progs-list');
progsContainer.innerHTML = `
  <div class="special-card">
    <span class="special-card-title">TCC / Monografias</span>
    <span class="special-card-value">${tccCount}</span>
  </div>
  <div class="special-card">
    <span class="special-card-title">Estágios Sup.</span>
    <span class="special-card-value">${estagioCount}</span>
  </div>
  <div class="special-card">
    <span class="special-card-title">Extensão</span>
    <span class="special-card-value">${extensaoCount}</span>
  </div>
`;


// ==========================================
// ROTEAMENTO (SPA) E NAVEGAÇÃO
// ==========================================

const mainNavItems = document.querySelectorAll('#main-nav .nav-item:not(.has-submenu)');
const views = document.querySelectorAll('.view-container');
const topbarTitle = document.getElementById('topbar-title');

// Sub-navegação interna - REMOVIDO PARA O BENTO GRID

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

// Submenu Toggle Logic
const navTccToggle = document.getElementById('nav-tcc-toggle');
const submenuTcc = document.getElementById('submenu-tcc');
const chevron = navTccToggle.querySelector('.chevron');

navTccToggle.addEventListener('click', () => {
  if (submenuTcc.style.display === 'none') {
    submenuTcc.style.display = 'flex';
    chevron.style.transform = 'rotate(180deg)';
  } else {
    submenuTcc.style.display = 'none';
    chevron.style.transform = 'rotate(0deg)';
  }
});

// Lidar com clique na Sidebar Principal
mainNavItems.forEach(navBtn => {
  navBtn.addEventListener('click', () => {
    // Remove active do submenu-tcc master se clicar em outra coisa fora dele
    if(!navBtn.classList.contains('sub-nav-item')) {
       document.querySelectorAll('.sub-nav-item').forEach(b => b.classList.remove('active'));
    }
    // UI state update
    mainNavItems.forEach(b => b.classList.remove('active'));
    navBtn.classList.add('active');
    
    views.forEach(v => v.classList.remove('active'));
    
    const viewId = navBtn.dataset.view;
    
    if (viewId === 'visao-geral') {
      document.getElementById('view-visao-geral').classList.add('active');
      topbarTitle.textContent = 'Visão Geral';
    } else {
      document.getElementById('view-detalhe').classList.add('active');
      
      // Checar se é centro ou prog
      if (viewId.startsWith('centro-')) {
        const centroId = viewId.split('-')[1]; // ex: CCAS
        renderDetalheView(`Centro: ${centroId}`, (c) => c.centro === centroId);
      } 
      else if (viewId === 'prog-TCC') {
        renderDetalheView('Trabalho de Conclusão de Curso', (c) => 
          c.grad === 'TCC' && c.tccCategory === 'IDs'
        );
      }
      else if (viewId === 'prog-TCC2') {
        renderDetalheView('TCC 2ª Graduação', (c) => 
          c.grad === 'TCC' && c.tccCategory === 'TCCs 2° graduação'
        );
      }
      else if (viewId === 'prog-PESQ') {
        renderDetalheView('Disciplinas de Pesquisa', (c) => 
          c.grad === 'TCC' && c.tccCategory === 'Disciplinas de Pesquisas'
        );
      }
      else if (viewId === 'prog-ESTAGIO') {
        renderDetalheView('Estágios Supervisionados', (c) => 
          c.disciplina.toUpperCase().includes('ESTÁGIO') || 
          c.disciplina.toUpperCase().includes('ESTAGIO') || 
          c.statusMediacao === 'ESTAGIO'
        );
      }
      else if (viewId === 'prog-EXTENSAO') {
        renderDetalheView('Atividades de Extensão', (c) => 
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

// Theme Toggle Logic
const themeBtn = document.getElementById('theme-toggle');
const iconMoon = `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>`;
const iconSun = `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>`;

themeBtn.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  
  // Efeito de fade out nos canvas para não dar tranco na troca de cor
  document.querySelectorAll('canvas').forEach(c => c.style.opacity = '0');
  
  setTimeout(() => {
    if (currentTheme === 'light') {
      document.documentElement.removeAttribute('data-theme');
      themeBtn.innerHTML = iconMoon;
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      themeBtn.innerHTML = iconSun;
    }
    
    // Re-render charts so they pick up new CSS variables
    for (let id in Chart.instances) {
      Chart.instances[id].destroy();
    }
    renderCharts();
    
    // Volta a opacidade
    document.querySelectorAll('canvas').forEach(c => {
      c.style.transition = 'opacity 0.4s ease';
      c.style.opacity = '1';
    });
  }, 150); // delay leve para dar tempo da transição do CSS começar
});

