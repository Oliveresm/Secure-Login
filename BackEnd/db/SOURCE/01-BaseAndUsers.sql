CREATE DATABASE IF NOT EXISTS chat_service_db;

USE chat_service_db;

-- Usuario principal (permite a la app hacer todo)
CREATE USER IF NOT EXISTS 'usuario'@'%' IDENTIFIED BY 'supersecreta';
GRANT ALL PRIVILEGES ON chat_service_db.* TO 'usuario'@'%';

-- Usuario extra con permisos más limitados
CREATE USER IF NOT EXISTS 'lectura'@'%' IDENTIFIED BY 'sololectura123';
GRANT SELECT ON chat_service_db.* TO 'lectura'@'%';
