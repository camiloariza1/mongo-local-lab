# Local MongoDB Lab

MongoDB Atlas Local 8.0 with synthetic users and orders. Docker must be running.

```sh
make up          # start MongoDB
make shell       # open mongosh
make test        # run smoke tests
make stop        # stop, keep data
make reset-data  # delete data; next `make up` reseeds it
```

Connect your app on the host with:

```text
mongodb://127.0.0.1:27018/mongo_local_lab?directConnection=true
```

From another Docker Compose service, use `mongodb://mongodb:27017/mongo_local_lab`.

The database has no authentication and is bound to localhost. Use for local development only.
