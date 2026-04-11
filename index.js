#!/usr/bin/env node
'use strict';

const { spawnSync } = require('child_process');
const fs = require('fs');

function getInput(name) {
  const envName = `INPUT_${name.toUpperCase()}`;
  return (process.env[envName] || '').trim();
}

function requireInput(name) {
  const value = getInput(name);
  if (!value) {
    console.error(`Missing required input: ${name}`);
    process.exit(1);
  }
  return value;
}

function run(command, args) {
  const result = spawnSync(command, args, { stdio: 'inherit' });
  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}

function runAllowFail(command, args) {
  spawnSync(command, args, { stdio: 'inherit' });
}

function writeOutput(name, value) {
  const outputPath = process.env.GITHUB_OUTPUT;
  if (!outputPath) {
    return;
  }
  fs.appendFileSync(outputPath, `${name}=${value}\n`);
}

function saveState(name, value) {
  const statePath = process.env.GITHUB_STATE;
  if (!statePath) {
    return;
  }
  fs.appendFileSync(statePath, `${name}=${value}\n`);
}

requireInput('environment');
const serverIpAddress = requireInput('server_ip_address');
const serverSshUser = requireInput('server_ssh_user');
const contextName = requireInput('context_name');

saveState('context_name', contextName);

runAllowFail('docker', ['context', 'rm', '-f', contextName]);
run('docker', [
  'context',
  'create',
  contextName,
  '--docker',
  `host=ssh://${serverSshUser}@${serverIpAddress}`,
]);
run('docker', ['context', 'use', contextName]);

writeOutput('context_name', contextName);
