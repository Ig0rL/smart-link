#!/bin/sh -e

psql --variable=ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
  CREATE DATABASE "smart_link";
  Grant all privileges on database "ms_support_service" to postgres;
EOSQL
