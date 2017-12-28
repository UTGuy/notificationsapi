import * as sass from './sass';
import * as html from './html';
import * as typescript from './typescript';
import * as watch from './watch';
import { EOL } from 'os';
import { Observable, ISubject, ISubscribable } from './observable';
import { relative } from 'path';

export interface ICompilerConfig {
    sourceDir: string;
    destDir: string;
}

export class Compiler {
    configure(config: ICompilerConfig): Compiler {
        this.config = config;
        return this;
    }

    private copyHtml(): ISubject<void> {
        return html.copy(this.config.sourceDir, this.config.destDir);
    }

    private compileSass(): ISubject<void> {
        return sass.compile(this.config.sourceDir, 'index.scss', this.config.destDir);
    }

    private compileTs(): ISubject<string> {
        return typescript.compile(this.config.sourceDir, this.config.destDir);
    }

    watch() {
        watch.directory(this.config.sourceDir).subscribe({
            next: data => {
                console.log(data);
                switch (data!.extension) {
                    case ".html":
                        console.log('updating html');
                        this.copyHtml();
                        break;
                    case ".scss":
                        console.log('updating sass');
                        this.compileSass();
                        break;
                    case ".ts":
                        console.log('updating typescript');
                        this.compileTs();
                        break;
                }
            }
        });
    }

    compile(): ISubject<any> {
        const obs = new Observable<{ count: number, name: string }>();

        let count = 0;
        const onNext = (subject: () => ISubject<any>, name: string) => {
            console.log(`compiling ${name}`);
            subject().subscribe({
                next: (value) => {
                    if (value != null)
                        console.log(value)
                },
                complete: () => obs.next({ count: ++count, name: name })
            });
        };

        const total = 3;
        onNext(() => this.copyHtml(), 'html');
        onNext(() => this.compileSass(), 'sass');
        onNext(() => this.compileTs(), 'typescript');

        obs.subscribe({
            next: data => {
                console.log(`completed(${data!.count}/${total}) ${data!.name}`);
                if (data!.count < total)
                    return;
                obs.complete();
            }
        });

        return obs;
    }

    config: ICompilerConfig;
}