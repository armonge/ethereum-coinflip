#!/bin/bash
set -eo pipefail
set -o xtrace
IFS=$'\n\t'

# this would be so much easier if embark used env variables
if [[ -n "$RPC_HOST" ]]; then
  sed -i "s/rpc_host:.*/rpc_host: ${RPC_HOST}/g" config/blockchain.yml
fi

if [[ -n "$RPC_PORT_DOMAIN" ]]; then
  RPC_PORT=$(dig +noall +answer $RPC_PORT_DOMAIN SRV   | awk '{print $7}' | head -n 1)
  sed -i "s/rpc_port:.*/rpc_port: ${RPC_PORT}/g" config/blockchain.yml
fi

cat config/blockchain.yml

exec $@
