USE test;

DROP TABLE IF EXISTS `books`;
CREATE TABLE `books` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `title` varchar(100) NOT NULL,
    `type` enum('Magazine', 'Novel', 'Life', 'Arts', 'Comics', 'Education & Reference', 'Humanities & Social Sciences', 'Science & Technology', 'Kids', 'Sports') NOT NULL,
    `published_at` datetime NOT NULL,
    `stock` int(11) DEFAULT '0',
    `price` decimal(15,2) DEFAULT '0.0',
    PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

DROP TABLE IF EXISTS `authors`;
CREATE TABLE `authors` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `name` varchar(100) NOT NULL,
    `gender` tinyint(1) DEFAULT NULL,
    `birth_year` smallint(6) DEFAULT NULL,
    `death_year` smallint(6) DEFAULT NULL,
    PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

DROP TABLE IF EXISTS `book_authors`;
CREATE TABLE `book_authors` (
   `book_id` int(11) NOT NULL,
   `author_id` int(11) NOT NULL,
   PRIMARY KEY (`book_id`,`author_id`) /*T![clustered_index] CLUSTERED */
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

DROP TABLE IF EXISTS `ratings`;
CREATE TABLE `ratings` (
    `book_id` int(11) NOT NULL,
    `user_id` int(11) NOT NULL,
    `score` tinyint NOT NULL,
    `rated_at` datetime NOT NULL DEFAULT NOW() ON UPDATE NOW(),
    PRIMARY KEY (`book_id`,`user_id`) /*T![clustered_index] CLUSTERED */,
    UNIQUE KEY `uniq_book_user_idx` (`book_id`,`user_id`)
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `balance` decimal(15,2) DEFAULT '0.0',
    `nickname` varchar(100) NOT NULL,
    PRIMARY KEY (`id`)
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `book_id` int(11) NOT NULL,
    `user_id` int(11) NOT NULL,
    `quality` tinyint(4) NOT NULL,
    `ordered_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
    KEY `orders_book_id_idx` (`book_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin