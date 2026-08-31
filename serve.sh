#!/usr/bin/env bash
# 대화상조 로컬 서버
PORT="${1:-5173}"
cd "$(dirname "$0")"
echo "▶ http://localhost:$PORT  (종료: Ctrl+C)"
python3 -m http.server "$PORT" --bind 127.0.0.1
