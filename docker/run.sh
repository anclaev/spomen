#!/bin/bash
if [ -n "$1" ]
then
docker compose -p spomen --env-file docker/.env.local -f docker/dev.docker-compose.yml up -d $1
else
echo 'Введите название сервиса'
exit 0
fi
