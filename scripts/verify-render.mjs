import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';
const output='output/semiologia_practica_premium.mp4';
const probe=(file)=>JSON.parse(execFileSync('ffprobe',['-v','error','-show_entries','format=duration:stream=codec_name,codec_type,width,height,r_frame_rate','-of','json',file],{encoding:'utf8'}));
const input=probe('assets/narracao_es.flac'), rendered=probe(output);
const video=rendered.streams.find(s=>s.codec_type==='video'), audio=rendered.streams.find(s=>s.codec_type==='audio');
assert.ok(video && video.codec_name==='h264' && video.width===1920 && video.height===1080 && video.r_frame_rate==='30/1','Video format mismatch');
assert.equal(audio?.codec_name,'aac');
assert.ok(Math.abs(+rendered.format.duration - +input.format.duration)<0.15, 'Output duration mismatch');
const decode=(file,offset)=>execFileSync('ffmpeg',['-v','error','-ss',String(offset),'-t','3','-i',file,'-ac','1','-ar','24000','-f','f32le','pipe:1'],{maxBuffer:1024*1024});
for(const time of [15,255,501,840]) {
 const a=decode('assets/narracao_es.flac',time), b=decode(output,time);
 let best=-1, bestOffset=0;
 for(let shift=-2048;shift<=2048;shift++){let ab=0,aa=0,bb=0,count=0;for(let i=2048;i<Math.min(a.length/4,b.length/4-2048);i+=16){let x=a.readFloatLE(i*4),y=b.readFloatLE((i+shift)*4);ab+=x*y;aa+=x*x;bb+=y*y;count++;}let corr=ab/Math.sqrt(aa*bb);if(corr>best){best=corr;bestOffset=shift;}}
 assert.ok(best>.90,`Audio mismatch at ${time}s: correlation ${best}`);
 console.log(`${time}s: audio correlation ${best.toFixed(4)}, offset ${bestOffset} samples`);
}
console.log('Video format and duration verified.');
