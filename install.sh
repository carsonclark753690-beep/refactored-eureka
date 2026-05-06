#!/usr/bin/env bash
set -euo pipefail

REPO_URL="https://github.com/carsonclark753690-beep/refactored-eureka.git"
TARGET_DIR="${1:-refactored-eureka}"
PORT="${PORT:-8000}"

echo "==> Cloning $REPO_URL into $TARGET_DIR"
if [ -d "$TARGET_DIR/.git" ]; then
  echo "    Directory already exists, pulling latest"
  git -C "$TARGET_DIR" pull --ff-only
else
  git clone --depth 1 "$REPO_URL" "$TARGET_DIR"
fi

cd "$TARGET_DIR"

pick_server() {
  if command -v python3 >/dev/null 2>&1; then
    echo "python3 -m http.server $PORT"
  elif command -v python >/dev/null 2>&1; then
    echo "python -m SimpleHTTPServer $PORT"
  elif command -v npx >/dev/null 2>&1; then
    echo "npx --yes serve -l $PORT ."
  else
    echo ""
  fi
}

CMD="$(pick_server)"
if [ -z "$CMD" ]; then
  echo "==> Installed. No python or npx found; open index.html in a browser to view."
  exit 0
fi

echo "==> Serving on http://localhost:$PORT (Ctrl+C to stop)"
exec sh -c "$CMD"
