@echo off
setlocal enabledelayedexpansion

if exist ".\.git" (
  npx simple-git-hooks
) else (
  echo "このフォルダはGit管理下ではないので、simple-git-hooksの初期処理をスキップします。"
)
