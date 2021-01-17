# agro-stat-server

### Postgress container
https://github.com/docker-library/docs/blob/master/postgres/README.md
https://linuxhint.com/run_postgresql_docker_compose/

## Install pgAdmin on Ubuntu
https://www.pgadmin.org/download/pgadmin-4-apt/

# docker-compose.yml
install: https://docs.docker.com/compose/install/

docker-compose up -d
docker-compose down

docker exec -it <mycontainer> bash


# Questions
1) How to copy init.sql to docker-entrypoint-initdb.d in container during docker-compose run ?
https://github.com/docker/compose/issues/1664
https://github.com/docker/compose/issues/5523

docker cp ./dump.sql pg_test:/docker-entrypoint-initdb.d/dump.sql
docker exec -u postgres pg_test psql postgres postgres -f docker-entrypoint-initdb.d/dump.sql