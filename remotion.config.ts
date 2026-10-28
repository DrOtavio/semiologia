import {Config} from '@remotion/cli/config';

// CI uses Remotion's managed Chrome Headless Shell. A local installation may
// opt in to a system Chromium by setting this variable to its executable path.
const browserExecutable = process.env.REMOTION_BROWSER_EXECUTABLE;
if (browserExecutable) Config.setBrowserExecutable(browserExecutable);
