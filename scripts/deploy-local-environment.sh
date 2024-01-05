#!/bin/bash

if [ -z "$1" ]
then
     echo "No argument supplied"
     exit 1
fi

PROFILE="${2:-infra}"

if [[ $1 == "apply" ]]
then
    echo "Starting local environment"
    docker compose \
        --parallel -1 \
        --project-name local \
        --file ./deploy/docker/compose.yaml \
        --profile ${PROFILE} \
        up --build -d --wait
    exit 0
fi

if [[ $1 == "destroy" ]]
then
    echo "Stopping local environment"
    docker compose \
        --project-name local \
        --profile ${PROFILE} \
        down --remove-orphans --volumes
    exit 0
fi

echo "Invalid argument supplied"
exit 1