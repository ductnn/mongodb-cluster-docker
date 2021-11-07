FROM mongo:5.0.3

EXPOSE 27017

CMD [ "mongos --port 27017 --configdb rs-config-server/configsvr01:27017,configsvr02:27017,configsvr03:27017 --bind_ip_all" ]
