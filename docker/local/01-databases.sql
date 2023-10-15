-- create databases
DROP DATABASE IF EXISTS `liber`;
DROP DATABASE IF EXISTS `liber_test`;
CREATE DATABASE IF NOT EXISTS `liber`;
CREATE DATABASE IF NOT EXISTS `liber_test`;

CREATE USER 'liber'@'%' IDENTIFIED BY '7oPZExu1K2nxct';
GRANT ALL PRIVILEGES ON `liber%`.* TO 'liber'@'%';
