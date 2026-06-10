function initApp() {
  const data = window.KPI_DATA;
  if (!data) return;

  const mapping = {
    'kpi-respostas': data.respostas,
    'kpi-disciplinas': data.disciplinas,
    'kpi-centros': data.centros,
    'kpi-media': data.media,
    'kpi-favoravel': data.favoravel,
    'kpi-neutro': data.neutro,
    'kpi-desfavoravel': data.desfavoravel
  };

  for (const [id, value] of Object.entries(mapping)) {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = value;
    }
  }
}

document.addEventListener('DOMContentLoaded', initApp);
