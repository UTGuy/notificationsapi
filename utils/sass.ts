import { render as renderSass } from "node-sass";
import { writeFileSync } from 'fs';

export function compile(sourceDir: string, entryFile: string, destDir: string) {
    renderSass({
        file: `${sourceDir}/${entryFile}`
    }, (err, result) => {
        writeFileSync(`${destDir}/stylesheet.css`, result.css);
    });
}