# docker-context-switch-action

Create a Docker context for a remote host over SSH, switch Docker to that context for the current job, and remove it during post-run cleanup.

This action is useful for deployment workflows that run Docker commands against a remote engine without hand-writing context setup and teardown logic in every repository.

## Why use this action?

- Standardizes remote Docker context management across workflows.
- Cleans up the temporary context after the job finishes.
- Works well with existing SSH agent and host key setup steps.

## Usage

```yaml
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
    uses: Makepad-fr/docker-context-switch-action@v1
    with:
      environment: production
      server_ip_address: ${{ secrets.DOCKER_HOST }}
      server_ssh_user: ${{ secrets.DOCKER_USER }}
      context_name: production-remote

  - name: Run Docker command on the remote host
    run: docker ps
```

## Inputs

| Name | Required | Description |
| --- | --- | --- |
| `environment` | yes | Deployment environment name retained for compatibility with existing workflows. |
| `server_ip_address` | yes | Server IP address or hostname for the remote Docker SSH endpoint. |
| `server_ssh_user` | yes | SSH user used to connect to the remote Docker host. |
| `context_name` | yes | Name of the Docker context that will be created and used. |

## Outputs

| Name | Description |
| --- | --- |
| `context_name` | The name of the Docker context created by the action. |

## Requirements

- The runner must have the Docker CLI installed.
- SSH authentication must already be configured for the remote host.
- Host key verification should be configured before this action runs.

## Documentation

- [Detailed usage guide](docs/usage.md)
- [Release and versioning guide](docs/releasing.md)
- [Changelog](CHANGELOG.md)
