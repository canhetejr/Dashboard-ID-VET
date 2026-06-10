# WORKFLOW — Construção do Dashboard

Guia de execução passo a passo para o Antigravity (`agy`) construir o dashboard.
Execute cada etapa em ordem. Não pule etapas.

---

## Pré-execução

```bash
# Criar pasta do projeto
mkdir dashboard-qualidade-ead && cd dashboard-qualidade-ead
git init
git remote add origin https://github.com/canhetejr/<nome-do-repo>.git

# Copiar os arquivos de contexto
cp /caminho/AGENTS.md ./AGENTS.md
cp /caminho/SPEC.md ./SPEC.md

# Abrir o Antigravity na pasta
agy
```

---

## Etapa 1 — Estrutura de arquivos

**Prompt para agy:**
```
Crie a estrutura de arquivos do projeto conforme o AGENTS.md:
- index.html (esqueleto HTML5 com meta viewport, charset UTF-8, link para style.css)
- data.js (dados vazios, só a estrutura dos exports)
- charts.js (arquivo vazio com comentário de placeholder)
- app.js (arquivo vazio com comentário de placeholder)
- style.css (apenas as custom properties do AGENTS.md no :root)
- README.md (instruções básicas de deploy para GitHub Pages)

Não implemente nenhuma lógica ainda. Só a estrutura.
```

**Critério de aceite:** `ls` mostra os 6 arquivos. `index.html` abre no browser sem erros de console.

---

## Etapa 2 — Dados (`data.js`)

**Prompt para agy:**
```
Preencha o data.js com todos os dados da seção "1. Dados dos Centros" do SPEC.md.
Use o formato de export definido na seção "11. data.js — Estrutura esperada".
Inclua também a constante PERIODO = '2025.1'.
Ao final, adicione window.CENTERS e window.ENSALAMENTO para compatibilidade
sem módulos ES.
```

**Critério de aceite:** abrir `data.js` no browser console, `window.CENTERS.length` retorna 6.

---

## Etapa 3 — CSS completo (`style.css`)

**Prompt para agy:**
```
Implemente o style.css completo baseado no AGENTS.md e SPEC.md:

1. Custom properties já existem no :root — não altere as que já estão lá
2. Reset básico: box-sizing border-box, margin 0, padding 0
3. Estilos de: body, .header, .kpi-grid, .kpi-card, .tab-nav, .tab-btn,
   .tab-btn.active, .tab-pane, .tab-pane.active, .two-col, .card,
   .legend, .legend-item, .legend-dot, .table-summary, .progress-bar-wrap
4. Layout .two-col: grid 3fr 2fr com gap 12px
5. Responsividade conforme seção "8. Responsividade" do SPEC.md
6. Sem frameworks CSS — apenas custom properties e seletores nativos
```

**Critério de aceite:** abrir `index.html` — estrutura vazia mas com fundo escuro correto.

---

## Etapa 4 — HTML (`index.html`)

**Prompt para agy:**
```
Construa o HTML completo do index.html conforme o SPEC.md:

1. Header (seção 9 do SPEC.md)
2. KPI Cards (seção 2) — valores hardcoded por enquanto
3. Navegação por abas (seção 3) — só HTML, sem JS ainda
4. Conteúdo das 3 abas:
   - Aba Mediação: div.two-col com div.card para gráfico + div.card para tabela
   - Aba Conteúdo: mesma estrutura
   - Aba Ensalamento: div.card full-width com sub-cards de totais
5. Cada canvas de gráfico com id único: chartMediacao, chartConteudo, chartEnsalamento
6. Scripts no final do body: data.js, Chart.js (CDN), charts.js, app.js

Não implemente JS ainda. Só HTML estático.
```

**Critério de aceite:** `index.html` renderiza layout completo, tabs visíveis, sem erros de console.

---

## Etapa 5 — Gráficos (`charts.js`)

**Prompt para agy:**
```
Implemente o charts.js com os 3 gráficos Chart.js conforme o SPEC.md:

1. Função initCharts() que instancia os 3 charts
2. Usar defaultOptions da seção "7. Comportamento dos Gráficos" do SPEC.md
3. Gráfico chartMediacao: barras empilhadas, 6 datasets, dados de window.CENTERS
4. Gráfico chartConteudo: barras empilhadas, 2 datasets (Concluído/Pendente)
5. Gráfico chartEnsalamento: barras empilhadas, 3 datasets (EAD/Semi/Tecs), dados de window.ENSALAMENTO
6. Tooltip do ensalamento: formatar com toLocaleString('pt-BR')
7. Chamar initCharts() no final do arquivo

Regra: legend nativa do Chart.js sempre display:false — legenda fica no HTML.
```

