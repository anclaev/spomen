#!/bin/bash
export VERSION=$1
docker compose up -d

sleep 5

docker exec spomen-db /scripts/rs-init.sh spomen-db
