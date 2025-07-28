USE chat_service_db;

-- Asegúrate de que el event scheduler esté activo
SET GLOBAL event_scheduler = ON;

-- Evento para limpiar tokens de recuperación expirados
DROP EVENT IF EXISTS clear_expired_recovery_tokens_event;

CREATE EVENT clear_expired_recovery_tokens_event
ON SCHEDULE EVERY 60 MINUTE
DO
  UPDATE users
  SET recovery_hash = NULL,
      recovery_expires_at = NULL
  WHERE recovery_expires_at IS NOT NULL
    AND recovery_expires_at < NOW();

-- Evento para eliminar usuarios no verificados con enlaces expirados
DROP EVENT IF EXISTS clear_expired_verification_links;

CREATE EVENT clear_expired_verification_links
ON SCHEDULE EVERY 60 MINUTE
DO
  DELETE FROM users
  WHERE out_hash_expires_at IS NOT NULL
    AND out_hash_expires_at < NOW()
    AND is_verified = FALSE;

-- Evento para eliminar refresh tokens expirados
DROP EVENT IF EXISTS clear_expired_refresh_tokens;

CREATE EVENT clear_expired_refresh_tokens
ON SCHEDULE EVERY 1 DAY
DO
  DELETE FROM refresh_tokens
  WHERE expires_at IS NOT NULL
    AND expires_at < NOW();
