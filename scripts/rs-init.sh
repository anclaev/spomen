#!/bin/bash

mongosh  <<EOF
var config = {
    "_id": "$1",
    "version": 1,
    "members": [
        {
            "_id": 1,
            "host": "$1:27017",
            "priority": 3
        },
    ]
};

rs.initiate(config, { force: true });
rs.status();

use admin;

db.createUser(
  {
    user: '$DATABASE_USER',
    pwd: '$DATABASE_PWD',
    roles: [{ role: 'clusterAdmin', db: 'admin' }],
  },
);

db.createCollection('Account');
EOF