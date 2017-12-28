import { copyFile } from 'fs';
import * as glob from 'glob';
import { Observable, ISubject } from './observable';

export function copy(sourceDir: string, destDir: string): ISubject<void> {
    var obs = new Observable<void>();

    glob(`${sourceDir}/**/*.html`, (err, files) => {
        let count = 0;
        let total = files.length;
        files.forEach(file => {
            copyFile(file, file.replace(sourceDir, destDir), (error) => {
                if (error != null) {
                    obs.error(error);
                } else {
                    count++;
                    obs.next(file);
                    if (count == total)
                        obs.complete();
                }
            });
        });
    });

    return obs;
}