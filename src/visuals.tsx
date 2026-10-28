import React from 'react';

/** Original schematic artwork. `progress` controls the clinical change, from 0 to 1. */
export type MedicalVisualKind = 'effusion' | 'pneumothorax' | 'tension' | 'heart' | 'circulation' | 'edema' | 'radiograph' | 'radiograph-air' | 'light' | 'angina' | 'cardiac-cycle' | 'percussion' | 'signorelli' | 'thoracentesis' | 'jugular' | 'bnp' | 'echo' | 'framingham' | 'dyspnea';
export interface MedicalVisualProps {
  kind: MedicalVisualKind;
  progress?: number;
  accent?: string;
}

const clamp = (v: number) => Math.max(0, Math.min(1, v));
const lungRight = 'M280 142 C242 136 203 160 182 207 C157 263 147 348 151 411 C154 451 174 474 217 473 C254 472 278 452 291 426 L293 218 C293 176 290 154 280 142 Z';
const lungLeft = 'M320 142 C358 136 397 160 418 207 C443 263 453 348 449 411 C446 451 426 474 383 473 C356 473 337 461 321 443 C346 415 340 368 320 346 Z';
const branches = <g fill="none" stroke="#b4edff" strokeWidth="3" opacity=".42" strokeLinecap="round"><path d="M300 130 L300 205 M300 198 Q261 208 241 258 L214 318 M260 226 L205 244 M244 255 L259 306 M226 294 L184 305 M221 312 L204 368 M300 198 Q340 208 359 258 L386 318 M340 226 L395 244 M356 255 L341 306 M374 294 L416 305 M379 312 L396 368"/></g>;

function Thorax({kind, p}: {kind: MedicalVisualKind; p: number}) {
  const collapsed = kind === 'pneumothorax' || kind === 'tension';
  const isEffusion = kind === 'effusion';
  const shifted = kind === 'tension' ? 20 * p : 0;
  return <>
    <path d="M219 79 Q300 48 381 79 C442 101 472 173 482 259 L485 432 Q466 493 412 510 Q300 541 188 510 Q134 493 115 432 L118 259 C128 173 158 101 219 79Z" fill="url(#body)" stroke="#70b9ca" strokeOpacity=".33" strokeWidth="3"/>
    {[0,1,2,3,4].map(i => <path key={i} d={`M144 ${208+i*43} Q204 ${184+i*43} 270 ${219+i*43} M330 ${219+i*43} Q396 ${184+i*43} 456 ${208+i*43}`} fill="none" stroke="#a5dce9" strokeOpacity=".13" strokeWidth="5"/>)}
    <path d="M300 94 L300 202" stroke="#bceeff" strokeWidth="15" strokeLinecap="round" opacity=".65"/>
    <path d="M300 198 Q270 207 253 233 M300 198 Q330 207 347 233" stroke="#bceeff" strokeWidth="10" strokeLinecap="round" fill="none" opacity=".65"/>
    {collapsed && <path d={lungRight} fill="#64d9c1" opacity={.09 + .18*p} stroke="#7ff0d5" strokeDasharray="9 10" strokeWidth="3"/>}
    <path d={lungRight} fill="url(#lung)" stroke="#97e8f0" strokeWidth="3" transform={collapsed ? `translate(${.38*p*285} ${.34*p*300}) scale(${1-.38*p} ${1-.34*p})` : isEffusion ? `translate(0 ${.2*p*142}) scale(1 ${1-.2*p})` : undefined}/>
    <path d={lungLeft} fill="url(#lung)" stroke="#97e8f0" strokeWidth="3"/>
    {(collapsed || isEffusion) ? <>
      <g transform={collapsed ? `translate(${.38*p*285} ${.34*p*300}) scale(${1-.38*p} ${1-.34*p})` : `translate(0 ${.2*p*142}) scale(1 ${1-.2*p})`}><g clipPath="url(#rightLungBranches)">{branches}</g></g>
      <g clipPath="url(#leftLungBranches)">{branches}</g>
    </> : branches}
    <path d="M300 244 C280 227 258 247 260 271 C262 295 285 316 300 331 C315 316 338 295 340 271 C342 247 320 227 300 244Z" fill="#e35f69" opacity=".8" transform={`translate(${shifted} 0)`}/>
    {isEffusion && <path d={`M143 ${478-90*p} Q192 ${487-62*p} 293 ${478-90*p} L293 470 Q266 491 216 490 Q153 490 143 466 Z`} fill="url(#fluid)" stroke="#8be6ff" strokeWidth="3" opacity={p}/>}
    {collapsed && <g opacity={p*.7} fill="#a3fff0">{[0,1,2,3,4,5].map(i=><circle key={i} cx={165+i*15} cy={190+i*37} r={3+i%2}/>)}</g>}
    <path d="M151 480 Q220 510 300 494 Q380 510 449 480" stroke="#b5ddea" strokeWidth="4" opacity=".35" fill="none"/>
  </>;
}

