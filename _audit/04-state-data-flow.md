# 04-state-data-flow

## Onde vive o estado
- Contexto global: BassTheoryContext guarda rootNote, scaleMode, displayMode, nnsMode e setters. (src/App.jsx)
- AppShell (estado de app): appMode, darkMode, bpm, isPlaying, includeEighths, includeSixteenths, target, streak, feedback, drawerOpen, coreOpen, stageNotes, stageCue. (src/App.jsx)
- Componentes locais: StudiesPanel (tab, copiedKey), SmartFretboard (activeString, playedNote), MetronomePanel/StageTempo (tapTimes), GrooveBriefing (briefing). (src/App.jsx)
- Hook TS separado `useMusicEngine` nao utilizado no fluxo atual. (src/hooks/useMusicEngine.ts, src/App.jsx)

## Persistencia
- localStorage: bassdojo:mode, bassdojo:dark, bassdojo:stage-notes, bassdojo:stage-cue. (src/App.jsx)
- Service worker registra cache de assets PWA, mas nao persiste estado do app. (public/sw.js, src/App.jsx)

## Fluxos principais
### (a) Fretboard
- SmartFretboard usa rootNote/scaleMode/displayMode do contexto para calcular notas e destacar casas. (src/App.jsx)
- buildScaleNotes usa SCALE_LIBRARY para gerar notas; SmartFretboard renderiza grid e clique chama onNoteSelect. (src/App.jsx, src/index.css)
- AppShell.handleGameAnswer recebe nota clicada, valida com validateTarget e atualiza streak/feedback/target. (src/App.jsx)

### (b) Flashcards
- target inicial vem de randomTarget em AppShell. (src/App.jsx)
- FlashcardTrainer exibe instrucao conforme target.type e rootNote; feedback vem do AppShell. (src/App.jsx)
- validateTarget compara noteIndex com target e atualiza mensagem. (src/App.jsx)

### (c) Metronome
- MetronomePanel recebe bpm/isPlaying/includeEighths/includeSixteenths do AppShell e atualiza via setters. (src/App.jsx)
- tapTimes calcula BPM por batidas; nao ha audio, apenas UI. (src/App.jsx)

### (d) Gig briefing
- GrooveBriefing gera briefing local com createBriefing (estilo/progressao/tecnica). (src/App.jsx)
- Modo Palco (StageMode) usa stageNotes e stageCue do AppShell, persistidos em localStorage. (src/App.jsx)
- StageTempo permite ajuste rapido de BPM com tapTimes. (src/App.jsx)

## Evidencias (outputs relevantes)
rg (localStorage):
```
rg -n "localStorage|bassdojo" src/App.jsx
114:    const saved = window.localStorage.getItem("bassdojo:mode");
124:    const saved = window.localStorage.getItem("bassdojo:dark");
144:    return window.localStorage.getItem("bassdojo:stage-notes") || "";
152:    return window.localStorage.getItem("bassdojo:stage-cue") || "";
170:    window.localStorage.setItem("bassdojo:dark", String(darkMode));
180:    window.localStorage.setItem("bassdojo:mode", appMode);
198:    window.localStorage.setItem("bassdojo:stage-notes", stageNotes);
204:    window.localStorage.setItem("bassdojo:stage-cue", stageCue);
```

rg (dominio musical):
```
rg -n "fretboard|flashcard|metronome|gig" src .
src\\App.jsx:1212:            <div className="fretboard-grid">
src\\index.css:28:.fretboard-grid {
src\\hooks\\useMusicEngine.ts:28:  fretboardData: () => FretboardString[];
... (ver comando completo em 00-repo-tree e execucao)
```
