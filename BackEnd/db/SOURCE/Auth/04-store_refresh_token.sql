USE chat_service_db;

DROP PROCEDURE IF EXISTS store_refresh_token;

DELIMITER //

CREATE PROCEDURE store_refresh_token (
  IN p_user_id CHAR(36),
  IN p_token VARCHAR(255)
)
BEGIN
  INSERT INTO refresh_tokens (id, user_id, token, expires_at, created_at)
  VALUES (
    UUID(),
    p_user_id,
    p_token,
    NOW() + INTERVAL 1 DAY,
    NOW()
  );
END //

DELIMITER ;
