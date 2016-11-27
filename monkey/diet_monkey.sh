#!/bin/bash

containerId=$(docker ps -q --no-trunc --filter ancestor=server --format="{{.ID}}")
memLimit=$(cat /sys/fs/cgroup/memory/docker/$containerId/memory.limit_in_bytes)
limitMB=$((memLimit / (1024 * 1024)))

newLimit=$((limitMB/2))M
docker stop $containerId
docker rm $containerId
docker run -p 50100:8000 -m $newLimit --oom-kill-disable -d server
echo $newLimit
