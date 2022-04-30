#!bin/bash -eu
if [ -d ./.git ]; then
  npx simple-git-hooks
else
  echo "このフォルダはGit管理下ではないので、simple-git-hooksの初期処理をスキップします。"
  exit 0
fi
