#!/usr/bin/env python3
"""Align script words to observed Whisper timestamps; unmatched values remain estimates.

Reproducible from checked-in ASR observations, original script, and timeline. The
result is not a forced alignment or a substitute for listening to the audio.
"""
import difflib
import json
import re
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ASR = json.loads((ROOT / 'src/data/asr-words.json').read_text(encoding='utf-8'))
SCENES = json.loads((ROOT / 'src/data/timeline.json').read_text(encoding='utf-8'))
SCRIPT = (ROOT / 'assets/roteiro_es.txt').read_text(encoding='utf-8')
PATTERN = re.compile(r'[\wáéíóúüñ]+', re.I)

def norm(text):
    return re.sub(r'[^a-z0-9]', '', ''.join(c for c in unicodedata.normalize('NFD', text.lower()) if unicodedata.category(c) != 'Mn'))

source_tokens = [m.group() for m in PATTERN.finditer(SCRIPT)]
scene_tokens = [[m.group() for m in PATTERN.finditer(scene['narrationText'])] for scene in SCENES]
tokens = [word for words in scene_tokens for word in words]
if [norm(t) for t in tokens] != [norm(t) for t in source_tokens]:
    raise ValueError('Timeline words differ from source or are not in source order')
observations = [(norm(token), float(w['start']), float(w['end']), float(w.get('probability', 0)))
                for w in ASR for token in PATTERN.findall(w['word'])]
anchors = [None] * len(tokens)
for a, b, size in difflib.SequenceMatcher(None, [norm(t) for t in tokens], [v[0] for v in observations], autojunk=False).get_matching_blocks():
    for j in range(size):
        obs = observations[b+j]
        anchors[a+j] = {'start': round(obs[1], 3), 'end': round(obs[2], 3), 'source': 'asr-exact', 'confidence': round(obs[3], 4)}

# Fill only sufficiently bounded, temporally plausible unmatched runs. The
# interpolated timestamps are visibly marked as estimates. Never invent times
# for the final words that are missing from the supplied recording.
i = 0
while i < len(tokens):
    if anchors[i] is not None:
        i += 1
        continue
    j = i
    while j < len(tokens) and anchors[j] is None:
        j += 1
    left = anchors[i-1]['end'] if i else 0.0
    right = anchors[j]['start'] if j < len(tokens) else float(SCENES[-1]['end'])
    bounded = i > 0 and j < len(tokens) and right > left and (j-i)/(right-left) <= 8.0
    for k in range(i, j):
        if bounded:
            a = left + (right-left)*(k-i)/(j-i)
            b = left + (right-left)*(k-i+1)/(j-i)
            anchors[k] = {'start': round(a, 3), 'end': round(b, 3), 'source': 'interpolated', 'confidence': None}
        else:
            anchors[k] = {'start': None, 'end': None, 'source': 'unresolved', 'confidence': None,
                          'bounds': [round(left, 3), round(right, 3)]}
    i = j

out_scenes = []
offset = 0
for index, (scene, words) in enumerate(zip(SCENES, scene_tokens)):
    annotated = [{'text': word, **anchors[offset+k]} for k, word in enumerate(words)]
    out_scenes.append({'sceneIndex': index, 'start': scene['start'], 'end': scene['end'], 'words': annotated})
    offset += len(words)
counts = {kind: sum(a['source'] == kind for a in anchors) for kind in ['asr-exact', 'interpolated', 'unresolved']}
out = {'method': 'Exact normalized transcript-to-Whisper word matching; other bounded times linearly interpolated. Not manually reviewed.',
       'units': 'seconds, absolute in original FLAC', 'sourceWords': len(tokens), 'counts': counts, 'scenes': out_scenes}
(ROOT / 'src/data/word-timings.json').write_text(json.dumps(out, ensure_ascii=False, separators=(',', ':')) + '\n', encoding='utf-8')
print(f"{len(out_scenes)} scenes; {len(tokens)} words: {counts}")
