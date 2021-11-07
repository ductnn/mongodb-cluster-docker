var config_replicaset_03 = {
    _id: "rs-shard-03",
    version: 1,
    members:[
        { _id: 0, host : "shard03-a:27017" },
        { _id: 1, host : "shard03-b:27017" },
        { _id: 2, host : "shard03-c:27017" }, 
    ]
};

var status_replicaset_03 = rs.initiate(config_replicaset_03);

printjson(status_replicaset_03);
