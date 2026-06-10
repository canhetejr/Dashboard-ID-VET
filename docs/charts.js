function getColor(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false }
  },
  scales: {
    x: {
      stacked: true,
      grid: { display: false },
      border: { display: false },
      ticks: { color: '#64748b', font: { size: 11 } }
    },
    y: {
      stacked: true,
      grid: { color: 'rgba(255,255,255,0.06)' },
      border: { display: false },
      ticks: { color: '#64748b', font: { size: 10 } }
    }
  }
};

function initCharts() {
  const centers = window.CENTERS || [];
  const ensalamento = window.ENSALAMENTO || [];
  
  const centerLabels = centers.map(c => c.key);
  
  // 1. Gráfico Mediação
  const ctxMediacao = document.getElementById('chartMediacao');
  if (ctxMediacao) {
    new Chart(ctxMediacao, {
      type: 'bar',
      data: {
        labels: centerLabels,
        datasets: [
          {
            label: 'Concluído',
            data: centers.map(c => c.mediacao.ok),
            backgroundColor: getColor('--color-green'),
            barThickness: 32
          },
          {
            label: 'Pendente',
            data: centers.map(c => c.mediacao.pendente),
            backgroundColor: '#94a3b8', // hardcode conforme AGENTS.md
            barThickness: 32
          },
          {
            label: 'Verificar',
            data: centers.map(c => c.mediacao.verificar),
            backgroundColor: getColor('--color-amber'),
            barThickness: 32
          },
          {
            label: 'Andamento',
            data: centers.map(c => c.mediacao.andamento),
            backgroundColor: getColor('--color-blue'),
            barThickness: 32
          },
          {
            label: 'Aguardando',
            data: centers.map(c => c.mediacao.aguardando),
            backgroundColor: getColor('--color-purple'),
            barThickness: 32
          },
          {
            label: 'Estágio',
            data: centers.map(c => c.mediacao.estagio),
            backgroundColor: getColor('--color-cyan'),
            barThickness: 32
          }
        ]
      },
      options: defaultOptions
    });
  }

  // 2. Gráfico Conteúdo
  const ctxConteudo = document.getElementById('chartConteudo');
  if (ctxConteudo) {
    new Chart(ctxConteudo, {
      type: 'bar',
      data: {
        labels: centerLabels,
        datasets: [
          {
            label: 'Concluído',
            data: centers.map(c => c.conteudo.ok),
            backgroundColor: getColor('--color-green'),
            barThickness: 32
          },
          {
            label: 'Pendente',
            data: centers.map(c => c.conteudo.pendente),
            backgroundColor: getColor('--color-amber'), // Conforme SPEC.md 5.2
            barThickness: 32
          }
        ]
      },
      options: defaultOptions
    });
  }

  // 3. Gráfico Ensalamento
  const ctxEnsalamento = document.getElementById('chartEnsalamento');
  if (ctxEnsalamento) {
    const ensalamentoLabels = ensalamento.map(e => e.key);
    
    // Config específica para tooltip toLocaleString('pt-BR')
    const ensOptions = JSON.parse(JSON.stringify(defaultOptions));
    ensOptions.plugins.tooltip = {
      callbacks: {
        label: function(context) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed.y !== null) {
            label += context.parsed.y.toLocaleString('pt-BR');
          }
          return label;
        }
      }
    };

    new Chart(ctxEnsalamento, {
      type: 'bar',
      data: {
        labels: ensalamentoLabels,
        datasets: [
          {
            label: 'EAD',
            data: ensalamento.map(e => e.ead),
            backgroundColor: getColor('--color-ead'),
            barThickness: 32
          },
          {
            label: 'Semipresencial',
            data: ensalamento.map(e => e.semi),
            backgroundColor: getColor('--color-semi'),
            barThickness: 32
          },
          {
            label: 'Tecnólogos',
            data: ensalamento.map(e => e.tecs),
            backgroundColor: getColor('--color-tecs'),
            barThickness: 32
          }
        ]
      },
      options: ensOptions
    });
  }
}

document.addEventListener('DOMContentLoaded', initCharts);
