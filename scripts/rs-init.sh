#!/bin/bash

mongosh  <<EOF
var config = {
    "_id": "spomen-db",
    "version": 1,
    "members": [
        {
            "_id": 1,
            "host": "spomen-db:27017",
            "priority": 3
        },
    ]
};

rs.initiate(config, { force: true });
rs.status();

use admin;

db.createUser(
  {
    user: '$MONGO_ROOT_USER',
    pwd: '$MONGO_ROOT_PASSWORD',
    roles: [{ role: 'clusterAdmin', db: 'admin' }],
  },
);

db.createCollection('Account');
EOF