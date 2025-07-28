USE chat_service_db;

DROP PROCEDURE IF EXISTS create_user;

DELIMITER //

CREATE PROCEDURE create_user (
  IN p_email VARCHAR(255),
  IN p_display_name VARCHAR(100),
  IN p_auth_type ENUM('local', 'oauth'),
  IN p_auth_hash VARCHAR(255),
  IN p_out_hash VARCHAR(255)
)
BEGIN
  DECLARE new_id CHAR(36);

  -- Verifica email en minúsculas
  IF EXISTS (SELECT 1 FROM users WHERE email = LOWER(p_email)) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Email already exists';
  END IF;

  IF EXISTS (SELECT 1 FROM users WHERE display_name = p_display_name) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Display name already exists';
  END IF;

  SET new_id = UUID();

  IF p_auth_type = 'oauth' THEN
    INSERT INTO users (
      id, email, display_name, auth_type, auth_hash,
      out_hash, out_hash_expires_at,
      recovery_hash, recovery_expires_at,
      is_verified, created_at
    )
    VALUES (
      new_id, LOWER(p_email), p_display_name, p_auth_type, p_auth_hash,
      NULL, NULL,
      NULL, NULL,
      TRUE, NOW()
    );
  ELSE
    INSERT INTO users (
      id, email, display_name, auth_type, auth_hash,
      out_hash, out_hash_expires_at,
      recovery_hash, recovery_expires_at,
      is_verified, created_at
    )
    VALUES (
      new_id, LOWER(p_email), p_display_name, p_auth_type, p_auth_hash,
      p_out_hash, NOW() + INTERVAL 5 MINUTE,
      NULL, NULL,
      FALSE, NOW()
    );
  END IF;
END //

DELIMITER ;
