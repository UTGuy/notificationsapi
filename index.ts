import * as commandline from './utils/commandline';
import { Compiler } from './utils/compiler';
import * as server from './utils/server';

const compiler = new Compiler();
compiler.configure({
    sourceDir: "./src",
    destDir: "./dest"
});
compiler.compile();

server.start();

if(commandline.hasArg('-w'))
    compiler.watch();