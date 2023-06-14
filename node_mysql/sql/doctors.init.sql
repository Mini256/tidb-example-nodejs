DROP TABLE IF EXISTS `doctors`;
CREATE TABLE `doctors` (
    `id` int(11) NOT NULL,
    `name` varchar(255) DEFAULT NULL,
    `on_call` tinyint(1) DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

INSERT INTO `doctors` (`id`, `name`, `on_call`)
VALUES
    (1, 'Alice', True),
    (2, 'Bob', True),
    (3, 'Carol', False);