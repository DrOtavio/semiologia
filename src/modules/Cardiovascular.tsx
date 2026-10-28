import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile} from 'remotion';

type Word = {text:string; start:number; end:number; source:string; confidence:number | null};
type Scene = {start:number; end:number; narrationText:string; visuals:string[]; words?:Word[]};
export type CardiovascularProps = {scene:Scene; frame:number};
type Display = {title:string; label:string; body:string; mode:'default'|'nyha'|'pain'|'study'; grade?:number};
const fade = (frame:number, begin:number, end:number) => interpolate(frame,[begin,end],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
const clean = (s:string) => s.replace(/\s+/g,' ').trim();
const nyha = ['Sin limitación habitual','Síntomas con esfuerzos moderados','Síntomas con esfuerzos leves','Síntomas en reposo'];
function classify(scene:Scene):Display {
 const t=clean(scene.narrationText), low=t.toLocaleLowerCase('es');
 const base = (title:string,label:string,mode:Display['mode']='default'):Display => ({title,label,body:t,mode});
 const g = low.match(/clase funcional\s+(uno|dos|tres|cuatro)/);
 if (g) return {...base('Capacidad funcional','CLASIFICACIÓN NYHA','nyha'), grade:['uno','dos','tres','cuatro'].indexOf(g[1])};
 if (/grados de capacidad funcional/.test(low)) return {...base('Capacidad funcional','CLASIFICACIÓN NYHA','nyha'),body:'Asociación del Corazón de Nueva York'};
 if (/ortopnea/.test(low)) return base('Ortopnea','TIPOS DE DISNEA');
 if (/platipnea/.test(low)) return base('Platipnea','TIPOS DE DISNEA');
 if (/trepopnea/.test(low)) return base('Trepopnea','TIPOS DE DISNEA');
 if (/disnea de esfuerzo/.test(low)) return base('Disnea de esfuerzo','TIPOS DE DISNEA');
 if (/disnea en reposo/.test(low)) return base('Disnea en reposo','TIPOS DE DISNEA');
 if (/disnea/.test(low)) return base('Disnea','MOTIVO DE CONSULTA');
 if (/muerte inminente|estimulación simpática|gasto cardíaco|alteraciones del ritmo/.test(low)) return base('Sensación de muerte','MANIFESTACIONES ASOCIADAS','pain');
 if (/retroesternal|zona de la corbata|opresivo|constrictivo|brazo izquierdo|cuello y la mandíbula|dolor isquémico|anginoso|desencadenantes habituales|nitroglicerina/.test(low)) return base('Dolor anginoso','CARACTERÍSTICAS','pain');
 if (/troponina|electrocardiograma|hemograma|ionograma|glucemia|perfil lipídico|ecocardiograma/.test(low)) return base('Estudios iniciales','EVALUACIÓN CARDIOVASCULAR','study');
 if (/anamnesis|intensidad, localización|tabla original|necrosis miocárdica/.test(low)) return base('Anamnesis','DOLOR TORÁCICO','pain');
 if (/angina|infarto|dolor torácico|isquémico|pericárdico|aórtico|atípico/.test(low)) return base('Dolor torácico','EVALUACIÓN CLÍNICA','pain');
 if (/motivo de consulta cardiovascular/i.test(t)) return {...base('Consulta cardiovascular','SEMIOLOGÍA CLÍNICA'),body:''};
 return base('Consulta cardiovascular','SEMIOLOGÍA CLÍNICA');
}

/** Scene-oriented 2.5D documentary composition. The anatomy is generated artwork and requires clinical review. */
export const Cardiovascular: React.FC<CardiovascularProps> = ({scene,frame}) => {
 const display=classify(scene);
 const appear=fade(frame,0,16);
 const absolute=scene.start+frame/30;
 const slow=interpolate(absolute,[455,641],[1.018,1.075],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 const isIrradiation=/irradiarse/i.test(scene.narrationText);
 const body = isIrradiation ? 'Irradiación del dolor' : /^(disnea|dolor torácico|tipos de disnea|anamnesis del dolor torácico)\.$/i.test(display.body) ? '' : display.body;
 const wordFrame = (word:string, fallback:number) => {const w=scene.words?.find(v=>v.text.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z]/g,'')===word); return w ? Math.max(0,(w.start-scene.start)*30) : fallback;};
 const arm = fade(frame,wordFrame('brazo',28),wordFrame('brazo',28)+12);
 const cubital = fade(frame,wordFrame('cubital',82),wordFrame('cubital',82)+12);
 const neck = fade(frame,wordFrame('cuello',141),wordFrame('cuello',141)+12);
 const jaw = fade(frame,wordFrame('mandibula',160),wordFrame('mandibula',160)+12);
 const isChest=/retroesternal|zona de la corbata/i.test(scene.narrationText);
 return <AbsoluteFill style={{background:'#071423',color:'#f7f9fc',fontFamily:'Inter, Helvetica Neue, Arial, sans-serif',overflow:'hidden'}}>
  <AbsoluteFill style={{transform:`scale(${slow}) translateX(-8px)`}}>
   <Img src={staticFile('modules/cardiovascular/torax.png')} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
  </AbsoluteFill>
  <AbsoluteFill style={{background:'linear-gradient(90deg,rgba(4,13,25,.98) 0%,rgba(5,16,29,.95) 23%,rgba(6,17,29,.80) 37%,rgba(5,13,25,.14) 66%),linear-gradient(0deg,rgba(4,13,25,.55),transparent 25%)'}}/>
  <div style={{position:'absolute',top:82,left:108,display:'flex',alignItems:'center',gap:15}}><span style={{width:40,height:2,background:'#ff8391'}}/><span style={{fontSize:19,letterSpacing:4,fontWeight:700,color:'#f2a8ae'}}>SEMIOLOGÍA PRÁCTICA</span></div>
  <div style={{position:'absolute',left:110,top:236,width:660,opacity:appear,transform:`translateY(${(1-appear)*14}px)`}}>
   <div style={{fontSize:18,letterSpacing:3.6,fontWeight:700,color:'#f19ba5',marginBottom:24}}>{display.label}</div>
   <div style={{fontSize:display.title.length>24?62:76,lineHeight:1.04,letterSpacing:-2.2,fontWeight:700}}>{display.title}</div>
   <div style={{width:72,height:3,background:'#ed7d8d',marginTop:30,marginBottom:30}}/>
   {body && <div style={{fontSize:body.length>135?27:31,lineHeight:1.42,color:'#dbe5eb',fontWeight:400,whiteSpace:'pre-wrap'}}>{body===clean(scene.narrationText) && scene.words?.length ? body.split(/(\s+)/).map((piece,i)=>{if(/^\s+$/.test(piece)) return piece; const k=Math.floor(i/2);const w=scene.words?.[k];const start=w ? Math.max(0,(w.start-scene.start)*30) : 0;return <span key={i} style={{opacity:fade(frame,start,start+5)}}>{piece}</span>;}) : body}</div>}
  </div>
  {display.mode==='nyha' && <div style={{position:'absolute',left:110,bottom:84,width:675,display:'flex',gap:10,opacity:appear}}>{nyha.map((label,i)=><div key={label} style={{flex:1,borderTop:`3px solid ${i===display.grade?'#ff98a0':'#ffffff38'}`,padding:'15px 8px',background:i===display.grade?'#a2394a65':'#0e203099',minHeight:110}}><div style={{fontSize:28,fontWeight:700,color:i===display.grade?'#ffb4ba':'#aebdc8'}}>{['I','II','III','IV'][i]}</div>{i===display.grade && <div style={{fontSize:15,lineHeight:1.25,marginTop:8,color:'#f7e8e9',opacity:fade(frame,wordFrame(i===0?'sin':'sintomas',8),wordFrame(i===0?'sin':'sintomas',8)+8)}}>{label}</div>}</div>)}</div>}
  {(isChest||isIrradiation) && <div style={{position:'absolute',right:345,top:367,width:190,height:190,borderRadius:'50%',background:'radial-gradient(circle,rgba(255,90,90,.43),rgba(250,70,80,.13) 35%,transparent 72%)',opacity:fade(frame,0,20),transform:`scale(${1+0.06*Math.sin(absolute*3)})`}}/>}
  {isIrradiation && <>
    <svg viewBox="0 0 1920 1080" style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none'}} aria-label="Zonas de irradiación del dolor">
     <path d="M1445 422 C1580 399 1692 430 1768 572" fill="none" stroke="#ffaca6" strokeWidth="4" strokeDasharray="10 12" opacity={arm} />
     <path d="M1445 422 C1383 342 1388 242 1420 172" fill="none" stroke="#ffaca6" strokeWidth="4" strokeDasharray="10 12" opacity={neck} />
     <path d="M1420 172 C1446 139 1470 120 1500 100" fill="none" stroke="#ffaca6" strokeWidth="4" strokeDasharray="10 12" opacity={jaw} />
    </svg>
    <div style={{position:'absolute',right:80,bottom:132,fontSize:20,color:'#ffd0cc',display:'flex',gap:16}}>
     <span style={{opacity:arm}}>Brazo izquierdo <span style={{opacity:cubital}}>· región cubital</span></span><span style={{opacity:neck}}>Cuello</span><span style={{opacity:jaw}}>Mandíbula</span>
    </div>
   </>}
  <div style={{position:'absolute',right:68,bottom:50,fontSize:14,letterSpacing:1.3,color:'#ccdae2',opacity:.8}}>ILUSTRACIÓN EDUCATIVA</div>
 </AbsoluteFill>;
};
