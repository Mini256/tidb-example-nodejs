USE test;
DROP TABLE IF EXISTS players;

CREATE TABLE players (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `coins` INT,
    `goods` INT,
    PRIMARY KEY (`id`)
);

INSERT INTO players VALUES (1, 100, 20);    -- To be updated.

INSERT INTO players VALUES (2, 100, 20);    -- To be deleted.

INSERT INTO players VALUES (3, 100, 20);    -- To be bulk updated.
INSERT INTO players VALUES (4, 100, 20);    -- To be bulk updated.
INSERT INTO players VALUES (5, 100, 20);    -- To be bulk updated.

INSERT INTO players VALUES (6, 100, 20);    -- To be bulk deleted.
INSERT INTO players VALUES (7, 100, 20);    -- To be bulk deleted.
INSERT INTO players VALUES (8, 100, 20);    -- To be bulk deleted.