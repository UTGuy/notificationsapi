export function hasArg(name: string): boolean {
    return process.argv.indexOf(name) > -1;
}