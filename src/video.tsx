import React from 'react';
import {AbsoluteFill, Audio, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import timeline from './data/timeline.json';
import timings from './data/word-timings.json';
import {Pleural} from './modules/Pleural';
import {Pneumothorax} from './modules/Pneumothorax';
import {Cardiovascular} from './modules/Cardiovascular';
import {HeartFailure} from './modules/HeartFailure';

const Intro: React.FC<{frame:number}> = ({frame}) => {
 const time=frame/30;
 const opacity=interpolate(frame,[0,15],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 const topics=[{name:'Derrame pleural',start:3.52},{name:'Neumotórax',start:4.26},{name:'Consulta cardiovascular',start:5.96},{name:'Insuficiencia cardíaca',start:7.92}];
 return <AbsoluteFill style={{background:'#061322',color:'#f2f8fb',fontFamily:'Inter, Helvetica Neue, Arial, sans-serif',overflow:'hidden'}}>
  <AbsoluteFill style={{transform:`scale(${1.015+frame/30*.003})`}}><Img src={staticFile('pleural-demo/basal.png')} style={{width:'100%',height:'100%',objectFit:'cover'}}/></AbsoluteFill>
  <AbsoluteFill style={{background:'linear-gradient(90deg,#04101ffb 0%,#04101fee 28%,#04101fa8 50%,#04101f35 100%)'}}/>
  <div style={{position:'absolute',left:105,top:86,fontSize:19,letterSpacing:4,color:'#a9dfea',fontWeight:700,opacity}}>SEMIOLOGÍA PRÁCTICA</div>
  <div style={{position:'absolute',left:105,top:250,fontSize:76,lineHeight:1.05,fontWeight:700,letterSpacing:-2,opacity}}>Semiología<br/>práctica</div>
  <div style={{position:'absolute',left:105,top:490,width:710,display:'grid',gap:18}}>{topics.map((topic,i)=><div key={topic.name} style={{color:'#d8eef2',fontSize:25,letterSpacing:.2,opacity:interpolate(time,[topic.start,topic.start+.3],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'})}}><span style={{color:['#80d9f4','#7be0b5','#ff92a0','#c2a3ff'][i],marginRight:15}}>•</span>{topic.name}</div>)}</div>
  <div style={{position:'absolute',right:70,bottom:50,fontSize:15,letterSpacing:1.5,color:'#d5e6eb'}}>ILUSTRACIÓN EDUCATIVA</div>
 </AbsoluteFill>;
};

export const Video: React.FC = () => {
 const frame=useCurrentFrame(), time=frame/30;
 let index=0;
 for (let i=1;i<timeline.length && timeline[i].start<=time;i++) index=i;
 const base=timeline[index];
 // Unresolved final words are retained in the transcript but are not invented in the audio.
 const words=timings.scenes[index].words.filter((w):w is typeof w & {start:number;end:number}=>w.start!==null && w.end!==null);
 const scene={...base,narrationText:base.start>=864?'Fin.':base.narrationText,words};
 const localFrame=frame-Math.round(scene.start*30);
 const visual=time<9.1 ? <Intro frame={frame}/> : /neumotórax/i.test(scene.section) ? <Pneumothorax scene={scene} frame={localFrame}/> : /motivo de consulta cardiovascular/i.test(scene.section) ? <Cardiovascular scene={scene} frame={localFrame}/> : /insuficiencia cardíaca/i.test(scene.section) ? <HeartFailure scene={scene} frame={localFrame}/> : <Pleural scene={scene} frame={localFrame}/>;
 return <AbsoluteFill style={{backgroundColor:'#07121f'}}>{visual}<Audio src={staticFile('narracao_es.flac')}/></AbsoluteFill>;
};
