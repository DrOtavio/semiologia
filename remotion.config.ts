import {Config} from '@remotion/cli/config';
import {existsSync} from 'node:fs';
if (existsSync('/usr/bin/chromium')) Config.setBrowserExecutable('/usr/bin/chromium');
