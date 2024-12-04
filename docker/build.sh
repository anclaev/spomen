#!/bin/bash
if [ -n "$1" ]
then
nx run @spomen/$1:container:dev
else
echo 'Введите название сервиса'
exit 0
fi
