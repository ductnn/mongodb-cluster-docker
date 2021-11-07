# router
docker build -t router:v1 -f .docker/router.dockerfile .

# config-server
docker build -t configserver:v1 -f .docker/configserver.dockerfile .
