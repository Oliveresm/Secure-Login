-- db/procedures/auth/delete_refresh_token.sql
DELIMITER //

CREATE PROCEDURE delete_refresh_token (
  IN p_user_id CHAR(36)
)
BEGIN
  DELETE FROM refresh_tokens
  WHERE user_id = p_user_id;
END //

DELIMITER ;
