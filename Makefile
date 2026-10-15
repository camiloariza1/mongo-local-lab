COMPOSE = docker compose -p mongo-local-lab -f compose.yaml

.PHONY: up shell test stop reset-data

up:
	$(COMPOSE) up -d --wait --wait-timeout 180

shell:
	$(COMPOSE) exec mongodb mongosh "mongodb://127.0.0.1:27017/mongo_local_lab?directConnection=true"

test:
	$(COMPOSE) exec -T mongodb mongosh --quiet "mongodb://127.0.0.1:27017/mongo_local_lab_test?directConnection=true" --file /lab/test.js

stop:
	$(COMPOSE) down

reset-data:
	$(COMPOSE) down --volumes --remove-orphans
