import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';

// A full render is checked by default. For the render of a frame range, pass
// --sample <file> <source-start-seconds>; the source timestamp is explicit.
const args = process.argv.slice(2);
const sample = args[0] === '--sample';
assert.ok(args.length === 0 || (sample && args.length === 3), 'Usage: node scripts/verify-render.mjs [--sample <mp4> <source-start-seconds>]');
const source = 'assets/narracao_es.flac';
const output = sample ? args[1] : 'output/semiologia_practica_premium.mp4';
const sampleStart = sample ? Number(args[2]) : 0;
assert.ok(Number.isFinite(sampleStart) && sampleStart >= 0, 'Invalid source start');
const probe = (file) => JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration:stream=codec_name,codec_type,width,height,r_frame_rate,duration', '-of', 'json', file], {encoding: 'utf8'}));
const input = probe(source), rendered = probe(output);
const sourceDuration = Number(input.format.duration);
const containerDuration = Number(rendered.format.duration);
const video = rendered.streams.find(s => s.codec_type === 'video');
const audio = rendered.streams.find(s => s.codec_type === 'audio');
assert.ok(video && video.codec_name === 'h264' && video.width === 1920 && video.height === 1080 && video.r_frame_rate === '30/1', 'Video must be H.264, 1920x1080, 30 fps');
assert.equal(audio?.codec_name, 'aac', 'Audio must be AAC');
assert.ok(Number.isFinite(sourceDuration) && Number.isFinite(containerDuration), 'Invalid duration');
if (!sample) {
 assert.ok(Math.abs(containerDuration - sourceDuration) < 0.15, 'Container duration does not match narration');
 assert.ok(Number.isFinite(Number(video.duration)) && Math.abs(Number(video.duration)-sourceDuration)<0.1, 'Video duration does not match narration');
 assert.ok(Number.isFinite(Number(audio.duration)) && Math.abs(Number(audio.duration)-sourceDuration)<0.15, 'Audio duration does not match narration');
} else {
 assert.ok(containerDuration >= 1 && sampleStart + containerDuration <= sourceDuration + 0.15, 'Sample is too short or extends past the source');
}

const rate = 24000;
const decode = (file, offset, seconds) => {
 const buffer = execFileSync('ffmpeg', ['-v', 'error', '-ss', String(offset), '-t', String(seconds), '-i', file, '-ac', '1', '-ar', String(rate), '-f', 'f32le', 'pipe:1'], {maxBuffer: 128 * 1024 * 1024});
 assert.ok(buffer.length >= rate * 4, `Decoded audio too short: ${file}`);
 return new Float32Array(buffer.buffer, buffer.byteOffset, buffer.byteLength / 4);
};
// Search for a small codec/seek offset. Subsampled dot products retain the
// waveform information while keeping verification practical in CI. This is a
// lossy-encoding check, not a proof of every sample or visual synchronization.
const compare = (sourceOffset, outputOffset, seconds) => {
 const a = decode(source, sourceOffset, seconds), b = decode(output, outputOffset, seconds);
 const margin = 2048;
 assert.ok(Math.min(a.length,b.length) > margin * 2, 'Insufficient samples for correlation');
 let best = -Infinity, bestOffset = 0;
 for (let shift = -margin; shift <= margin; shift++) {
  let xy=0, xx=0, yy=0;
  for (let i=margin, end=Math.min(a.length,b.length)-margin; i<end; i+=16) {
   const x=a[i], y=b[i+shift]; xy+=x*y; xx+=x*x; yy+=y*y;
  }
  if (xx > 1e-9 && yy > 1e-9) {
   const correlation = xy / Math.sqrt(xx*yy);
   if (correlation > best) {best=correlation; bestOffset=shift;}
  }
 }
 assert.ok(best > 0.90, `Audio mismatch at ${sourceOffset}s: correlation ${best.toFixed(4)}`);
 console.log(`${sourceOffset.toFixed(2)}s: audio correlation ${best.toFixed(4)}, codec/seek offset ${bestOffset} samples`);
 return bestOffset;
};
const verifyContinuous = (sourceOffset, outputOffset, duration, shift) => {
 const a=decode(source,sourceOffset,duration), b=decode(output,outputOffset,duration+0.1);
 const start=Math.max(0,-shift), end=Math.min(a.length,b.length-shift);
 assert.ok(end-start >= Math.max(0,Math.min(a.length,duration*rate)-rate*.15), 'Output misses an audible portion of the source');
 let verified=0, quiet=0;
 for(let pos=start;pos<end;pos+=rate) {
  const limit=Math.min(pos+rate,end); let xx=0,yy=0,xy=0;
  for(let i=pos;i<limit;i+=2){const x=a[i],y=b[i+shift];xx+=x*x;yy+=y*y;xy+=x*y;}
  const count=Math.ceil((limit-pos)/2), rms=Math.sqrt(xx/count), outRms=Math.sqrt(yy/count);
  if(rms<0.001) {assert.ok(outRms<0.01, `Unexpected sound near ${(sourceOffset+pos/rate).toFixed(2)}s`);quiet++;continue;}
  const correlation=xy/Math.sqrt(xx*yy);
  assert.ok(correlation>0.90, `Audio differs near ${(sourceOffset+pos/rate).toFixed(2)}s: correlation ${correlation.toFixed(4)}`);
  verified++;
 }
 assert.ok(verified>0, 'No non-silent audio windows were checked');
 console.log(`Checked ${verified} audible and ${quiet} quiet one-second windows.`);
};
if (sample) {
 const duration=Number(video.duration);
 const shift=compare(sampleStart,0,Math.min(3,duration));
 verifyContinuous(sampleStart,0,duration,shift);
} else {
 const times = [15, 255, 501, 840, Math.max(0, sourceDuration - 3.5)];
 for (const time of times) compare(time, time, 3);
 const shift=compare(0,0,3);
 verifyContinuous(0,0,sourceDuration,shift);
}
console.log(sample ? 'Sample video format and audio checked.' : 'Video format, duration, and continuous audio checked.');
