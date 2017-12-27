import { copyFileSync } from 'fs';
import * as glob from 'glob';

export function copy(sourceDir: string, destDir: string) {
    glob(`${sourceDir}/**/*.html`, (err, files) => {
        files.forEach(file => {
            copyFileSync(file, file.replace(sourceDir, destDir));
        });
    });
}