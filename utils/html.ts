import { copyFile } from 'fs';
import * as glob from 'glob';
import { Observable, ISubject } from './observable';

class FileCopier extends Observable<string> {
    constructor() {
        super();
    }

    configure(sourceDir: string, destDir: string) {
        this.sourceDir = sourceDir;
        this.destDir = destDir;
    }

    private async getFiles(): Promise<string[]> {
        return new Promise<string[]>((resolve, reject) => {
            const command = `${this.sourceDir}/**/*.html`;
            this.next(`[HtmlCopier]: ${command}`);
            glob(command, (error, files) => {
                if (error != null)
                    return reject(error);
                resolve(files);
            })
        });
    }

    private copyToDestination(sourceFile: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const destFile = sourceFile.replace(this.sourceDir, this.destDir);
            copyFile(sourceFile, destFile, (error) => {
                if (error != null)
                    return reject(error);
                resolve(destFile);
            });
        });
    }

    async copy() {
        try {
            const files = await this.getFiles();
            const tasks = files.map(sourceFile => this.copyToDestination(sourceFile));
            tasks.forEach(task => task.then(
                file => this.next(file),
                error => this.error(error)
            ));
            await Promise.all(tasks);
            this.complete();
        } catch (ex) {
            this.error(ex);
        }
    }

    private sourceDir: string;
    private destDir: string;
}

export function copy(sourceDir: string, destDir: string): ISubject<string> {
    var copier = new FileCopier();
    copier.configure(sourceDir, destDir);
    copier.copy();
    return copier;
}