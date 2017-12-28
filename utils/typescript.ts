import { exec } from 'child_process';
import { Observable, ISubject } from './observable';
import * as ts from 'typescript';
import { readFileSync, writeFileSync } from 'fs';

declare global {
    interface Error {
        code: number;
    }
}

export function compile(sourceDir: string, destDir: string): ISubject<string> {
    var obs = new Observable<string>();

    const requireSource = readFileSync('./utils/require.ts').toString();
    const requireOutput = ts.transpileModule(requireSource, {});
    writeFileSync(`${destDir}/require.js`, requireOutput.outputText);

    const command = `npx -q tsc -p ${sourceDir} -outDir ${destDir}`;
    obs.next(`command: ${command}`);

    const child = exec(command, (error, stdout, stderr) => {
        if (error) {
            obs.error(stderr);
            return;
        }

        if (stderr) {
            obs.error(stderr);
        }

        if (stdout) {
            obs.next(stdout);
        }
    });

    child.on('close', (code: number) => {
        if (code !== 0)
            return;
        obs.complete();
    });

    return obs;
}