import data from './word-timings.json';

/**
 * Return an absolute FLAC timestamp for a phrase within the requested scene.
 * Values with source 'interpolated' are estimates; none have been confirmed by
 * listening. An unresolved occurrence returns undefined instead of fabricating
 * an audio anchor. Pass a 0-based occurrence for repeated phrases.
 */
export type TimingSource = 'asr-exact' | 'interpolated';
export type PhraseTiming = {start: number; end: number; source: TimingSource};
const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
const tokenPattern = /[\p{L}\p{N}_]+/gu;
export function phraseTiming(sceneStart: number, phrase: string, occurrence = 0): PhraseTiming | undefined {
  const scene = data.scenes.find(item => Math.abs(item.start - sceneStart) < 0.001);
  const terms = [...phrase.matchAll(tokenPattern)].map(item => normalize(item[0]));
  if (!scene || !terms.length || occurrence < 0) return undefined;
  let matches = 0;
  for (let i = 0; i <= scene.words.length - terms.length; i++) {
    const candidate = scene.words.slice(i, i + terms.length);
    if (!candidate.every((word, j) => normalize(word.text) === terms[j])) continue;
    if (matches++ !== occurrence) continue;
    const first = candidate[0], last = candidate[candidate.length - 1];
    if (first.start == null || last.end == null || candidate.some(word => word.source === 'unresolved')) return undefined;
    return {start: first.start, end: last.end, source: candidate.some(word => word.source === 'interpolated') ? 'interpolated' : 'asr-exact'};
  }
  return undefined;
}
/** Frame index relative to the scene at which a phrase begins. */
export function phraseFrame(sceneStart: number, phrase: string, fps = 30, occurrence = 0): number | undefined {
  const timing = phraseTiming(sceneStart, phrase, occurrence);
  return timing ? Math.max(0, Math.round((timing.start - sceneStart) * fps)) : undefined;
}
