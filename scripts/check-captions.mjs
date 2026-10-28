import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const content=readFileSync('src/data/semiologia_practica_es.srt','utf8').trim();
const cues=content.split(/\r?\n\s*\r?\n/);
assert.ok(cues.length > 50, 'SRT must contain captions for the full narration');
const toSeconds=(s)=>{const m=/^(\d{2}):(\d{2}):(\d{2}),(\d{3})$/.exec(s);assert.ok(m,`Invalid SRT time ${s}`);return +m[1]*3600 + +m[2]*60 + +m[3] + +m[4]/1000;};
let lastEnd=0;
const captionBodies=[];
for (const [index,cue] of cues.entries()) {
 const [number,range,...body]=cue.split(/\r?\n/);
 assert.equal(+number,index+1,`Caption number ${index+1}`);
 assert.ok(body.join(' ').trim(),`Caption ${index+1} is empty`);
 captionBodies.push(body.join(' '));
 const parts=range.split(' --> ');
 assert.equal(parts.length,2,`Caption ${index+1} has malformed range`);
 const start=toSeconds(parts[0]), end=toSeconds(parts[1]);
 assert.ok(start>=lastEnd-0.001 && end>start,`Caption ${index+1} overlaps or has invalid duration`);
 assert.ok(end<=864.523+0.001,`Caption ${index+1} exceeds audio duration`);
 lastEnd=end;
}
assert.ok(lastEnd>864, 'SRT does not reach the end of narration');
// The supplied recording ends after “Fin”; the remaining closing words in the
// script are not audible. Keep that one documented exception explicit.
const normalize=(text)=>text.normalize('NFC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,'');
const script=normalize(readFileSync('assets/roteiro_es.txt','utf8'));
const captions=normalize(captionBodies.join(' '));
const missingClosing=normalize('de la lectura de la infografía de Semiología Práctica');
assert.equal(captions+missingClosing,script,'SRT must cover the script, except for the documented inaudible ending');
console.log(`Validated ${cues.length} captions ending at ${lastEnd.toFixed(3)} seconds.`);
