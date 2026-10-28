import React from 'react';
import {interpolate, spring, useVideoConfig} from 'remotion';
import {MedicalVisual} from './visuals';

type VisualKind = 'effusion' | 'pneumothorax' | 'tension' | 'heart' | 'circulation' | 'edema' | 'radiograph' | 'radiograph-air' | 'light' | 'angina' | 'cardiac-cycle' | 'percussion' | 'signorelli' | 'thoracentesis' | 'jugular' | 'bnp' | 'echo' | 'framingham' | 'dyspnea';
type SceneProps = {section: string; narrationText: string; frame: number; durationFrames?: number; context?: string};
type Topic = {match: RegExp; title: string; kicker?: string; kind?: VisualKind; terms?: string[]};

// Editorial labels are keyed to the actual narration, never to the reference image.
const topics: Topic[] = [
 {match:/criterios de light|proteínas del líquido pleural|lactato deshidrogenasa/i,title:'Criterios de Light',kicker:'CLASIFICACIÓN DEL LÍQUIDO PLEURAL',kind:'light',terms:['Proteínas','LDH','Líquido pleural','Suero']},
 {match:/trasudado.*exudado|causas de trasudado|causas de exudado/i,title:'Trasudado y exudado',kicker:'ETIOLOGÍA',kind:'effusion',terms:['Trasudado','Exudado']},
 {match:/diferencias entre derrame pleural y neumonía|respecto al inicio|respecto a la fiebre|respecto a la tos|respecto al dolor|auscultación.*neumonía|percusión.*ambos|vibraciones vocales.*condensación|tratamiento.*neumonía/i,title:'Derrame pleural y neumonía',kicker:'COMPARACIÓN CLÍNICA',kind:'effusion',terms:['Derrame pleural','Neumonía']},
 {match:/signorelli/i,title:'Signo de Signorelli',kicker:'EXPLORACIÓN FÍSICA',kind:'signorelli',terms:['Percusión','Región paravertebral']},
 {match:/toracocentesis|puncionar/i,title:'Toracocentesis',kicker:'INDICACIONES',kind:'thoracentesis',terms:['Diagnóstica','Terapéutica']},
 {match:/neoplasia pulmonar asociada|adenocarcinoma/i,title:'Neoplasia y derrame',kicker:'ASOCIACIÓN CLÍNICA',kind:'effusion'},
 {match:/radiografía.*derrame|menisco|seno costofrénico|decúbito.*velamiento/i,title:'Hallazgos radiográficos',kicker:'ESQUEMA ILUSTRATIVO',kind:'radiograph',terms:['Opacidad','Menisco','Seno costofrénico']},
 {match:/neumotórax.*derrame pleural|derrame pleural.*neumotórax/i,title:'Aire y líquido pleural',kicker:'COMPARACIÓN',kind:'pneumothorax',terms:['Neumotórax','Derrame pleural']},
 {match:/a tensión|desplazamiento mediastínico|compresión de grandes vasos/i,title:'Neumotórax a tensión',kicker:'DESPLAZAMIENTO MEDIASTÍNICO',kind:'tension',terms:['Aire pleural','Mediastino']},
 {match:/espontáneo primario|espontáneo secundario|neumotórax traumático|neumotórax iatrogénico|clasificación del neumotórax/i,title:'Tipos de neumotórax',kicker:'CLASIFICACIÓN',kind:'pneumothorax',terms:['Espontáneo','Traumático','Iatrogénico']},
 {match:/radiografía de neumotórax|línea de la pleura visceral|trama vascular periférica|claridad radiográfica/i,title:'Radiografía de neumotórax',kicker:'ESQUEMA ILUSTRATIVO',kind:'radiograph-air',terms:['Línea pleural','Sin trama periférica']},
 {match:/hipersonoridad/i,title:'Hipersonoridad',kicker:'PERCUSIÓN',kind:'percussion',terms:['Aire pleural','Sonido timpánico']},
 {match:/grado[s]? de capacidad funcional|clase funcional|asociación del corazón de nueva york/i,title:'Capacidad funcional',kicker:'CLASIFICACIÓN NYHA',kind:'heart',terms:['I','II','III','IV']},
 {match:/ortopnea|platipnea|trepopnea|disnea de esfuerzo|disnea en reposo|tipos de disnea/i,title:'Formas de disnea',kicker:'SÍNTOMAS RESPIRATORIOS',kind:'dyspnea',terms:['Esfuerzo','Reposo','Ortopnea','Platipnea','Trepopnea']},
 {match:/dolor isquémico|anginoso|zona de la corbata|brazo izquierdo|nitroglicerina/i,title:'Dolor anginoso',kicker:'LOCALIZACIÓN Y CARACTERÍSTICAS',kind:'angina',terms:['Retroesternal','Opresivo','Irradiación']},
 {match:/anamnesis|intensidad, localización/i,title:'Anamnesis del dolor',kicker:'PREGUNTAS CLÍNICAS',kind:'heart',terms:['Localización','Carácter','Duración','Desencadenantes']},
 {match:/electrocardiograma|troponinas|hemograma|ionograma/i,title:'Evaluación inicial',kicker:'SOSPECHA DE SÍNDROME CORONARIO',kind:'heart',terms:['Electrocardiograma','Troponinas','Otros estudios']},
 {match:/muerte inminente|estimulación simpática/i,title:'Sensación de muerte inminente',kicker:'RESPUESTA CLÍNICA',kind:'circulation'},
 {match:/infarto agudo|angina de esfuerzo|angina de reposo|angina inestable/i,title:'Angina e infarto',kicker:'FORMAS CLÍNICAS',kind:'heart'},
 {match:/reflujo hepatoyugular|presión venosa yugular/i,title:'Reflujo hepatoyugular',kicker:'EXPLORACIÓN CLÍNICA',kind:'jugular',terms:['Presión abdominal','Presión venosa yugular']},
 {match:/péptido natriurético|marcador hormonal|propéptido/i,title:'BNP y NT-proBNP',kicker:'MARCADORES CARDÍACOS',kind:'bnp',terms:['Distensión','Diagnóstico','Pronóstico']},
 {match:/ecocardiograma/i,title:'Ecocardiograma',kicker:'FUNCIÓN Y ESTRUCTURA',kind:'echo',terms:['Sístole','Diástole','Fracción de eyección']},
 {match:/framingham|criterios mayores|criterios menores/i,title:'Criterios de Framingham',kicker:'DIAGNÓSTICO CLÍNICO',kind:'framingham',terms:['Mayores','Menores']},
 {match:/godet|grado uno|grado dos|grado tres|grado cuatro|depresión.*milímetros/i,title:'Edema con fóvea',kicker:'ESCALA DE GODET',kind:'edema',terms:['I','II','III','IV']},
 {match:/disfunción sistólica|disfunción diastólica|contractilidad|llenado ventricular|sobrecarga de volumen/i,title:'Sístole y diástole',kicker:'MECANISMOS',kind:'cardiac-cycle',terms:['Contractilidad','Llenado']},
 {match:/factores desencadenantes|factores agravantes/i,title:'Desencadenantes y agravantes',kicker:'INSUFICIENCIA CARDÍACA',kind:'circulation'},
 {match:/signos y síntomas cardinales|estertores pulmonares/i,title:'Signos cardinales',kicker:'INSUFICIENCIA CARDÍACA',kind:'circulation',terms:['Disnea','Fatiga','Edema','Estertores']},
 {match:/insuficiencia cardíaca es un síndrome/i,title:'Insuficiencia cardíaca',kicker:'DEFINICIÓN',kind:'heart'},
 {match:/disnea es una sensación/i,title:'Disnea',kicker:'MOTIVO DE CONSULTA',kind:'heart'},
 {match:/dolor torácico puede clasificarse/i,title:'Dolor torácico',kicker:'MOTIVO DE CONSULTA',kind:'heart'},
 {match:/neumotórax es la presencia/i,title:'Neumotórax',kicker:'DEFINICIÓN',kind:'pneumothorax',terms:['Aire pleural','Pulmón retraído']},
 {match:/derrame pleural es la acumulación/i,title:'Derrame pleural',kicker:'DEFINICIÓN',kind:'effusion',terms:['Pulmón','Espacio pleural','Líquido']},
];

