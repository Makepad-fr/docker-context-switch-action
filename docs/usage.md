# Usage Guide

## What the action does

During the main step, the action removes any existing context with the same name, creates a new Docker context that points to `ssh://<user>@<host>`, and switches Docker to that context.

During post-run cleanup, the action switches Docker back to the default context and removes the temporary context it created.

## Example workflow

```yaml
name: Deploy

on:
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5

      - name: Start SSH agent
        uses: webfactory/ssh-agent@v0.9.1
        with:
          ssh-private-key: ${{ secrets.DEPLOY_SSH_PRIVATE_KEY }}

      - name: Add Docker host key
        uses: Makepad-fr/add-ssh-host-key-action@v1
        with:
          server_ip_address: ${{ secrets.DOCKER_HOST }}
          known_host_entry: ${{ secrets.DOCKER_HOST_KNOWN_HOST }}

      - name: Switch Docker context
        id: docker_context
        uses: Makepad-fr/docker-context-switch-action@v1
        with:
          environment: production
          server_ip_address: ${{ secrets.DOCKER_HOST }}
          server_ssh_user: ${{ secrets.DOCKER_USER }}
          context_name: production-remote

      - name: Deploy with Docker
        run: docker compose pull && docker compose up -d
```

## Inputs and compatibility

The `environment` input is currently retained for compatibility with workflows that already pass deployment environment names. The action validates that it is present but does not otherwise use it in the context creation logic.

Choose a `context_name` that is unique within the job if you run multiple remote Docker contexts on the same runner.

## Troubleshooting

If `docker context create` fails, verify that:

- Docker is installed on the runner.
- The SSH key is loaded into an agent available to the job.
- The remote host key has been added to `known_hosts`.
- The target user can access the remote Docker socket.

If cleanup fails, inspect whether the runner still has an active command using the temporary context or whether the Docker CLI is unavailable during post-run execution.
