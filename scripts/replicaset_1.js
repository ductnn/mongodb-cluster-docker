var config_replicaset_01 = {
    _id: "rs-shard-01",
    version: 1,
    members:[
        { _id: 0, host : "shard01-a:27017" },
        { _id: 1, host : "shard01-b:27017" },
        { _id: 2, host : "shard01-c:27017" }, 
    ]
};

var status_replicaset_01 = rs.initiate(config_replicaset_01);

printjson(status_replicaset_01);
