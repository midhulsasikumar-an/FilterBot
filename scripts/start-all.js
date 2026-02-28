const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

const children = [];
let shuttingDown = false;

function run(name, command, args, options = {}) {
  const { failOnError = true, ...spawnOptions } = options;
  const child = spawn(command, args, {
    stdio: 'inherit',
    shell: false,
    ...spawnOptions,
  });

  child.on('error', (error) => {
    console.error(`[${name}] failed to start: ${error.message}`);
    if (failOnError) {
      shutdown(1);
    }
  });

  child.on('exit', (code) => {
    if (!shuttingDown && code !== 0) {
      console.error(`[${name}] exited with code ${code}`);
      shutdown(code || 1);
    }
  });

  children.push(child);
  return child;
}

function shutdown(exitCode = 0) {
  if (shuttingDown) return;
  shuttingDown = true;

  for (const child of children) {
    if (!child.killed) {
      child.kill();
    }
  }

  process.exit(exitCode);
}

function startBackend() {
  const backendArgs = ['python_backend/app.py'];
  const backend = run('backend', 'python', backendArgs, {
    failOnError: false,
    cwd: rootDir,
  });

  backend.on('error', () => {
    run('backend', 'py', ['-3', ...backendArgs], { cwd: rootDir });
  });
}

const reactStartScript = path.join(
  rootDir,
  'node_modules',
  'react-scripts',
  'scripts',
  'start.js'
);

if (!fs.existsSync(reactStartScript)) {
  console.error('[frontend] Missing dependencies. Run: npm install');
  process.exit(1);
}

run('frontend', process.execPath, [reactStartScript], { cwd: rootDir });
startBackend();

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));
