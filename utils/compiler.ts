import * as sass from './sass';
import * as html from './html';
import * as typescript from './typescript';
import * as watch from './watch';
import {Observable, ISubject} from './observable';

export interface ICompilerConfig {
    sourceDir: string;
    destDir: string;
}

export class Compiler {
    configure(config: ICompilerConfig) {
        this.config = config;
    }

    private copyHtml() {
        console.log('copy Html');
        html.copy(this.config.sourceDir, this.config.destDir);
    }

    private compileSass() {
        console.log('compile Sass');
        sass.compile(this.config.sourceDir, 'index.scss', this.config.destDir);
    }

    private compileTs() {
        console.log('compile Ts');
        typescript.compile();
    }

    watch() {
        watch.directory(this.config.sourceDir).subscribe({
            next: data => {
                console.log(data);
                switch (data.extension) {
                    case ".html":
                        this.copyHtml();
                        break;
                    case ".scss":
                        this.compileSass();
                        break;
                    case ".ts":
                        this.compileTs();
                        break;
                }
            }
        });
    }

    compile(): ISubject<void> {
        const obs = new Observable<void>();

        this.copyHtml();
        this.compileSass();
        this.compileTs();

        return obs;
    }

    config: ICompilerConfig;
}