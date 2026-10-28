# Demonstração de derrame pleural

A composição `PleuralDemo` usa 372 quadros (12,4 s), 1920 × 1080, 30 fps. O áudio é o FLAC original entre 12,4 e 24,8 segundos. Os marcos da fala foram estimados por reconhecimento de palavras e apoiados por análise de silêncio; não substituem conferência auditiva. As palavras «líquido» e «espacio pleural» ocorrem aproximadamente 3,1 e 3,6 segundos após o início da amostra.

As imagens em `public/pleural-demo/basal.png` e `derrame.png` são ilustrações originais geradas para esta demonstração. A composição apresenta uma transição em camadas 2.5D com máscara progressiva, movimento de câmera simulado e tipografia sincronizada. Não é uma simulação física nem uma malha tridimensional animada; a posição do líquido e a forma do pulmão requerem revisão por especialista antes de uso clínico ou educacional definitivo. A imagem do infográfico original não foi usada na composição.

```bash
npm install
npm run demo
```

O Remotion baixa e usa seu navegador próprio por padrão. Para usar um Chromium local, defina `REMOTION_BROWSER_EXECUTABLE` com o caminho do executável antes de rodar o comando.

O arquivo gerado é `output/amostra_derrame_premium.mp4`. O projeto Remotion e o workflow `render-video.yml` do vídeo completo continuam disponíveis. A demonstração é uma composição separada e não altera o master de 14 minutos.

## Fontes anatômicas avaliadas

Os modelos de pulmão e coração da HuBMAP foram obtidos da distribuição oficial, inspecionados e renderizados em Blender. Fonte, autoria, licença CC BY 4.0 e hashes constam em `artifacts/anatomy/ATTRIBUTION.md`. A renderização auxiliar `public/pleural-demo/hubmap-anatomy.png` é reproduzível com `blender -b -P scripts/render-anatomy.py`; ela não integra o MP4 da demonstração, que usa as ilustrações 2.5D. Os modelos foram importados e renderizados com novos materiais e iluminação.

O repositório [Z-Anatomy](https://github.com/Z-Anatomy/Models-of-human-anatomy), commit `6ffffec1`, declara CC BY-SA 4.0 e pede atribuição também a BodyParts3D (CC BY-SA 2.1 Japan); o README descreve exceções não comerciais em algumas peças. O arquivo Blender contém uma malha `Pleura` com 3.442 vértices e 3.580 faces, sem arestas não manifold, com modificadores Subdivision e Solidify. Não foi possível confirmar quais superfícies representam os folhetos visceral e parietal ou a proveniência específica da peça; ela não foi usada nem redistribuída. Antes de reutilizá-la, confirme a licença daquela peça e cumpra as condições de atribuição e compartilhamento aplicáveis.
