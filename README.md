# MongoDB Atlas Local lab

A small, persistent MongoDB 8.0 Atlas Local deployment for learning and local application development. The image uses the 8.0 tag pinned to digest `sha256:cd79e87b95ca4184668aacd35ca74493930727ead8d1789e37461ffbe8ef12a6`. It binds only to `127.0.0.1:27018`, uses synthetic data, and has no production credentials or Atlas connection.

Researched against the current MongoDB documentation on **2026-10-15**. Atlas Local is a single-node development and test deployment; it does not provide production availability or managed cloud operations.

## Prerequisites

- Docker Desktop 4.31+ on macOS/Windows, or Docker Engine 27+ on Linux, with a current Docker Compose supporting `up --wait --wait-timeout` (tested with Compose 5.3.1).
- At least 2 CPU cores and 2 GB free RAM.
- GNU Make. No host `mongosh` installation is needed; it runs inside the container.

## Run it

Run these commands from this directory:

```sh
make up       # create/start the service and wait until Atlas Local is healthy
make shell    # open mongosh in mongo_local_lab
make test     # seed and check a separate database, then drop it
make stop     # stop the container; preserve all lab data
make reset-data # remove this Compose project's containers, network, and volumes
```

After `make shell`, try:

```javascript
db.users.find({ status: "active" })
db.orders.find().sort({ createdAt: -1 })
db.orders.aggregate([
  { $group: { _id: "$status", orders: { $sum: 1 }, total: { $sum: "$total" } } }
])
```

The development database is seeded only when the persistent data volume is first created. To reload the initial data, run `make reset-data` followed by `make up`. Reset permanently deletes this lab's MongoDB data, configuration, and Search indexes.

## Connect an application

From a process on the host, use:

```text
mongodb://127.0.0.1:27018/mongo_local_lab?directConnection=true
```

Inside this Compose network, the hostname is `mongodb` and the port is `27017`, for example:

```text
mongodb://mongodb:27017/mongo_local_lab?directConnection=true
```

Add an application service to `compose.yaml` and connect it to the `mongodb` service. For startup ordering, use `depends_on: { mongodb: { condition: service_healthy } }`. The Atlas Local image supplies the health check and includes MongoDB Search (`mongot`).

## Fixture data

All values are fictional and use the reserved `.test` email domain. `scripts/10-seed.js` creates:

- `users`: three users with `ObjectId` identifiers, nested names, status strings, UTC `Date` values, and tag arrays. `email` has a unique ascending index.
- `orders`: four orders with `ObjectId` identifiers, user references, item arrays, status strings, UTC `Date` values, and `Decimal128` prices and totals. `{ userId: 1, createdAt: -1 }` supports recent-order lookups.

The seed script is mounted as the initialization script and reused by `make test`. The smoke test checks seed counts, unique-index enforcement, a Decimal128 aggregation, CRUD, and single-node transaction rollback and commit. It runs against `mongo_local_lab_test` and drops that database in a `finally` block. The test refuses to run if its connection targets another database.

Keep the `mongo_local_lab_test` name reserved for disposable test data. Run one test process at a time: concurrent runs share that database.

Adapt the documents and indexes in `scripts/10-seed.js` to your application, then reset the volumes to initialize a fresh lab. The sample records are examples, not a statement about any real customer data.

## Local security and Atlas differences

Authentication is intentionally off for this personal local lab. The MongoDB port is published only on loopback, so use this configuration only on a trusted development machine; do not expose it on a network or reuse it for production. The Compose project opts out of Atlas Local anonymous telemetry with `DO_NOT_TRACK=1`.

Atlas Local includes a single-node replica set and `mongot` for local development and testing. A single node cannot validate high availability, failover, production performance, backups, managed scaling, or cloud access controls. Search and Vector Search behavior can differ from Atlas; check MongoDB's current local deployment and Search limitations before relying on a feature-specific result.

## Verified on 2026-10-15

Executed on macOS ARM64 with Docker Desktop 4.86.0, Docker Compose 5.3.1, MongoDB 8.0.34, and container mongosh 2.13.0:

- Compose configuration and both JavaScript syntax checks passed.
- Fresh startup seeded three users and four orders; the host connection string and `make shell` worked.
- `make test` passed before and after container recreation and after a full reset: fixtures, CRUD, Decimal128 aggregation, unique index, transaction rollback and commit.
- The wrong-database guard rejected a test run against `mongo_local_lab`. Development fixtures and a temporary record survived an ordinary test run and container recreation.
- `make reset-data` removed the temporary record; the next startup restored the original fixtures. Each successful test run removed its disposable database.

The service was left running with the original fixtures. No Atlas connection or client system was tested. Search and Vector Search queries, Windows/Linux operation, and integration with your own application have not been tested.

## Sources

- [Create a Local Atlas Deployment with Docker](https://www.mongodb.com/docs/atlas/cli/current/atlas-cli-deploy-docker/)
- [MongoDB Atlas Local Docker Compose example](https://www.mongodb.com/docs/atlas/cli/current/atlas-cli-docker-compose/)
- [MongoDB Atlas Local image](https://hub.docker.com/r/mongodb/mongodb-atlas-local/)
- [MongoDB Search and Vector Search deployment guide](https://www.mongodb.com/docs/atlas/cli/current/atlas-cli-deploy-fts/)
