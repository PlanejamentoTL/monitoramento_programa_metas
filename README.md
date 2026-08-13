# Monitoramento Programa de Metas

Aplicação web para acompanhamento e atualização do progresso das metas dos planos municipais de Três Lagoas/MS (Plano de Governo, Plano Plurianual, LDO, Plano Diretor, entre outros), usada pelas secretarias responsáveis e pela administração central (SEGOV).

## Sobre o projeto

Cada secretaria acessa suas próprias metas, atualiza o status/percentual de execução e anexa documentos comprobatórios. A SEGOV (perfil admin) tem uma visão geral consolidada de todas as secretarias e planos.

Os dados ficam no Firestore, organizados em uma coleção por plano (ex.: `plano-governo`, `plano-plurianual`, `ldo-2026`). O login é local (não usa Firebase Auth), validado contra uma lista de usuários cadastrados no próprio repositório.

### Planos suportados

- Plano de Governo
- Plano Plurianual 2026-2029
- Lei de Diretrizes Orçamentárias (LDO) 2026
- Plano Diretor
- Plano Municipal da 1ª Infância
- Plano Três Lagoas Sustentável
- Plano Setorial - Assistência Social

### Principais funcionalidades

- Login local por e-mail/senha, com sessão persistida em `localStorage`.
- Listagem de metas por plano e por secretaria, com filtro (visão restrita para usuários comuns, visão geral para admins).
- Edição de metas em modais dedicados por tipo de plano (status, percentual de execução, previsão de conclusão, indicadores, justificativas etc.).
- Upload de documentos comprobatórios via Google Apps Script.
- Painel com gráfico (doughnut) do progresso das metas por status.
- Exportação de dados para planilha (`xlsx`).
- Rotas protegidas por autenticação (`ProtectedRoute`).

## Tecnologias

- [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- [React Router](https://reactrouter.com/) para navegação
- [Firebase](https://firebase.google.com/) (Firestore) como banco de dados
- [Chart.js](https://www.chartjs.org/) / `react-chartjs-2` para gráficos
- [xlsx (SheetJS)](https://www.npmjs.com/package/xlsx) para exportação de planilhas
- ESLint para lint de código

## Estrutura do projeto

```
src/
├── App.jsx                  # Rotas da aplicação
├── api.js                   # Chamadas auxiliares de API
├── components/
│   └── ProtectedRoute.jsx   # Guard de rotas autenticadas
├── config/
│   └── periodoAtual.js      # Semestre vigente do ciclo de coleta
├── context/
│   └── AuthContextLocal.jsx # Contexto de autenticação local
├── data/
│   └── users.json           # Base de usuários do login local
├── pages/
│   ├── Home.jsx              # Dashboard da secretaria logada
│   ├── visualizacaoGeral.jsx # Dashboard consolidado (admin/SEGOV)
│   ├── PainelMetas.jsx       # Gráfico/resumo de progresso das metas
│   ├── LoginLocal.jsx        # Tela de login
│   ├── footer.jsx
│   ├── pop-up_meta.jsx           # Modal de edição - Plano de Governo
│   ├── Pop_up_planos_gerais.jsx  # Modal de edição - demais planos
│   ├── pop-up-ppa.jsx            # Modal de edição - Plano Plurianual
│   └── pop-up-ldo-ppa.jsx        # Modal de edição - LDO
├── services/
│   ├── firebase.js          # Inicialização do Firebase (Auth/Firestore)
│   └── consultas.js
├── utils/
│   └── metaStatus.js        # Regras de "meta completa" por plano
└── estilos/                 # CSS das páginas/componentes
```

Veja também [`BACKLOG.md`](./BACKLOG.md) para um levantamento técnico de bugs conhecidos e melhorias planejadas.

## Pré-requisitos

- [Node.js](https://nodejs.org/) 18+
- npm

## Instalação

```bash
git clone <url-do-repositorio>
cd monitoramento_programa_metas
npm install
```

## Configuração

O projeto usa variáveis de ambiente para os endpoints de upload/planilha (Google Apps Script). Crie um arquivo `.env` na raiz com:

```
VITE_SHEETS_API=<url-do-apps-script-principal>
VITE_SHEETS_APIPG=<url-do-apps-script-plano-de-governo>
VITE_SHEETS_APILDO=<url-do-apps-script-ldo>
```

A configuração do Firebase (Firestore) está em `src/services/firebase.js`.

Os usuários que podem acessar o sistema são definidos em `src/data/users.json` (e-mail, senha, secretaria e papel `admin`/`user`).

## Executando o projeto

```bash
npm run dev
```

Acesse `http://localhost:5173` (porta padrão do Vite).

## Scripts disponíveis

| Comando           | Descrição                                          |
| ------------------ | --------------------------------------------------- |
| `npm run dev`      | Inicia o servidor de desenvolvimento com hot reload |
| `npm run build`    | Gera o build de produção em `dist/`                  |
| `npm run lint`     | Executa o ESLint                                     |
| `npm run preview`  | Serve o build de produção localmente para conferência |
| `npm run deploy`   | Publica o conteúdo de `dist/` no GitHub Pages        |

## Deploy

O deploy é feito via [gh-pages](https://www.npmjs.com/package/gh-pages), publicando o build no branch `gh-pages`:

```bash
npm run deploy
```

A URL configurada em `package.json` (`homepage`) é:
`https://planejamentotl.github.io/monitoramento_programa_metas`

## Autenticação

O login **não** usa o Firebase Authentication. Ele valida e-mail/senha contra a lista em `src/data/users.json` e mantém a sessão do usuário em `localStorage` (`AuthContextLocal.jsx`). O papel `role: "admin"` libera acesso à visão geral (`/visualizacao_geral`).

> ⚠️ Por ser uma lista de credenciais em texto simples versionada no repositório, trate o acesso a este repositório como sensível.
