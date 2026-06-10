# SPEC — Dashboard Qualidade EAD

## 1. Dados dos Centros

### 1.1 Status de Conteúdo por Centro
| Centro | Total IDs | Concluído | Pendente |
|--------|-----------|-----------|---------|
| CCS    | 297       | 295       | 2       |
| CCSA   | 222       | 216       | 6       |
| CEHLA  | 661       | 646       | 15      |
| CES    | 186       | 186       | 0       |
| CGJS   | 178       | 169       | 9       |
| CTIC   | 278       | 276       | 2       |
| **Total** | **1.822** | **1.788** | **34** |

> CCAS (137 IDs) não possui planilha de detalhe — exibir apenas total nas KPI cards e no gráfico de ensalamento.

### 1.2 Status de Mediação por Centro
| Centro | Total | Concluído | Pendente | Verificar | Andamento | Aguardando | Estágio | Não Ofertado |
|--------|-------|-----------|---------|-----------|-----------|-----------|---------|-------------|
| CCS    | 297   | 280       | 0       | 15        | 0         | 1         | 0       | 1           |
| CCSA   | 222   | 133       | 81      | 6         | 1         | 0         | 1       | 0           |
| CEHLA  | 661   | 307       | 331     | 19        | 4         | 0         | 0       | 0           |
| CES    | 186   | 90        | 62      | 2         | 29        | 3         | 0       | 0           |
| CGJS   | 178   | 99        | 59      | 7         | 11        | 2         | 0       | 0           |
| CTIC   | 278   | 162       | 115     | 0         | 1         | 0         | 0       | 0           |

**Totais calculados:**
- Mediação concluída: 1.071 / 1.822 = **58,8%**
- Mediação pendente (critical): **648**

### 1.3 Ensalamento por Modalidade
| Centro | EAD   | Semipresencial | Tecnólogos | Total |
|--------|-------|----------------|-----------|-------|
| CCAS   | 155   | 69             | 85        | 309   |
| CCS    | 229   | 55             | 547       | 831   |
| CCSA   | 602   | 0              | 907       | 1.509 |
| CEHLA  | 1.344 | 599            | 152       | 2.095 |
| CES    | 225   | 0              | 395       | 620   |
| CGJS   | 102   | 0              | 725       | 827   |
| CTIC   | 439   | 6              | 806       | 1.251 |
| **Total** | **3.096** | **729** | **3.617** | **7.442** |

---

## 2. KPI Cards (linha do topo)

Quatro cards, sempre visíveis independente da aba ativa:

| # | Label                | Valor   | Sub-texto              | Cor do valor      |
|---|----------------------|---------|------------------------|-------------------|
| 1 | Total de IDs         | 2.121   | 7 centros acadêmicos   | `--color-text`    |
| 2 | Conteúdo concluído   | 98,1%   | 1.788 de 1.822         | `--color-green`   |
| 3 | Mediação concluída   | 58,8%   | 1.071 de 1.822         | `--color-amber`   |
| 4 | Mediação pendente    | 648     | requer ação            | `--color-red`     |

---

## 3. Navegação por Abas

Três abas em sequência:
```
[ Mediação ]  [ Conteúdo ]  [ Ensalamento ]
```
- Aba ativa: borda inferior `--color-green` 2px + texto branco + `font-weight: 600`
- Aba inativa: texto `--color-muted`
- Primeira aba ativa por padrão

---

## 4. Aba — Mediação

### 4.1 Layout: duas colunas (proporção 3:2)
- Coluna esquerda: gráfico de barras empilhadas
- Coluna direita: tabela resumo

### 4.2 Gráfico: barras empilhadas verticais (Chart.js — `type: 'bar'`)
- Eixo X: siglas dos centros (CCS, CCSA, CEHLA, CES, CGJS, CTIC)
- Eixo Y: contagem de IDs
- `barThickness: 32`
- `stacked: true` em ambos os eixos
- Datasets na ordem: Concluído → Pendente → Verificar → Andamento → Aguardando → Estágio
- Tooltip: mostrar label do dataset + valor
- Legenda: custom HTML acima do canvas (não usar legenda nativa do Chart.js)

