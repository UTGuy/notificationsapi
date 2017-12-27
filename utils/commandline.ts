export function hasArg(name): boolean {
    return process.argv.indexOf(name) > -1;
}