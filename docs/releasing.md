# Releasing

This repository is intended to be consumed through version tags such as `v1`.

## Release process

1. Update [CHANGELOG.md](../CHANGELOG.md).
2. Commit the release changes to `main`.
3. Create and push a semantic version tag:

```bash
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin main --follow-tags
```

## Major tag updates

The repository includes a workflow that moves the matching major tag when a semantic version tag is pushed.

For example, pushing `v1.2.3` updates `v1` to point at the same commit. That lets workflows pin to `@v1` while you continue publishing patch and minor releases.
