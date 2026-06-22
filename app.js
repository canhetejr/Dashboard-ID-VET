

let CENTERS = [];
let ENSALAMENTO = [];
let COURSES = [];
let PERIODO = '';

function initDashboard(periodName) {
  try {
    const data = DATA_BY_TAB[periodName];
    if (!data) {
      document.getElementById('kpi-total-ids').textContent = "NO DATA";
      return;
    }

    CENTERS = data.CENTERS;
    ENSALAMENTO = data.ENSALAMENTO;
    COURSES = data.COURSES;
    PERIODO = data.PERIODO;

  // Atualizar UI
  const brandTitle = document.querySelector('.brand-title');
  if (brandTitle) brandTitle.textContent = `ID VET ${periodName}`;
  const titleElem = document.getElementById('topbar-title');
  if (titleElem.textContent === 'Visão Geral') {
    // just normal
  }

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
  const contPerc = totalIds > 0 ? ((contOk / totalIds) * 100).toFixed(1) : 0;
  document.getElementById('kpi-cont-perc').textContent = `${contPerc}%`;
  document.getElementById('kpi-cont-sub').textContent = `${contOk} de ${totalIds}`;
  
  const medPerc = totalIds > 0 ? ((medOk / totalIds) * 100).toFixed(1) : 0;
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
  if(progsContainer) {
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
  }

  // Recarregar a view detalhe se estiver ativa
  const activeNavItem = document.querySelector('.nav-item.active');
  if (activeNavItem && activeNavItem.dataset.view !== 'visao-geral') {
    activeNavItem.click(); // forçar re-render da tabela
  }

  // Destruir os gráficos antigos se houver
  for (let id in Chart.instances) {
    Chart.instances[id].destroy();
  }

  renderCharts(CENTERS, ENSALAMENTO, COURSES);
  } catch (err) {
    document.getElementById('kpi-total-ids').innerHTML = `<span style="font-size:12px;color:red">${err.message}</span>`;
    console.error(err);
  }
}

