-- -----------------------------------------------------
-- Schema mexazon
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mexazon` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `mexazon` ;

-- -----------------------------------------------------
-- Table `mexazon`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mexazon`.`users` (
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `user_type` ENUM('ordinary', 'business') NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(15) NOT NULL,
  `name` VARCHAR(100) NULL,
  `description` TEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `avatar_url` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE INDEX `email` (`email` ASC),
  UNIQUE INDEX `phone_UNIQUE` (`phone` ASC)
)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `mexazon`.`businesses`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mexazon`.`businesses` (
  `business_id` INT NOT NULL,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (`business_id`),
  CONSTRAINT `fk_business_user`
    FOREIGN KEY (`business_id`)
    REFERENCES `mexazon`.`users` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `mexazon`.`business_hours`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mexazon`.`business_hours` (
  `business_id` INT NOT NULL,
  `day_of_week` ENUM('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun') NOT NULL,
  `time_in` TIME NULL,
  `time_out` TIME NULL,
  `is_working` BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (`business_id`, `day_of_week`),
  CONSTRAINT `fk_bh_business`
    FOREIGN KEY (`business_id`)
    REFERENCES `mexazon`.`businesses` (`business_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `mexazon`.`menu_categories`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mexazon`.`menu_categories` (
  `category_id` INT NOT NULL AUTO_INCREMENT,
  `category_name` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `uq_category_name` (`category_name`)
)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `mexazon`.`dishes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mexazon`.`dishes` (
  `dish_id` INT NOT NULL AUTO_INCREMENT,
  `business_id` INT NOT NULL,
  `category_id` INT NOT NULL,
  `dish_name` VARCHAR(100) NOT NULL,
  `description` TEXT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `photo_url` VARCHAR(255) NULL,
  PRIMARY KEY (`dish_id`),
  KEY `idx_dish_business` (`business_id`),
  KEY `idx_dish_category_business` (`category_id`,`business_id`),
  CONSTRAINT uq_business_dishname UNIQUE (business_id, dish_name),
  CONSTRAINT `fk_dish_business`
    FOREIGN KEY (`business_id`)
    REFERENCES `mexazon`.`businesses` (`business_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_dish_category`
    FOREIGN KEY (`category_id`)
    REFERENCES `mexazon`.`menu_categories` (`category_id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `mexazon`.`posts`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mexazon`.`posts` (
  `post_id` INT NOT NULL AUTO_INCREMENT,
  `author_user_id` INT NOT NULL,
  `reviewed_business_id` INT NOT NULL,
  `rating` TINYINT UNSIGNED NOT NULL,
  `description` TEXT NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`post_id`),
  UNIQUE KEY `uq_author_business_once` (`author_user_id`,`reviewed_business_id`),
  KEY `idx_posts_author_created`   (`author_user_id`, `created_at`),
  KEY `idx_posts_business_created` (`reviewed_business_id`, `created_at`),
  CONSTRAINT `fk_posts_author`
    FOREIGN KEY (`author_user_id`)
    REFERENCES `mexazon`.`users` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_posts_business`
    FOREIGN KEY (`reviewed_business_id`)
    REFERENCES `mexazon`.`businesses` (`business_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    CHECK (`rating` BETWEEN 1 AND 5)
)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `mexazon`.`post_photos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mexazon`.`post_photos` (
  `photo_id` INT NOT NULL AUTO_INCREMENT,
  `post_id` INT NOT NULL,
  `photo_url` VARCHAR(255) NOT NULL,
  `photo_order` SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  PRIMARY KEY (`photo_id`),
  UNIQUE KEY `uq_post_photo_order` (`post_id`, `photo_order`),
  KEY `idx_post_photos_post` (`post_id`, `photo_order`),
  CONSTRAINT `fk_post_photos_post`
    FOREIGN KEY (`post_id`)
    REFERENCES `mexazon`.`posts` (`post_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `mexazon`.`postal_code_catalog`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mexazon`.`postal_code_catalog` (
  `postal_code` VARCHAR(10)  NOT NULL,
  `colonia`     VARCHAR(100) NOT NULL,
  `alcaldia`    VARCHAR(100) NOT NULL,
  PRIMARY KEY (`postal_code`, `colonia`),
  KEY `idx_pcc_alcaldia` (`alcaldia`)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `mexazon`.`users_address`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mexazon`.`users_address` (
  `user_id`     INT          NOT NULL,
  `postal_code` VARCHAR(10)  NOT NULL,
  `colonia`     VARCHAR(100) NOT NULL,
  `street`      VARCHAR(100) NULL,
  `number`      VARCHAR(10)  NULL,
  PRIMARY KEY (`user_id`),
  KEY `idx_ua_cp_colonia` (`postal_code`, `colonia`),
  CONSTRAINT `fk_ua_user`
    FOREIGN KEY (`user_id`) REFERENCES `mexazon`.`users` (`user_id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_ua_cp_colonia`
    FOREIGN KEY (`postal_code`, `colonia`)
    REFERENCES `mexazon`.`postal_code_catalog` (`postal_code`, `colonia`)
    ON DELETE RESTRICT ON UPDATE CASCADE
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;

-- -----------------------------------------------------
-- INSERTS
-- -----------------------------------------------------
INSERT INTO mexazon.users (user_type, email, password_hash, phone, name, description, avatar_url) VALUES
('business','eljarocho@ejemplo.mx',   '$2a$10$hash1','5550000001','Taquería El Jarocho','Tacos al pastor y suadero','https://example.com/avatars/jarocho.png'),
('business','donalucha@ejemplo.mx',   '$2a$10$hash2','5550000002','Tamales Doña Lucha','Tamales y atole','https://example.com/avatars/lucha.png'),
('business','laguera@ejemplo.mx',     '$2a$10$hash3','5550000003','Quesadillas La Güera','Quesadillas y salsas caseras','https://example.com/avatars/guera.png'),
('business','tortastigre@ejemplo.mx', '$2a$10$hash4','5550000004','Tortas El Tigre','Tortas gigantes y jugos','https://example.com/avatars/tigre.png'),
('business','donpepe@ejemplo.mx',     '$2a$10$hash5','5550000005','Churros Don Pepe','Churros y chocolate caliente','https://example.com/avatars/pepe.png'),

('ordinary','diana.ham@ejemplo.mx',   '$2a$10$hash6','5550000011','Diana Ham','Amante de la garnacha','https://example.com/avatars/diana.png'),
('ordinary','carlos.r@ejemplo.mx',    '$2a$10$hash7','5550000012','Carlos Ruiz','Buscador de tacos perfectos','https://example.com/avatars/carlos.png'),
('ordinary','ana.g@ejemplo.mx',       '$2a$10$hash8','5550000013','Ana Gómez','Fan del atole y los tamales','https://example.com/avatars/ana.png'),
('ordinary','luis.m@ejemplo.mx',      '$2a$10$hash9','5550000014','Luis Morales','Team torta de milanesa','https://example.com/avatars/luis.png'),
('ordinary','sofia.p@ejemplo.mx',     '$2a$10$hashA','5550000015','Sofía Pérez','Churros con chocolate > todo','https://example.com/avatars/sofia.png');

-- 2) BUSINESSES: 5 (apuntan a los user_id 1..5)
INSERT INTO mexazon.businesses (business_id, is_active) VALUES
(1, TRUE),
(2, TRUE),
(3, TRUE),
(4, TRUE),
(5, TRUE);

-- 3) POSTAL CODE CATALOG: 5
INSERT INTO mexazon.postal_code_catalog (postal_code, colonia, alcaldia) VALUES
('03020','Del Valle Norte','Benito Juárez'),
('03100','Narvarte Poniente','Benito Juárez'),
('06700','Roma Norte','Cuauhtémoc'),
('06800','Jardín Balbuena','Venustiano Carranza'),
('04000','Coyoacán','Coyoacán');

-- 4) USER ADDRESS: 10 (una dirección por cada user)
INSERT INTO mexazon.users_address (user_id, postal_code, colonia, street, number) VALUES
(1,'03020','Del Valle Norte','Av. Insurgentes Sur','123'),
(2,'03100','Narvarte Poniente','Av. Universidad','456B'),
(3,'06700','Roma Norte','Durango','789'),
(4,'06800','Jardín Balbuena','Francisco del Paso','55'),
(5,'04000','Coyoacán','Higuera','12A'),

(6,'03020','Del Valle Norte','Porfirio Díaz','101'),
(7,'03100','Narvarte Poniente','Doctor Vértiz','222'),
(8,'06700','Roma Norte','Álvaro Obregón','303'),
(9,'06800','Jardín Balbuena','Retorno 18','404'),
(10,'04000','Coyoacán','Centenario','505');

-- 5) BUSINESS HOURS: lun–mié para cada negocio
INSERT INTO mexazon.business_hours (business_id, day_of_week, time_in, time_out, is_working) VALUES
(1,'Mon','09:00:00','17:00:00', TRUE),
(1,'Tue','09:00:00','17:00:00', TRUE),
(1,'Wed','09:00:00','17:00:00', TRUE),

(2,'Mon','07:30:00','14:30:00', TRUE),
(2,'Tue','07:30:00','14:30:00', TRUE),
(2,'Wed','07:30:00','14:30:00', TRUE),

(3,'Mon','10:00:00','18:00:00', TRUE),
(3,'Tue','10:00:00','18:00:00', TRUE),
(3,'Wed','10:00:00','18:00:00', TRUE),

(4,'Mon','08:00:00','16:00:00', TRUE),
(4,'Tue','08:00:00','16:00:00', TRUE),
(4,'Wed','08:00:00','16:00:00', TRUE),

(5,'Mon','11:00:00','19:00:00', TRUE),
(5,'Tue','11:00:00','19:00:00', TRUE),
(5,'Wed','11:00:00','19:00:00', TRUE);

-- 6) MENU CATEGORIES: 5
INSERT INTO mexazon.menu_categories (category_name) VALUES
('tacos'),
('tamales'),
('burritos'),
('pozoles'),
('elotes');

-- 7) DISHES: 5 (uno por negocio)
INSERT INTO mexazon.dishes (business_id, category_id, dish_name, description, price, photo_url) VALUES
(1, (SELECT category_id FROM mexazon.menu_categories WHERE category_name='tacos'),       'Taco al pastor','Con piña y salsa verde', 25.00,'https://example.com/dishes/pastor.jpg'),
(2, (SELECT category_id FROM mexazon.menu_categories WHERE category_name='tamales'),      'Tamal verde','Salsa verde y pollo',       20.00,'https://example.com/dishes/tamal-verde.jpg'),
(3, (SELECT category_id FROM mexazon.menu_categories WHERE category_name='burritos'), 'Burritos de huitlacoche','Con queso',    35.00,'https://example.com/dishes/huitlacoche.jpg'),
(4, (SELECT category_id FROM mexazon.menu_categories WHERE category_name='pozoles'),      'Pozole de milanesa','Pan telera',           60.00,'https://example.com/dishes/milanesa.jpg'),
(5, (SELECT category_id FROM mexazon.menu_categories WHERE category_name='elotes'),     'Elotes clásicos','Azúcar y canela',       18.00,'https://example.com/dishes/churro.jpg');

-- 8) POSTS: 5 (autores = usuarios ordinary 6..10, reseñan negocios 1..5)
INSERT INTO mexazon.posts (author_user_id, reviewed_business_id, rating, description) VALUES
(6, 1, 5, 'Los tacos al pastor del Jarocho están de otro nivel.'),
(7, 2, 5, 'Tamales de Doña Lucha increíbles; el de rajas es mi favorito.'),
(8, 3, 4, 'Quesadillas enormes; la de huitlacoche con queso, top.'),
(9, 4, 5, 'Tortas gigantes y jugos bien servidos, recomendadísimo.'),
(10,5, 4, 'Churros crujientes y el chocolate calientito, muy bien.');

-- 9) POST_PHOTOS: 5 (una foto por post)
INSERT INTO mexazon.post_photos (post_id, photo_url, photo_order) VALUES
(1,'https://example.com/posts/p1.jpg',1),
(2,'https://example.com/posts/p2.jpg',1),
(3,'https://example.com/posts/p3.jpg',1),
(4,'https://example.com/posts/p4.jpg',1),
(5,'https://example.com/posts/p5.jpg',1);


