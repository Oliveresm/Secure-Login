-- src/sql/procedures/update_user_display_name.sql
DELIMITER //

CREATE PROCEDURE update_user_display_name(
  IN p_user_id CHAR(36),
  IN p_new_name VARCHAR(255)
)
BEGIN
  IF EXISTS (
    SELECT 1 FROM users
    WHERE display_name = p_new_name
      AND id != p_user_id
  ) THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Display name is already taken';
  END IF;

  UPDATE users
  SET display_name = p_new_name
  WHERE id = p_user_id;

  IF ROW_COUNT() = 0 THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'User not found';
  END IF;
END //

DELIMITER ;
