// Utilitário para pegar a cor real da variável CSS
function getCssColor(varName) {
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim() || '#ffffff';
}

function hexToRgba(hex, alpha) {
  // Conversão simples se for hex
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

function renderCharts(CENTERS, ENSALAMENTO, COURSES) {
  const colors = {
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

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: colors.surface,
        titleColor: colors.text,
        bodyColor: colors.muted,
        borderColor: colors.border,
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        boxPadding: 6
      }
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
    interaction: {
      mode: 'index',
      intersect: false
    }
  };

  const labels = CENTERS.map(c => c.key);
  const borderRadius = { topLeft: 4, topRight: 4, bottomLeft: 4, bottomRight: 4 };

  // --- Gráfico Mediação ---
  const dsMed = [
    { label: 'Concluído', data: CENTERS.map(c => c.mediacao.ok), backgroundColor: colors.green, borderRadius, barThickness: 28 },
    { label: 'Pendente', data: CENTERS.map(c => c.mediacao.pendente), backgroundColor: colors.muted, borderRadius, barThickness: 28 },
    { label: 'Verificar', data: CENTERS.map(c => c.mediacao.verificar), backgroundColor: colors.amber, borderRadius, barThickness: 28 },
    { label: 'Andamento', data: CENTERS.map(c => c.mediacao.andamento), backgroundColor: colors.blue, borderRadius, barThickness: 28 },
    { label: 'Aguardando', data: CENTERS.map(c => c.mediacao.aguardando), backgroundColor: colors.purple, borderRadius, barThickness: 28 },
    { label: 'Estágio', data: CENTERS.map(c => c.mediacao.estagio), backgroundColor: colors.cyan, borderRadius, barThickness: 28 },
    { label: 'Não Ofertado', data: CENTERS.map(c => c.mediacao.naoOfertado), backgroundColor: colors.red, borderRadius, barThickness: 28 }
  ];
  
  new Chart(document.getElementById('chartMediacao'), {
    type: 'bar',
    data: { labels, datasets: dsMed },
    options: commonOptions
  });

  renderLegend('legendMediacao', dsMed);

  // --- Gráfico Conteúdo ---
  const dsCont = [
    { label: 'Concluído', data: CENTERS.map(c => c.conteudo.ok), backgroundColor: colors.green, borderRadius, barThickness: 32 },
    { label: 'Pendente', data: CENTERS.map(c => c.conteudo.pendente), backgroundColor: colors.amber, borderRadius, barThickness: 32 }
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
    { label: 'EAD', data: ENSALAMENTO.map(e => e.ead), backgroundColor: colors.ead, borderRadius, barThickness: 36 },
    { label: 'Semipresencial', data: ENSALAMENTO.map(e => e.semi), backgroundColor: colors.semi, borderRadius, barThickness: 36 },
    { label: 'Tecnólogos', data: ENSALAMENTO.map(e => e.tecs), backgroundColor: colors.tecs, borderRadius, barThickness: 36 }
  ];

  const ensOptions = JSON.parse(JSON.stringify(commonOptions));
  ensOptions.plugins.tooltip.callbacks = {
    label: function(context) {
      let label = context.dataset.label || '';
      if (label) label += ': ';
      if (context.parsed.y !== null) label += context.parsed.y.toLocaleString('pt-BR');
      return label;
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
    new Chart(ctxPerfil, {
      type: 'doughnut',
      data: {
        labels: ['Veteranos', 'Ingressantes', 'Outros'],
        datasets: [{
          data: [vet, ing, out],
          backgroundColor: [colors.blue, colors.green, colors.border],
          borderWidth: 0,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: colors.surface,
            titleColor: colors.text,
            bodyColor: colors.text,
            borderColor: colors.border,
            borderWidth: 1
          }
        }
      }
    });

    const legPerfil = document.getElementById('legendPerfil');
    if (legPerfil) {
      legPerfil.innerHTML = `
        <div class="legend-item"><div class="legend-dot" style="background-color: ${colors.blue};"></div>Veteranos (${vet})</div>
        <div class="legend-item"><div class="legend-dot" style="background-color: ${colors.green};"></div>Ingressantes (${ing})</div>
        <div class="legend-item"><div class="legend-dot" style="background-color: ${colors.border};"></div>Outros (${out})</div>
      `;
    }
  }
}

function renderLegend(containerId, datasets) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  datasets.forEach(ds => {
    // Só renderiza se a soma for maior que zero pra não poluir atoa (opcional, aqui renderiza todos)
    const el = document.createElement('div');
    el.className = 'legend-item';
    el.innerHTML = `<div class="legend-dot" style="background-color: ${ds.backgroundColor};"></div>${ds.label}`;
    container.appendChild(el);
  });
}

// We need to inject the chartPerfil logic inside renderCharts. I will use a script to rewrite it cleanly.

