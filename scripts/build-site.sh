#!/usr/bin/env bash
# Builds (or serves) the Quartz site without vendoring Quartz into this repo.
#
# Quartz is cloned fresh at a pinned version into ./quartz/ (gitignored), then
# our customized quartz.config.ts is overlaid before building. To upgrade
# Quartz, bump QUARTZ_VERSION below and delete the local ./quartz/ directory.
#
#   scripts/build-site.sh           build the site into ./public
#   scripts/build-site.sh --serve   build and serve locally with live reload
#
# Extra arguments are passed through to `quartz build`.
set -euo pipefail

QUARTZ_VERSION="v4.5.2"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
QUARTZ_DIR="$REPO_ROOT/quartz"

if [ ! -d "$QUARTZ_DIR/.git" ]; then
  echo "Cloning Quartz $QUARTZ_VERSION into quartz/ ..."
  rm -rf "$QUARTZ_DIR"
  git clone --quiet --depth 1 --branch "$QUARTZ_VERSION" \
    https://github.com/jackyzha0/quartz.git "$QUARTZ_DIR"
fi

# Overlay our customized config onto the Quartz checkout (the only file we own;
# quartz.layout.ts and everything else stay stock).
cp "$REPO_ROOT/quartz.config.ts" "$QUARTZ_DIR/quartz.config.ts"

if [ ! -d "$QUARTZ_DIR/node_modules" ]; then
  echo "Installing Quartz dependencies ..."
  (cd "$QUARTZ_DIR" && npm ci)
fi

cd "$QUARTZ_DIR"
exec node quartz/bootstrap-cli.mjs build \
  -d "$REPO_ROOT/wiki" -o "$REPO_ROOT/public" "$@"
