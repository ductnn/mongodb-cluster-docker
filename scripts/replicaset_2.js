var config_replicaset_02 = {
    _id: "rs-shard-02",
    version: 1,
    members:[
        { _id: 0, host : "shard02-a:27017" },
        { _id: 1, host : "shard02-b:27017" },
        { _id: 2, host : "shard02-c:27017" }, 
    ]
};

var status_replicaset_02 = rs.initiate(config_replicaset_02);

printjson(status_replicaset_02);
