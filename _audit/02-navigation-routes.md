# 02-navigation-routes

## Sistema de rotas
- INDETERMINADO para rotas tradicionais (React Router/Next), pois o rg nao encontrou nenhum uso de router. (rg output abaixo)
- O app funciona como SPA unica, sem rotas declaradas; a navegacao entre "telas" ocorre por estado appMode (treino/palco). (src/App.jsx)

## Telas/Seções (condicionais por estado)
- Treino: renderiza SmartFretboard, FlashcardTrainer, StudiesPanel, MetronomePanel e GrooveBriefing. (src/App.jsx)
- Palco: renderiza StageMode (com StageTempo e campos de anotacoes). (src/App.jsx)

## Entrada do app
- index.html aponta para /src/main.jsx. (index.html)
- main.jsx cria o root e renderiza <App />. (src/main.jsx)

## Evidencias (outputs relevantes)
rg (rotas):
```
rg -n "createBrowserRouter|BrowserRouter|Routes\\b|Route\\b|react-router|next/router|next/navigation" .
(sem matches)
```

rg (entrada do app):
```
rg -n "App\\.|main\\.|createRoot\\(" src .
src\\main.jsx:4:import App from "./App.jsx"
src\\main.jsx:6:createRoot(document.getElementById("root")).render(
.\\index.html:17:    <script type="module" src="/src/main.jsx"></script>
.\\legacy\\js\\app.js:633:const root = createRoot(document.getElementById("root"));
```
