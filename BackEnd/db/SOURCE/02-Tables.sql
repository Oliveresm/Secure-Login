use chat_service_db;

CREATE TABLE IF NOT EXISTS users (
  id                     CHAR(36) PRIMARY KEY,
  email                  VARCHAR(255) NOT NULL UNIQUE,
  display_name           VARCHAR(100) NOT NULL,
  auth_type              ENUM('local', 'oauth') NOT NULL,
  auth_hash              VARCHAR(255),            -- Contraseña encriptada
  out_hash               VARCHAR(255),            -- Token de verificación de cuenta
  out_hash_expires_at    DATETIME,                -- Expira si no se verifica a tiempo
  recovery_hash          VARCHAR(255),            -- Token para recuperación de contraseña
  recovery_expires_at    DATETIME,                -- Expira si no se usa para restablecer
  is_verified            BOOLEAN NOT NULL,
  created_at             DATETIME NOT NULL
);

CREATE TABLE refresh_tokens (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  token VARCHAR(255) NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);