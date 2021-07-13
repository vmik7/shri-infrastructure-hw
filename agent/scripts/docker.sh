#!/usr/bin/env bash

defaults=($(node ./scripts/readConfig.js))

PORT=${defaults[0]}
SERVER_HOST=${defaults[1]}
SERVER_PORT=${defaults[2]}

while [ -n "$1" ]; do
    case "$1" in
        '-i' | '--interactive')
            read -p "PORT: ($PORT) " input
            if [ -n "$input" ]; then
                PORT=$input
            fi
            read -p "SERVER_HOST: ($SERVER_HOST) " input
            if [ -n "$input" ]; then
                SERVER_HOST=$input
            fi
            read -p "SERVER_PORT: ($SERVER_PORT) " input
            if [ -n "$input" ]; then
                SERVER_PORT=$input
            fi
            break
            ;;
        '-p' | '--port')
            PORT="$2"
            shift
            ;;
        '--server-host')
            SERVER_HOST="$2"
            shift
            ;;
        '--server-port')
            SERVER_PORT="$2"
            shift
            ;;
        *)
            echo "$1 is not an option"
            exit -1
            ;;
    esac
    shift
done

docker run --rm --publish $PORT:$PORT --env PORT=$PORT --env SERVER_HOST=$SERVER_HOST --env SERVER_PORT=$SERVER_PORT --name agent-$PORT vmik7/agent
