# Missão: produzir uma videoaula premium de Semiología Práctica, totalmente animada e sincronizada

Você é o diretor de arte, motion designer médico, editor sênior e engenheiro audiovisual deste projeto. O repositório acabou de ser criado: **construa o projeto do zero, sem solicitar código preexistente**. Sua entrega precisa ser executável, renderizável e versionada. Não entregue apenas um roteiro, storyboard, mockup, protótipo ou imagens estáticas: IMPLEMENTE A VIDEOAULA REAL.

## Arquivos obrigatórios já presentes em `assets/`

- `assets/narracao_es.flac`: áudio original da locução espanhola, obrigatório, com duração aproximada de 14 min e 24,5 s. Preservar a voz real, ordem, todas as falas e velocidade natural. Não sintetizar nova narração nem resumir.
- `assets/roteiro_es.txt`: transcrição integral correspondente à narração, na ordem da leitura. É o roteiro mestre para a sincronização de tópicos e de frases. Não ler os números de linha: eles não fazem parte da locução.
- `assets/infografico_referencia.jpg`: REFERÊNCIA EDITORIAL e de conteúdo, não é material a recortar e colar no vídeo.

## REGRA VISUAL MAIS IMPORTANTE

**RECRIE O CONTEÚDO DO INFOGRÁFICO DO ZERO. NÃO USE CROP, ZOOM OU PANORÂMICA DA IMAGEM COMO A VIDEOAULA.** Não colocar a imagem inteira na tela, nem fazer zoom nos quadrantes, nem usar trechos fotografados como cards, nem usar screenshots das tabelas. Redesene cada informação com componentes vetoriais, gráficos originais, tabelas tipografadas, representações anatômicas, diagramas médicos, ilustrações educativas, ícones clínicos, cards e animações próprias. O JPG serve para compreender a hierarquia e os tópicos. O áudio e o texto são a fonte principal da sequência falada.

A estética deve lembrar uma **produção premium de educação médica**, com direção de arte coesa, cinematografia de infográficos, animação fluida, microinterações visuais e alto rigor tipográfico; nada de apresentação escolar, slides comuns, transições genéricas de PowerPoint ou texto correndo em blocos pequenos. Faça o design como se um editor profissional e um motion designer experiente tivessem trabalhado quadro a quadro.

## Especificações e engenharia

- Formato master: **1920 × 1080, 16:9, 30 fps, H.264 + AAC, MP4**, para YouTube/aula em desktop e TV; se viável crie também variante 1080 × 1920 como configuração opcional, sem sacrificar a versão 16:9.
- Vídeo deve durar exatamente a duração do áudio, exceto pequena tolerância técnica de último frame/contêiner. O áudio não pode ser acelerado, desacelerado, cortado, repetido ou regravado.
- Escreva o projeto com **Remotion + React + TypeScript**, SVGs/Canvas ou biblioteca de animação apropriada, e FFmpeg para inspeção/mux. Inicialize `package.json`, instalação, compilação, scripts, config, componentes, assets e pipeline de render. Pode usar alternativas somente se forem concretamente superiores e estiverem justificadas no README.
- Identidade visual: base azul-marinho/azul-clínico com variações por módulo (derrame azul, pneumotórax verde, cardiovascular vermelho, insuficiência cardíaca violeta); fundos sofisticados, luz suave, sombra sutil, gradação, profundidade leve, layout com margens seguras. Tipografia legível, com acentos em espanhol corretos, contraste alto, tamanho confortável em 1080p. Elementos inéditos e visualmente consistentes.
- Animar os conceitos, não só os títulos: líquido se acumulando no espaço pleural; distinção entre exudado/trasudado; sons à percussão; sinais radiológicos como esquemas autorais; pneumotórax com retração pulmonar e ar pleural; desvio mediastínico a tensão; localização e irradiação da dor anginosa; NYHA I a IV com esforço; sístole e diástole; congestão venosa; interpretação visual de BNP, ecocardiograma, Framingham e graus do edema Godet.
- Evitar reutilização excessiva de um mesmo layout. Revezar visão anatômica, tabela reconstituída, comparativo dividido, infográfico interativo, motion typography, checklist, pictogramas, silhuetas e diagramas clínicos. Criar transições contextuais elegantes (morph, máscara, wipe suave, elementos com continuidade), sem exagerar nos efeitos.
- **Não inventar dados clínicos nem imagens radiológicas falsas apresentadas como exame real**. Se não existirem radiografias legalmente reutilizáveis no projeto, usar ESQUEMAS RADIOGRÁFICOS ILUSTRADOS, devidamente identificados como ilustrativos. Se utilizar mídia externa, registrar fonte/licença no README. Toda representação deve ser clinicamente coerente.
- Idioma de todo o conteúdo visível: **espanhol**. NÃO gerar textos em português no vídeo. Corrigir graficamente palavras deformadas no infográfico apenas quando confirmadas pelo roteiro. Em trecho onde o roteiro diz ser ilegível a palavra da tabela, não inventar o termo. Não corrigir a fala original.
- Nenhum logotipo, marca d'água, assinatura, número de página ou tela longa de créditos. Não inserir música que dispute com a locução; priorizar voz inteligível. Sons de interface sutis são opcionais e devem ter licença clara.