function Heart({p, circulation}: {p: number; circulation: boolean}) {
  return <g transform="translate(300 300)">
    {circulation && <g fill="none" strokeWidth="8" strokeLinecap="round" opacity=".65"><path d="M-95 -40 C-240 -130 -243 125 -115 135" stroke="#57b7ed"/><path d="M98 80 C245 150 248 -128 116 -123" stroke="#ff7777"/><path d="M-115 135 l-15 -16 m15 16 l-22 7 M116 -123 l19 -9 m-19 9 l8 20" stroke="#ebf9ff"/></g>}
    <g transform={`scale(${.96+.04*p})`}>
      <path d="M-34 -100 C-45 -165 -26 -193 3 -189 C28 -187 34 -163 28 -119" fill="none" stroke="#fc8d92" strokeWidth="29"/>
      <path d="M18 -125 C61 -175 107 -158 99 -120" fill="none" stroke="#91c9f9" strokeWidth="24"/>
      <path d="M-4 -94 C-37 -136 -99 -123 -114 -69 C-135 5 -88 78 -8 149 C46 128 108 74 113 2 C119 -65 73 -113 28 -95 L9 -70Z" fill="url(#heart)" stroke="#ffb1a8" strokeWidth="4"/>
      <path d="M-5 -77 C-30 -19 -30 58 -8 137 M15 -67 C39 -37 55 -4 60 32" fill="none" stroke="#ffb4ad" strokeWidth="4" opacity=".45"/>
      <path d="M-70 -63 C-53 -80 -37 -76 -22 -60 M-72 -49 C-62 -37 -59 -17 -56 2" fill="none" stroke="#ffe0d4" strokeWidth="4" opacity=".48"/>
    </g>
  </g>;
}

function Edema({p}: {p: number}) {
  return <g transform="translate(90 80)"><path d="M134 30 Q184 15 233 31 L228 267 Q235 300 271 323 L340 352 Q359 359 356 380 Q352 400 329 400 L166 400 Q119 394 118 359 L134 269Z" fill="url(#body)" stroke="#95e2ea" strokeWidth="4"/><path d={`M124 315 Q190 ${315+45*p} 242 315`} fill="none" stroke="#b8f7ff" strokeWidth="5" opacity=".8"/><ellipse cx="194" cy="318" rx={22*p} ry={8*p} fill="#061a30" opacity=".65"/><path d="M174 270 L194 300 L214 270" fill="none" stroke="#8cf2ff" strokeWidth="5" strokeLinecap="round" opacity={p}/></g>;
}

function LightCriteria({p}: {p: number}) {
  const rows = [
    {label: 'Proteínas pleural / sérica', value: '> 0,5'},
    {label: 'LDH pleural / sérica', value: '> 0,6'},
    {label: 'LDH pleural / límite sérico', value: '> ⅔'},
  ];
  return <g>
    <text x="300" y="105" textAnchor="middle" fill="#b5e9f3" fontSize="18" fontWeight="700" letterSpacing="3">CRITERIOS DE LIGHT</text>
    {rows.map((row, i) => <g key={row.value} opacity={p >= i / 3 ? 1 : .22} transform={`translate(45 ${145 + i * 100})`}>
      <rect width="510" height="82" rx="17" fill="#173b56" stroke="#64d9ef" strokeOpacity=".45"/>
      <circle cx="38" cy="41" r="18" fill="#5ad9ee" fillOpacity=".18" stroke="#73e6f3"/>
      <text x="38" y="47" textAnchor="middle" fill="#a5f1ff" fontSize="17" fontWeight="700">{i+1}</text>
      <text x="73" y="48" fill="#ebf8fc" fontSize="21" fontWeight="600">{row.label}</text>
      <text x="480" y="50" textAnchor="end" fill="#79e8f4" fontSize="27" fontWeight="800">{row.value}</text>
    </g>)}
    <text x="300" y="495" textAnchor="middle" fill="#e8f8fb" fontSize="21">Exudado: al menos uno positivo</text>
    <text x="300" y="525" textAnchor="middle" fill="#a6c9d5" fontSize="16">LDH: límite superior normal sérico</text>
  </g>;
}

