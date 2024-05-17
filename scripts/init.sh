#!/bin/bash

docker compose up -d

sleep 5

docker exec spomen-db /scripts/rs-init.sh