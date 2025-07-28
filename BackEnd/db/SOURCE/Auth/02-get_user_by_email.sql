DELIMITER //

CREATE PROCEDURE get_user_by_email(IN user_email TEXT)
BEGIN
  SELECT *
  FROM users
  WHERE email = user_email
  LIMIT 1;
END //

DELIMITER ;
