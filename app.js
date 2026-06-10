import { CENTERS, ENSALAMENTO, PERIODO } from './data.js';
import { renderCharts } from './charts.js';

// Setup abas
const tabs = [
  { btn: document.getElementById('btn-med'), pane: document.getElementById('pane-med') },
  { btn: document.getElementById('btn-cont'), pane: document.getElementById('pane-cont') },
  { btn: document.getElementById('btn-ens'), pane: document.getElementById('pane-ens') }
];

tabs.forEach(tab => {
  tab.btn.addEventListener('click', () => {
    // Remove actives
    tabs.forEach(t => {
      t.btn.classList.remove('active');
      t.pane.classList.remove('active');
    });
    // Set active
    tab.btn.classList.add('active');
    tab.pane.classList.add('active');
  });
});

// Setup header e KPIs globais
document.getElementById('lbl-periodo').textContent = PERIODO;
document.getElementById('lbl-meta').innerHTML = `Atualizado automaticamente`;

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
  // Para mediação pendente geral (critical): Pendente + Verificar + Andamento + Aguardando
  medPendente += (c.mediacao.pendente + c.mediacao.verificar + c.mediacao.andamento + c.mediacao.aguardando);
});

// Preencher KPI Cards
document.getElementById('kpi-total-ids').textContent = totalIds.toLocaleString('pt-BR');

const contPerc = ((contOk / totalIds) * 100).toFixed(1);
document.getElementById('kpi-cont-perc').textContent = `${contPerc}%`;
document.getElementById('kpi-cont-sub').textContent = `${contOk} de ${totalIds}`;

const medPerc = ((medOk / totalIds) * 100).toFixed(1);
document.getElementById('kpi-med-perc').textContent = `${medPerc}%`;
document.getElementById('kpi-med-sub').textContent = `${medOk} de ${totalIds}`;

document.getElementById('kpi-med-pend').textContent = medPendente;

// Renderizar tabelas
const tbodyMed = document.querySelector('#tableMediacao tbody');
const tbodyCont = document.querySelector('#tableConteudo tbody');

CENTERS.forEach(c => {
  // Tabela Mediação
  const perc = Math.round((c.mediacao.ok / c.total) * 100);
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

  // Tabela Conteúdo
  const trCont = document.createElement('tr');
  const pend = c.conteudo.pendente;
  const pendHTML = pend === 0 
    ? `<span style="color: var(--color-green);">—</span>`
    : `<span style="color: var(--color-amber);">${pend}</span>`;
    
  trCont.innerHTML = `
    <td>${c.key}</td>
    <td>${c.total}</td>
    <td>${pendHTML}</td>
  `;
  tbodyCont.appendChild(trCont);
});

// Sub-cards Ensalamento
let sumEad = 0, sumSemi = 0, sumTecs = 0, sumTotal = 0;
ENSALAMENTO.forEach(e => {
  sumEad += e.ead;
  sumSemi += e.semi;
  sumTecs += e.tecs;
  sumTotal += (e.ead + e.semi + e.tecs);
});

document.getElementById('sub-ead').textContent = sumEad.toLocaleString('pt-BR');
document.getElementById('sub-semi').textContent = sumSemi.toLocaleString('pt-BR');
document.getElementById('sub-tecs').textContent = sumTecs.toLocaleString('pt-BR');
document.getElementById('sub-total').textContent = sumTotal.toLocaleString('pt-BR');

// Trigger inicial para os gráficos
renderCharts();

// Animar progress bars da tabela após o carregamento
setTimeout(() => {
  document.querySelectorAll('.progress-bar-fill').forEach(bar => {
    bar.style.width = bar.getAttribute('data-width');
  });
}, 100);
