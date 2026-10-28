# Semiología Práctica

Videoaula em espanhol sobre derrame pleural, neumotórax, consulta cardiovascular e insuficiencia cardíaca, criada com Remotion, React e TypeScript. A narração original está em `assets/narracao_es.flac`; `assets/roteiro_es.txt` é o roteiro mestre. O infográfico em `assets/infografico_referencia.jpg` é apenas referência editorial e não integra os quadros do vídeo.

## Preparação e execução

É necessário Node.js e npm, além das dependências de navegador do Remotion. No diretório do projeto:

```bash
npm install
npm run dev
```

O comando `dev` abre o Remotion Studio. Para gerar o master e uma prévia:

```bash
npm run render
npm run preview
```

O master é `output/semiologia_practica_premium.mp4` (1920 × 1080, 30 fps), com legendas externas em `output/semiologia_practica_es.srt`. A prévia é `output/preview.mp4`. Os vídeos gerados são ignorados pelo Git. Para verificar a composição e a duração, use `ffprobe output/semiologia_practica_premium.mp4`. Os testes do projeto são executados com `npm test`.

## Renderização pelo GitHub Actions

Envie o projeto, incluindo `package-lock.json` e os arquivos de `assets/`, ao GitHub. Na aba **Actions**, escolha **Renderizar videoaula**, clique em **Run workflow**, selecione a branch e inicie a execução. Quando o job terminar, abra a execução e baixe o artefato **semiologia-practica-full-hd**. Ele contém o MP4 e o SRT; o GitHub disponibiliza o artefato pelo período configurado no workflow. Não é necessário versionar o vídeo renderizado.

## Alterações visuais e exportação

As cores, ilustrações e cenas são definidas nos componentes e dados em `src/`. Após alterar a identidade visual, revise as cenas no Studio e execute os testes antes de gerar novamente com `npm run render`. Mantenha o FLAC original sem cortes ou mudança de velocidade e preserve a sincronização da timeline com a fala. Os diagramas médicos são ilustrações educativas, não exames de pacientes.

## Estado e limites da versão atual

Esta é uma implementação inicial, ainda não uma entrega audiovisual premium concluída. Os quatro módulos estão representados na timeline e o texto segue o roteiro, mas muitas cenas usam composições semelhantes e nem todos os conceitos são demonstrados por animações específicas. A sincronização foi estimada automaticamente: 92,37% das palavras tiveram correspondência exata com a transcrição automática, e os trechos restantes foram interpolados entre âncoras. É necessária revisão auditiva, particularmente nos cortes de 80, 290 e 580 segundos, e revisão clínica e visual completa antes de publicar. Consulte `src/data/ALINEACION.md` e `src/data/alignment-report.json`.

O áudio termina após a palavra «Fin», enquanto o arquivo de roteiro contém mais uma frase de encerramento; a legenda termina com a palavra realmente detectada. O comando `npm run verify` verifica o formato, a duração e amostras do áudio do MP4 integral com FFmpeg/FFprobe; não substitui a revisão da sincronização nem avalia a qualidade clínica ou visual.
