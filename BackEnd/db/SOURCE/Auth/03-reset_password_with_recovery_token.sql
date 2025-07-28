use chat_service_db;

DROP PROCEDURE IF EXISTS reset_password_with_recovery_token;

DELIMITER //

CREATE PROCEDURE reset_password_with_recovery_token (
  IN p_recovery_hash VARCHAR(255),
  IN p_new_auth_hash VARCHAR(255)
)
BEGIN
  DECLARE db_id CHAR(36);
  DECLARE db_exp DATETIME;

  -- Buscar al usuario con ese recovery_hash
  SELECT id, recovery_expires_at INTO db_id, db_exp
  FROM users
  WHERE recovery_hash = p_recovery_hash;

  -- Si no existe
  IF db_id IS NULL THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid or used recovery token';
  END IF;

  -- Verificar si expiró
  IF db_exp IS NOT NULL AND db_exp < NOW() THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Recovery token has expired';
  END IF;

  -- Actualizar contraseña y limpiar tokens
  UPDATE users
  SET auth_hash = p_new_auth_hash,
      recovery_hash = NULL,
      recovery_expires_at = NULL
  WHERE id = db_id;
END //

DELIMITER ;