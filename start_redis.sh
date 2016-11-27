#!/bin/bash

wget http://download.redis.io/redis-stable.tar.gz
tar xvzf redis-stable.tar.gz
cd redis-stable
make
apt-get install redis-tools

cd src
./redis-server --daemonize yes

redis-cli CONFIG SET protected-mode no
