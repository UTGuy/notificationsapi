import * as commandline from './utils/commandline';
import { Compiler } from './utils/compiler';
import * as server from './utils/server';

function onCompileComplete() {
    server.start();

    if (commandline.hasArg('-w'))
        compiler.watch();
}

const compiler = new Compiler();
compiler.configure({
    sourceDir: "./src",
    destDir: "./dest"
}).compile().subscribe({
    complete: onCompileComplete
});