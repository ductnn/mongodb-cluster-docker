#!/bin/bash

# Set up
bash ./bash/init-configserver.sh

bash ./bash/init-replicaset.sh

bash ./bash/init-router.sh