### 4.3 Tabela resumo
Colunas: `Centro | IDs | % mediação`

A coluna `% mediação` exibe uma mini barra de progresso inline:
- Barra preenchida: cor dinâmica baseada no percentual
  - ≥ 85%: `--color-green`
  - ≥ 60%: `--color-amber`
  - < 60%: `--color-red`
- Texto do percentual à direita da barra, mesma cor

---

## 5. Aba — Conteúdo

### 5.1 Layout: duas colunas (proporção 3:2)
- Coluna esquerda: gráfico de barras empilhadas
- Coluna direita: tabela resumo

### 5.2 Gráfico: barras empilhadas verticais (Chart.js)
- Eixo X: siglas dos centros
- Datasets: Concluído (`--color-green`) e Pendente (`--color-amber`)
- Mesma configuração de tooltip e legenda da aba Mediação

### 5.3 Tabela resumo
Colunas: `Centro | Total | Pendente`
- Se pendente = 0: exibir "—" em `--color-green`
- Se pendente > 0: exibir o número em `--color-amber`

---

## 6. Aba — Ensalamento

### 6.1 Layout: coluna única (full-width)

### 6.2 Sub-cards de totais (acima do gráfico, linha com 4 cards)
| Label          | Valor | Cor              |
|----------------|-------|------------------|
| EAD            | 3.096 | `--color-ead`    |
| Semipresencial | 729   | `--color-semi`   |
| Tecnólogos     | 3.617 | `--color-tecs`   |
| Total geral    | 7.442 | `--color-text`   |

Cada card: borda esquerda 3px na cor correspondente, fundo `--color-card`.

### 6.3 Gráfico: barras empilhadas verticais (Chart.js)
- Eixo X: todos os 7 centros (incluindo CCAS)
- Datasets: EAD → Semipresencial → Tecnólogos
- Tooltip: formatar número com `toLocaleString('pt-BR')`

---

## 7. Comportamento dos Gráficos (Chart.js — padrão global)

```js
// Aplicar a todos os gráficos
const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false }  // sempre custom HTML
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
```

---

## 8. Responsividade

| Breakpoint   | Comportamento                                    |
|--------------|--------------------------------------------------|
| ≥ 1024px     | Layout padrão (duas colunas nas abas Med/Cont)   |
| 768px–1023px | Colunas viram linha única (stacked)              |
| < 768px      | KPI cards em 2×2, gráficos em altura reduzida    |

---

## 9. Header

```
[barra verde 6px] Qualidade EAD · UniCV
                  Acompanhamento de disciplinas — Período 2025.1
                                          [à direita] 2.121 IDs · 7 centros
```

---

## 10. GitHub Pages — Instruções de Deploy

### Opção A: branch `gh-pages`
```bash
git checkout -b gh-pages
git push origin gh-pages
# Ativar em Settings → Pages → Branch: gh-pages / root
```

### Opção B: pasta `/docs` na `main`
```bash
mkdir docs
cp -r index.html data.js charts.js app.js style.css docs/
git add docs/
git commit -m "build: dashboard para GitHub Pages"
git push origin main
# Ativar em Settings → Pages → Branch: main / /docs
```

### Verificar deploy
```
https://canhetejr.github.io/<nome-do-repo>/
```

---

## 11. data.js — Estrutura esperada

```js
export const CENTERS = [
  {
    key: 'CCS',
    label: 'Ciências da Saúde',
    total: 297,
    conteudo: { ok: 295, pendente: 2 },
    mediacao: { ok: 280, pendente: 0, verificar: 15, andamento: 0, aguardando: 1, estagio: 0, naoOfertado: 1 }
  },
  // ... demais centros
];

export const ENSALAMENTO = [
  { key: 'CCAS', label: 'Cidadania e Ação Social', ead: 155, semi: 69, tecs: 85 },
  // ... demais centros
];

export const PERIODO = '2025.1';
```

> `data.js` usa `export` nativo. O `index.html` deve carregar com `<script type="module">` ou usar `window.CENTERS = [...]` se preferir compatibilidade máxima (sem módulos).
