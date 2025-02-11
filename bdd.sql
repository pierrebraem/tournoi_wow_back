CREATE TABLE dungeon(
    id SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(50) NOT NULL,
    level INT NOT NULL,
    timer VARCHAR(5) NOT NULL,
    CONSTRAINT level_ck CHECK (level BETWEEN 2 AND 30)
);

CREATE TABLE challenge(
    dungeon_id INT NOT NULL,
    tournament_id INT NOT NULL,
    party_id INT NOT NULL,
    done BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (dungeon_id, tournament_id, party_id)
);

CREATE TABLE tournament(
    id SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    participation_right INT NOT NULL,
    description TEXT NOT NULL
);

CREATE TABLE registered(
    tournament_id INT NOT NULL,
    parties_id INT NOT NULL,
    registration_date DATE NOT NULL,
    PRIMARY KEY (tournament_id, parties_id)
);

CREATE TABLE parties (
    id SERIAL PRIMARY KEY NOT NULL,
    party_name VARCHAR(50) NOT NULL
);

CREATE TABLE compose (
    parties_id SERIAL NOT NULL,
    characters_id INT NOT NULL,
    PRIMARY KEY (parties_id, characters_id)
);

CREATE TABLE characters (
    id SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(50) NOT NULL,
    class_id INT NOT NULL,
    role_id INT NOT NULL,
    ilvl INT NOT NULL,
    rio INT NOT NULL,
    CONSTRAINT ilvl_ck CHECK (ilvl BETWEEN 0 AND 645),
    CONSTRAINT rio_ck CHECK (rio BETWEEN 0 AND 4500)
);

CREATE TABLE class (
    id INT PRIMARY KEY NOT NULL,
    label VARCHAR(30) NOT NULL
);

CREATE TABLE can_be (
    role_id INT NOT NULL,
    class_id INT NOT NULL,
    PRIMARY KEY (role_id, class_id)
);

CREATE TABLE roles (
    id INT PRIMARY KEY NOT NULL,
    label VARCHAR(50)
);

ALTER TABLE can_be
ADD CONSTRAINT fk_can_be_role FOREIGN KEY (role_id) REFERENCES roles(id),
ADD CONSTRAINT fk_can_be_class FOREIGN KEY (class_id) REFERENCES class(id);

ALTER TABLE characters
ADD CONSTRAINT fk_characters_class FOREIGN KEY (class_id) REFERENCES class(id),
ADD CONSTRAINT fk_characters_role FOREIGN KEY (role_id) REFERENCES roles(id);

ALTER TABLE compose
ADD CONSTRAINT fk_compose_parties FOREIGN KEY (parties_id) REFERENCES parties(id),
ADD CONSTRAINT fk_compose_characters FOREIGN KEY (characters_id) REFERENCES characters(id);

ALTER TABLE registered
ADD CONSTRAINT fk_registered_tournament FOREIGN KEY (tournament_id) REFERENCES tournament(id),
ADD CONSTRAINT fk_registered_parties FOREIGN KEY (parties_id) REFERENCES parties(id);

ALTER TABLE challenge
ADD CONSTRAINT fk_challenge_dungeon FOREIGN KEY (dungeon_id) REFERENCES dungeon(id),
ADD CONSTRAINT fk_challenge_tournament FOREIGN KEY (tournament_id) REFERENCES tournament(id),
ADD CONSTRAINT fk_challenge_parties FOREIGN KEY (party_id) REFERENCES parties(id);

INSERT INTO class VALUES
(1, 'Guerrier'),
(2, 'Paladin'),
(3, 'Chasseur'),
(4, 'Voleur'),
(5, 'Prêtre'),
(6, 'Chaman'),
(7, 'Mage'),
(8, 'Démoniste'),
(9, 'Moine'),
(10, 'Druide'),
(11, 'Chasseur de démons'),
(12, 'Chevalier de la mort'),
(13, 'Evocateur');

INSERT INTO roles VALUES
(1, 'Tank'),
(2, 'Soigneur'),
(3, 'Spécialiste des dégâts'),
(4, 'Dégâts'),
(5, 'Soins'),
(6, 'Spécialiste des dégâts physiques de mêlée');

INSERT INTO can_be VALUES
(1,1),
(3,1),
(1,2),
(2,2),
(2,3),
(4,3),
(3,4),
(2,5),
(3,5),
(2,6),
(3,6),
(4,7),
(3,8),
(1,9),
(2,9),
(3,9),
(1,10),
(2,10),
(3,10),
(1,11),
(3,11),
(1,12),
(6,12),
(5,13),
(3,13);

INSERT INTO characters (name, class_id, role_id, ilvl, rio) VALUES
('Savage Tiger', 2, 1, 590, 1450),
('Fierce Star', 10, 2, 35, 3000),
('Bold Raven', 1, 3, 500, 100),
('Mighty Cosmos', 5, 2, 10, 1000),
('Savage Fire', 1, 3, 250, 4000),
('Gallant Shield', 13, 5, 500, 1250),
('Resolute Oracle', 7, 4, 245, 1500),
('Nimble Revenant', 12, 6, 500, 4500),
('Mystic Lance', 4, 3, 250, 1000),
('Mighty Eagle', 9, 2, 15, 100),
('Bold Avenger', 8, 3, 135, 1450),
('Swift Assassin', 6, 2, 150, 1500),
('Daring Wolf', 1, 1, 300, 3000),
('Stalwart Ram', 5, 3, 400, 500),
('Fearless Leopard', 11, 3, 200, 3500);

INSERT INTO parties (party_name) VALUES
('Groupe 1'),
('Groupe 2');

INSERT INTO compose VALUES
(1, 1),
(1, 2),
(1, 5),
(1, 7),
(1, 8),
(2, 13),
(2, 11),
(2, 3),
(2, 15),
(2, 14);

INSERT INTO dungeon VALUES
(1, 'The Stonevault', 2, '33:00'),
(2, 'The Dawnbreaker', 13, '35:00'),
(3, 'Ara-Kara, City of Echoes', 29, '30:00');