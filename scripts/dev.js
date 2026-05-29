import { spawn } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';

const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
let shuttingDown = false;

const commands = [
  { name: 'backend', cwd: 'backend', args: ['run', 'dev'] },
  { name: 'frontend', cwd: 'frontend', args: ['run', 'dev'] },
];

const children = commands.map(({ name, cwd, args }) => {
  const child = spawn(npmCmd, args, {
    cwd: resolve(rootDir, cwd),
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  child.on('exit', (code) => {
    if (code && !shuttingDown) {
      console.error(`${name} exited with code ${code}`);
      shutdown(code);
    }
  });

  return child;
});

function shutdown(code = 0) {
  shuttingDown = true;
  for (const child of children) {
    if (!child.killed) child.kill();
  }
  process.exit(code);
}

process.on('SIGINT', () => shutdown());
process.on('SIGTERM', () => shutdown());
