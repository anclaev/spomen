#!/bin/bash
if [ -n "$1" ]
then
./docker/build.sh $1
./docker/run.sh $1
else
echo 'Введите название сервиса'
exit 0
fi
