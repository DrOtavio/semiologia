import React from 'react';
import {Composition} from 'remotion';
import {Video} from './video';
import {PleuralDemo} from './PleuralDemo';
export const Root: React.FC = () => <>
  <Composition id="Semiologia" component={Video} width={1920} height={1080} fps={30} durationInFrames={25936}/>
  <Composition id="PleuralDemo" component={PleuralDemo} width={1920} height={1080} fps={30} durationInFrames={372}/>
</>;
