import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile} from 'remotion';
import timings from '../data/word-timings.json';

type TimelineScene = {start:number; end:number; narrationText:string; visuals?:string[]};
type Props = {scene:TimelineScene; frame:number};
const clamp = (x:number)=>Math.max(0,Math.min(1,x));
const fade = (frame:number,a=0,b=14)=>interpolate(frame,[a,b],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
const color='#83ddea';
// ASR word markers are approximate and remain subject to listening review.
function spoken(sceneStart:number, word:RegExp, fallback:number=sceneStart):number {
 const segment=timings.scenes.find(s=>Math.abs(s.start-sceneStart)<0.01);
 return segment?.words.find(w=>word.test(w.text))?.start ?? fallback;
}
const asRows=[
 {t:spoken(34.86,/insuficiencia/i), type:'TRASUDADO', label:'Insuficiencia cardíaca'},
 {t:spoken(39.82,/cirrosis/i), type:'TRASUDADO', label:'Cirrosis hepática'},
 {t:spoken(41.08,/síndrome/i), type:'TRASUDADO', label:'Síndrome nefrótico'},
 {t:spoken(42.44,/hipoalbuminemia/i), type:'TRASUDADO', label:'Hipoalbuminemia'},
 {t:spoken(43.56,/diálisis/i), type:'TRASUDADO', label:'Diálisis peritoneal'},
 {t:spoken(45.02,/obstrucción/i), type:'TRASUDADO', label:'Obstrucción de vena cava superior'},
 {t:spoken(47.26,/neumonía/i), type:'EXUDADO', label:'Neumonía · empiema'},
 {t:spoken(52.06,/tuberculosis/i), type:'EXUDADO', label:'Tuberculosis'},
 {t:spoken(53.26,/neoplasias/i), type:'EXUDADO', label:'Neoplasias · linfomas'},
 {t:spoken(56.2,/embolia/i), type:'EXUDADO', label:'Embolia pulmonar'},
 {t:spoken(57.2,/enfermedades/i), type:'EXUDADO', label:'Enfermedades autoinmunes'},
 {t:spoken(63.04,/pancreatitis/i), type:'EXUDADO', label:'Pancreatitis'},
 {t:spoken(64.24,/posquirúrgicas/i), type:'EXUDADO', label:'Cirugía · traumatismo'},
 {t:spoken(66.2,/fármacos/i), type:'EXUDADO', label:'Fármacos'},
];
const compareRows=[
 {t:spoken(72.14,/inicio/i), leftAt:spoken(72.14,/progresivo/i), rightAt:spoken(72.14,/aguda/i), label:'Inicio', left:'Progresivo',right:'Agudo'},
 {t:spoken(78.84,/fiebre/i), leftAt:spoken(78.84,/rara/i), rightAt:spoken(78.84,/frecuente/i), label:'Fiebre', left:'Rara',right:'Frecuente'},
 {t:spoken(85.26,/tos/i), leftAt:spoken(85.26,/seca/i), rightAt:spoken(85.26,/productiva/i), label:'Tos',left:'Seca',right:'Productiva'},
 {t:spoken(90.1,/dolor/i), leftAt:spoken(90.1,/pleurítico/i), rightAt:spoken(90.1,/frecuente/i), label:'Dolor',left:'Pleurítico',right:'Frecuente'},
 {t:spoken(97.42,/auscultación/i), leftAt:spoken(97.42,/abolición/i), rightAt:spoken(97.42,/crepitantes/i), label:'Auscultación',left:'Murmullo abolido',right:'Crepitantes'},
 {t:spoken(106.28,/percusión/i), leftAt:spoken(106.28,/matidez/i), rightAt:spoken(106.28,/matidez/i), label:'Percusión',left:'Matidez',right:'Matidez'},
 {t:spoken(108.6,/vibraciones/i), leftAt:spoken(108.6,/disminuidas/i), rightAt:spoken(108.6,/aumentadas/i), label:'Vibraciones vocales',left:'Disminuidas',right:'Aumentadas'},
 {t:spoken(115.22,/radiografía/i), leftAt:spoken(115.22,/menisco/i), rightAt:spoken(115.22,/condensación/i), label:'Radiografía',left:'Menisco',right:'Condensación'},
 {t:spoken(122.84,/tratamiento/i), leftAt:spoken(122.84,/causa/i), rightAt:spoken(122.84,/antibióticos/i), label:'Tratamiento',left:'Según causa',right:'Antibióticos*'},
];
const card:React.CSSProperties={border:'1px solid rgba(160,218,237,.20)',background:'linear-gradient(125deg, rgba(12,36,54,.93),rgba(5,18,32,.84))',borderRadius:18,boxShadow:'0 16px 55px rgba(0,0,0,.25)'};
const small:React.CSSProperties={fontSize:17,letterSpacing:3,color:'#88dbe7',fontWeight:700};
function Head({eyebrow,title,subtitle}:{eyebrow:string;title:string;subtitle?:string}) {return <div style={{position:'absolute',left:100,top:174,width:610}}><div style={small}>{eyebrow.toLocaleUpperCase('es')}</div><div style={{fontSize:title.length>31?55:72,lineHeight:1.04,letterSpacing:-1.7,fontWeight:680,marginTop:24,color:'#f5f9fb'}}>{title}</div>{subtitle&&<div style={{fontSize:27,lineHeight:1.3,color:'#d4e4ea',marginTop:28,maxWidth:570}}>{subtitle}</div>}</div>}
function Background({time,frame}:{time:number;frame:number}){
 const expansion=clamp((time-15.45)/2.6);
 const top=73-expansion*40;
 const mask=`linear-gradient(to bottom, transparent ${top-3}%, black ${top+3}%)`;
 // The anatomy is an original generated illustration, not a clinical image.
 const baseScale=1.015+Math.min(time,252)*.00008;
 const radiograph=time>=130.02 && time<147.06;
 const signorelli=time>=163.94 && time<174.1;
 const baseImage=radiograph?'modules/pleural/radiografia.png':signorelli?'modules/pleural/signorelli.png':'pleural-demo/basal.png';
 return <><AbsoluteFill style={{transform:`scale(${baseScale}) translateX(${Math.sin(time*.12)*-10}px)`}}><Img src={staticFile(baseImage)} style={{width:'100%',height:'100%',objectFit:'cover'}}/>{!radiograph && !signorelli && <Img src={staticFile('pleural-demo/derrame.png')} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',opacity:expansion,clipPath:'polygon(39% 33%, 66% 32%, 67% 73%, 58% 80%, 39% 78%)',maskImage:mask,WebkitMaskImage:mask}}/>}</AbsoluteFill><AbsoluteFill style={{background:'linear-gradient(90deg,rgba(3,13,25,.98),rgba(3,13,25,.95) 25%,rgba(3,13,25,.54) 47%,rgba(3,13,25,.14) 100%),linear-gradient(0deg,rgba(3,13,25,.7),transparent 24%)'}}/><div style={{position:'absolute',left:100,right:90,top:64,display:'flex',alignItems:'center',gap:14,color:'#a9dfea',fontSize:17,fontWeight:700,letterSpacing:3.5}}><div style={{width:40,height:2,background:color}}/>SEMIOLOGÍA PRÁCTICA<span style={{flex:1}}/><span style={{opacity:.7,fontSize:14}}>DERRAME PLEURAL</span></div><div style={{position:'absolute',right:68,bottom:48,color:'#d9eaf2',fontSize:19,letterSpacing:1.5,opacity:1,background:'rgba(3,13,25,.86)',padding:'10px 14px',borderRadius:6}}>{radiograph?'ESQUEMA RADIOGRÁFICO ILUSTRATIVO':'ILUSTRACIÓN EDUCATIVA'}</div></>
}
function Compare({time}:{time:number}){const active=compareRows.reduce((last,r,i)=>time>=r.t?i:last,-1);return <div style={{...card,position:'absolute',right:65,top:155,width:1120,padding:'35px 38px'}}><div style={{display:'grid',gridTemplateColumns:'260px 1fr 1fr',gap:15,alignItems:'center',paddingBottom:22}}><span style={small}>HALLAZGO</span><span style={{...small,textAlign:'center'}}>DERRAME PLEURAL</span><span style={{...small,textAlign:'center',color:'#e2b9a6'}}>NEUMONÍA</span></div>{compareRows.slice(0,Math.max(0,active+1)).map((r,i)=><div key={r.label} style={{display:'grid',gridTemplateColumns:'260px 1fr 1fr',gap:15,alignItems:'center',padding:'10px 0',borderTop:'1px solid #ffffff17',opacity:i===active?1:.48}}><div style={{fontSize:20,fontWeight:650,color:i===active?color:'#e3edf1'}}>{r.label}</div><div style={{fontSize:22,fontWeight:600,textAlign:'center',opacity:time>=r.leftAt?1:0}}>{r.left}</div><div style={{fontSize:22,fontWeight:600,textAlign:'center',opacity:time>=r.rightAt?1:0}}>{r.right}</div></div>)}{active===8&&<div style={{fontSize:15,color:'#bed1d9',marginTop:13}}>* En neumonía bacteriana, según el esquema narrado.</div>}</div>}
function Etiology({time}:{time:number}){const type=time>=spoken(47.26,/exudado/i)?'EXUDADO':'TRASUDADO';const entries=asRows.filter(r=>r.type===type && time>=r.t);const columns=['TRASUDADO','EXUDADO'];return <div style={{...card,position:'absolute',right:95,top:183,width:1000,minHeight:530,padding:36}}><div style={{display:'flex',gap:12,marginBottom:35}}>{columns.map(c=><div key={c} style={{flex:1,textAlign:'center',borderRadius:10,padding:18,letterSpacing:2,fontSize:21,fontWeight:700,background:type===c?'rgba(91,199,221,.24)':'rgba(255,255,255,.04)',color:type===c?'#a6f0f3':'#a9c1cc'}}>{c}</div>)}</div><div style={{fontSize:19,letterSpacing:2,color:'#a6c3d1',marginBottom:20}}>CAUSAS MENCIONADAS</div>{entries.length===0?<div style={{fontSize:32,color:'#dceef3'}}>Clasificación del líquido pleural</div>:entries.map((r,i)=><div key={r.label} style={{display:'flex',gap:16,alignItems:'center',fontSize:25,fontWeight:i===entries.length-1?700:450,opacity:i===entries.length-1?1:.55,margin:'16px 0'}}><div style={{width:5,height:5,borderRadius:'50%',background:color}}/>{r.label}</div>)}</div>}
function Light({time}:{time:number}){const rows=[{t:spoken(198.66,/proteínas/i), reveal:spoken(198.66,/cinco/i), label:'Proteínas pleurales / séricas',v:'> 0,5'},{t:spoken(204.46,/lactato/i),reveal:spoken(204.46,/seis/i),label:'LDH pleural / sérica',v:'> 0,6'},{t:spoken(212.06,/lactato/i),reveal:spoken(212.06,/tercios/i),label:'LDH pleural / límite sérico normal',v:'> ⅔'}];const active=rows.reduce((a,r,i)=>time>=r.t?i:a,-1);return <div style={{...card,position:'absolute',right:90,top:210,width:1040,padding:40}}><div style={{...small,marginBottom:28}}>EXUDADO · AL MENOS UN CRITERIO</div>{rows.map((r,i)=><div key={r.label} style={{padding:'25px 24px',marginTop:12,borderRadius:10,border:`1px solid ${i===active?'#83ddea99':'#ffffff15'}`,background:i===active?'#79d7e41c':'#ffffff08',display:'flex',alignItems:'center',opacity:i>active?.36:1}}><span style={{fontSize:25,flex:1}}>{r.label}</span><span style={{fontSize:37,fontWeight:700,color:i===active?color:'#e4edf2',opacity:time>=r.reveal?1:0}}>{r.v}</span></div>)}</div>}
function TimedList({time,entries}:{time:number;entries:[number,string][]}){const shown=entries.filter(e=>time>=e[0]);return <div style={{...card,position:'absolute',left:100,top:500,width:570,padding:'24px 30px'}}>{shown.map(([t,label],i)=><div key={label} style={{display:'flex',gap:13,alignItems:'center',margin:'11px 0',fontSize:23,lineHeight:1.2,opacity:i===shown.length-1?1:.58,color:i===shown.length-1?'#a8f0f6':'#e4eff3'}}><span style={{width:5,height:5,borderRadius:'50%',background:color}}/>{label}</div>)}</div>}
function topic(s:TimelineScene){let t=s.start, txt=s.narrationText;
 if(t<9.1)return {k:'SEMIología práctica',title:'Semiología práctica',sub:'Exploración clínica · diagnóstico'};
 if(t<30.56)return {k:'Definición',title:'Derrame pleural',sub:'Acumulación anormal de líquido en el espacio pleural'};
 if(t<69.04)return {k:'Etiología',title:'Trasudado y exudado',sub:'Causas del líquido pleural'};
 if(t<130.02)return {k:'Diagnóstico diferencial',title:'Derrame y neumonía',sub:'Comparación clínica'};
 if(t<147.06)return {k:'Radiografía',title:'Hallazgos pleurales',sub: t>=142.2?'En decúbito: velamiento difuso':undefined};
 if(t<163.94)return {k:'Exploración',title:'Signos y síntomas',sub:undefined};
 if(t<174.1)return {k:'Exploración física',title:'Signo de Signorelli',sub:'Matidez paravertebral en el lado del derrame'};
 if(t<191.1)return {k:'Procedimiento',title:'Toracocentesis',sub:t>=186.14?'Sospecha de infección, sangre o neoplasia':t>=181.28?'Indicación terapéutica':'Indicación diagnóstica'};
 if(t<221.08)return {k:'Clasificación',title:'Criterios de Light',sub:'Al menos un criterio positivo define exudado'};
 if(t<231.46)return {k:'Asociación clínica',title:'Neoplasia pulmonar',sub:'Adenocarcinoma y derrame pleural maligno'};
 return {k:'Decisión clínica',title:'Trasudado típico',sub:'Causa sistémica evidente · tratar la enfermedad de base'};
}
export const Pleural:React.FC<Props>=({scene,frame})=>{const time=scene.start+frame/30;const q=topic(scene);const showList=time>=30.56&&time<69.04;const showComparison=time>=69.04&&time<130.02;const showLight=time>=191.1&&time<221.08;const showFindings=scene.start===132.4;const showSymptoms=scene.start===149.84;const simpleDetail=!(showList||showComparison||showLight||showFindings||showSymptoms||time<30.56);const sub=scene.start===12.86 && time<spoken(12.86,/acumulación/i) ? undefined:q.sub;return <AbsoluteFill style={{backgroundColor:'#061523',fontFamily:'Inter, Helvetica Neue, Arial, sans-serif',color:'#edf8fb',overflow:'hidden'}}><Background time={time} frame={frame}/><div style={{opacity:fade(frame)}}><Head eyebrow={q.k} title={q.title} subtitle={sub}/ >{showList&&<Etiology time={time}/ >}{showComparison&&<Compare time={time}/ >}{showLight&&<Light time={time}/ >}{showFindings&&<TimedList time={time} entries={[[spoken(132.4,/opacidad/i),'Opacidad homogénea'],[spoken(132.4,/menisco/i),'Signo del menisco'],[spoken(132.4,/borramiento/i),'Borramiento del seno costofrénico'],[spoken(132.4,/desplazamiento/i),'Desplazamiento mediastínico']]} />}{showSymptoms&&<TimedList time={time} entries={[[spoken(149.84,/Disnea/i),'Disnea progresiva'],[spoken(149.84,/dolor/i),'Dolor pleurítico'],[spoken(149.84,/tos/i),'Tos seca'],[spoken(149.84,/opresión/i),'Opresión'],[spoken(149.84,/fiebre/i),'Fiebre'],[spoken(149.84,/murmullo/i),'Murmullo abolido'],[spoken(149.84,/matidez/i),'Matidez'],[spoken(149.84,/vibraciones/i),'Vibraciones disminuidas']]} />}{simpleDetail&&<div style={{...card,position:'absolute',left:100,top:525,width:580,padding:'24px 28px',fontSize:23,lineHeight:1.38,color:'#d7e9ef'}}>{scene.narrationText}</div>}</div></AbsoluteFill>};
