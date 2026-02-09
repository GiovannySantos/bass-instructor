# 06-risk-smells

1. Monolito de UI/logic em um unico arquivo (App.jsx). Evidence: varios componentes e helpers no mesmo arquivo. (src/App.jsx) Impacto: manutencao e onboarding mais dificeis, maior acoplamento entre UI e regra.
2. Logica de dominio embutida em componentes de UI. Evidence: buildScaleNotes, randomTarget, validateTarget e createBriefing estao em src/App.jsx junto da renderizacao. (src/App.jsx) Impacto: dificulta testes isolados e reuse de logica.
3. Duplicacao de logica de tap tempo. Evidence: MetronomePanel e StageTempo calculam BPM com tapTimes de forma similar. (src/App.jsx) Impacto: risco de divergencia de comportamento e manutencao duplicada.
4. Hook TS nao utilizado. Evidence: src/hooks/useMusicEngine.ts nao e importado em lugar nenhum. (src/hooks/useMusicEngine.ts, src/App.jsx) Impacto: codigo morto/confusao sobre fonte de verdade para logica musical.
5. Inconsistencia de tipografia configurada. Evidence: Tailwind define fontFamily studio=Inter, mas o CSS global aplica Space Grotesk no body. (tailwind.config.js, src/index.css) Impacto: inconsistencias visuais e dificuldade de governanca de design system.
6. Sem rotas/deep links. Evidence: nenhum router encontrado por rg; condicional por appMode. (src/App.jsx, 02-navigation-routes.md) Impacto: nao ha URLs para telas/flows, limitando analytics e navegacao direta.
7. Metronomo visual apenas. Evidence: MetronomePanel diz "Sem reproducao de audio" e so alterna isPlaying. (src/App.jsx) Impacto: expectativa de UX pode nao ser atendida se usuario espera som.
8. Codigo legado no repo sem integracao. Evidence: pasta legacy com app separado. (legacy/) Impacto: confusao sobre fonte da verdade e volume extra para auditoria.