**Critério de aceite:** os 3 gráficos aparecem com dados corretos. Console sem erros.

---

## Etapa 6 — Interatividade (`app.js`)

**Prompt para agy:**
```
Implemente o app.js com toda a lógica de UI:

1. Função switchTab(tabId) que:
   - Remove .active de todos os .tab-btn e .tab-pane
   - Adiciona .active no btn e pane correspondentes
   - Chama window.dispatchEvent(new Event('resize')) para rerender os charts

2. Preencher a tabela de mediação (#tableMediacao) dinamicamente com window.CENTERS:
   - Coluna Centro: chave do centro
   - Coluna IDs: total
   - Coluna % Mediação: mini barra de progresso com cor dinâmica conforme SPEC.md seção 4.3

3. Preencher a tabela de conteúdo (#tableConteudo) dinamicamente:
   - Coluna Centro, Total, Pendente (conforme seção 5.3 do SPEC.md)

4. Adicionar onclick="switchTab('med'|'cont'|'ens')" nos botões de aba
   (ou via addEventListener — preferir addEventListener)

5. Aba 'med' ativa por padrão no DOMContentLoaded
```

**Critério de aceite:** clicar nas abas troca o conteúdo, tabelas mostram dados, barras de progresso funcionam.

---

## Etapa 7 — Legendas customizadas HTML

**Prompt para agy:**
```
Adicione as legendas customizadas (HTML, não nativas do Chart.js) em cada aba:

Aba Mediação (acima do canvas):
  Concluído · Pendente · Verificar · Andamento · Aguardando · Estágio
  (quadradinhos 10x10 com border-radius 2px, cores conforme AGENTS.md)

Aba Conteúdo:
  Concluído · Pendente

Aba Ensalamento:
  EAD — 3.096 · Semipresencial — 729 · Tecnólogos — 3.617

As legendas ficam dentro de .legend com .legend-item e .legend-dot (conforme style.css).
```

**Critério de aceite:** legendas visíveis e corretas nas 3 abas.

---

## Etapa 8 — Review e polish

**Prompt para agy:**
```
Faça uma revisão completa do dashboard:

1. Abrir index.html e verificar visualmente as 3 abas
2. Conferir se os totais das KPI cards batem com SPEC.md seção 2
3. Conferir se as cores dos status seguem exatamente a tabela do AGENTS.md
4. Verificar responsividade em 768px (dois colunas viram stacked)
5. Console do browser deve ter zero erros e zero warnings

Se encontrar algum problema, corrigir antes de continuar.
```

---

## Etapa 9 — Deploy no GitHub Pages

**Prompt para agy:**
```
Prepare o deploy para GitHub Pages usando a Opção B (pasta /docs) do SPEC.md seção 10:

1. Criar pasta docs/
2. Copiar index.html, data.js, charts.js, app.js, style.css para docs/
3. Criar .gitignore com: .DS_Store, *.log, node_modules/
4. Fazer o commit inicial:
   git add .
   git commit -m "feat: dashboard qualidade ead v1.0"
5. Push para origin main

Após o push, lembrar de ativar o GitHub Pages em:
Settings → Pages → Branch: main / /docs
```

**Critério de aceite:** URL `https://canhetejr.github.io/<repo>/` carrega o dashboard.

---

## Checklist final

- [ ] KPI cards com valores corretos
- [ ] 3 abas funcionando (Mediação, Conteúdo, Ensalamento)
- [ ] Gráfico de mediação: 6 datasets empilhados, cores corretas
- [ ] Tabela de mediação: barras de progresso com cores dinâmicas
- [ ] Gráfico de conteúdo: 2 datasets
- [ ] Tabela de conteúdo: pendente destacado em amber
- [ ] Sub-cards de totais na aba Ensalamento
- [ ] Gráfico de ensalamento: 3 datasets, todos 7 centros
- [ ] Responsivo em 768px
- [ ] Zero erros de console
- [ ] Deploy no GitHub Pages funcionando

---

## Observações para o Antigravity

- Se um gráfico não renderizar, verificar se o `<canvas>` existe no DOM antes de `initCharts()` ser chamado.
- Se a troca de aba não atualizar o gráfico, o `dispatchEvent(resize)` resolve na maioria dos casos.
- Toda alteração de cor deve ir em `style.css` via custom properties — nunca inline no JS.
- Em caso de dúvida sobre um valor numérico, a fonte da verdade é `SPEC.md`.
