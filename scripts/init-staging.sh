#!/bin/bash
export VERSION=$1
docker compose -p spomen_staging -f staging.docker-compose.yml --env-file .env.staging up -d 

sleep 5

docker exec spomen-db_staging /scripts/rs-init.sh spomen-db_staging
