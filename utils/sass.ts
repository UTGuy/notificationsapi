import { render as renderSass } from 'node-sass';
import { writeFile } from 'fs';
import { Observable, ISubject } from './observable';

class SassCompiler extends Observable<string> {
    constructor() {
        super();
    }

    configure(sourceDir: string, destDir: string, entryFile: string) {
        this.sourceDir = sourceDir;
        this.destDir = destDir;
        this.entryFile = entryFile;
    }

    async compileSass(): Promise<Buffer> {
        return new Promise<Buffer>((resolve, reject) => {
            const command = `${this.sourceDir}/${this.entryFile}`;
            this.next(`[SassCompiler]: ${command}`);
            renderSass({
                file: command
            }, (error, result) => {
                if (error) {
                    this.error(error);
                    return;
                }
                resolve(result.css);
            });
        });
    }

    async writeFile(css: Buffer): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const file = `${this.destDir}/stylesheet.css`;
            writeFile(file, css, error => {
                if (error != null)
                    return reject(error);
                resolve(file);
            });
        });
    }

    async compile() {
        try {
            const css = await this.compileSass();
            const file = await this.writeFile(css);
            this.next(file);
            this.complete();
        } catch (ex) {
            this.error(ex);
        }
    }

    private sourceDir: string;
    private destDir: string;
    private entryFile: string;
}

export function compile(sourceDir: string, entryFile: string, destDir: string): ISubject<string> {
    const compiler = new SassCompiler();
    compiler.configure(sourceDir, destDir, entryFile);
    compiler.compile();
    return compiler;
}