import React from 'react';

/** Original schematic artwork. `progress` controls the clinical change, from 0 to 1. */
export type MedicalVisualKind = 'effusion' | 'pneumothorax' | 'tension' | 'heart' | 'circulation' | 'edema' | 'radiograph' | 'radiograph-air' | 'light' | 'angina' | 'cardiac-cycle';
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
    <path d={lungRight} fill="url(#lung)" stroke="#97e8f0" strokeWidth="3" transform={collapsed ? `translate(${(1-(1-.38*p))*285} ${(1-(1-.34*p))*300}) scale(${1-.38*p} ${1-.34*p})` : undefined}/>
    <path d={lungLeft} fill="url(#lung)" stroke="#97e8f0" strokeWidth="3"/>
    {collapsed ? <>
      <g transform={`translate(${(1-(1-.38*p))*285} ${(1-(1-.34*p))*300}) scale(${1-.38*p} ${1-.34*p})`}><g clipPath="url(#rightLungBranches)">{branches}</g></g>
      <g clipPath="url(#leftLungBranches)">{branches}</g>
    </> : branches}
    <path d="M300 244 C280 227 258 247 260 271 C262 295 285 316 300 331 C315 316 338 295 340 271 C342 247 320 227 300 244Z" fill="#e35f69" opacity=".8" transform={`translate(${shifted} 0)`}/>
    {isEffusion && <path d={`M152 ${470-155*p} Q190 ${476-110*p} 291 ${470-155*p} L291 454 Q268 478 217 478 Q164 478 152 441 Z`} fill="url(#fluid)" stroke="#8be6ff" strokeWidth="3" opacity={p}/>}
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
      <path d="M261 225 Q220 228 202 280 L183 330 M190 315 L183 330 L199 326"/>
      <path d="M300 195 Q294 159 282 126 M277 140 L282 126 L294 136"/>
      <path d="M339 224 Q378 229 399 269 M388 263 L399 269 L399 255"/>
    </g>
    <text x="300" y="530" textAnchor="middle" fill="#ffd4c9" fontSize="21" fontWeight="700">DOLOR RETROESTERNAL · IRRADIACIÓN</text>
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
    {kind === 'light' ? <LightCriteria p={p}/> : kind === 'angina' ? <Angina p={p}/> : kind === 'cardiac-cycle' ? <CardiacCycle p={p}/> : kind === 'heart' || kind === 'circulation' ? <Heart p={p} circulation={kind === 'circulation'}/> : kind === 'edema' ? <Edema p={p}/> : <Thorax kind={kind === 'radiograph' ? 'effusion' : kind === 'radiograph-air' ? 'pneumothorax' : kind} p={p}/>}
    {kind.startsWith('radiograph') && <text x="300" y="555" textAnchor="middle" fill="#c7e8f2" opacity=".7" fontFamily="sans-serif" fontSize="17" letterSpacing="2">ESQUEMA ILUSTRATIVO</text>}
  </svg>;
};