// Inicialização do seletor de período (controle segmentado)
try {
  const tabSelector = document.getElementById('tab-selector');
  const tabNames = Object.keys(DATA_BY_TAB || {});

  if (tabNames.length > 0) {
    // "26.1" -> "2026.1" para exibição (mantém o valor original como chave)
    const formatPeriodo = (tab) => /^\d{2}\.\d+$/.test(tab) ? `20${tab}` : tab;

    const buttons = tabNames.map(tab => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'period-pill';
      btn.dataset.value = tab;
      btn.setAttribute('role', 'tab');
      btn.textContent = formatPeriodo(tab);
      tabSelector.appendChild(btn);
      return btn;
    });

    const selectTab = (tab) => {
      buttons.forEach(b => {
        const active = b.dataset.value === tab;
        b.classList.toggle('active', active);
        b.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      initDashboard(tab);
    };

    tabSelector.addEventListener('click', (e) => {
      const btn = e.target.closest('.period-pill');
      if (btn) selectTab(btn.dataset.value);
    });

    // Carrega a última aba por padrão (geralmente a mais recente)
    selectTab(tabNames[tabNames.length - 1]);
  } else {
    document.getElementById('kpi-total-ids').innerHTML = `<span style="font-size:12px;color:orange">DATA_BY_TAB vazio ou undefined</span>`;
  }
} catch (e) {
  document.getElementById('kpi-total-ids').innerHTML = `<span style="font-size:12px;color:red">${e.message}</span>`;
}

// ==========================================
// ROTEAMENTO (SPA) E NAVEGAÇÃO
// ==========================================

const mainNavItems = document.querySelectorAll('#main-nav .nav-item');
const views = document.querySelectorAll('.view-container');
const topbarTitle = document.getElementById('topbar-title');

function renderDetalheView(title, filterFn) {
  const filtered = COURSES.filter(filterFn);
  
  topbarTitle.textContent = title;
  
  let total = filtered.length;
  let cOk = 0;
  let mOk = 0;
  let mPendente = 0;
  
  const tbody = document.querySelector('#tableDetalhe tbody');
  if(!tbody) return;
  tbody.innerHTML = '';
  
  filtered.forEach(c => {
    if (c.statusConteudo === 'CONCLUIDO') cOk++;
    if (c.statusMediacao === 'CONCLUIDO') mOk++;
    if (['PENDENTE','VERIFICAR','ANDAMENTO','AGUARDANDO'].includes(c.statusMediacao)) mPendente++;

    const cColor = c.statusConteudo === 'CONCLUIDO' ? 'var(--color-green)' : (c.statusConteudo === 'PENDENTE' ? 'var(--color-amber)' : 'var(--color-muted)');
    const mColor = c.statusMediacao === 'CONCLUIDO' ? 'var(--color-green)' : (['PENDENTE','VERIFICAR','ANDAMENTO','AGUARDANDO'].includes(c.statusMediacao) ? 'var(--color-red)' : 'var(--color-muted)');

    const linkHtml = c.link ? '<a href="' + c.link + '" target="_blank" style="color:var(--color-blue); text-decoration:none;">Acessar</a>' : '-';
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td data-label="ID Moodle">${c.id}</td>
      <td data-label="Componente" title="${c.nomeBreve}"><strong>${c.disciplina}</strong><br><small style="color:var(--color-muted)">${c.grad} - ${c.turma}</small></td>
      <td data-label="Centro">${c.centro}</td>
      <td data-label="Conteúdo"><span style="color: ${cColor}; font-weight:600;">${c.statusConteudo || '-'}</span></td>
      <td data-label="Mediação"><span style="color: ${mColor}; font-weight:600;">${c.statusMediacao || '-'}</span></td>
      <td data-label="Ações">${linkHtml}</td>
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

  // Agregação de Mediadores por Disciplina (mesmo filtro da relação)
  renderMediadoresTable(filtered);
}

// Agrega as disciplinas filtradas por mediador, com a quebra de status de mediação
function renderMediadoresTable(list) {
  const tbody = document.querySelector('#tableMediadores tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  const map = {};
  list.forEach(c => {
    const nome = (c.mediador || '').replace(/\s*\|\s*Unicive\s*$/i, '').trim() || '— Sem mediador';
    if (!map[nome]) map[nome] = { total: 0, concluido: 0, andamento: 0, aguardando: 0, verificar: 0, pendente: 0 };
    const m = map[nome];
    m.total++;
    switch (c.statusMediacao) {
      case 'CONCLUIDO': m.concluido++; break;
      case 'ANDAMENTO': m.andamento++; break;
      case 'AGUARDANDO': m.aguardando++; break;
      case 'VERIFICAR': m.verificar++; break;
      case 'ESTAGIO': case 'NAO_OFERTADO': break; // estados neutros: não contam como pendência
      default: m.pendente++; // PENDENTE e demais
    }
  });

  const arr = Object.keys(map).map(nome => ({ nome, ...map[nome] }));
  arr.sort((a, b) => b.total - a.total || a.nome.localeCompare(b.nome));

  if (arr.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:var(--color-muted)">Sem dados de mediadores.</td></tr>';
    return;
  }

  const cell = (val, color) => val > 0
    ? `<span style="color:${color};font-weight:600">${val}</span>`
    : `<span style="color:var(--color-hint)">0</span>`;

  arr.forEach(m => {
    const perc = m.total > 0 ? Math.round((m.concluido / m.total) * 100) : 0;
    const percColor = perc >= 80 ? 'var(--color-green)' : (perc >= 50 ? 'var(--color-amber)' : 'var(--color-red)');
    const semMediador = m.nome.charAt(0) === '—';
    const nomeHtml = semMediador
      ? `<span style="color:var(--color-muted)">${m.nome}</span>`
      : `<strong>${m.nome}</strong>`;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td data-label="Mediador">${nomeHtml}</td>
      <td data-label="Disciplinas"><strong>${m.total}</strong></td>
      <td data-label="Concluído">${cell(m.concluido, 'var(--color-green)')}</td>
      <td data-label="Andamento">${cell(m.andamento, 'var(--color-blue)')}</td>
      <td data-label="Aguardando">${cell(m.aguardando, 'var(--color-purple)')}</td>
      <td data-label="Verificar">${cell(m.verificar, 'var(--color-amber)')}</td>
      <td data-label="Pendente">${cell(m.pendente, 'var(--color-red)')}</td>
      <td data-label="% Conclusão">
        <div style="display:flex;align-items:center;gap:8px;min-width:90px">
          <div style="flex:1;height:6px;border-radius:999px;background:var(--color-border);overflow:hidden">
            <div style="width:${perc}%;height:100%;background:${percColor}"></div>
          </div>
          <span style="color:${percColor};font-weight:600;font-size:12px">${perc}%</span>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
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
      topbarTitle.textContent = 'ID VET';
    } else {
      // Detalhe por centro (ex: centro-CCAS)
      document.getElementById('view-detalhe').classList.add('active');
      const centroId = viewId.split('-')[1];
      renderDetalheView(`Centro: ${centroId}`, (c) => c.centro === centroId);
    }
  });
});

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
  
  document.querySelectorAll('canvas').forEach(c => c.style.opacity = '0');
  
  setTimeout(() => {
    if (currentTheme === 'light') {
      document.documentElement.removeAttribute('data-theme');
      themeBtn.innerHTML = iconMoon;
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      themeBtn.innerHTML = iconSun;
    }
    
    for (let id in Chart.instances) {
      Chart.instances[id].destroy();
    }
    renderCharts(CENTERS, ENSALAMENTO, COURSES);
    
    document.querySelectorAll('canvas').forEach(c => {
      c.style.transition = 'opacity 0.4s ease';
      c.style.opacity = '1';
    });
  }, 150);
});