## Sincronização obrigatória com a fala

- Use o `roteiro_es.txt` como sequência editorial, mas extraia **timestamps reais do áudio** usando alinhamento forçado ou reconhecimento de fala com timestamps (p. ex. Whisper + forced alignment/WhisperX se o ambiente suportar). Verifique início/fim de cada frase. Se o alinhamento automatizado não estiver disponível, crie metodologia de alinhamento manual verificável com forma de onda, marcadores e revisão. **Não distribua automaticamente o tempo por número de palavras** como versão final.
- Crie `src/data/timeline.json` ou equivalente com cenas estruturadas: `start`, `end`, `narrationText`, `section`, `visualType`, `visuals`, `emphasis`, `transition`. Organize cada fala por ideias/orações. A visualização muda QUANDO O ÁUDIO ENTRA NO ASSUNTO, e o destaque aparece quando aquela informação é mencionada.
- Quando a voz explicar um sinal, o espectador verá esse sinal sendo demonstrado NAQUELA HORA. Quando comparar pneumotórax e derrame, exibir o comparativo sincronizado. Quando falar do quarto grau de NYHA ou Godet, realçar somente o respectivo grau, na ordem.
- Legendas opcionais curtas e discretas sincronizadas no rodapé; não cobrir diagramas. Gerar SRT externo completo com os tempos conferidos; priorizar textos-chave grandes na tela em lugar de transcrever tudo permanentemente.
- Fazer pausas visuais equilibradas com continuidade entre frases; não inserir silêncios artificiais, nem permitir cenas vazias.

## Cobertura integral dos quatro módulos, na ordem do áudio

1. **Derrame pleural**: definição, etiologia exudado/trasudado, comparação com pneumonia, radiografia e sinais, Signorelli, toracocentese, critérios de Light com valores corretos, neoplasia associada e por que não puncionar de rotina transudado típico.
2. **Neumotórax**: definição, tipos, exames radiográficos, sinais/sintomas, hipersonoridade, deslocamento mediastínico, comparação com derrame pleural, comparação entre neumotórax simples/a tensão e derrames.
3. **Motivo de consulta cardiovascular**: disnea e suas variantes, classes NYHA, tipos e características de dor torácica, roteiro de anamnese, IAM/angina, exames, sensação de morte iminente.
4. **Insuficiencia cardíaca**: definição, mecanismos, sinais, causas, precipitantes e agravantes, reflujo hepatoyugular, BNP/NT-proBNP, ecocardiograma, Framingham e quatro graus de edema Godet.

Não excluir detalhes do roteiro para encurtar a videoaula. Transformar passagens extensas em sequências visuais legíveis, sem excesso de texto simultâneo.

## Qualidade, verificações e entrega efetiva

1. Inspecionar duração e canais do FLAC com `ffprobe`. Fazer checagem automática de correspondência do áudio no MP4 final.
2. Produzir storyboard e timeline **codificados**; depois implementar TODOS os módulos, não só o primeiro.
3. Renderizar amostras de pelo menos 3 trechos diferentes (abertura/derrame, pneumotórax, cardiovascular ou IC) e revisar enquadramento, composição, ortografia espanhola, legibilidade e alinhamento temporal; corrigir problemas encontrados.
4. Renderizar `output/semiologia_practica_premium.mp4` integral em Full HD, se os recursos da nuvem permitirem, e `output/semiologia_practica_es.srt`; gerar também `output/preview.mp4` curto. **Não declarar concluído sem ter validado os arquivos renderizados e sua duração**. Se existir limite da tarefa, deixar o projeto totalmente reproduzível e comunicar honestamente exatamente o que foi ou não foi renderizado.
5. Documentar `npm install`, `npm run dev`, `npm run render`, `npm run preview` e o procedimento de exportação. Adicionar `.gitignore` para vídeos renderizados grandes, caches e node_modules.
6. Implementar workflow do **GitHub Actions com `workflow_dispatch`** que renderize a versão final em ambiente Linux e publique o MP4 e SRT como **artefatos baixáveis** da execução, com qualidade Full HD. Assim posso obter o vídeo sem precisar fazer download pelo terminal do Codex e sem versionar um MP4 enorme.
7. Criar testes automatizados para timeline: monotonicidade, lacunas excessivas, sobreposições indevidas, falas faltantes e duração total. Verificar que todas as quatro seções existem e que nenhum item do roteiro ficou sem tratamento.
8. Faça commits ou prepare PR das mudanças conforme permissões. Ao final, apresente instruções práticas para baixar o vídeo pelo GitHub Actions e como alterar a identidade visual e regenerar.

**Comece implementando, não apenas planejando. Assuma liberdade criativa de alto nível sem pedir aprovação intermediária. A qualidade visual e a sincronização do áudio com o conteúdo refeito são os critérios prioritários.**
