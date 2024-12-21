CREATE DATABASE IF NOT EXISTS red_tetris;
USE `red_tetris`;
DROP TABLE IF EXISTS `scores`;
CREATE TABLE `scores` (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `username` varchar(255) NOT NULL,
    `roomname` varchar(255) NOT NULL,
    `score` int NOT NULL,
    `created` datetime NOT NULL,

    PRIMARY KEY (`id`)
);

GRANT ALL PRIVILEGES ON red_tetris.* TO 'redtetris'@'%';