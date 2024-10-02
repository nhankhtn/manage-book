-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: qlns_cnpm
-- ------------------------------------------------------
-- Server version	9.0.1

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
-- Table structure for table `bc_cong_no`
--

DROP TABLE IF EXISTS bc_cong_no;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE bc_cong_no (
  ID_BCCN varchar(6) NOT NULL,
  NGAY date DEFAULT NULL,
  PRIMARY KEY (ID_BCCN)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bc_cong_no`
--

LOCK TABLES bc_cong_no WRITE;
/*!40000 ALTER TABLE bc_cong_no DISABLE KEYS */;
/*!40000 ALTER TABLE bc_cong_no ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bc_ton`
--

DROP TABLE IF EXISTS bc_ton;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE bc_ton (
  ID_BCT varchar(6) NOT NULL,
  NGAY date DEFAULT NULL,
  PRIMARY KEY (ID_BCT)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bc_ton`
--

LOCK TABLES bc_ton WRITE;
/*!40000 ALTER TABLE bc_ton DISABLE KEYS */;
/*!40000 ALTER TABLE bc_ton ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ctbccn`
--

DROP TABLE IF EXISTS ctbccn;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE ctbccn (
  ID_BCCN varchar(6) NOT NULL,
  ID_KH int NOT NULL,
  NO_DAU decimal(10,2) DEFAULT NULL,
  PHAT_SINH decimal(10,2) DEFAULT NULL,
  NO_CUOI decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (ID_BCCN,ID_KH),
  KEY FK_CTBCCN_KHACH_HANG (ID_KH),
  CONSTRAINT FK_CTBCCN_BC_CONG_NO FOREIGN KEY (ID_BCCN) REFERENCES bc_cong_no (ID_BCCN),
  CONSTRAINT FK_CTBCCN_KHACH_HANG FOREIGN KEY (ID_KH) REFERENCES khach_hang (ID_KH)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ctbccn`
--

LOCK TABLES ctbccn WRITE;
/*!40000 ALTER TABLE ctbccn DISABLE KEYS */;
/*!40000 ALTER TABLE ctbccn ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ctbct`
--

DROP TABLE IF EXISTS ctbct;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE ctbct (
  ID_BCT varchar(6) NOT NULL,
  ID_SACH varchar(6) NOT NULL,
  TON_DAU decimal(10,2) DEFAULT NULL,
  PHAT_SINH decimal(10,2) DEFAULT NULL,
  TON_CUOI decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (ID_BCT,ID_SACH),
  KEY FK_CTBCT_SACH (ID_SACH),
  CONSTRAINT FK_CTBCT_BC_TON FOREIGN KEY (ID_BCT) REFERENCES bc_ton (ID_BCT),
  CONSTRAINT FK_CTBCT_SACH FOREIGN KEY (ID_SACH) REFERENCES sach (ID_SACH)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ctbct`
--

LOCK TABLES ctbct WRITE;
/*!40000 ALTER TABLE ctbct DISABLE KEYS */;
/*!40000 ALTER TABLE ctbct ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cthd`
--

DROP TABLE IF EXISTS cthd;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE cthd (
  ID_HOA_DON varchar(6) NOT NULL,
  ID_SACH varchar(6) NOT NULL,
  SO_LUONG int DEFAULT NULL,
  DON_GIA decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (ID_HOA_DON,ID_SACH),
  KEY FK_CTHD_SACH (ID_SACH),
  CONSTRAINT FK_CTHD_HOA_DON FOREIGN KEY (ID_HOA_DON) REFERENCES hoa_don (ID_HOA_DON),
  CONSTRAINT FK_CTHD_SACH FOREIGN KEY (ID_SACH) REFERENCES sach (ID_SACH)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cthd`
--

LOCK TABLES cthd WRITE;
/*!40000 ALTER TABLE cthd DISABLE KEYS */;
/*!40000 ALTER TABLE cthd ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ctpn`
--

DROP TABLE IF EXISTS ctpn;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE ctpn (
  ID_PHIEU_NHAP varchar(6) NOT NULL,
  ID_SACH varchar(6) NOT NULL,
  SO_LUONG int DEFAULT NULL,
  PRIMARY KEY (ID_PHIEU_NHAP,ID_SACH),
  KEY FK_CTPN_SACH (ID_SACH),
  CONSTRAINT FK_CTPN_PHIEU_NHAP FOREIGN KEY (ID_PHIEU_NHAP) REFERENCES phieu_nhap (ID_PHIEU_NHAP),
  CONSTRAINT FK_CTPN_SACH FOREIGN KEY (ID_SACH) REFERENCES sach (ID_SACH)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ctpn`
--

LOCK TABLES ctpn WRITE;
/*!40000 ALTER TABLE ctpn DISABLE KEYS */;
/*!40000 ALTER TABLE ctpn ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hoa_don`
--

DROP TABLE IF EXISTS hoa_don;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE hoa_don (
  ID_HOA_DON varchar(6) NOT NULL,
  ID_KH int DEFAULT NULL,
  NGAY_LAP date DEFAULT NULL,
  PRIMARY KEY (ID_HOA_DON),
  KEY FK_HD_KHACH_HANG (ID_KH),
  CONSTRAINT FK_HD_KHACH_HANG FOREIGN KEY (ID_KH) REFERENCES khach_hang (ID_KH)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hoa_don`
--

LOCK TABLES hoa_don WRITE;
/*!40000 ALTER TABLE hoa_don DISABLE KEYS */;
/*!40000 ALTER TABLE hoa_don ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `khach_hang`
--

DROP TABLE IF EXISTS khach_hang;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE khach_hang (
  ID_KH int NOT NULL,
  HO_TEN varchar(30) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  DIA_CHI varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  DIEN_THOAI varchar(10) DEFAULT NULL,
  EMAIL varchar(50) DEFAULT NULL,
  DU_NO decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (ID_KH)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `khach_hang`
--

LOCK TABLES khach_hang WRITE;
/*!40000 ALTER TABLE khach_hang DISABLE KEYS */;
/*!40000 ALTER TABLE khach_hang ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `phieu_nhap`
--

DROP TABLE IF EXISTS phieu_nhap;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE phieu_nhap (
  ID_PHIEU_NHAP varchar(6) NOT NULL,
  NGAY_NHAP date DEFAULT NULL,
  PRIMARY KEY (ID_PHIEU_NHAP)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `phieu_nhap`
--

LOCK TABLES phieu_nhap WRITE;
/*!40000 ALTER TABLE phieu_nhap DISABLE KEYS */;
/*!40000 ALTER TABLE phieu_nhap ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `phieu_thu_tien`
--

DROP TABLE IF EXISTS phieu_thu_tien;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE phieu_thu_tien (
  ID_PHIEUTT varchar(6) NOT NULL,
  ID_KH int DEFAULT NULL,
  NGAY_THU date DEFAULT NULL,
  TIEN_THU decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (ID_PHIEUTT),
  KEY FK_PTT_KHACH_HANG (ID_KH),
  CONSTRAINT FK_PTT_KHACH_HANG FOREIGN KEY (ID_KH) REFERENCES khach_hang (ID_KH)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `phieu_thu_tien`
--

LOCK TABLES phieu_thu_tien WRITE;
/*!40000 ALTER TABLE phieu_thu_tien DISABLE KEYS */;
/*!40000 ALTER TABLE phieu_thu_tien ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sach`
--

DROP TABLE IF EXISTS sach;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE sach (
  ID_SACH varchar(6) AUTO_INCREMENT NOT NULL,
  TEN_SACH varchar(70) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  THE_LOAI varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  TAC_GIA varchar(30) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  SO_LUONG int DEFAULT NULL,
  PRIMARY KEY (ID_SACH)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sach`
--


DROP TABLE IF EXISTS `rules`;
CREATE TABLE rules (
    id INT PRIMARY KEY AUTO_INCREMENT,
    rule_name VARCHAR(255),
    rule_value int,
    is_active BOOLEAN DEFAULT TRUE
);

INSERT INTO rules (rule_name, rule_value) VALUES ('Max inventory quantity', 300);



LOCK TABLES sach WRITE;
/*!40000 ALTER TABLE sach DISABLE KEYS */;
/*!40000 ALTER TABLE sach ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-09-29 16:48:33


DROP TRIGGER IF EXISTS check_inventory;

DELIMITER $$

CREATE TRIGGER check_inventory
BEFORE UPDATE ON sach
FOR EACH ROW
BEGIN
    DECLARE max_quantity INT;


    SELECT CAST(rule_value AS UNSIGNED) INTO max_quantity 
    FROM rules 
    WHERE rule_name = 'Max inventory quantity';

    IF OLD.SO_LUONG >= max_quantity THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Lượng tồn kho hiện tại đã lớn hơn hoặc bằng giới hạn cho phép'; ;
    END IF;
END $$

DELIMITER ;
