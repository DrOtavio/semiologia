import React from 'react';
import {AbsoluteFill, Audio, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';

/** A 12.4-second educational, 2.5D illustration synchronized to 12.4–24.8s of the source FLAC. */
export const PleuralDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const ease = (a:number,b:number) => interpolate(frame,[a,b],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  const title = ease(8,28);
  const fluid = ease(87,165);
  const fluidTop = 73 - 40 * fluid;
  const fluidMask = `linear-gradient(to bottom, transparent ${fluidTop - 3}%, black ${fluidTop + 3}%)`;
  const space = ease(112,132);
  const effects = ease(174,198);
  const scale = interpolate(frame,[0,371],[1.015,1.075],{extrapolateRight:'clamp'});
  const x = interpolate(frame,[0,371],[0,-24],{extrapolateRight:'clamp'});
  const y = interpolate(frame,[0,371],[0,8],{extrapolateRight:'clamp'});
  return <AbsoluteFill style={{background:'#071424',fontFamily:'Inter, Helvetica Neue, Arial, sans-serif',color:'#f4f8fb',overflow:'hidden'}}>
    <AbsoluteFill style={{transform:`translate(${x}px, ${y}px) scale(${scale})`}}>
      <Img src={staticFile('pleural-demo/basal.png')} style={{width:'100%',height:'100%',objectFit:'cover'}} />
      {/* Mask confines the transition to the affected hemithorax; the artwork itself supplies anatomy. */}
      <Img src={staticFile('pleural-demo/derrame.png')} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',opacity:ease(87,100),clipPath:'polygon(39% 33%, 66% 32%, 67% 73%, 58% 80%, 39% 78%)',maskImage:fluidMask,WebkitMaskImage:fluidMask}} />
    </AbsoluteFill>
    <AbsoluteFill style={{background:'linear-gradient(90deg,rgba(3,13,25,.97) 0%,rgba(3,13,25,.91) 22%,rgba(3,13,25,.48) 38%,rgba(3,13,25,0) 60%), linear-gradient(0deg,rgba(3,13,25,.45),transparent 24%)'}}/>
    <div style={{position:'absolute',top:83,left:110,opacity:title,display:'flex',alignItems:'center',gap:16}}>
      <div style={{height:2,width:42,background:'#6fd6e8'}}/><span style={{fontSize:20,letterSpacing:4.5,fontWeight:650,color:'#a9dfea'}}>SEMIOLOGÍA PRÁCTICA</span>
    </div>
    <div style={{position:'absolute',top:253,left:110,width:570,opacity:title,transform:`translateY(${(1-title)*16}px)`}}>
      <div style={{fontSize:18,letterSpacing:4,fontWeight:700,color:'#81d5e6',marginBottom:24}}>DEFINICIÓN</div>
      <div style={{fontSize:78,lineHeight:1.04,letterSpacing:-2.5,fontWeight:650}}>Derrame<br/>pleural</div>
      <div style={{height:3,width:76,background:'#6fd6e8',marginTop:32,marginBottom:29}}/>
      <div style={{fontSize:31,lineHeight:1.35,color:'#d4e6ed',opacity:ease(58,84)}}>Acumulación anormal<br/>de líquido</div>
    </div>
    <div style={{position:'absolute',left:110,bottom:185,opacity:space,transform:`translateY(${(1-space)*10}px)`}}>
      <div style={{display:'flex',alignItems:'center',gap:14}}><div style={{width:7,height:7,borderRadius:'50%',background:'#8fe6f2',boxShadow:'0 0 14px #65d7ea'}}/><span style={{fontSize:18,letterSpacing:2.5,fontWeight:700,color:'#99dfe9'}}>ENTRE LAS PLEURAS</span></div>
      <div style={{fontSize:25,marginTop:12,color:'#dcebf0'}}>Espacio pleural</div>
    </div>
    <div style={{position:'absolute',left:110,bottom:105,opacity:effects,color:'#a6c0cc',fontSize:19,letterSpacing:.3}}>Producción · absorción · presiones</div>
    <div style={{position:'absolute',right:65,bottom:52,color:'#d5e6eb',fontSize:15,letterSpacing:1.5,opacity:.8}}>ILUSTRACIÓN EDUCATIVA</div>
    <Audio src={staticFile('narracao_es.flac')} startFrom={372}/>
  </AbsoluteFill>;
};
