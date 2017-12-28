import { exec } from 'child_process';
import { Observable, ISubject } from './observable';
import * as ts from 'typescript';
import { readFileSync, writeFileSync } from 'fs';

declare global {
    interface Error {
        code: number;
    }
}

class TsCompiler extends Observable<string> {
    constructor() {
        super();
    }

    configure(sourceDir: string, destDir: string) {
        this.sourceDir = sourceDir;
        this.destDir = destDir;
    }

    private compileRequire() {
        const requireSource = readFileSync('./utils/require.ts').toString();
        const requireOutput = ts.transpileModule(requireSource, {});
        writeFileSync(`${this.destDir}/require.js`, requireOutput.outputText);
    }

    compile() {
        this.compileRequire();

        const command = `npx -q tsc -p ${this.sourceDir} -outDir ${this.destDir}`;
        this.next(`[TsCompiler]: ${command}`);

        exec(command, (error, stdout, stderr) => {
            if (error) {
                this.error(stderr);
                return;
            }

            if (stderr)
                this.error(stderr);

            if (stdout)
                this.next(stdout);
        }).on('close', (code: number) => {
            if (code !== 0)
                return;
            this.complete();
        });
    }

    private sourceDir: string;
    private destDir: string;
}

export function compile(sourceDir: string, destDir: string): ISubject<string> {
    var compiler = new TsCompiler();
    compiler.configure(sourceDir, destDir);
    compiler.compile();
    return compiler;
}