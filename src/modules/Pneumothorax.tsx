import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile} from 'remotion';

type Word = {text:string; start:number; end:number; source:string};
type Cue = {start:number; end:number; narrationText:string; visuals?:string[]; words?:Word[]};
type Props = {scene:Cue; frame:number};
const clamp = (x:number) => Math.max(0,Math.min(1,x));
const fade=(f:number,a=0,b=14)=>interpolate(f,[a,b],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
const has=(s:string,r:RegExp)=>r.test(s);

type Detail={title:string; eyebrow:string; lines:string[]; mode:'anatomy'|'xray'|'compare'|'symptoms'|'classification'|'tension';};
function detail(text:string, context:string):Detail {
 const s=(text+' '+context).toLowerCase();
 if(has(s,/diferencias entre neumotórax y derrame pleural/)) {
  let lines=['Aire en la pleura','Líquido en la pleura'];
  if(has(text,/percusión/i))lines=['Hipersonoridad','Matidez'];
  else if(has(text,/auscultación|murmullo/i))lines=['Murmullo disminuido o abolido','Murmullo abolido'];
  else if(has(text,/vibraciones/i))lines=['Vibraciones disminuidas','Vibraciones disminuidas'];
  else if(has(text,/radiografía/i))lines=['Línea pleural · hiperlucidez','Opacidad · menisco'];
  else if(has(text,/causa/i))lines=['Ruptura alveolar','Insuficiencia cardíaca · neoplasia · infección'];
  else if(has(text,/tratamiento/i))lines=['Drenaje torácico','Según la causa'];
  return {title:'Aire y líquido',eyebrow:'COMPARACIÓN CLÍNICA',lines,mode:'compare'};
 }
 // Radiographic context must take priority over a later mention of tension.
 // Otherwise the scene switches to tension before the narrator reaches it.
 if(has(s,/radiogr[aá]f|línea de la pleura|trama vascular|hiperlúcida|opacidad homogénea|signo del menisco/)) {
  const lines = has(text,/derrame pleural masivo/i) ? ['Velamiento casi completo del hemitórax'] : has(text,/aplanamiento/i) ? ['Claridad radiográfica aumentada','Aplanamiento diafragmático','Desplazamiento mediastínico']
   : has(text,/hiperlúcida/i) ? ['Zona hiperlúcida','Desviación mediastínica']
   : has(s,/derrame/) ? ['Opacidad homogénea','Signo del menisco'] : ['Línea pleural visceral','Ausencia de trama periférica'];
  return {title:'Hallazgos radiográficos',eyebrow:'ESQUEMA ILUSTRATIVO',lines,mode:'xray'};
 }
 if(has(s,/desplazamiento mediastínico|a tensión|desviación del mediastino/)) return {title:'Desplazamiento mediastínico',eyebrow:has(s,/tensión/)?'NEUMOTÓRAX A TENSIÓN':'MECÁNICA TORÁCICA',lines:has(s,/compresión/)?['Desviación contralateral','Compresión de grandes vasos']:['Desviación hacia el lado contrario'],mode:'tension'};
 if(has(s,/clasificación del neumotórax|espontáneo|traumático|iatrogénico/)) {
  if(has(text,/primario/i))return {title:'Espontáneo primario',eyebrow:'CLASIFICACIÓN',lines:['Sin enfermedad pulmonar previa','Ruptura de bullas apicales'],mode:'classification'};
  if(has(text,/secundario/i))return {title:'Espontáneo secundario',eyebrow:'CLASIFICACIÓN',lines:['Enfermedad pulmonar previa','EPOC · asma · fibrosis quística · tuberculosis'],mode:'classification'};
  if(has(text,/traumático/i))return {title:'Traumático',eyebrow:'CLASIFICACIÓN',lines:['Cerrado · contusión','Abierto · herida penetrante'],mode:'classification'};
  if(has(text,/iatrogénico/i))return {title:'Iatrogénico',eyebrow:'CLASIFICACIÓN',lines:['Relacionado con procedimientos médicos'],mode:'classification'};
  return {title:'Tipos de neumotórax',eyebrow:'CLASIFICACIÓN',lines:['Espontáneo','Traumático','Iatrogénico'],mode:'classification'};
 }
 if(has(s,/signos y síntomas|hipersonoridad|expansión torácica|vibraciones vocales/)) {
  let line=text.replace(/[;.]$/,'').trim(); if(line.length>92)line='El aire pleural produce un sonido timpánico';
  return {title:has(s,/hipersonoridad/)?'Hipersonoridad':'Exploración clínica',eyebrow:'SIGNOS Y SÍNTOMAS',lines:[line],mode:'symptoms'};
 }
 return {title:'Neumotórax',eyebrow:'AIRE EN EL ESPACIO PLEURAL',lines:['Aire pleural','Retracción pulmonar'],mode:'anatomy'};
}

export const Pneumothorax: React.FC<Props> = ({scene,frame}) => {
 const text=scene.narrationText||'';
 const d=detail(text,scene.visuals?.[0]||'');
 const t=clamp(frame/Math.max(1,Math.round((scene.end-scene.start)*30)));
 const intro=fade(frame,0,16);
 const pan=1.02+.04*t;
 const isCompare=d.mode==='compare';
 const wordKey = (s:string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
 const lineAt = (line:string, index:number) => {
  const keys = line.split(/\s+/).map(wordKey).filter(k => k.length > 4 && !['pulmonar','pleural','neumotorax','derrame'].includes(k));
  const match = scene.words?.find(w => keys.includes(wordKey(w.text)));
  return match ? Math.max(0, Math.round((match.start-scene.start)*30)) : index * 8;
 };
 const reveal = (line:string,index:number) => fade(frame,lineAt(line,index),lineAt(line,index)+12);
 const atWord = (word:string,fallback:number) => {const w=scene.words?.find(x=>wordKey(x.text)===word); return w ? Math.max(0,Math.round((w.start-scene.start)*30)) : fallback;};
 const airAt=atWord('aire',30); const collapseAt=Math.max(airAt+12,atWord('colapso',105));
 const shiftAt=atWord('desplazamiento',atWord('desviacion',15));
 const effusionXray = d.mode === 'xray' && /derrame pleural/i.test(text) && !/neumotórax/i.test(text);
 const displayedXray = d.mode === 'xray' && !effusionXray;
 const showTension = (d.mode === 'tension' || d.mode === 'xray') && /tensión|compresión|marcado/i.test(text) && /desplazamiento|desviación|compresión/i.test(text);
 const animateCollapse = d.mode === 'anatomy' && /presencia de aire/i.test(text);
 return <AbsoluteFill style={{fontFamily:'Inter, Helvetica Neue, Arial, sans-serif',background:'#061322',color:'#f4f9fc',overflow:'hidden'}}>
  {isCompare ? <AbsoluteFill style={{display:'flex',flexDirection:'row'}}>
   <div style={{width:'50%',height:'100%',overflow:'hidden',position:'relative',borderRight:'1px solid #9ddfd044'}}><Img src={staticFile('modules/pneumothorax/air.png')} style={{width:'200%',height:'100%',objectFit:'cover',objectPosition:'right',transform:`translateX(-40%) scale(${pan})`}}/></div>
   <div style={{width:'50%',height:'100%',overflow:'hidden',position:'relative'}}><Img src={staticFile('pleural-demo/derrame.png')} style={{width:'200%',height:'100%',objectFit:'cover',objectPosition:'right',transform:`translateX(-40%) scale(${pan})`}}/></div>
   <AbsoluteFill style={{background:'linear-gradient(0deg,#03121bf5 0%,#03121b91 34%,#03121b18 77%,#03121b90 100%)'}}/>
  </AbsoluteFill> : <>
   <AbsoluteFill style={{transform:`scale(${pan}) translateX(${-12*t}px)`}}><Img src={staticFile(displayedXray ? 'modules/pneumothorax/xray.png' : effusionXray ? (/masivo/i.test(text) ? 'modules/pleural/radiografia-masivo.png' : 'modules/pleural/radiografia.png') : animateCollapse ? 'modules/pneumothorax/baseline.png' : 'modules/pneumothorax/air.png')} style={{width:'100%',height:'100%',objectFit:'cover'}}/>{animateCollapse && <Img src={staticFile('modules/pneumothorax/air.png')} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',opacity:fade(frame,airAt,collapseAt),maskImage:'linear-gradient(to right, transparent 34%, black 45%, black 70%, transparent 77%)'}}/>}{showTension && <Img src={staticFile('modules/pneumothorax/tension.png')} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',opacity:fade(frame,shiftAt,shiftAt+45)}}/>}</AbsoluteFill>
   <AbsoluteFill style={{background:'linear-gradient(90deg,rgba(3,13,25,.98) 0%,rgba(3,13,25,.93) 24%,rgba(3,13,25,.55) 39%,rgba(3,13,25,.04) 68%),linear-gradient(0deg,#04121b77,transparent 24%)'}}/>
  </>}
  <div style={{position:'absolute',top:74,left:104,display:'flex',alignItems:'center',gap:16,opacity:intro}}><div style={{height:2,width:42,background:'#7de6c0'}}/><div style={{fontSize:19,letterSpacing:4.2,color:'#a8e8d7',fontWeight:700}}>SEMIOLOGÍA PRÁCTICA</div></div>
  {isCompare ? <>
   <div style={{position:'absolute',top:145,left:104,fontSize:20,letterSpacing:4,color:'#8ee7c7',fontWeight:700,opacity:intro}}>COMPARACIÓN CLÍNICA</div>
   <div style={{position:'absolute',top:195,left:104,fontSize:66,letterSpacing:-2,fontWeight:700,opacity:intro}}>Neumotórax y derrame</div>
   <div style={{position:'absolute',bottom:133,left:104,right:104,display:'grid',gridTemplateColumns:'1fr 1fr',gap:50}}>{d.lines.map((v,i)=><div key={i} style={{borderTop:`3px solid ${i===0?'#7de6c0':'#75c6f3'}`,paddingTop:23,opacity:reveal(v,i)}}><div style={{fontSize:18,letterSpacing:3,color:i===0?'#97ecd0':'#9ad9f7',fontWeight:700}}>{i===0?'NEUMOTÓRAX':'DERRAME PLEURAL'}</div><div style={{fontSize:33,lineHeight:1.2,marginTop:13,maxWidth:650,fontWeight:600}}>{v}</div></div>)}</div>
  </> : <div style={{position:'absolute',left:104,top:218,width:695,opacity:intro,transform:`translateY(${(1-intro)*18}px)`}}>
   <div style={{fontSize:19,letterSpacing:4,color:'#80ddc3',fontWeight:700,marginBottom:24}}>{d.eyebrow}</div>
   <div style={{fontSize:d.title.length>25?59:76,lineHeight:1.05,letterSpacing:-2.3,fontWeight:700}}>{d.title}</div>
   <div style={{width:80,height:3,background:'#76ddc0',margin:'32px 0'}}/>
   <div style={{display:'grid',gap:18}}>{d.lines.map((v,i)=><div key={i} style={{fontSize:v.length>65?27:31,lineHeight:1.28,color:'#d9e9e9',opacity:reveal(v,i),display:'flex',alignItems:'baseline',gap:14}}><span style={{color:'#7adcc0',fontSize:20}}>•</span><span>{v}</span></div>)}</div>
  </div>}
  {(d.mode==='tension' || showTension) && <div style={{position:'absolute',right:130,top:155,background:'#082422d9',border:'1px solid #7de6c088',padding:'13px 20px',borderRadius:4,color:'#a8f4d9',fontWeight:700,fontSize:18,letterSpacing:2,opacity:fade(frame,shiftAt,shiftAt+20)}}>DESPLAZAMIENTO MEDIASTÍNICO</div>}
  <div style={{position:'absolute',bottom:49,right:70,fontSize:15,letterSpacing:1.5,color:'#d5e8e6',opacity:.8}}>{(displayedXray || effusionXray) && !(showTension && frame>=shiftAt+23)?'ESQUEMA RADIOGRÁFICO ILUSTRATIVO':'ILUSTRACIÓN EDUCATIVA'}</div>
 </AbsoluteFill>;
};