function group(section: string, text: string) {
 const s = section.toLowerCase();
 if (/insuficiencia card[ií]aca/.test(s)) return {color:'#b49aff', label:'INSUFICIENCIA CARDÍACA', kind:'heart' as VisualKind};
 if (/cardiovascular|angina|nyha|dolor torácico/.test(section.toLowerCase())) return {color:'#ff8290',label:'MOTIVO DE CONSULTA CARDIOVASCULAR',kind:'heart' as VisualKind};
 if (/neumot[oó]rax/.test(section.toLowerCase())) return {color:'#75e1b4',label:'NEUMOTÓRAX',kind:'pneumothorax' as VisualKind};
 return {color:'#73c9ff',label:'DERRAME PLEURAL',kind:'effusion' as VisualKind};
}
function clean(text: string) {return text.replace(/\s+/g,' ').trim();}
function textSize(text: string) {
 // Preserve every word of the aligned cue and shrink only as needed to fit.
 if (text.length > 600) return 21;
 if (text.length > 420) return 24;
 if (text.length > 260) return 27;
 return 30;
}
function activeIndex(text: string, terms: string[]) {
 const roman = text.match(/(?:clase funcional|grado)\s+(uno|dos|tres|cuatro)/i)?.[1]?.toLowerCase();
 if (roman) return ['uno','dos','tres','cuatro'].indexOf(roman);
 return -1;
}

