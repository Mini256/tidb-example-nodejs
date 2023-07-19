DROP TABLE IF EXISTS players;

CREATE TABLE players (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `coins` INT,
    `goods` INT,
    PRIMARY KEY (`id`)
);

INSERT INTO players VALUES (1, 1, 1024);
INSERT INTO players VALUES (2, 2, 512);
INSERT INTO players VALUES (3, 4, 256);
INSERT INTO players VALUES (4, 8, 128);
INSERT INTO players VALUES (5, 16, 64);
INSERT INTO players VALUES (6, 32, 32);
INSERT INTO players VALUES (7, 64, 16);
INSERT INTO players VALUES (8, 128, 8);
