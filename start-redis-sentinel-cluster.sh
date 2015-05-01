#!/bin/bash

trap "kill -1 -$$" SIGINT

mkdir -p logs
mkdir -p conf

start_redis_server() {
  port=$1
  redis-server --port $port &> logs/redis-server-${port}.log
}

start_redis_sentinel() {
  port=$1
  redis=$2
  cat << EOF > conf/sentinel-$port.conf
port $port
sentinel monitor mymaster ::1 $redis 2
sentinel down-after-milliseconds mymaster 1000
sentinel failover-timeout mymaster 10000
sentinel config-epoch mymaster 12
EOF
  redis-sentinel conf/sentinel-$port.conf &> logs/redis-sentinel-${port}.log
}

start_redis_server 23450 &
start_redis_server 23451 &

sleep 1

start_redis_sentinel 23460 23450 &
start_redis_sentinel 23461 23450 &
start_redis_sentinel 23462 23450 &

sleep 1

redis-cli -p 23451 slaveof ::1 23450

tail -f logs/*
