import { render as renderSass } from "node-sass";
import { writeFile } from 'fs';
import { Observable, ISubject } from './observable';

export function compile(sourceDir: string, entryFile: string, destDir: string): ISubject<void> {
    var obs = Observable.create();

    renderSass({
        file: `${sourceDir}/${entryFile}`
    }, (err, result) => {
        writeFile(`${destDir}/stylesheet.css`, result.css, error => {
            if (error != null) {
                obs.error(error);
            } else {
                obs.next();
                obs.complete();
            }
        });
    });

    return obs;
}