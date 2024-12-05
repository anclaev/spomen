#!/bin/bash
if [[ "$OSTYPE" == "msys" ]]; then
  PLUGIN="protoc-gen-ts_proto.cmd";
else
  PLUGIN="protoc-gen-ts_proto";
fi

npx protoc --plugin=node_modules/ts-proto/$PLUGIN \
    --ts_proto_opt=esModuleInterop=true \
    --ts_proto_opt=nestJs=true \
    --ts_proto_opt=returnObservable=false  \
    --ts_proto_opt=addGrpcMetadata=true \
    --ts_proto_out=./libs/core/src/lib/grpc \
    -I=./apps/account/src \
    ./apps/account/src/account.proto \
    -I=./apps/auth/src \
    ./apps/auth/src/auth.proto
