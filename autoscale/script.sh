#!/bin/bash

containerId=$(docker ps -q --no-trunc --filter ancestor=server --format="{{.ID}}")
memUsage=$(cat /sys/fs/cgroup/memory/docker/$containerId/memory.usage_in_bytes)
memLimit=$(cat /sys/fs/cgroup/memory/docker/$containerId/memory.limit_in_bytes)
usageMB=$((memUsage / (1024 * 1024)))
limitMB=$((memLimit / (1024 * 1024)))

ratio=$((limitMB / usageMB))
#newLimit=$((limitMB + 100))M

echo $limitMB
echo $usageMB
echo $ratio

if [ "$ratio" -lt 2 ]
then
	newLimit=$((limitMB + 100))M
	docker stop $containerId
	docker rm $containerId
	docker run -p 50100:8000 -m $newLimit --oom-kill-disable -d server
	echo $newLimit 
fi


