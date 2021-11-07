FROM mongo:5.0.3

EXPOSE 27017

CMD [ "mongod --port 27017 --configsvr --replSet rs-config-server" ]
