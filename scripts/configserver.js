var config_server = {
    _id: "rs-config-server",
    configsvr: true,
    version: 1,
    members: [ 
        { _id: 0, host : 'configsvr01:27017' },
        { _id: 1, host : 'configsvr02:27017' },
        { _id: 2, host : 'configsvr03:27017' }
    ]
};

var status_config_server = rs.initiate(config_server);

printjson(status_config_server);
