#!/usr/bin/env python3
"""List transcript tokens lacking exact ASR matches, for manual audio review.

The ASR output is evidence, not a ground truth transcript. Candidate intervals
are bounded by neighboring ASR words and must be checked by listening.
"""
import difflib, json, re, unicodedata
from pathlib import Path
root = Path(__file__).resolve().parent.parent
source = (root / 'assets/roteiro_es.txt').read_text(encoding='utf-8')
words = json.loads((root / 'src/data/asr-words.json').read_text(encoding='utf-8'))
pattern = re.compile(r'[\wáéíóúüñ]+', re.I)
def norm(s):
    return re.sub(r'[^a-z0-9]', '', ''.join(c for c in unicodedata.normalize('NFD', s.lower()) if unicodedata.category(c) != 'Mn'))
tokens = list(pattern.finditer(source))
target = [norm(m.group()) for m in tokens]
actual = [(norm(t), w['start'], w['end']) for w in words for t in pattern.findall(w['word'])]
matched = [None] * len(tokens)
for ai, bi, length in difflib.SequenceMatcher(None, target, [a[0] for a in actual], autojunk=False).get_matching_blocks():
    for offset in range(length): matched[ai+offset] = actual[bi+offset][1:]
reviews = []
i = 0
while i < len(tokens):
    if matched[i] is not None:
        i += 1
        continue
    j = i
    while j < len(tokens) and matched[j] is None: j += 1
    reviews.append({'text': source[tokens[i].start():tokens[j-1].end()], 'words': j-i,
                    'start_bound': matched[i-1][1] if i else 0,
                    'end_bound': matched[j][0] if j < len(tokens) else 864.522708})
    i = j
out = {'method': 'Unmatched transcript tokens bounded by nearest exact ASR matches; manual review required.',
       'unmatched_words': sum(item['words'] for item in reviews), 'intervals': reviews}
(root / 'src/data/alignment-review.json').write_text(json.dumps(out, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f"{len(reviews)} intervals; {out['unmatched_words']} unmatched words")