function Angina({p}: {p: number}) {
  return <g>
    <circle cx="300" cy="102" r="44" fill="#2d5469" stroke="#99dae4" strokeOpacity=".6" strokeWidth="3"/>
    <path d="M255 146 Q300 159 345 146 L389 169 Q405 181 412 210 L447 358 Q449 373 437 376 Q424 380 418 364 L380 249 L369 454 Q367 478 344 478 L256 478 Q233 478 231 454 L220 249 L182 364 Q176 380 163 376 Q151 373 153 358 L188 210 Q195 181 211 169Z" fill="url(#body)" stroke="#9adce6" strokeOpacity=".45" strokeWidth="3"/>
    <circle cx="300" cy="235" r="78" fill="url(#pain)" opacity={.65 + p*.35}/>
    <path d="M300 203 C278 179 257 200 264 222 C270 242 289 254 300 266 C311 254 330 242 336 222 C343 200 322 179 300 203Z" fill="#ff7f7e" opacity=".87"/>
    <g fill="none" stroke="#ff9a87" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" opacity={p}>

      <path d="M300 195 Q294 159 282 126 M277 140 L282 126 L294 136"/>
      <path d="M339 224 Q375 230 394 274 L416 342 M405 332 L416 342 L420 327"/>
    </g>
    <text x="300" y="530" textAnchor="middle" fill="#ffd4c9" fontSize="21" fontWeight="700">DOLOR RETROESTERNAL · IRRADIACIÓN</text>
  </g>;
}

function Radiograph({p, air}: {p: number; air: boolean}) {
  return <g>
    <rect x="86" y="45" width="428" height="485" rx="18" fill="#081118" stroke="#b1c8d5" strokeOpacity=".55" strokeWidth="3"/>
    <path d="M178 91 Q300 56 422 91 Q460 122 465 194 L463 437 Q450 478 407 494 Q300 516 193 494 Q150 478 137 437 L135 194 Q140 122 178 91Z" fill="#a9bbc1" opacity=".16"/>
    <path d={lungRight} transform={air ? 'translate(75 66) scale(.75 .8)' : undefined} fill="#192a34" stroke="#c8dae0" strokeOpacity=".45" strokeWidth="2"/>
    <path d={lungLeft} fill="#192a34" stroke="#c8dae0" strokeOpacity=".45" strokeWidth="2"/>
    <g fill="none" stroke="#d2e0e1" strokeOpacity=".18" strokeWidth="5">{[0,1,2,3,4,5].map(i=><path key={i} d={`M150 ${165+i*47} Q220 ${135+i*47} 285 ${181+i*47} M315 ${181+i*47} Q380 ${135+i*47} 450 ${165+i*47}`}/>)}</g>
    <path d="M300 102 L300 438" stroke="#e0e7e6" strokeWidth="20" opacity=".22"/>
    <path d="M300 245 C262 225 250 260 264 300 L294 372 L340 370 C349 337 355 283 330 261Z" fill="#bfcccf" opacity=".25"/>
    {air ? <>
      <path d="M266 169 C234 163 204 187 192 221 C174 266 174 344 181 395" fill="none" stroke="#f4ffff" strokeWidth="4" opacity={.55+.4*p}/>
      <path d="M150 146 Q118 272 145 414" fill="none" stroke="#c0eef1" strokeDasharray="7 9" strokeWidth="3" opacity={.4+.3*p}/>
      <text x="195" y="452" textAnchor="middle" fill="#e6f4f7" fontSize="16">LÍNEA PLEURAL</text>
    </> : <>
      <path d="M146 372 Q205 403 291 370 L291 457 Q266 487 216 489 Q155 487 146 450Z" fill="#dce8e8" opacity={.35+.45*p}/>
      <path d="M146 372 Q205 403 291 370" fill="none" stroke="#efffff" strokeWidth="3"/>
      <text x="204" y="452" textAnchor="middle" fill="#eaf4f6" fontSize="16">MENISCO</text>
    </>}
    <text x="300" y="553" textAnchor="middle" fill="#c7e8f2" fontSize="17" letterSpacing="2">ESQUEMA RADIOLÓGICO ILUSTRATIVO</text>
  </g>;
}

