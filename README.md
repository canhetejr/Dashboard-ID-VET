# Dashboard Qualidade EAD — UniCV

Dashboard estático para acompanhamento de disciplinas do Moodle da UniCV no período 2025.1.

## Atualização de Dados (Google Sheets)

A arquitetura foi atualizada para buscar dados automaticamente de uma planilha do Google Sheets através de uma Conta de Serviço. O Dashboard continua estático e offline-capable no navegador.

Para atualizar os dados (`data.js`):

1. Adicione os detalhes da sua conta de serviço no arquivo `credentials.json`
2. Execute o comando para buscar os dados da planilha e atualizar o frontend:
```bash
npm run update
```
Isso executará o arquivo `updateData.js` que vai acessar as planilhas do Google e reescrever o arquivo `data.js`.

Para testar e ver o site localmente:
```bash
npm start
```

## Deploy no GitHub Pages

Para realizar o deploy na branch `main`:
1. Faça o commit de todas as alterações.
2. Os arquivos serão copiados para a pasta `docs/` (conforme workflow).
3. Ative o GitHub Pages em Settings → Pages → Branch: main / `/docs`.