type ComparisonRow = {key: RegExp; label: string; left: string; right: string};
const pneumoniaRows: ComparisonRow[] = [
 {key:/inicio/i,label:'Inicio',left:'Progresivo',right:'Agudo'},
 {key:/fiebre/i,label:'Fiebre',left:'Rara',right:'Frecuente'},
 {key:/tos/i,label:'Tos',left:'Seca',right:'Productiva'},
 {key:/dolor/i,label:'Dolor',left:'Pleurítico',right:'Frecuente'},
 {key:/auscultación/i,label:'Auscultación',left:'Murmullo abolido',right:'Crepitantes'},
 {key:/percusión/i,label:'Percusión',left:'Matidez',right:'Matidez'},
 {key:/vibraciones/i,label:'Vibraciones',left:'Disminuidas',right:'Aumentadas'},
 {key:/radiografía/i,label:'Radiografía',left:'Menisco',right:'Condensación'},
 {key:/tratamiento/i,label:'Tratamiento',left:'Según la causa',right:'Antibióticos*'},
];
const airRows: ComparisonRow[] = [
 {key:/percusión/i,label:'Percusión',left:'Hipersonoridad',right:'Matidez'},
 {key:/auscultación/i,label:'Auscultación',left:'Disminuido o abolido',right:'Puede estar abolido'},
 {key:/vibraciones/i,label:'Vibraciones',left:'Disminuidas',right:'Disminuidas'},
 {key:/radiografía/i,label:'Radiografía',left:'Línea pleural · claridad',right:'Opacidad · menisco'},
 {key:/causa/i,label:'Causas',left:'Ruptura alveolar',right:'IC · neoplasia · infección'},
 {key:/tratamiento/i,label:'Tratamiento',left:'Drenaje torácico',right:'Según la causa'},
];

