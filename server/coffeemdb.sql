CREATE DATABASE  IF NOT EXISTS `coffeemdb` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: coffeemdb
-- ------------------------------------------------------
-- Server version	8.0.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `posts` (
  `id_user` int DEFAULT NULL,
  `date` varchar(255) DEFAULT NULL,
  `imageUrl` varchar(255) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `resume` varchar(255) DEFAULT NULL,
  `content` text,
  `duration` varchar(255) DEFAULT NULL,
  `star` varchar(255) DEFAULT NULL,
  `views` int DEFAULT NULL,
  `status` tinyint(1) DEFAULT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES (1,'2022-05-22','https://nyousefali.com.br/blog/img/08.png','cinema','Cafeicultores Mineiros lideram - Prêmio Ernesto Illy','Resumo do post','Conteúdo do post','5','5',8,1,1),(1,'2021-12-21','https://nyousefali.com.br/blog/img/08.png','cinema','O novo filme do Spider-Man','Resumo do post','Conteúdo do post','7','4',10,1,9),(1,'2024-03-06','https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1','tecnologia','Novo post','resumo do novo post','Conteudo do novo post','5','4',10,1,10),(2,'2024-03-05','https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1','fotografia','Post Teste','Resumo de post teste','post teste','10','4',10,1,11),(1,'2024-03-06','https://cdn.pixabay.com/photo/2023/04/11/13/27/bird-7917250_1280.jpg','cinema','Testando post Elizeu','Teste de post Elizeu','testesteteste','7','4',10,1,12),(2,'2024-03-07','https://cdn.pixabay.com/photo/2017/09/04/18/39/coffee-2714970_1280.jpg','fotografia','Isabela Belinha','Resumo da bela','BELABELABELABELABELABELABELABELABELABELABELABELABELABELABELABELABELABELABELABELABELABELABELABELABELABELABELABELABELABELABELABELABELABELABELABELABELABELABELABELABELABELABELABELABELABELABELABELABELABELABELABELABELABELABELABELABELABELABELABELABELABELABELABELABELABELABELABELABELABELABELABELABELABELABELABELABELABELABELABELABELABELABELABELABELABELABELA','10','4',10,1,13);
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `surname` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `description` text,
  `image_profile` varchar(255) DEFAULT NULL,
  `auth_token` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'fabianof','Fabiano','Freire','$2b$10$t9tNsCHOy2vEfkXETUFXy.SnoXWVDchSTIV8aH4clXJeK3zaZLefm','Descrição de Fernando','https://nyousefali.com.br/blog/profile/alex.png','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiZmVybmFuZG8iLCJpYXQiOjE3MDk2OTQ0MDh9.3_t5c75eT6fX7rNwT3cNE70Rlx3LbFrcY0J5qBqYCX8'),(2,'joaoeduardo','João Eduardo','Miranda','$2b$10$mlEMSJbwfJiIj0DaQABM5uAEcFWIGUsBqvext6DaQNlH/k/dRGCUS','Descrição de Joao','https://nyousefali.com.br/blog/profile/ny.jpg','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiam9hb2VkdSIsImlhdCI6MTcwOTY5NDU3OX0.CKXzJ3UotJUqc5PQj4v3ZDx01CSqwq1BXA4JKjbW6JE');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-03-12 14:43:24
