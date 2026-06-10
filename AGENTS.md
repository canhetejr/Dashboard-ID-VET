# Dashboard Qualidade EAD — UniCV

## Identidade do projeto
Dashboard estático para acompanhamento de disciplinas do Moodle da UniCV no período 2025.1.
Painel operacional da equipe de Qualidade EAD. Lido por pessoas técnicas (não por alunos).

## Stack — não negociável
- HTML5 semântico
- CSS custom properties (sem frameworks CSS externos)
- Chart.js 4.4.x via CDN (`cdnjs.cloudflare.com`)
- Vanilla JS ES2022 — nenhum bundler, nenhum framework
- Deploy: GitHub Pages (branch `gh-pages` ou pasta `/docs` na `main`)

## Estrutura de arquivos
```
/
├── index.html      ← ponto de entrada, importa os demais
├── data.js         ← todos os dados como constantes JS exportadas
├── charts.js       ← instanciação e lógica dos Charts.js
├── app.js          ← tabs, interações, lógica de UI
├── style.css       ← design system completo via custom properties
└── README.md       ← instruções de build e deploy
```

## Regras obrigatórias de código
- Todos os `<script>` no final do `<body>`, na ordem: `data.js` → `charts.js` → `app.js`
- CSS: usar apenas `var(--nome)` para cores, nunca hex hardcoded dentro de regras CSS
- JS: `const` e `let` apenas, zero `var`; sem `document.write()`
- Nenhuma chamada de API, nenhum backend — tudo client-side e offline-capable
- Nomes de classes CSS em `kebab-case`; variáveis JS em `camelCase`
- Comentários em português

## Paleta de cores (custom properties em `:root`)
```css
--color-bg:        #0f1321;
--color-surface:   #141828;
--color-card:      #1a1f35;
--color-border:    #1e2540;
--color-text:      #e2e8f0;
--color-muted:     #64748b;
--color-hint:      #475569;
--color-green:     #22c55e;
--color-amber:     #f59e0b;
--color-red:       #ef4444;
--color-blue:      #60a5fa;
--color-purple:    #c084fc;
--color-cyan:      #22d3ee;
--color-ead:       #378add;
--color-semi:      #c084fc;
--color-tecs:      #f59e0b;
```

## Status de Mediação → cor
| Status         | Variável CSS         |
|----------------|----------------------|
| CONCLUIDO      | `--color-green`      |
| PENDENTE       | `#94a3b8` (hardcode) |
| VERIFICAR      | `--color-amber`      |
| ANDAMENTO      | `--color-blue`       |
| AGUARDANDO     | `--color-purple`     |
| ESTAGIO        | `--color-cyan`       |
| NAO_OFERTADO   | `--color-red`        |

## Referência de dados
Ver `SPEC.md` — seção "Dados dos Centros" para todos os valores numéricos.

## Após cada arquivo criado
Rodar `agy inspect` se o comportamento do agente parecer inesperado.
Não commitar arquivos de build intermediários (`.DS_Store`, `node_modules`, etc.).
