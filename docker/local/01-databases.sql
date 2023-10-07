-- create databases
DROP DATABASE IF EXISTS `sports_manager`;
DROP DATABASE IF EXISTS `sports_manager_test`;
CREATE DATABASE IF NOT EXISTS `sports_manager`;
CREATE DATABASE IF NOT EXISTS `sports_manager_test`;

CREATE USER 'sports_manager'@'%' IDENTIFIED BY '7oPZExu1K2nxct';
GRANT ALL PRIVILEGES ON `sports_manager%`.* TO 'sports_manager'@'%';
