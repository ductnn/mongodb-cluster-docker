 # MongoDB Cluster on Docker

![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=102)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/ductnn/mongodb-cluster-docker/pulls)

A simple implement MongoDB Cluster on Docker with **PSS Style** (Primary -
Secondary - Secondary). Inspired by this [article](https://viblo.asia/p/cai-dat-mongo-cluster-voi-docker-m68Z0NN25kG)

## Components
- **2 Mongos** (router): The mongos acts as query routers, providing an interface
between client applications and the sharded cluster.
  - `router01`
  - `router02`
- **3 Config Servers**: Store metadata and configuration settings for the cluster
  - `configsvr01`
  - `configsvr02`
  - `configsvr03`
- **3 Shards** (each a 3 member replica set): Each shard contains a subset of
the sharded data. Each shard can be deployed as a replica set.
  - `shard01-a`, `shard01-b`, `shard01-c`
  - `shard02-a`, `shard02-b`, `shard02-c`
  - `shard03-a`, `shard03-b`, `shard03-c`

## Installation

Clone this repo:

```bash
git clone https://github.com/ductnn/mongodb-cluster-docker.git
cd mongodb-cluster-docker
```

And run `docker-compose.yaml`:

```bash
➜  mongodb-cluster-docker git:(master) ✗ docker-compose up -d
Creating network "mongodb-cluster-docker_default" with the default driver
Pulling router01 (mongo:5.0.3)...
5.0.3: Pulling from library/mongo
7b1a6ab2e44d: Already exists
90eb44ebc60b: Already exists
5085b59f2efb: Already exists
c7499923d022: Already exists
019496b6c44a: Already exists
c0df4f407f69: Already exists
351daa315b6c: Already exists
557b07ecd9d7: Already exists
a2dff157a5e3: Already exists
07d83e88231b: Already exists
Digest: sha256:07212fb304ea36b8c5a9e5694527f16deeb0b99f87fc60162dc15ab260bf8a2a
Status: Downloaded newer image for mongo:5.0.3
Creating shard-02-node-b ... done
Creating shard-03-node-b ... done
Creating shard-03-node-c ... done
Creating shard-02-node-c ... done
Creating router-01       ... done
Creating shard-01-node-b ... done
Creating shard-01-node-c ... done
Creating shard-03-node-a ... done
Creating shard-01-node-a ... done
Creating shard-02-node-a ... done
Creating router-02       ... done
Creating mongo-config-01 ... done
Creating mongo-config-02 ... done
Creating mongo-config-03 ... done
```

**Result**:

```bash
➜  mongodb-cluster-docker git:(master) ✗ docker ps
CONTAINER ID   IMAGE         COMMAND                  CREATED          STATUS          PORTS                                           NAMES
302243ef45a3   mongo:5.0.3   "docker-entrypoint.s…"   16 minutes ago   Up 15 minutes   0.0.0.0:27121->27017/tcp, :::27121->27017/tcp   mongo-config-03
4599103daf74   mongo:5.0.3   "docker-entrypoint.s…"   16 minutes ago   Up 16 minutes   0.0.0.0:27120->27017/tcp, :::27120->27017/tcp   mongo-config-02
5be686736dd8   mongo:5.0.3   "docker-entrypoint.s…"   16 minutes ago   Up 16 minutes   0.0.0.0:27119->27017/tcp, :::27119->27017/tcp   mongo-config-01
4eff0c607d3c   mongo:5.0.3   "docker-entrypoint.s…"   16 minutes ago   Up 16 minutes   0.0.0.0:27118->27017/tcp, :::27118->27017/tcp   router-02
b28d39a0a262   mongo:5.0.3   "docker-entrypoint.s…"   16 minutes ago   Up 16 minutes   0.0.0.0:27125->27017/tcp, :::27125->27017/tcp   shard-02-node-a
ad9c4985f630   mongo:5.0.3   "docker-entrypoint.s…"   16 minutes ago   Up 16 minutes   0.0.0.0:27122->27017/tcp, :::27122->27017/tcp   shard-01-node-a
5a43e22ff9ae   mongo:5.0.3   "docker-entrypoint.s…"   16 minutes ago   Up 16 minutes   0.0.0.0:27128->27017/tcp, :::27128->27017/tcp   shard-03-node-a
52520b1b29a9   mongo:5.0.3   "docker-entrypoint.s…"   16 minutes ago   Up 16 minutes   0.0.0.0:27124->27017/tcp, :::27124->27017/tcp   shard-01-node-c
9591f85f2dc0   mongo:5.0.3   "docker-entrypoint.s…"   16 minutes ago   Up 16 minutes   0.0.0.0:27130->27017/tcp, :::27130->27017/tcp   shard-03-node-c
1b745802b88a   mongo:5.0.3   "docker-entrypoint.s…"   16 minutes ago   Up 16 minutes   0.0.0.0:27126->27017/tcp, :::27126->27017/tcp   shard-02-node-b
161baac14972   mongo:5.0.3   "docker-entrypoint.s…"   16 minutes ago   Up 16 minutes   0.0.0.0:27117->27017/tcp, :::27117->27017/tcp   router-01
4468e7f23da1   mongo:5.0.3   "docker-entrypoint.s…"   16 minutes ago   Up 16 minutes   0.0.0.0:27123->27017/tcp, :::27123->27017/tcp   shard-01-node-b
1b99d3d5ea54   mongo:5.0.3   "docker-entrypoint.s…"   16 minutes ago   Up 16 minutes   0.0.0.0:27129->27017/tcp, :::27129->27017/tcp   shard-03-node-b
0480f8b2247d   mongo:5.0.3   "docker-entrypoint.s…"   16 minutes ago   Up 16 minutes   0.0.0.0:27127->27017/tcp, :::27127->27017/tcp   shard-02-node-c
```

Then, we need to init `config-servers`, `shards` and `router`:

### Config servers

```bash
# Initilizing the config server
➜  mongodb-cluster-docker git:(master) ✗ bash bash/init-configserver.sh 
MongoDB shell version v5.0.3
connecting to: mongodb://127.0.0.1:27017/?compressors=disabled&gssapiServiceName=mongodb
Implicit session: session { "id" : UUID("555e23b7-f1bd-4232-9947-8f5dd0db6c3b") }
MongoDB server version: 5.0.3
================
Warning: the "mongo" shell has been superseded by "mongosh",
which delivers improved usability and compatibility.The "mongo" shell has been deprecated and will be removed in
an upcoming release.
We recommend you begin using "mongosh".
For installation instructions, see
https://docs.mongodb.com/mongodb-shell/install/
================
{
        "ok" : 1,
        "$gleStats" : {
                "lastOpTime" : Timestamp(1636305337, 1),
                "electionId" : ObjectId("000000000000000000000000")
        },
        "lastCommittedOpTime" : Timestamp(0, 0)
}
bye
```

### Shards

```bash
# Initilzing the shards
➜  mongodb-cluster-docker git:(master) ✗ bash bash/init-replicaset.sh 
MongoDB shell version v5.0.3
connecting to: mongodb://127.0.0.1:27017/?compressors=disabled&gssapiServiceName=mongodb
Implicit session: session { "id" : UUID("815f9a5c-997b-48a6-bba0-8847b0890521") }
MongoDB server version: 5.0.3
================
Warning: the "mongo" shell has been superseded by "mongosh",
which delivers improved usability and compatibility.The "mongo" shell has been deprecated and will be removed in
an upcoming release.
We recommend you begin using "mongosh".
For installation instructions, see
https://docs.mongodb.com/mongodb-shell/install/
================
{
        "ok" : 1,
        "$clusterTime" : {
                "clusterTime" : Timestamp(1636305394, 1),
                "signature" : {
                        "hash" : BinData(0,"AAAAAAAAAAAAAAAAAAAAAAAAAAA="),
                        "keyId" : NumberLong(0)
                }
        },
        "operationTime" : Timestamp(1636305394, 1)
}
bye
MongoDB shell version v5.0.3
connecting to: mongodb://127.0.0.1:27017/?compressors=disabled&gssapiServiceName=mongodb
Implicit session: session { "id" : UUID("16424801-e037-450b-b4db-4d9dfe19752b") }
MongoDB server version: 5.0.3
================
Warning: the "mongo" shell has been superseded by "mongosh",
which delivers improved usability and compatibility.The "mongo" shell has been deprecated and will be removed in
an upcoming release.
We recommend you begin using "mongosh".
For installation instructions, see
https://docs.mongodb.com/mongodb-shell/install/
================
{ "ok" : 1 }
bye
MongoDB shell version v5.0.3
connecting to: mongodb://127.0.0.1:27017/?compressors=disabled&gssapiServiceName=mongodb
Implicit session: session { "id" : UUID("6f621971-1d81-45c6-9f74-23eacc9cc4a1") }
MongoDB server version: 5.0.3
================
Warning: the "mongo" shell has been superseded by "mongosh",
which delivers improved usability and compatibility.The "mongo" shell has been deprecated and will be removed in
an upcoming release.
We recommend you begin using "mongosh".
For installation instructions, see
https://docs.mongodb.com/mongodb-shell/install/
================
{
        "ok" : 1,
        "$clusterTime" : {
                "clusterTime" : Timestamp(1636305395, 1),
                "signature" : {
                        "hash" : BinData(0,"AAAAAAAAAAAAAAAAAAAAAAAAAAA="),
                        "keyId" : NumberLong(0)
                }
        },
        "operationTime" : Timestamp(1636305395, 1)
}
bye
```

### Routers
After initilizing `config-server` and `shards`, wait a bit to to elect primaries
before initilizing `router`:

```bash
➜  mongodb-cluster-docker git:(master) ✗ bash bash/init-router.sh 
MongoDB shell version v5.0.3
connecting to: mongodb://127.0.0.1:27017/?compressors=disabled&gssapiServiceName=mongodb
Implicit session: session { "id" : UUID("25a1c2a2-135c-4550-b732-713e018eb0a2") }
MongoDB server version: 5.0.3
================
Warning: the "mongo" shell has been superseded by "mongosh",
which delivers improved usability and compatibility.The "mongo" shell has been deprecated and will be removed in
an upcoming release.
We recommend you begin using "mongosh".
For installation instructions, see
https://docs.mongodb.com/mongodb-shell/install/
================
{
        "shardAdded" : "rs-shard-01",
        "ok" : 1,
        "$clusterTime" : {
                "clusterTime" : Timestamp(1636305656, 6),
                "signature" : {
                        "hash" : BinData(0,"AAAAAAAAAAAAAAAAAAAAAAAAAAA="),
                        "keyId" : NumberLong(0)
                }
        },
        "operationTime" : Timestamp(1636305656, 5)
}
{
        "shardAdded" : "rs-shard-02",
        "ok" : 1,
        "$clusterTime" : {
                "clusterTime" : Timestamp(1636305660, 2),
                "signature" : {
                        "hash" : BinData(0,"AAAAAAAAAAAAAAAAAAAAAAAAAAA="),
                        "keyId" : NumberLong(0)
                }
        },
        "operationTime" : Timestamp(1636305658, 4)
}
{
        "shardAdded" : "rs-shard-03",
        "ok" : 1,
        "$clusterTime" : {
                "clusterTime" : Timestamp(1636305662, 9),
                "signature" : {
                        "hash" : BinData(0,"AAAAAAAAAAAAAAAAAAAAAAAAAAA="),
                        "keyId" : NumberLong(0)
                }
        },
        "operationTime" : Timestamp(1636305662, 3)
}
bye
```

### Verify status
We can check the status of replicaset:

```bash
# Exec to the shard
➜  mongodb-cluster-docker git:(master) ✗ docker exec -it shard-01-node-a bash 
root@ad9c4985f630:/# mongo
rs-shard-01:PRIMARY> rs.status()
{
        "set" : "rs-shard-01",
        "date" : ISODate("2021-11-07T17:31:01.326Z"),
        "myState" : 1,
        "term" : NumberLong(1),
        "syncSourceHost" : "",
        "syncSourceId" : -1,
        "heartbeatIntervalMillis" : NumberLong(2000),
        "majorityVoteCount" : 2,
        "writeMajorityCount" : 2,
        "votingMembersCount" : 3,
        "writableVotingMembersCount" : 3,
        "optimes" : {
                "lastCommittedOpTime" : {
                        "ts" : Timestamp(1636306261, 9),
                        "t" : NumberLong(1)
                },
                "lastCommittedWallTime" : ISODate("2021-11-07T17:31:01.283Z"),
                "readConcernMajorityOpTime" : {
                        "ts" : Timestamp(1636306261, 9),
                        "t" : NumberLong(1)
                },
                "appliedOpTime" : {
                        "ts" : Timestamp(1636306261, 9),
                        "t" : NumberLong(1)
                },
                "durableOpTime" : {
                        "ts" : Timestamp(1636306261, 8),
                        "t" : NumberLong(1)
                },
                "lastAppliedWallTime" : ISODate("2021-11-07T17:31:01.283Z"),
                "lastDurableWallTime" : ISODate("2021-11-07T17:31:01.278Z")
        },
        "lastStableRecoveryTimestamp" : Timestamp(1636306245, 14),
        "electionCandidateMetrics" : {
                "lastElectionReason" : "electionTimeout",
                "lastElectionDate" : ISODate("2021-11-07T17:16:45.266Z"),
                "electionTerm" : NumberLong(1),
                "lastCommittedOpTimeAtElection" : {
                        "ts" : Timestamp(0, 0),
                        "t" : NumberLong(-1)
                },
                "lastSeenOpTimeAtElection" : {
                        "ts" : Timestamp(1636305394, 1),
                        "t" : NumberLong(-1)
                },
                "numVotesNeeded" : 2,
                "priorityAtElection" : 1,
                "electionTimeoutMillis" : NumberLong(10000),
                "numCatchUpOps" : NumberLong(0),
                "newTermStartDate" : ISODate("2021-11-07T17:16:45.299Z"),
                "wMajorityWriteAvailabilityDate" : ISODate("2021-11-07T17:16:45.957Z")
        },
        "members" : [
                {
                        "_id" : 0,
                        "name" : "shard01-a:27017",
                        "health" : 1,
                        "state" : 1,
                        "stateStr" : "PRIMARY",
                        "uptime" : 1211,
                        "optime" : {
                                "ts" : Timestamp(1636306261, 9),
                                "t" : NumberLong(1)
                        },
                        "optimeDate" : ISODate("2021-11-07T17:31:01Z"),
                        "syncSourceHost" : "",
                        "syncSourceId" : -1,
                        "infoMessage" : "",
                        "electionTime" : Timestamp(1636305405, 1),
                        "electionDate" : ISODate("2021-11-07T17:16:45Z"),
                        "configVersion" : 2,
                        "configTerm" : 1,
                        "self" : true,
                        "lastHeartbeatMessage" : ""
                },
                {
                        "_id" : 1,
                        "name" : "shard01-b:27017",
                        "health" : 1,
                        "state" : 2,
                        "stateStr" : "SECONDARY",
                        "uptime" : 867,
                        "optime" : {
                                "ts" : Timestamp(1636306260, 9),
                                "t" : NumberLong(1)
                        },
                        "optimeDurable" : {
                                "ts" : Timestamp(1636306260, 9),
                                "t" : NumberLong(1)
                        },
                        "optimeDate" : ISODate("2021-11-07T17:31:00Z"),
                        "optimeDurableDate" : ISODate("2021-11-07T17:31:00Z"),
                        "lastHeartbeat" : ISODate("2021-11-07T17:31:01.263Z"),
                        "lastHeartbeatRecv" : ISODate("2021-11-07T17:31:01.252Z"),
                        "pingMs" : NumberLong(0),
                        "lastHeartbeatMessage" : "",
                        "syncSourceHost" : "shard01-a:27017",
                        "syncSourceId" : 0,
                        "infoMessage" : "",
                        "configVersion" : 2,
                        "configTerm" : 1
                },
                {
                        "_id" : 2,
                        "name" : "shard01-c:27017",
                        "health" : 1,
                        "state" : 2,
                        "stateStr" : "SECONDARY",
                        "uptime" : 867,
                        "optime" : {
                                "ts" : Timestamp(1636306260, 9),
                                "t" : NumberLong(1)
                        },
                        "optimeDurable" : {
                                "ts" : Timestamp(1636306260, 9),
                                "t" : NumberLong(1)
                        },
                        "optimeDate" : ISODate("2021-11-07T17:31:00Z"),
                        "optimeDurableDate" : ISODate("2021-11-07T17:31:00Z"),
                        "lastHeartbeat" : ISODate("2021-11-07T17:31:01.263Z"),
                        "lastHeartbeatRecv" : ISODate("2021-11-07T17:31:01.248Z"),
                        "pingMs" : NumberLong(0),
                        "lastHeartbeatMessage" : "",
                        "syncSourceHost" : "shard01-a:27017",
                        "syncSourceId" : 0,
                        "infoMessage" : "",
                        "configVersion" : 2,
                        "configTerm" : 1
                }
        ],
        "ok" : 1,
        "$gleStats" : {
                "lastOpTime" : Timestamp(0, 0),
                "electionId" : ObjectId("7fffffff0000000000000001")
        },
        "lastCommittedOpTime" : Timestamp(1636306261, 9),
        "$configServerState" : {
                "opTime" : {
                        "ts" : Timestamp(1636306261, 11),
                        "t" : NumberLong(-1)
                }
        },
        "$clusterTime" : {
                "clusterTime" : Timestamp(1636306261, 11),
                "signature" : {
                        "hash" : BinData(0,"AAAAAAAAAAAAAAAAAAAAAAAAAAA="),
                        "keyId" : NumberLong(0)
                }
        },
        "operationTime" : Timestamp(1636306261, 9)
}
```

Similar with another `shards`. Check the status of `router`:

```bash
➜  mongodb-cluster-docker git:(master) ✗ docker-compose exec router01 mongo --port 27017
MongoDB shell version v5.0.3
connecting to: mongodb://127.0.0.1:27017/?compressors=disabled&gssapiServiceName=mongodb
Implicit session: session { "id" : UUID("69408b5a-d313-44ae-ae64-81e9d3d21588") }
MongoDB server version: 5.0.3
================
Warning: the "mongo" shell has been superseded by "mongosh",
which delivers improved usability and compatibility.The "mongo" shell has been deprecated and will be removed in
an upcoming release.
We recommend you begin using "mongosh".
For installation instructions, see
https://docs.mongodb.com/mongodb-shell/install/
================
---
The server generated these startup warnings when booting: 
        2021-11-07T17:10:47.048+00:00: Access control is not enabled for the database. Read and write access to data and configuration is unrestricted
---
mongos> sh.status()
--- Sharding Status --- 
  sharding version: {
        "_id" : 1,
        "minCompatibleVersion" : 5,
        "currentVersion" : 6,
        "clusterId" : ObjectId("618809c41517a9e726602e13")
  }
  shards:
        {  "_id" : "rs-shard-01",  "host" : "rs-shard-01/shard01-a:27017,shard01-b:27017,shard01-c:27017",  "state" : 1,  "topologyTime" : Timestamp(1636305656, 2) }
        {  "_id" : "rs-shard-02",  "host" : "rs-shard-02/shard02-a:27017,shard02-b:27017,shard02-c:27017",  "state" : 1,  "topologyTime" : Timestamp(1636305658, 2) }
        {  "_id" : "rs-shard-03",  "host" : "rs-shard-03/shard03-a:27017,shard03-b:27017,shard03-c:27017",  "state" : 1,  "topologyTime" : Timestamp(1636305662, 1) }
  active mongoses:
        "5.0.3" : 2
  autosplit:
        Currently enabled: yes
  balancer:
        Currently enabled: yes
        Currently running: yes
        Collections with active migrations: 
                config.system.sessions started at Sun Nov 07 2021 17:33:54 GMT+0000 (UTC)
        Failed balancer rounds in last 5 attempts: 0
        Migration results for the last 24 hours: 
                237 : Success
  databases:
        {  "_id" : "config",  "primary" : "config",  "partitioned" : true }
                config.system.sessions
                        shard key: { "_id" : 1 }
                        unique: false
                        balancing: true
                        chunks:
                                rs-shard-01     787
                                rs-shard-02     118
                                rs-shard-03     119
                        too many chunks to print, use verbose if you want to force print
```

Done ... *wait*. You can **remove** all:

```bash
➜  mongodb-cluster-docker git:(master) bash clean_all.sh 
Stopping mongo-config-03 ... done
Stopping mongo-config-02 ... done
Stopping mongo-config-01 ... done
Stopping router-02       ... done
Stopping shard-02-node-a ... done
Stopping shard-01-node-a ... done
Stopping shard-03-node-a ... done
Stopping shard-01-node-c ... done
Stopping shard-03-node-c ... done
Stopping shard-02-node-b ... done
Stopping router-01       ... done
Stopping shard-01-node-b ... done
Stopping shard-03-node-b ... done
Stopping shard-02-node-c ... done
Removing mongo-config-03 ... done
Removing mongo-config-02 ... done
Removing mongo-config-01 ... done
Removing router-02       ... done
Removing shard-02-node-a ... done
Removing shard-01-node-a ... done
Removing shard-03-node-a ... done
Removing shard-01-node-c ... done
Removing shard-03-node-c ... done
Removing shard-02-node-b ... done
Removing router-01       ... done
Removing shard-01-node-b ... done
Removing shard-03-node-b ... done
Removing shard-02-node-c ... done
Removing network mongodb-cluster-docker_default
Removing image mongo:5.0.3
```

And so real *done* =))))

### Show your support
Give a ⭐ if you like this application ❤️

## Contribution
All contributions are welcomed in this project!

## License
The MIT License (MIT). Please see [LICENSE](LICENSE) for more information.
