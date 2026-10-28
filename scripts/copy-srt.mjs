import {mkdir,copyFile} from 'node:fs/promises';
await mkdir('output',{recursive:true});
await copyFile('src/data/semiologia_practica_es.srt','output/semiologia_practica_es.srt');
