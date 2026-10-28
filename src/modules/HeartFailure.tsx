import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile} from 'remotion';
import words from '../data/asr-words.json';

type Word = {text: string; start: number; end: number; source: string; confidence: number | null};
type Scene = {start: number; end: number; narrationText: string; visuals: string[]; section: string; words?: Word[]};
type Entry = {label: string; word: string; note?: string};
type Editorial = {title: string; subtitle?: string; entries?: Entry[]; mode?: 'godet' | 'framingham' | 'echo' | 'bnp' | 'mechanism' | 'jugular';};
const E = (label: string, word: string, note?: string): Entry => ({label, word, note});

// Text is grounded in the narrated script. Each list item enters at the detected
// time of its spoken anchor when present; an unmatched ASR anchor appears at cue start.
function editorial(start: number): Editorial {
 if (start < 656.8) return {title:'Insuficiencia cardíaca', subtitle:'Alteración del llenado o de la eyección ventricular'};
 if (start < 657.6) return {title:'Mecanismos', subtitle:'Función ventricular', mode:'mechanism'};
 if (start < 666.1) return {title:'Disfunción sistólica',subtitle:'Alteración de la contractilidad',mode:'mechanism'};
 if (start < 670.16) return {title:'Disfunción diastólica',subtitle:'Alteración del llenado ventricular',mode:'mechanism'};
 if (start < 677.18) return {title:'Mecanismos',mode:'mechanism',entries:[E('Sobrecarga de volumen o presión','sobrecarga'),E('Pérdida de miocardio','pérdida'),E('Restricción del llenado','restricción')]};
 if (start < 683.22) return {title:'Signos cardinales',entries:[E('Disnea','disnea'),E('Fatiga','fatiga'),E('Edema','edema'),E('Estertores pulmonares','estertores')]};
 if (start < 685.44) return {title:'Etiología',subtitle:'Causas cardíacas'};
 if (start < 693.67) return {title:'Etiología',entries:[E('Enfermedad coronaria','coronaria'),E('Hipertensión arterial','hipertensión'),E('Cardiomiopatía dilatada','cardiomiopatía'),E('Valvulopatías','valvulopatías')]};
 if (start < 699.17) return {title:'Otras causas',entries:[E('Miocarditis','miocarditis'),E('Cardiopatías congénitas','congénitas'),E('Arritmias','arritmias')]};
 if (start < 701.05) return {title:'Factores desencadenantes'};
 if (start < 711.37) return {title:'Desencadenantes',entries:[E('Inotrópicos negativos','inotrópico'),E('Estrés emocional','estrés'),E('Alcohol','alcohol'),E('Excesos físicos o alimentarios','excesos'),E('Abandono del tratamiento','abandono'),E('Reducción de medicación','reducción')]};
 if (start < 712.63) return {title:'Factores agravantes'};
 if (start < 720.63) return {title:'Factores agravantes',entries:[E('Hipertensión arterial','hipertensión'),E('Síndrome coronario agudo','síndrome'),E('Tromboembolismo pulmonar','tromboembolismo'),E('Arritmias','arritmias'),E('Valvulopatías','valvulopatías')]};
 if (start < 727.91) return {title:'Factores agravantes',entries:[E('Anemia','anemia'),E('Insuficiencia renal','renal'),E('Diabetes','diabetes'),E('Embarazo','embarazo'),E('Obesidad','obesidad'),E('EPOC','obstructiva'),E('Infecciones','infecciones')]};
 if (start < 735.83) return {title:'Factores agravantes',entries:[E('Infarto previo','infarto'),E('Hipertrofia ventricular izquierda','hipertrofia'),E('Tabaquismo','tabaquismo'),E('Edad avanzada','edad')]};
 if (start < 737.71) return {title:'Reflujo hepatoyugular',subtitle:'Exploración clínica',mode:'jugular'};
 if (start < 745.81) return {title:'Reflujo hepatoyugular',subtitle:'Presión firme en hemiabdomen superior derecho · al menos 10 s',mode:'jugular'};
 if (start < 752.47) return {title:'Respuesta positiva',subtitle:'Aumento sostenido de la presión venosa yugular',entries:[E('Más de 3 cm','tres')],mode:'jugular'};
 if (start < 756.81) return {title:'Reflujo hepatoyugular',subtitle:'Sobrecarga de volumen y disfunción del ventrículo derecho',mode:'jugular'};
 if (start < 757.67) return {title:'Marcadores cardíacos',subtitle:'BNP · NT-proBNP',mode:'bnp'};
 if (start < 766.87) return {title:'BNP · NT-proBNP',subtitle:'Péptido natriurético de tipo B y fragmento amino terminal',mode:'bnp'};
 if (start < 772.01) return {title:'BNP · NT-proBNP',subtitle:'Aumentan ante la distensión de las paredes cardíacas',mode:'bnp'};
 if (start < 780.45) return {title:'BNP · NT-proBNP',subtitle:'Diagnóstico y pronóstico · valores elevados apoyan la sospecha clínica',mode:'bnp'};
 if (start < 789.97) return {title:'Ecocardiograma',subtitle:'Función sistólica y diastólica · fracción de eyección · estructura y válvulas',mode:'echo'};
 if (start < 791.13) return {title:'Criterios de Framingham',subtitle:'Diagnóstico clínico',mode:'framingham'};
 if (start < 798.99) return {title:'Criterios de Framingham',subtitle:'Dos mayores, o un mayor y dos menores',mode:'framingham'};
 if (start < 812.77) return {title:'Criterios mayores',mode:'framingham',entries:[E('Disnea paroxística nocturna','paroxística'),E('Ingurgitación yugular','ingurgitación'),E('Estertores pulmonares','estertores'),E('Cardiomegalia','cardiomegalia'),E('Edema agudo de pulmón','edema'),E('Galope por tercer ruido','galope'),E('Reflujo hepatoyugular','hepatoyugular')]};
 if (start < 820.17) return {title:'Criterios mayores',subtitle:'Pérdida de peso superior a 4,5 kg con tratamiento',mode:'framingham'};
 if (start < 830.79) return {title:'Criterios menores',mode:'framingham',entries:[E('Edema de miembros inferiores','edema'),E('Tos nocturna','tos'),E('Disnea de esfuerzo','disnea'),E('Hepatomegalia','hepatomegalia'),E('Derrame pleural','derrame'),E('Taquicardia','taquicardia')]};
 if (start < 864.13) return {title:'Edema con fóvea',subtitle:'Clasificación de Godet',mode:'godet'};
 return {title:'Semiología práctica',subtitle:'Fin'};
}
const normalize = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,'');
function anchorFrame(scene: Scene, word: string): number | null {
 const key=normalize(word);
 const aligned=scene.words?.find(w => normalize(w.text).includes(key));
 const candidate=words.find(w=>w.start>=scene.start-.08 && w.start<scene.end && normalize(w.word).includes(key));
 const start=aligned?.start ?? candidate?.start;
 return start !== undefined ? Math.max(0,Math.round((start-scene.start)*30)) : null;
}
const fade = (frame: number, a: number,b: number) => interpolate(frame,[a,b],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
const godet = [
 {label:'I', depth:'< 2 mm', time:'Desaparece rápido'},
 {label:'II', depth:'2–4 mm', time:'≈ 15 segundos'},
 {label:'III',depth:'4–6 mm',time:'15–30 segundos'},
 {label:'IV',depth:'> 6 mm',time:'> 30 segundos'},
];

export const HeartFailure: React.FC<{scene: Scene; frame: number}> = ({scene,frame}) => {
 const e=editorial(scene.start), p=fade(frame,0,15);
 const index=/grado uno/i.test(scene.narrationText)?0:/grado dos/i.test(scene.narrationText)?1:/grado tres/i.test(scene.narrationText)?2:/grado cuatro/i.test(scene.narrationText)?3:-1;
 const showOverview=scene.start>=857.55 && scene.start<864.13;
 const depthAt=anchorFrame(scene,'milímetros');
 const recoveryAt=anchorFrame(scene,index===0?'rápidamente':'segundos');
 const scale=interpolate(frame,[0,Math.max(1,Math.round((scene.end-scene.start)*30))],[1.015,1.055],{extrapolateRight:'clamp'});
 const illustration=e.mode==='godet'?'modules/heart-failure/edema.png':e.mode==='jugular'?'modules/heart-failure/jugular.png':e.mode==='echo'?'modules/heart-failure/echo.png':'modules/heart-failure/heart.png';
 return <AbsoluteFill style={{background:'#080e1e',color:'#f5f4fb',fontFamily:'Inter, Arial, sans-serif',overflow:'hidden'}}>
   <AbsoluteFill style={{transform:`scale(${scale})`}}><Img src={staticFile(illustration)} style={{width:'100%',height:'100%',objectFit:'cover'}}/></AbsoluteFill>
   <AbsoluteFill style={{background:'linear-gradient(90deg,rgba(6,11,28,.98) 0%,rgba(8,12,30,.94) 26%,rgba(11,14,34,.72) 42%,rgba(12,14,30,.12) 72%),linear-gradient(0deg,rgba(8,10,25,.35),transparent 35%)'}}/>
   <div style={{position:'absolute',top:78,left:104,right:104,display:'flex',gap:16,alignItems:'center',opacity:p}}><div style={{height:2,width:43,background:'#c0a6f4'}}/><span style={{color:'#d6c9f5',letterSpacing:4,fontWeight:650,fontSize:19}}>INSUFICIENCIA CARDÍACA</span></div>
   <div style={{position:'absolute',top:200,left:110,width:750,opacity:p,transform:`translateY(${(1-p)*18}px)`}}>
     <div style={{fontSize:18,letterSpacing:4,fontWeight:700,color:'#bca6eb',marginBottom:22}}>SEMIOLOGÍA PRÁCTICA</div>
     <div style={{fontSize:e.title.length>28?57:72,fontWeight:650,lineHeight:1.05,letterSpacing:-2.1,maxWidth:750}}>{e.title}</div>
     <div style={{width:76,height:3,background:'#c0a6f4',marginTop:30,marginBottom:27}}/>
     {e.subtitle && <div style={{fontSize:30,lineHeight:1.38,color:'#dee3f0',maxWidth:690,opacity:fade(frame,10,24)}}>{e.subtitle}</div>}
     {e.entries && <div style={{marginTop:30,display:'grid',gridTemplateColumns:e.entries.length>4?'repeat(2,minmax(0,1fr))':'1fr',gap:'12px 22px',maxWidth:725}}>{e.entries.map((entry,i)=>{const a=anchorFrame(scene,entry.word);const visible=a===null?0:fade(frame,a,a+9);return <div key={i} style={{opacity:visible,transform:`translateY(${(1-visible)*8}px)`,display:'flex',alignItems:'center',gap:12,minHeight:36}}><div style={{width:6,height:6,flexShrink:0,borderRadius:'50%',background:'#ccb7fb'}}/><div style={{fontSize:e.entries!.length>5?23:26,lineHeight:1.18,color:'#f4f2fa'}}>{entry.label}</div></div>})}</div>}
     {e.mode==='godet' && <div style={{display:'grid',gridTemplateColumns:'repeat(2, 1fr)',gap:12,marginTop:35,maxWidth:660}}>{godet.map((g,i)=><div key={g.label} style={{padding:'14px 18px',borderRadius:10,background:index===i?'rgba(186,155,247,.27)':'rgba(255,255,255,.05)',border:`1px solid ${index===i?'#d7c5ff':'rgba(255,255,255,.14)'}`,opacity:index<0?.82:index===i?1:.42}}><div style={{color:'#dfd0fc',fontSize:17,letterSpacing:2,fontWeight:700}}>GRADO {g.label}</div>{(index===i || showOverview) && <><div style={{fontSize:24,fontWeight:650,marginTop:7,opacity:showOverview?1:depthAt===null?0:fade(frame,depthAt,depthAt+9)}}>{g.depth}</div><div style={{fontSize:17,color:'#d3d6e4',marginTop:5,opacity:showOverview?1:recoveryAt===null?0:fade(frame,recoveryAt,recoveryAt+9)}}>{g.time}</div></>}</div>)}</div>}
   </div>
   <div style={{position:'absolute',right:70,bottom:54,fontSize:14,letterSpacing:1.5,color:'#d0d4e4',opacity:.8}}>ILUSTRACIÓN EDUCATIVA</div>
 </AbsoluteFill>;
};
