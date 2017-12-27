import { exec } from 'child_process';

export function start() {
    console.log('starting server');
    const serverProcess = exec('npx lite-server');
    serverProcess.stdout.pipe(process.stdout);
    serverProcess.stderr.pipe(process.stderr);
}