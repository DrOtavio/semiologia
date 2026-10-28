import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import timeline from './data/timeline.json';
import {MedicalScene} from './scenes';
export const Video: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const scene = [...timeline].reverse().find(s => s.start <= t) ?? timeline[0];
  return <AbsoluteFill style={{backgroundColor:'#07121f'}}><MedicalScene section={scene.section} narrationText={scene.start >= 864 ? 'Fin.' : scene.narrationText} frame={frame - Math.round(scene.start * 30)} durationFrames={Math.max(1, Math.round((scene.end-scene.start)*30))}/><Audio src={staticFile('narracao_es.flac')}/></AbsoluteFill>;
};
