// Utilitário para pegar a cor real da variável CSS
function getCssColor(varName) {
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim() || '#ffffff';
}

function hexToRgba(hex, alpha) {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.substring(1, 3), 16);
    g = parseInt(hex.substring(3, 5), 16);
    b = parseInt(hex.substring(5, 7), 16);
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const prefersReducedMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

function renderCharts(CENTERS, ENSALAMENTO, COURSES) {
  const colors = {
    accent: getCssColor('--color-accent'),
    green: getCssColor('--color-green'),
    amber: getCssColor('--color-amber'),
    red: getCssColor('--color-red'),
    blue: getCssColor('--color-blue'),
    purple: getCssColor('--color-purple'),
    cyan: getCssColor('--color-cyan'),
    ead: getCssColor('--color-ead'),
    semi: getCssColor('--color-semi'),
    tecs: getCssColor('--color-tecs'),
    text: getCssColor('--color-text'),
    border: getCssColor('--color-border'),
    muted: getCssColor('--color-muted'),
    surface: getCssColor('--color-surface')
  };

  // Animação de entrada suave + leve escalonamento (respeita prefers-reduced-motion)
  const barAnimation = prefersReducedMotion ? false : {
    duration: 800,
    easing: 'easeOutQuart',
    delay: (ctx) => (ctx && ctx.type === 'data' && ctx.mode === 'default') ? ctx.dataIndex * 45 : 0
  };

  const tooltipStyle = {
    backgroundColor: colors.surface,
    titleColor: colors.text,
    bodyColor: colors.muted,
    borderColor: colors.border,
    borderWidth: 1,
    padding: 12,
    cornerRadius: 10,
    displayColors: true,
    usePointStyle: true,
    boxPadding: 6,
    titleFont: { family: 'Outfit', size: 13, weight: '600' },
    bodyFont: { family: 'Outfit', size: 12 }
  };

  // Barras: cantos arredondados + fino separador na cor do card (look "polido")
  const barBase = {
    borderRadius: 6,
    borderSkipped: false,
    borderColor: colors.surface,
    borderWidth: 2
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: barAnimation,
    plugins: {
      legend: { display: false },
      tooltip: tooltipStyle
    },
    scales: {
      x: {
        stacked: true,
        grid: { display: false, drawBorder: false },
        border: { display: false },
        ticks: { color: colors.muted, font: { family: 'Outfit', size: 12, weight: 500 } }
      },
      y: {
        stacked: true,
        grid: { color: colors.border, drawBorder: false },
        border: { display: false, dash: [4, 4] },
        ticks: { color: colors.muted, font: { family: 'Outfit', size: 12 } }
      }
    },
    interaction: { mode: 'index', intersect: false }
  };

  const labels = CENTERS.map(c => c.key);

  // --- Gráfico Mediação --- (Concluído = accent do tema)
  const dsMed = [
    { label: 'Concluído', data: CENTERS.map(c => c.mediacao.ok), backgroundColor: colors.accent, ...barBase, maxBarThickness: 30 },
    { label: 'Pendente', data: CENTERS.map(c => c.mediacao.pendente), backgroundColor: colors.red, ...barBase, maxBarThickness: 30 },
    { label: 'Verificar', data: CENTERS.map(c => c.mediacao.verificar), backgroundColor: colors.amber, ...barBase, maxBarThickness: 30 },
    { label: 'Andamento', data: CENTERS.map(c => c.mediacao.andamento), backgroundColor: colors.blue, ...barBase, maxBarThickness: 30 },
    { label: 'Aguardando', data: CENTERS.map(c => c.mediacao.aguardando), backgroundColor: colors.purple, ...barBase, maxBarThickness: 30 },
    { label: 'Estágio', data: CENTERS.map(c => c.mediacao.estagio), backgroundColor: colors.cyan, ...barBase, maxBarThickness: 30 },
    { label: 'Não Ofertado', data: CENTERS.map(c => c.mediacao.naoOfertado), backgroundColor: colors.muted, ...barBase, maxBarThickness: 30 }
  ];

  new Chart(document.getElementById('chartMediacao'), {
    type: 'bar',
    data: { labels, datasets: dsMed },
    options: commonOptions
  });
  renderLegend('legendMediacao', dsMed);

  // --- Gráfico Conteúdo --- (Concluído = accent do tema)
  const dsCont = [
    { label: 'Concluído', data: CENTERS.map(c => c.conteudo.ok), backgroundColor: colors.accent, ...barBase, maxBarThickness: 34 },
    { label: 'Pendente', data: CENTERS.map(c => c.conteudo.pendente), backgroundColor: colors.red, ...barBase, maxBarThickness: 34 }
  ];

  new Chart(document.getElementById('chartConteudo'), {
    type: 'bar',
    data: { labels, datasets: dsCont },
    options: commonOptions
  });
  renderLegend('legendConteudo', dsCont);

  // --- Gráfico Ensalamento ---
  const ensLabels = ENSALAMENTO.map(e => e.key);
  const dsEns = [
    { label: 'EAD', data: ENSALAMENTO.map(e => e.ead), backgroundColor: colors.ead, ...barBase, maxBarThickness: 38 },
    { label: 'Semipresencial', data: ENSALAMENTO.map(e => e.semi), backgroundColor: colors.semi, ...barBase, maxBarThickness: 38 },
    { label: 'Tecnólogos', data: ENSALAMENTO.map(e => e.tecs), backgroundColor: colors.tecs, ...barBase, maxBarThickness: 38 }
  ];

  const ensOptions = JSON.parse(JSON.stringify(commonOptions));
  // funções não sobrevivem ao clone JSON: restaura animação e tooltip
  ensOptions.animation = barAnimation;
  ensOptions.plugins.tooltip = {
    ...tooltipStyle,
    callbacks: {
      label: function(context) {
        let label = context.dataset.label || '';
        if (label) label += ': ';
        if (context.parsed.y !== null) label += context.parsed.y.toLocaleString('pt-BR');
        return label;
      }
    }
  };

  new Chart(document.getElementById('chartEnsalamento'), {
    type: 'bar',
    data: { labels: ensLabels, datasets: dsEns },
    options: ensOptions
  });
  renderLegend('legendEnsalamento', dsEns);

  // --- Gráfico Perfil (Doughnut) ---
  let vet = 0, ing = 0, out = 0;
  COURSES.forEach(c => {
    const t = (c.turma || '').toUpperCase();
    if (t.includes('VETERANOS')) vet++;
    else if (t.includes('INGRESSANTES')) ing++;
    else out++;
  });

  const ctxPerfil = document.getElementById('chartPerfil');
  if (ctxPerfil) {
    const perfilColors = [colors.accent, colors.blue, colors.border];
    new Chart(ctxPerfil, {
      type: 'doughnut',
      data: {
        labels: ['Veteranos', 'Ingressantes', 'Outros'],
        datasets: [{
          data: [vet, ing, out],
          backgroundColor: perfilColors,
          borderColor: colors.surface,
          borderWidth: 2,
          borderRadius: 6,
          spacing: 2,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        animation: prefersReducedMotion ? false : { animateRotate: true, animateScale: true, duration: 900, easing: 'easeOutQuart' },
        plugins: {
          legend: { display: false },
          tooltip: tooltipStyle
        }
      }
    });

    const legPerfil = document.getElementById('legendPerfil');
    if (legPerfil) {
      legPerfil.innerHTML = `
        <div class="legend-item"><div class="legend-dot" style="background-color: ${perfilColors[0]};"></div>Veteranos (${vet})</div>
        <div class="legend-item"><div class="legend-dot" style="background-color: ${perfilColors[1]};"></div>Ingressantes (${ing})</div>
        <div class="legend-item"><div class="legend-dot" style="background-color: ${perfilColors[2]};"></div>Outros (${out})</div>
      `;
    }
  }
}

function renderLegend(containerId, datasets) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  datasets.forEach(ds => {
    const el = document.createElement('div');
    el.className = 'legend-item';
    el.innerHTML = `<div class="legend-dot" style="background-color: ${ds.backgroundColor};"></div>${ds.label}`;
    container.appendChild(el);
  });
}
