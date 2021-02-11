## Run options
  

### `npm start`

Runs the app in the development mode.

API available on [http://localhost:8080](http://localhost:8080).

**Don't forget to install and configure Postgress first!**

## Endpoints

### /prices
Return list of prices for given crop.

| params | values |
|--|--|
| crop |  wheat_2, wheat_3, wheat_4, sunflower, rye, corn, barley, soybean, buckwheat|

**Request example**

      http://localhost:8080/prices?crop=wheat_2
**Response example**

    [{
	    "cropName":"wheat_2",
	    "country":"UKR",
	    "date":"2021-01-8T23:00:00.000Z",
	    "price":8351,"currency":"UAH"
	}]

## Postgress container

https://github.com/docker-library/docs/blob/master/postgres/README.md

https://linuxhint.com/run_postgresql_docker_compose/  

### Install pgAdmin on Ubuntu

https://www.pgadmin.org/download/pgadmin-4-apt/

  
### docker-compose.yml

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

# TODO

 - fix postgres serialization issue
 - create docker-compose.yml for whole project
 - volumes backups 