function CardiacCycle({p}: {p: number}) {
  const systole = p < .5;
  return <g>
    <Heart p={systole ? 0 : 1} circulation={false}/>
    <g fill="none" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
      <path d={systole ? 'M300 188 L300 105 M286 121 L300 105 L314 121' : 'M300 105 L300 188 M286 172 L300 188 L314 172'} stroke={systole ? '#ff9c96' : '#83dcfc'}/>
      <path d={systole ? 'M375 285 Q444 285 469 245 M453 250 L469 245 L466 262' : 'M469 245 Q444 285 375 285 M390 274 L375 285 L393 296'} stroke={systole ? '#ff9c96' : '#83dcfc'}/>
    </g>
    <text x="300" y="485" textAnchor="middle" fill="#f3fbff" fontSize="34" fontWeight="800">{systole ? 'SÍSTOLE' : 'DIÁSTOLE'}</text>
    <text x="300" y="523" textAnchor="middle" fill="#b4d9e7" fontSize="22">{systole ? 'Contracción · eyección' : 'Relajación · llenado'}</text>
  </g>;
}

function Percussion({p}: {p: number}) {
  return <g>
    <Thorax kind="pneumothorax" p={.7}/>
    <g transform={`translate(${12*Math.sin(p*Math.PI*3)} 0)`}>
      <path d="M55 273 Q82 245 116 254 L161 278 L147 296 L115 287 L78 310Z" fill="#e8c4ac" stroke="#ffe1cb" strokeWidth="3"/>
      <path d="M125 250 L174 273 M121 264 L169 283" stroke="#ae7a70" strokeWidth="4" strokeLinecap="round"/>
    </g>
    {[0,1,2].map(i=><path key={i} d={`M${145-i*12} ${200-i*15} Q${110-i*18} 255 ${145-i*12} ${310+i*15}`} fill="none" stroke="#82f0d5" strokeWidth="4" opacity={.9-i*.25}/>) }
    <text x="300" y="550" textAnchor="middle" fill="#baf8e5" fontSize="20" letterSpacing="2">AIRE · HIPERSONORIDAD</text>
  </g>;
}
function Signorelli({p}: {p: number}) {
  return <g>
    <path d="M225 85 Q300 60 375 85 L433 150 Q452 174 448 216 L426 435 Q415 485 300 500 Q185 485 174 435 L152 216 Q148 174 167 150Z" fill="url(#body)" stroke="#93dce6" strokeOpacity=".55" strokeWidth="3"/>
    <path d="M300 120 L300 451" stroke="#d6eefa" strokeWidth="14" strokeLinecap="round" opacity=".55"/>
    {Array.from({length:12},(_,i)=><rect key={i} x="288" y={142+i*23} width="24" height="12" rx="5" fill="#d8effb" opacity=".45"/>)}
    <path d="M310 355 Q357 325 409 356 L409 440 Q365 460 310 455Z" fill="url(#fluid)" opacity={.2+.55*p}/>
    <circle cx="315" cy="389" r={25+9*p} fill="none" stroke="#a9f0ff" strokeWidth="4"/>
    <path d="M416 366 L352 378" stroke="#a9f0ff" strokeWidth="4"/><path d="M365 367 L352 378 L368 384" stroke="#a9f0ff" strokeWidth="4" fill="none"/>
    <text x="300" y="542" textAnchor="middle" fill="#c1eaf6" fontSize="20" letterSpacing="2">PERCUSIÓN PARAVERTEBRAL</text>
  </g>;
}
function Thoracentesis({p}: {p: number}) {
  return <g>
    <Thorax kind="effusion" p={.78}/>
    <path d="M76 390 L132 405 L153 410" stroke="#ecf9ff" strokeWidth="7" strokeLinecap="round"/>
    <path d="M54 384 L82 390" stroke="#8ceaff" strokeWidth="14" strokeLinecap="round"/>
    <path d={`M153 414 Q176 450 203 477`} fill="none" stroke="#88dcef" strokeWidth="4" strokeDasharray="5 9" opacity={.4+.6*p}/>
    <circle cx="153" cy="411" r="9" fill="#baf6ff" opacity={p}/>
    <text x="300" y="549" textAnchor="middle" fill="#c9e9f3" fontSize="19" letterSpacing="2">ESQUEMA DE TORACOCENTESIS</text>
  </g>;
}
function Jugular({p}: {p: number}) {
  return <g>
    <path d="M267 88 Q300 53 335 88 Q347 105 341 145 L330 174 L381 205 Q418 230 419 277 L411 476 Q300 510 189 476 L181 277 Q182 230 219 205 L270 174 L259 145 Q252 105 267 88Z" fill="url(#body)" stroke="#9bdbe5" strokeOpacity=".55" strokeWidth="3"/>
    <path d="M322 160 C320 194 337 224 330 259" fill="none" stroke="#72d7f2" strokeWidth="12" strokeLinecap="round"/>
    <path d={`M322 ${205-45*p} L322 253`} stroke="#e6faff" strokeWidth="5"/>
    <path d="M355 211 L410 211 M355 170 L410 170 M398 170 L398 211" fill="none" stroke="#a9eaf5" strokeWidth="3"/>
    <text x="420" y="197" fill="#c6eef8" fontSize="18">&gt; 3 cm</text>
    <ellipse cx="248" cy="355" rx="52" ry="34" fill="#dfab8b" opacity=".6"/>
    <path d={`M166 354 L${210+15*p} 354 M199 342 L${210+15*p} 354 L199 366`} fill="none" stroke="#ffe0c9" strokeWidth="5"/>
    <text x="300" y="544" textAnchor="middle" fill="#c7eaf5" fontSize="19" letterSpacing="2">PRESIÓN ABDOMINAL · YUGULAR</text>
  </g>;
}
function BNP({p}: {p: number}) {
  return <g>
    <g transform="translate(-90 0) scale(.8)"><Heart p={.4+.2*p} circulation={false}/></g>
    <path d="M330 263 C373 217 415 217 455 263" stroke="#b49aff" strokeWidth="4" strokeDasharray="8 7" fill="none" opacity={p}/>
    <circle cx="447" cy="260" r="58" fill="#ae97ff" fillOpacity=".18" stroke="#c6b4ff" strokeWidth="3"/>
    <text x="447" y="256" textAnchor="middle" fill="#e8deff" fontSize="25" fontWeight="700">BNP</text>
    <text x="447" y="280" textAnchor="middle" fill="#d0c0ff" fontSize="16">NT-proBNP</text>
    <text x="300" y="491" textAnchor="middle" fill="#e6dcff" fontSize="22" fontWeight="700">DISTENSIÓN VENTRICULAR</text>
    <text x="300" y="523" textAnchor="middle" fill="#bdcbe7" fontSize="18">Diagnóstico y pronóstico</text>
  </g>;
}
function Echo({p}: {p: number}) {
  return <g>
    <rect x="61" y="95" width="478" height="350" rx="26" fill="#081822" stroke="#a3cfe1" strokeOpacity=".55" strokeWidth="3"/>
    <path d="M300 132 L130 404 Q300 460 470 404Z" fill="#314d5a" stroke="#a3cfe1" strokeOpacity=".45" strokeWidth="3"/>
    <ellipse cx="300" cy="298" rx={82-12*p} ry={85-10*p} fill="#142f3b" stroke="#d3ecf1" strokeWidth="15" opacity=".8"/>
    <path d="M90 465 L146 465 L162 449 L177 484 L191 463 L224 463 L240 452 L255 479 L270 464 L325 464 L342 452 L358 480 L373 464 L507 464" fill="none" stroke="#8de5e8" strokeWidth="4"/>
    <text x="300" y="534" textAnchor="middle" fill="#cceafa" fontSize="19" letterSpacing="2">ECOCARDIOGRAMA · ESQUEMA</text>
  </g>;
}
function Framingham({p}: {p: number}) {
  return <g>
    <text x="300" y="100" textAnchor="middle" fill="#ddceff" fontSize="20" fontWeight="700" letterSpacing="3">CRITERIOS DE FRAMINGHAM</text>
    <g transform="translate(40 150)">
      <rect width="520" height="100" rx="20" fill="#ac90f2" fillOpacity=".17" stroke="#c3a8ff" strokeWidth="2"/>
      <text x="260" y="62" textAnchor="middle" fill="#f4ebff" fontSize="29" fontWeight="700">2 mayores</text>
    </g>
    <text x="300" y="290" textAnchor="middle" fill="#c2aaff" fontSize="23">O</text>
    <g transform="translate(40 320)" opacity={.35+.65*p}>
      <rect width="520" height="100" rx="20" fill="#ac90f2" fillOpacity=".17" stroke="#c3a8ff" strokeWidth="2"/>
      <text x="260" y="62" textAnchor="middle" fill="#f4ebff" fontSize="29" fontWeight="700">1 mayor + 2 menores</text>
    </g>
    <text x="300" y="502" textAnchor="middle" fill="#bbcae1" fontSize="18">ESQUEMA CLÍNICO</text>
  </g>;
}
function Dyspnea({p}: {p: number}) {
 return <g>
  <path d="M260 75 Q300 50 340 75 Q356 90 350 140 L337 171 L387 201 Q415 218 420 261 L407 474 Q300 504 193 474 L180 261 Q185 218 213 201 L263 171 L250 140 Q244 90 260 75Z" fill="url(#body)" stroke="#c3def3" strokeOpacity=".45" strokeWidth="3"/>
  <g transform={`translate(300 300) scale(${.92+.08*p}) translate(-300 -300)`}>
   <path d="M285 198 C251 186 219 211 207 251 C193 297 200 348 214 369 C230 391 266 379 288 355Z M315 198 C349 186 381 211 393 251 C407 297 400 348 386 369 C370 391 334 379 312 355Z" fill="url(#lung)" stroke="#a4edf4" strokeWidth="3"/>
  </g>
  <path d="M138 296 Q120 267 138 238 M462 296 Q480 267 462 238" fill="none" stroke="#d1f6ff" strokeWidth="4" opacity={.4+.6*p}/>
  <text x="300" y="540" textAnchor="middle" fill="#d6eef6" fontSize="20" letterSpacing="2">TRABAJO RESPIRATORIO</text>
 </g>;
}

