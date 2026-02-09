# Baseline do App

## Como rodar local
- npm install
- npm run dev
- npm run build
- npm run preview

## Versao de Node recomendada
INDETERMINADO (nao ha .nvmrc no repo)

## Pontos de entrada do app
- index.html
- src/main.jsx
- src/App.jsx

## Persistencia local
- localStorage: "bassdojo:mode"
- localStorage: "bassdojo:dark"
- localStorage: "bassdojo:stage-notes"
- localStorage: "bassdojo:stage-cue"

## Observacoes rapidas
- SPA React + Vite com Tailwind (dependencias em package.json)
- React 19 / Vite 7 / Tailwind 4 (conforme package.json)
- Persistencia de modo/tema/campos de palco via localStorage em src/App.jsx
- netlify.toml presente para deploy
- Pasta dist/ presente (artefatos de build)
