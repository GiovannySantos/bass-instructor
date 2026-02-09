# 03-ui-components-map

## Mapa de componentes (arquivo unico)
- Todos os componentes React principais estao no arquivo `src/App.jsx`. (src/App.jsx)
- Nao ha pasta `components/` ou `ui/` na arvore atual. (00-repo-tree.md, src/App.jsx)

## Componentes de topo (Shell/Layout/Nav)
- App: registra service worker e injeta BassTheoryProvider + AppShell. (src/App.jsx)
- BassTheoryProvider: Contexto com rootNote, scaleMode, displayMode, nnsMode e setters. (src/App.jsx)
- AppShell: layout geral (header/main/footer/drawer) e orquestra estado global do app. (src/App.jsx)
- ModeToggle: alterna appMode entre treino/palco. (src/App.jsx)
- ControlPanel: controles de teoria (tonica, modo, exibicao, NNS). (src/App.jsx)

## Componentes de dominio musical
- SmartFretboard: renderiza braco e responde a cliques de notas. (src/App.jsx, src/index.css)
- FlashcardTrainer: desafio de notas/intervalos com streak/feedback. (src/App.jsx)
- MetronomePanel: treino de ritmo (tap tempo, BPM, subdivisoes). (src/App.jsx)
- StudiesPanel: tabelas de escalas/intervalos/acordes, com copia. (src/App.jsx)
- GrooveBriefing: briefing de gig com estilo/progressao/tecnica. (src/App.jsx)
- StageMode + StageTempo: layout "palco" com BPM, tom/escala e anotacoes. (src/App.jsx)

## Como os componentes conversam (props/context/store)
- Contexto `BassTheoryContext`: compartilhado por ControlPanel, SmartFretboard, FlashcardTrainer, StudiesPanel. (src/App.jsx)
- Props do AppShell: passa bpm/isPlaying/includeEighths/includeSixteenths para MetronomePanel; passa target/streak/feedback para FlashcardTrainer; passa handlers/estado para StageMode. (src/App.jsx)
- Callbacks: SmartFretboard chama onNoteSelect -> AppShell.handleGameAnswer atualiza streak/feedback/target. (src/App.jsx)
- Estado local: MetronomePanel e StageTempo usam tapTimes internos para calcular BPM; GrooveBriefing gera briefing local. (src/App.jsx)

## Observacao sobre hook TS
- `src/hooks/useMusicEngine.ts` existe, mas nao ha uso/import no app principal. (src/hooks/useMusicEngine.ts, src/App.jsx)

## Evidencias (outputs relevantes)
rg (componentes e helpers no App.jsx):
```
rg -n "^const [A-Za-z]" src/App.jsx
5:const BassTheoryContext = createContext(null);
55:const BassTheoryProvider = ({ children }) => {
95:const AppShell = () => {
582:const ControlPanel = ({ compact = false, showTitle = true }) => {
752:const ModeToggle = ({ appMode, setAppMode, compact = false }) => {
798:const buildScaleNotes = (rootNote, scaleMode) => {
806:const StudiesPanel = () => {
1070:const randomTarget = () => {
1084:const validateTarget = (target, noteIndex, rootNote) => {
1114:const SmartFretboard = ({ onNoteSelect }) => {
1300:const MetronomePanel = ({
1472:const StageMode = ({
1638:const StageTempo = ({ bpm, setBpm }) => {
1720:const FlashcardTrainer = ({ target, streak, feedback }) => {
1790:const GrooveBriefing = ({ compact = false }) => {
1854:const createBriefing = () => {
1896:const App = () => {
```