/** Vector schematic; all anatomy is original and no source infographic is embedded. */
export const MedicalVisual: React.FC<MedicalVisualProps> = ({kind, progress = 1, accent = '#5bd7ec'}) => {
  const p = clamp(progress);
  return <svg viewBox="0 0 600 580" width="100%" height="100%" role="img" aria-label={kind.startsWith('radiograph') ? 'Esquema radiográfico ilustrativo' : 'Esquema anatómico ilustrativo'}>
    <defs>
      <clipPath id="rightLungBranches"><rect x="0" y="0" width="300" height="580"/></clipPath>
      <clipPath id="leftLungBranches"><rect x="300" y="0" width="300" height="580"/></clipPath>
      <radialGradient id="pain"><stop stopColor="#ff897e" stopOpacity=".9"/><stop offset="1" stopColor="#f0525e" stopOpacity="0"/></radialGradient>
      <radialGradient id="halo"><stop stopColor={accent} stopOpacity=".24"/><stop offset="1" stopColor={accent} stopOpacity="0"/></radialGradient>
      <linearGradient id="body" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#345672" stopOpacity=".62"/><stop offset="1" stopColor="#0a2239" stopOpacity=".55"/></linearGradient>
      <linearGradient id="lung" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#87dbe4"/><stop offset=".48" stopColor="#397e9d"/><stop offset="1" stopColor="#17425f"/></linearGradient>
      <linearGradient id="fluid" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#7adffc" stopOpacity=".8"/><stop offset="1" stopColor="#1784bf"/></linearGradient>
      <linearGradient id="heart" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#ff9b96"/><stop offset=".55" stopColor="#d54b60"/><stop offset="1" stopColor="#852b4d"/></linearGradient>
    </defs>
    <circle cx="300" cy="290" r="265" fill="url(#halo)"/>
    <circle cx="300" cy="290" r="225" fill="none" stroke={accent} strokeOpacity=".12" strokeWidth="1"/>
    <circle cx="300" cy="290" r="255" fill="none" stroke={accent} strokeOpacity=".08" strokeWidth="1" strokeDasharray="3 13"/>
    {kind === 'radiograph' || kind === 'radiograph-air' ? <Radiograph p={p} air={kind === 'radiograph-air'}/> : kind === 'percussion' ? <Percussion p={p}/> : kind === 'signorelli' ? <Signorelli p={p}/> : kind === 'thoracentesis' ? <Thoracentesis p={p}/> : kind === 'jugular' ? <Jugular p={p}/> : kind === 'bnp' ? <BNP p={p}/> : kind === 'echo' ? <Echo p={p}/> : kind === 'framingham' ? <Framingham p={p}/> : kind === 'dyspnea' ? <Dyspnea p={p}/> : kind === 'light' ? <LightCriteria p={p}/> : kind === 'angina' ? <Angina p={p}/> : kind === 'cardiac-cycle' ? <CardiacCycle p={p}/> : kind === 'heart' || kind === 'circulation' ? <Heart p={p} circulation={kind === 'circulation'}/> : kind === 'edema' ? <Edema p={p}/> : <Thorax kind={kind} p={p}/>}
  </svg>;
};
