use chat_service_db;

DROP PROCEDURE IF EXISTS generate_expired_recovery_token;

DELIMITER //

CREATE PROCEDURE generate_expired_recovery_token (
  IN p_email VARCHAR(255),
  IN p_hash VARCHAR(255)
)
BEGIN
  -- Asegurar que el usuario existe
  IF NOT EXISTS (
    SELECT 1 FROM users
    WHERE email = p_email
  ) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User not found';
  END IF;

  -- Asignar hash de recuperación y expiración
  UPDATE users
  SET recovery_hash = p_hash,
      recovery_expires_at = NOW() + INTERVAL 60 MINUTE
  WHERE email = p_email;
END //

DELIMITER ;




