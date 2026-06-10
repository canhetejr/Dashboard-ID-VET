function getColor(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function initCharts() {
  Chart.defaults.font.family = "'Inter', sans-serif";
  Chart.defaults.color = getColor('--color-muted');

  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false }
      },
      y: {
        grid: { color: getColor('--color-border') },
        border: { display: false }
      }
    }
  };

  // 1. Distribuição de Respostas (Horizontal Bar Stacked)
  const ctxDist = document.getElementById('chartDistribuicao');
  if (ctxDist && window.DISTRIBUICAO) {
    new Chart(ctxDist, {
      type: 'bar',
      data: {
        labels: [window.DISTRIBUICAO[0].label],
        datasets: [
          { label: 'Discordo Totalmente', data: [window.DISTRIBUICAO[0].data[0]], backgroundColor: getColor('--likert-1') },
          { label: 'Discordo Parcialmente', data: [window.DISTRIBUICAO[0].data[1]], backgroundColor: getColor('--likert-2') },
          { label: 'Indiferente', data: [window.DISTRIBUICAO[0].data[2]], backgroundColor: getColor('--likert-3') },
          { label: 'Concordo Parcialmente', data: [window.DISTRIBUICAO[0].data[3]], backgroundColor: getColor('--likert-4') },
          { label: 'Concordo Totalmente', data: [window.DISTRIBUICAO[0].data[4]], backgroundColor: getColor('--likert-5') }
        ]
      },
      options: {
        ...defaultOptions,
        indexAxis: 'y',
        scales: {
          x: { stacked: true, display: false },
          y: { stacked: true, display: true, grid: { display: false } }
        }
      }
    });
  }

  // 2. Média por Pergunta
  const ctxPerguntas = document.getElementById('chartPerguntas');
  if (ctxPerguntas && window.PERGUNTAS) {
    const opt = JSON.parse(JSON.stringify(defaultOptions));
    opt.scales.y.min = 1;
    opt.scales.y.max = 5;
    
    new Chart(ctxPerguntas, {
      type: 'bar',
      data: {
        labels: window.PERGUNTAS.labels,
        datasets: [{
          data: window.PERGUNTAS.data,
          backgroundColor: getColor('--color-primary'),
          barThickness: 40,
          borderRadius: 4
        }]
      },
      options: opt
    });
  }

  // 3. Média Likert por Centro
  const ctxMediaCentro = document.getElementById('chartMediaCentro');
  if (ctxMediaCentro && window.MEDIA_CENTRO) {
    const opt = JSON.parse(JSON.stringify(defaultOptions));
    opt.scales.y.min = 2;
    opt.scales.y.max = 5;

    new Chart(ctxMediaCentro, {
      type: 'bar',
      data: {
        labels: window.MEDIA_CENTRO.labels,
        datasets: [{
          data: window.MEDIA_CENTRO.data,
          backgroundColor: getColor('--color-primary'),
          barThickness: 32,
          borderRadius: 4
        }]
      },
      options: opt
    });
  }

  // 4. Favorabilidade por Centro
  const ctxFavoravel = document.getElementById('chartFavorabilidade');
  if (ctxFavoravel && window.FAVORAVEL_CENTRO) {
    const opt = JSON.parse(JSON.stringify(defaultOptions));
    opt.scales.y.min = 50;
    opt.scales.y.max = 100;
    opt.scales.y.ticks = {
      callback: function(value) { return value + '%'; }
    };

    new Chart(ctxFavoravel, {
      type: 'bar',
      data: {
        labels: window.FAVORAVEL_CENTRO.labels,
        datasets: [{
          data: window.FAVORAVEL_CENTRO.data,
          backgroundColor: getColor('--color-primary'),
          barThickness: 32,
          borderRadius: 4
        }]
      },
      options: opt
    });
  }
}

document.addEventListener('DOMContentLoaded', initCharts);
