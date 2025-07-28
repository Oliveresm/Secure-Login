#!/bin/bash
set -e

DB_HOST="mysql_db"
DB_PORT="3306"
DB_USER="root"
DB_PASS="supersecreta"
DB_NAME="chat_service_db"

cd /db-init

mysql -h $DB_HOST -P $DB_PORT -u$DB_USER -p$DB_PASS -e "DROP DATABASE IF EXISTS \`$DB_NAME\`;"
mysql -h $DB_HOST -P $DB_PORT -u$DB_USER -p$DB_PASS -e "CREATE DATABASE \`$DB_NAME\`;"

mysql -h $DB_HOST -P $DB_PORT -u$DB_USER -p$DB_PASS $DB_NAME < SOURCE/01-BaseAndUsers.sql
mysql -h $DB_HOST -P $DB_PORT -u$DB_USER -p$DB_PASS $DB_NAME < SOURCE/02-Tables.sql

for file in SOURCE/create/*.sql; do
  mysql -h $DB_HOST -P $DB_PORT -u$DB_USER -p$DB_PASS $DB_NAME < "$file"
done

for file in SOURCE/Auth/*.sql; do
  mysql -h $DB_HOST -P $DB_PORT -u$DB_USER -p$DB_PASS $DB_NAME < "$file"
done

for file in SOURCE/Users/*.sql; do
  mysql -h $DB_HOST -P $DB_PORT -u$DB_USER -p$DB_PASS $DB_NAME < "$file"
done

echo "Base de datos inicializada correctamente"
