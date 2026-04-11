#!/usr/bin/env node
'use strict';

const { spawnSync } = require('child_process');

function run(command, args) {
  const result = spawnSync(command, args, { stdio: 'inherit' });
  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}

const contextName = (process.env.STATE_context_name || '').trim();
if (!contextName) {
  console.log('No context_name state found; skipping cleanup.');
  process.exit(0);
}

run('docker', ['context', 'use', 'default']);
run('docker', ['context', 'rm', '-f', contextName]);
