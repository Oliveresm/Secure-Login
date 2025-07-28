USE chat_service_db;

DROP PROCEDURE IF EXISTS validate_refresh_token;

DELIMITER //

CREATE PROCEDURE validate_refresh_token (
  IN p_token VARCHAR(255)
)
BEGIN
  DECLARE db_user_id CHAR(36);
  DECLARE db_expires DATETIME;

  -- Buscar el token
  SELECT user_id, expires_at INTO db_user_id, db_expires
  FROM refresh_tokens
  WHERE token = p_token;

  -- Si no existe
  IF db_user_id IS NULL THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Refresh token not found';
  END IF;

  -- Si expiró
  IF db_expires < NOW() THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Refresh token expired';
  END IF;

  -- Si es válido, no se lanza error; el backend puede usar el user_id
  SELECT db_user_id AS user_id;
END //

DELIMITER ;
