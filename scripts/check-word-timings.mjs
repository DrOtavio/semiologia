import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const words = JSON.parse(readFileSync('src/data/word-timings.json', 'utf8'));
const scenes = JSON.parse(readFileSync('src/data/timeline.json', 'utf8'));
const asr = JSON.parse(readFileSync('src/data/asr-words.json', 'utf8'));
const norm = (s) => s.normalize('NFD').replace(/\p{M}/gu,'').toLowerCase().replace(/[^a-z0-9]/g, '');
const tokenRe = /[\p{L}\p{N}_]+/gu;
const observations = new Set(asr.flatMap(w => [...w.word.matchAll(tokenRe)].map(m => [norm(m[0]), Number(w.start).toFixed(3), Number(w.end).toFixed(3)].join('|'))));
assert.equal(words.scenes.length, scenes.length, 'Timeline and word scene counts differ');
let previousEnd = 0, total = 0;
const counts = {'asr-exact': 0, interpolated: 0, unresolved: 0};
for (const [i, timedScene] of words.scenes.entries()) {
  const scene = scenes[i];
  assert.equal(timedScene.sceneIndex, i, 'Scene ordering differs');
  assert.equal(timedScene.start, scene.start); assert.equal(timedScene.end, scene.end);
  assert.deepEqual(timedScene.words.map(w => norm(w.text)), [...scene.narrationText.matchAll(tokenRe)].map(m => norm(m[0])), `Words missing in scene ${i}`);
  for (const w of timedScene.words) {
    assert.ok(Object.hasOwn(counts, w.source), `Unknown source: ${w.source}`); counts[w.source]++; total++;
    if (w.source === 'unresolved') {
      assert.equal(w.start, null); assert.equal(w.end, null);
      assert.equal(w.bounds.length, 2);
      continue;
    }
    assert.ok(Number.isFinite(w.start) && Number.isFinite(w.end) && w.end >= w.start, 'Invalid word interval');
    assert.ok(w.start >= scene.start - 0.1 && w.end <= scene.end + 0.1, `Word outside scene ${i}`);
    assert.ok(w.start >= previousEnd - 0.01, `Nonmonotonic interval at scene ${i}`); previousEnd = w.end;
    if (w.source === 'asr-exact') assert.ok(observations.has([norm(w.text), w.start.toFixed(3), w.end.toFixed(3)].join('|')), `ASR source is not an exact word observation: ${w.text}`);
    if (w.source === 'interpolated') assert.equal(w.confidence, null, 'Interpolated timing must not pretend to have ASR confidence');
  }
}
assert.deepEqual(counts, words.counts); assert.equal(total, words.sourceWords);
console.log(`Validated ${total} script tokens: ${counts['asr-exact']} ASR matches, ${counts.interpolated} estimates, ${counts.unresolved} unresolved.`);