function ComparisonPanel({type, text, frame, accent}: {type: 'pneumonia'|'air'; text: string; frame: number; accent: string}) {
 const rows = type === 'pneumonia' ? pneumoniaRows : airRows;
 const current = rows.findIndex(row => row.key.test(text));
 const shown = current < 0 ? 0 : current + 1;
 const entrance = interpolate(frame,[0,12],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 return <div style={{position:'absolute',inset:'68px 38px 54px',opacity:entrance,display:'flex',flexDirection:'column',gap:8}}>
  <div style={{display:'grid',gridTemplateColumns:'160px 1fr 1fr',gap:8,marginBottom:9}}>
   <div style={{fontSize:15,letterSpacing:2,color:'#a9bfd0',alignSelf:'end'}}>HALLAZGO</div>
   {[type === 'pneumonia' ? 'DERRAME' : 'NEUMOTÓRAX', type === 'pneumonia' ? 'NEUMONÍA' : 'DERRAME'].map((name,i)=><div key={name} style={{padding:'17px 13px',background:i===0?`${accent}1f`:'#ffffff0d',borderRadius:10,color:i===0?accent:'#e5f2fa',fontSize:17,fontWeight:700,textAlign:'center',letterSpacing:1}}>{name}</div>)}
  </div>
  {rows.slice(0,shown).map((row,i)=><div key={row.label} style={{display:'grid',gridTemplateColumns:'160px 1fr 1fr',gap:8,flex:1,maxHeight:68,alignItems:'center',opacity:i===current?1:.55}}>
   <div style={{fontSize:19,fontWeight:700,color:i===current?accent:'#c6d8e5'}}>{row.label}</div>
   {[row.left,row.right].map((value,j)=><div key={j} style={{height:'100%',display:'flex',alignItems:'center',justifyContent:'center',textAlign:'center',fontSize:18,fontWeight:i===current?700:500,lineHeight:1.15,color:'#f3f8fc',background:i===current?`${accent}20`:'#ffffff08',border:`1px solid ${i===current?`${accent}66`:'transparent'}`,borderRadius:8,padding:'0 6px'}}>{value}</div>)}
  </div>)}
  {current < 0 && <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',color:'#a9c8d9',fontSize:24,letterSpacing:1}}>Exploración clínica y radiografía</div>}
  {type==='pneumonia' && current===8 && <div style={{fontSize:14,color:'#aec6d7'}}>* En la neumonía bacteriana, según el esquema.</div>}
 </div>;
}

export const MedicalScene: React.FC<SceneProps> = ({section, narrationText, frame, durationFrames = 180, context = ''}) => {
 const {fps} = useVideoConfig();
 const text = clean(narrationText);
 const theme = group(section,text);
 const contextual = `${context} ${text}`;
 // The heading retains the topic when the narration lists short follow-up clauses.
 const topic = topics.find((t) => t.match.test(contextual));
 const title = topic?.title || (text.length < 65 ? text.replace(/[.:]$/,'') : theme.label.toLocaleLowerCase('es'));
 const kind = topic?.kind || theme.kind;
 const visualProgress = kind === 'light' ? (/dos tercios/i.test(text) ? .9 : /lactato/i.test(text) ? .55 : .2) : kind === 'cardiac-cycle' ? (/diastólica/i.test(text) && !/sistólica/i.test(text) ? .75 : .25) : undefined;
 const enter = spring({frame, fps, config:{damping: 22, stiffness: 90}});
 const opacity = interpolate(frame,[0,12],[0,1],{extrapolateRight:'clamp'});
 const progress = Math.max(0,Math.min(1,frame/Math.max(1,durationFrames)));
 const chosen = activeIndex(text,topic?.terms||[]);
 const terms = topic?.terms || [];
 const comparePneumonia = /diferencias entre derrame pleural y neumonía/i.test(contextual);
 const compareAir = /diferencias entre neumotórax y derrame pleural/i.test(contextual);
 const isCompare = comparePneumonia || compareAir || /comparaci[oó]n|diferencias/i.test(text);
 const statement = text;
 const scale = /escala de godet|grado (?:uno|dos|tres|cuatro)|clase funcional|grados de capacidad funcional/i.test(contextual);
 const isGodet = /godet|grado (?:uno|dos|tres|cuatro)/i.test(contextual);
 const airFluid = compareAir;
 const fontSize = textSize(statement);
 return <div style={{position:'absolute',inset:0,overflow:'hidden',background:'radial-gradient(ellipse at 75% 40%, #17354b 0%, #0b1d32 42%, #07111f 100%)',color:'#f4f8ff',fontFamily:'Inter, Arial, sans-serif'}}>
  <div style={{position:'absolute',inset:0,opacity:.2,backgroundImage:'linear-gradient(#ffffff0a 1px, transparent 1px),linear-gradient(90deg,#ffffff0a 1px,transparent 1px)',backgroundSize:'80px 80px',maskImage:'linear-gradient(to right, transparent, black)'}} />
  <div style={{position:'absolute',width:950,height:950,borderRadius:'50%',right:-140,top:-120,background:`radial-gradient(circle, ${theme.color}18, transparent 68%)`}} />
  <div style={{position:'absolute',top:76,left:96,right:96,display:'flex',alignItems:'center',gap:18,opacity}}>
   <div style={{width:42,height:3,background:theme.color}}/><div style={{fontSize:19,fontWeight:700,letterSpacing:4,color:theme.color}}>{theme.label}</div>
   <div style={{flex:1,height:1,background:'#ffffff20'}}/><div style={{fontSize:17,letterSpacing:3,color:'#a6bdd1'}}>SEMIOLOGÍA PRÁCTICA</div>
  </div>
  <div style={{position:'absolute',left:104,top:206,width:785,opacity,transform:`translateY(${(1-enter)*35}px)`}}>
   <div style={{fontSize:19,letterSpacing:4,fontWeight:700,color:theme.color,marginBottom:23}}>{topic?.kicker || 'SEMIOLOGÍA CLÍNICA'}</div>
   <div style={{fontSize:title.length>40?59:76,lineHeight:1.04,fontWeight:700,letterSpacing:-2.2,maxWidth:780,textTransform:'none'}}>{title}</div>
   <div style={{width:84,height:5,marginTop:36,background:theme.color,borderRadius:8}} />
   {statement && statement.toLowerCase().replace(/[.:]$/,'') !== title.toLowerCase() && <div style={{fontSize,lineHeight:1.36,color:'#c7d8e8',marginTop:34,maxWidth:740,fontWeight:400}}>{statement}</div>}
   {terms.length>0 && <div style={{display:'flex',flexWrap:'wrap',gap:12,marginTop:statement.length>350?18:40,maxWidth:770}}>{terms.map((term,i)=><div key={term} style={{padding:'12px 19px',borderRadius:8,border:`1px solid ${chosen===i?theme.color:'#ffffff28'}`,color:chosen===i?'#07111f':'#e3eef8',background:chosen===i?theme.color:'#ffffff0c',fontSize:21,fontWeight:600,opacity:interpolate(frame,[6+i*6,18+i*6],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'})}}>{term}</div>)}</div>}
  </div>
  <div style={{position:'absolute',right:85,top:170,width:820,height:720,opacity,transform:`translateY(${(1-enter)*22}px)`}}>
   <div style={{position:'absolute',inset:'30px 25px',borderRadius:42,border:'1px solid #ffffff16',background:'linear-gradient(145deg,#ffffff09,#ffffff02)',boxShadow:'0 35px 100px #0003'}} />
   {(comparePneumonia || compareAir) ? <ComparisonPanel type={comparePneumonia ? 'pneumonia' : 'air'} text={text} frame={frame} accent={theme.color}/> : scale ? <div style={{position:'absolute',inset:'105px 62px 110px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>{['I','II','III','IV'].map((grade,i)=><div key={grade} style={{border:`1px solid ${chosen===i?theme.color:'#ffffff28'}`,borderRadius:22,background:chosen===i?`${theme.color}22`:'#ffffff08',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',opacity:interpolate(frame,[i*5,i*5+12],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'})}}><span style={{fontSize:78,fontWeight:700,color:chosen===i?theme.color:'#d3e6f5'}}>{grade}</span><span style={{fontSize:17,letterSpacing:2,color:'#b6cddd'}}>{isGodet?'GRADO':'CLASE'}</span><span style={{fontSize:19,color:'#d5e4ee',marginTop:12,textAlign:'center',maxWidth:250,lineHeight:1.25}}>{(isGodet ? ['< 2 mm · rápida','2–4 mm · ~15 s','4–6 mm · 15–30 s','> 6 mm · >30 s'] : ['Actividad habitual','Esfuerzo moderado','Esfuerzo leve','En reposo'])[i]}</span></div>)}</div> : airFluid ? <div style={{position:'absolute',inset:'100px 38px 90px',display:'flex',gap:12}}>{(['pneumothorax','effusion'] as VisualKind[]).map((v,i)=><div key={v} style={{flex:1,border:'1px solid #ffffff18',borderRadius:22,background:'#ffffff08',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}><div style={{width:'100%',height:420}}><MedicalVisual kind={v} progress={progress} accent={i===0?'#75e1b4':'#73c9ff'}/></div><span style={{fontSize:20,color:i===0?'#75e1b4':'#73c9ff',fontWeight:700}}>{i===0?'NEUMOTÓRAX':'DERRAME PLEURAL'}</span></div>)}</div> : <div style={{position:'absolute',inset:'65px 45px 45px'}}><MedicalVisual kind={kind} progress={visualProgress ?? progress} accent={theme.color}/></div>}
   {kind.startsWith('radiograph') && <div style={{position:'absolute',bottom:30,right:58,color:'#b5cfdf',fontSize:16,letterSpacing:2}}>ESQUEMA ILUSTRATIVO</div>}
   {isCompare && <div style={{position:'absolute',top:58,right:62,color:theme.color,fontSize:17,letterSpacing:3}}>COMPARACIÓN CLÍNICA</div>}
  </div>
  <div style={{position:'absolute',left:104,right:104,bottom:68,height:2,background:'#ffffff16'}}><div style={{height:'100%',width:`${progress*100}%`,background:theme.color}}/></div>
 </div>;
};
