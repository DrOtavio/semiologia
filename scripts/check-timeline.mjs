import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const scenes=JSON.parse(readFileSync('src/data/timeline.json','utf8'));
assert.ok(scenes.length > 50, 'Timeline must contain individual ideas');
const expected=864.522708;
assert.ok(scenes[0].start < 0.5, 'Timeline must start with the narration');
let last=0;
for (const [i,s] of scenes.entries()) {
 assert.ok(s.narrationText && s.section && s.visualType && s.transition, `Missing metadata at ${i}`);
 assert.ok(Number.isFinite(s.start) && Number.isFinite(s.end) && s.end>s.start, `Invalid interval at ${i}`);
 assert.ok(s.start>=last-0.001, `Overlap at ${i}`);
 assert.ok(s.start-last<1, `Gap at ${i}`);
 last=s.end;
}
assert.ok(Math.abs(last-expected)<0.1, 'Timeline duration must match audio');
const text=s=>s.normalize('NFC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,'');
const source=text(readFileSync('assets/roteiro_es.txt','utf8'));
const represented=text(scenes.map(s=>s.narrationText).join(' '));
assert.equal(represented,source,'Timeline must preserve all of the source script in order');
const sections=scenes.map(s=>s.section.toLowerCase()).join(' ');
for(const label of ['derrame','neumotórax','cardiovascular','insuficiencia']) assert.ok(sections.includes(label),`Missing section: ${label}`);
console.log(`Validated ${scenes.length} scenes and ${last.toFixed(3)} seconds.`);
