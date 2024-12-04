#!/bin/bash
docker compose -p spomen-services --env-file environments/.env.local -f environments/docker-compose.local.yml up -d $1
