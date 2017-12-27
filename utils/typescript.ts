import { execSync } from 'child_process';

export function compile() {
    execSync(`npx tsc`);
}