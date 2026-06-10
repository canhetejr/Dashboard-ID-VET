function switchTab(tabId) {
  // Remove .active de todos
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
  
  // Adiciona .active no btn e pane alvo
  const targetBtn = document.getElementById(`btn-${tabId}`);
  const targetPane = document.getElementById(`pane-${tabId}`);
  
  if (targetBtn && targetPane) {
    targetBtn.classList.add('active');
    targetPane.classList.add('active');
  }
  
  // Rerender nos charts
  window.dispatchEvent(new Event('resize'));
}

function renderTables() {
  const centers = window.CENTERS || [];
  
  const tbodyMed = document.querySelector('#tableMediacao tbody');
  const tbodyCont = document.querySelector('#tableConteudo tbody');
  
  if (tbodyMed && tbodyCont) {
    let htmlMed = '';
    let htmlCont = '';
    
    centers.forEach(c => {
      // Cálculo para Mediação
      const calcMed = c.total > 0 ? ((c.mediacao.ok / c.total) * 100).toFixed(1) : 0;
      let colorMed = 'var(--color-red)';
      if (calcMed >= 85) {
        colorMed = 'var(--color-green)';
      } else if (calcMed >= 60) {
        colorMed = 'var(--color-amber)';
      }
      
      htmlMed += `
        <tr>
          <td>${c.key}</td>
          <td>${c.total}</td>
          <td>
            <div class="progress-bar-wrap">
              <div class="progress-bar-bg">
                <div class="progress-bar-fill" style="width: ${calcMed}%; background-color: ${colorMed};"></div>
              </div>
              <div class="progress-text" style="color: ${colorMed};">${calcMed}%</div>
            </div>
          </td>
        </tr>
      `;
      
      // Cálculo para Conteúdo
      let pendenteHtml = '';
      if (c.conteudo.pendente === 0) {
        pendenteHtml = `<span style="color: var(--color-green); font-weight: 600;">—</span>`;
      } else {
        pendenteHtml = `<span style="color: var(--color-amber); font-weight: 600;">${c.conteudo.pendente}</span>`;
      }
      
      htmlCont += `
        <tr>
          <td>${c.key}</td>
          <td>${c.total}</td>
          <td>${pendenteHtml}</td>
        </tr>
      `;
    });
    
    tbodyMed.innerHTML = htmlMed;
    tbodyCont.innerHTML = htmlCont;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderTables();
  
  const btnMed = document.getElementById('btn-med');
  const btnCont = document.getElementById('btn-cont');
  const btnEns = document.getElementById('btn-ens');
  
  if (btnMed) btnMed.addEventListener('click', () => switchTab('med'));
  if (btnCont) btnCont.addEventListener('click', () => switchTab('cont'));
  if (btnEns) btnEns.addEventListener('click', () => switchTab('ens'));
  
  // Aba 'med' ativa por padrão
  switchTab('med');
});
