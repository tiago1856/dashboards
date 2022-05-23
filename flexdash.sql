-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.5.8-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             11.0.0.5919
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Dumping database structure for flexdash
CREATE DATABASE IF NOT EXISTS `flexdash` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `flexdash`;

-- Dumping structure for table flexdash.auth_group
CREATE TABLE IF NOT EXISTS `auth_group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table flexdash.auth_group: ~0 rows (approximately)
/*!40000 ALTER TABLE `auth_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group` ENABLE KEYS */;

-- Dumping structure for table flexdash.auth_group_permissions
CREATE TABLE IF NOT EXISTS `auth_group_permissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `group_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table flexdash.auth_group_permissions: ~0 rows (approximately)
/*!40000 ALTER TABLE `auth_group_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group_permissions` ENABLE KEYS */;

-- Dumping structure for table flexdash.auth_permission
CREATE TABLE IF NOT EXISTS `auth_permission` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `content_type_id` int(11) NOT NULL,
  `codename` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=latin1;

-- Dumping data for table flexdash.auth_permission: ~28 rows (approximately)
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES
	(1, 'Can add log entry', 1, 'add_logentry'),
	(2, 'Can change log entry', 1, 'change_logentry'),
	(3, 'Can delete log entry', 1, 'delete_logentry'),
	(4, 'Can view log entry', 1, 'view_logentry'),
	(5, 'Can add permission', 2, 'add_permission'),
	(6, 'Can change permission', 2, 'change_permission'),
	(7, 'Can delete permission', 2, 'delete_permission'),
	(8, 'Can view permission', 2, 'view_permission'),
	(9, 'Can add group', 3, 'add_group'),
	(10, 'Can change group', 3, 'change_group'),
	(11, 'Can delete group', 3, 'delete_group'),
	(12, 'Can view group', 3, 'view_group'),
	(13, 'Can add content type', 4, 'add_contenttype'),
	(14, 'Can change content type', 4, 'change_contenttype'),
	(15, 'Can delete content type', 4, 'delete_contenttype'),
	(16, 'Can view content type', 4, 'view_contenttype'),
	(17, 'Can add session', 5, 'add_session'),
	(18, 'Can change session', 5, 'change_session'),
	(19, 'Can delete session', 5, 'delete_session'),
	(20, 'Can view session', 5, 'view_session'),
	(21, 'Can add user', 6, 'add_user'),
	(22, 'Can change user', 6, 'change_user'),
	(23, 'Can delete user', 6, 'delete_user'),
	(24, 'Can view user', 6, 'view_user'),
	(25, 'Can add query', 7, 'add_query'),
	(26, 'Can change query', 7, 'change_query'),
	(27, 'Can delete query', 7, 'delete_query'),
	(28, 'Can view query', 7, 'view_query'),
	(29, 'Can add component', 8, 'add_component'),
	(30, 'Can change component', 8, 'change_component'),
	(31, 'Can delete component', 8, 'delete_component'),
	(32, 'Can view component', 8, 'view_component'),
	(33, 'Can add layout', 9, 'add_layout'),
	(34, 'Can change layout', 9, 'change_layout'),
	(35, 'Can delete layout', 9, 'delete_layout'),
	(36, 'Can view layout', 9, 'view_layout'),
	(37, 'Can add dashboard', 10, 'add_dashboard'),
	(38, 'Can change dashboard', 10, 'change_dashboard'),
	(39, 'Can delete dashboard', 10, 'delete_dashboard'),
	(40, 'Can view dashboard', 10, 'view_dashboard'),
	(41, 'Can add config', 11, 'add_config'),
	(42, 'Can change config', 11, 'change_config'),
	(43, 'Can delete config', 11, 'delete_config'),
	(44, 'Can view config', 11, 'view_config');
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;

-- Dumping structure for table flexdash.dash_component
CREATE TABLE IF NOT EXISTS `dash_component` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(80) NOT NULL,
  `description` varchar(128) DEFAULT NULL,
  `title` varchar(128) DEFAULT NULL,
  `date_created` datetime(6) NOT NULL,
  `date_updated` datetime(6) NOT NULL,
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`data`)),
  `author` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `uuid` varchar(48) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `component_name` (`name`),
  KEY `component_author_496dc400_fk_user_id` (`author`),
  KEY `component_updated_by_77dab664_fk_user_id` (`updated_by`),
  CONSTRAINT `component_author_496dc400_fk_user_id` FOREIGN KEY (`author`) REFERENCES `user` (`id`),
  CONSTRAINT `component_updated_by_77dab664_fk_user_id` FOREIGN KEY (`updated_by`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=latin1;

-- Dumping data for table flexdash.dash_component: ~6 rows (approximately)
/*!40000 ALTER TABLE `dash_component` DISABLE KEYS */;
INSERT INTO `dash_component` (`id`, `name`, `description`, `title`, `date_created`, `date_updated`, `data`, `author`, `updated_by`, `uuid`) VALUES
	(20, '1810290b-8136-4c5c-83c4-8099e016e3c7', '', '', '2022-03-07 13:50:27.519556', '2022-03-29 16:36:13.162274', '{"id": null, "name": "1810290b-8136-4c5c-83c4-8099e016e3c7", "description": "", "title": "", "component_type": "TABLE", "query": {"query_selection": "2", "query": "SELECT * FROM world.country WHERE SurfaceArea > 1000000", "query_selected_fields": ["Code", "Name", "Continent", "Region", "SurfaceArea", "IndepYear", "Population", "LifeExpectancy", "GNP", "GNPOld", "LocalName", "GovernmentForm", "HeadOfState", "Capital", "Code2"], "query_fields": ["Code", "Name", "Continent", "Region", "SurfaceArea", "IndepYear", "Population", "LifeExpectancy", "GNP", "GNPOld", "LocalName", "GovernmentForm", "HeadOfState", "Capital", "Code2"]}, "visualization": {"visualization_type": "TS", "visualization_tab": "data-visualization-tables"}, "data_config": {"fields": ["Code", "Name", "Continent", "Region", "SurfaceArea", "IndepYear", "Population", "LifeExpectancy", "GNP", "GNPOld", "LocalName", "GovernmentForm", "HeadOfState", "Capital", "Code2"]}, "uuid": "75d0471e-9a55-46eb-b42c-f59a1e1c6bff"}', NULL, 1, '1810290b-8136-4c5c-83c4-8099e016e3c7'),
	(21, 'xxxxx', '', '', '2022-03-09 19:01:22.187295', '2022-05-09 08:51:10.105099', '{"id": 21, "name": "xxxxx", "description": "", "title": "", "component_type": "GRAPH", "query": {"query_selection": "12", "query": "SELECT continent,\\tCOUNT(*) as total FROM world.country GROUP BY continent;", "query_selected_fields": ["continent", "total"], "query_fields": ["continent", "total"]}, "visualization": {"visualization_type": "G1N", "visualization_tab": "data-visualization-graphs"}, "data_config": {"fields": ["continent", "total"]}, "uuid": "39eefb3f-d5c0-44d1-9a7d-f646c43cca2f", "options": null}', NULL, NULL, NULL),
	(23, 'd2f22360-7ac0-4cae-99d6-bccbd46302a2', '', '', '2022-03-14 08:06:29.997580', '2022-03-14 08:06:29.997580', '{"id": null, "uuid": "bea0f761-cfec-4197-89d0-acf51d262e43", "name": "d2f22360-7ac0-4cae-99d6-bccbd46302a2", "description": "", "title": "", "component_type": "GRAPH", "query": {"query_selection": "2", "query": "SELECT * FROM world.country WHERE SurfaceArea > 1000000", "query_selected_fields": ["Code", "SurfaceArea"], "query_fields": ["Code", "SurfaceArea"]}, "visualization": {"visualization_type": "G1N", "visualization_tab": "data-visualization-graphs"}, "data_config": {"fields": ["Code", "SurfaceArea"]}}', NULL, NULL, 'bea0f761-cfec-4197-89d0-acf51d262e43'),
	(31, '3843185f-1047-4587-9927-2650ec5e13f4', '', '', '2022-04-03 17:41:35.452308', '2022-04-03 17:41:35.452308', '{"id": null, "name": "3843185f-1047-4587-9927-2650ec5e13f4", "description": "", "title": "", "component_type": "GRAPH", "query": {"query_selection": "2", "query": "SELECT * FROM world.country WHERE $SurfaceArea$ > #5000000#", "query_selected_fields": ["Code", "Name", "Continent", "Region", "SurfaceArea", "IndepYear", "Population", "LifeExpectancy", "GNP", "GNPOld", "LocalName", "GovernmentForm", "HeadOfState", "Capital", "Code2"], "query_fields": ["Code", "Name", "Continent", "Region", "SurfaceArea", "IndepYear", "Population", "LifeExpectancy", "GNP", "GNPOld", "LocalName", "GovernmentForm", "HeadOfState", "Capital", "Code2"]}, "visualization": {"visualization_type": "G1N", "visualization_tab": "data-visualization-graphs"}, "data_config": {"fields": ["Code", "SurfaceArea"]}, "uuid": "506b2773-d520-4a5d-afd3-1f4d1f963fe3"}', 1, 1, '506b2773-d520-4a5d-afd3-1f4d1f963fe3'),
	(32, '3b4929d7-75b4-4cfd-b9a5-70c273148cc0', 'error?', '', '2022-05-09 08:48:47.200345', '2022-05-09 08:53:29.789176', '{"id": null, "name": "3b4929d7-75b4-4cfd-b9a5-70c273148cc0", "description": "error?", "title": "", "component_type": "INFO", "query": {"query_selection": "13", "query": "SELECT \\n\\tCOUNT(*) AS Count, (SELECT COUNT(*) FROM world.country) AS Total\\nFROM\\n\\tworld.country\\nWHERE \\n\\tcountry.SurfaceArea > 1000000", "query_selected_fields": ["Count"], "query_fields": ["Count"]}, "visualization": {"visualization_type": "ISL", "visualization_tab": "data-visualization-info"}, "data_config": {"value": "Count", "text_1": "Count", "text_2": "", "fields": ["Count"]}, "uuid": "c8deaeb6-c3e0-46ba-ace5-9fd74dd9a85e", "options": {"icon": "ion ion-md-alert", "icon-background-color": "#ff0000", "icon-color": "#ffffff", "icon-size": 92, "text-size": 24, "value-size": 32, "card-back-color": "#ffffff", "text-color": "#000000", "value-color": "#000000"}}', NULL, NULL, 'c8deaeb6-c3e0-46ba-ace5-9fd74dd9a85e');
/*!40000 ALTER TABLE `dash_component` ENABLE KEYS */;

-- Dumping structure for table flexdash.dash_config
CREATE TABLE IF NOT EXISTS `dash_config` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(80) NOT NULL,
  `date` datetime(6) NOT NULL,
  `author` int(11) DEFAULT NULL,
  `dashboard` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `dash_config_author_aaebb991_fk_user_id` (`author`),
  KEY `dash_config_dashboard_7f9c3c39_fk_dash_dashboard_id` (`dashboard`),
  CONSTRAINT `dash_config_author_aaebb991_fk_user_id` FOREIGN KEY (`author`) REFERENCES `user` (`id`),
  CONSTRAINT `dash_config_dashboard_7f9c3c39_fk_dash_dashboard_id` FOREIGN KEY (`dashboard`) REFERENCES `dash_dashboard` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=latin1;

-- Dumping data for table flexdash.dash_config: ~26 rows (approximately)
/*!40000 ALTER TABLE `dash_config` DISABLE KEYS */;
INSERT INTO `dash_config` (`id`, `name`, `date`, `author`, `dashboard`) VALUES
	(2, 'dsasd', '2022-03-01 16:39:41.000000', NULL, 21),
	(3, '579aecf9-b8a8-41c3-9bcd-eed8ad74178c', '2022-03-01 17:00:21.953938', NULL, 21),
	(4, '73ae6bc3-c4a2-4540-8120-2fd65b89c7b9', '2022-03-14 08:01:47.789328', NULL, 31),
	(5, 'ea2c3191-11cb-4e64-ade4-3936aa81c8cd', '2022-03-14 08:14:45.939265', NULL, NULL),
	(6, '3841a24e-4e1c-4e09-be52-901db3845def', '2022-03-14 08:24:14.717487', NULL, 21),
	(7, '2dbe7696-90b3-4028-af12-b948c07889db', '2022-03-21 13:30:56.068707', NULL, 21),
	(8, '6164f713-0949-4513-9918-15c08879475d', '2022-03-23 11:32:20.830036', NULL, 21),
	(9, 'b715b539-5734-4e5a-afc0-89647398b119', '2022-03-28 12:17:41.399409', NULL, 21),
	(10, '9333597c-7350-4aa7-b17e-61b6b7887081', '2022-03-29 13:54:32.115476', 1, 29),
	(11, '4787dc28-07c4-48ac-a5db-de49ae95435f', '2022-04-26 15:24:40.564021', NULL, 31),
	(12, 'd6db8e4a-4fc1-403d-8349-e7c836146357', '2022-04-28 06:40:28.653053', NULL, 21),
	(13, 'f002bbdf-f58b-49c5-8fbc-47a04becef8e', '2022-04-28 07:11:06.550812', NULL, 37),
	(14, '0734de6f-c610-4c23-893d-d4cc4bdd28a1', '2022-04-28 07:21:48.320715', NULL, 21),
	(15, '6eccbe60-f562-4020-ae3f-98240277d3b6', '2022-04-28 10:04:05.695821', NULL, 24),
	(16, '7f2862e2-2d03-41ef-92c7-a1c8369c8c5d', '2022-04-28 13:37:32.382472', NULL, 29),
	(17, '1521df02-f3df-4f78-9b0f-71bd75470d19', '2022-05-08 17:54:46.048826', NULL, 24),
	(18, '9eea9f06-4bf4-4b5c-9a05-08258b89a423', '2022-05-09 09:32:55.336812', NULL, 29),
	(19, 'c4b9a67c-1ff6-4812-b5e2-ac929e4e5aa3', '2022-05-20 08:04:05.895700', NULL, 21),
	(20, '9f7cf3d2-382c-4e1b-b79c-90de83fef373', '2022-05-20 08:04:36.915825', NULL, 21),
	(21, '0c1f192a-6d76-4fa2-9edd-d7edc1ef7d00', '2022-05-22 12:12:15.741480', NULL, 38),
	(22, 'ed63b77b-2280-490e-be52-8a10d31c60ae', '2022-05-22 18:29:12.375114', NULL, 39),
	(23, '85b63879-8a49-43db-8345-f1a5e8dcc037', '2022-05-22 18:57:41.786011', NULL, 38),
	(24, 'e9a805f1-a372-4fc2-b114-1bfbab9f8ae3', '2022-05-22 21:06:15.817703', NULL, 29),
	(25, '5fe4e587-c835-4b73-90c6-49dda64b0517', '2022-05-22 21:08:20.257140', NULL, 38),
	(26, '8069cabb-0b47-4271-99da-b01366973709', '2022-05-23 08:48:43.619263', 1, 29),
	(27, '991b27b2-b3d1-42ac-b38d-633d3138fb8e', '2022-05-23 14:16:38.492225', 1, 38),
	(28, '75766371-cc19-46c2-b339-d5ae1e71e9cc', '2022-05-23 15:07:44.851356', 1, 21),
	(29, 'd2634da0-02df-496d-b407-b3207efc9e27', '2022-05-23 15:07:55.905838', 1, 38);
/*!40000 ALTER TABLE `dash_config` ENABLE KEYS */;

-- Dumping structure for table flexdash.dash_dashboard
CREATE TABLE IF NOT EXISTS `dash_dashboard` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(80) NOT NULL,
  `description` varchar(128) DEFAULT NULL,
  `title` varchar(128) DEFAULT NULL,
  `date_created` datetime(6) NOT NULL,
  `date_updated` datetime(6) NOT NULL,
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`data`)),
  `author` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `layout` int(11) DEFAULT NULL,
  `date_format` varchar(16) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `dashboard_name` (`name`),
  KEY `dashboard_author_8ef66c6d_fk_user_id` (`author`),
  KEY `dashboard_updated_by_546f3c4a_fk_user_id` (`updated_by`),
  KEY `dashboard_layout_1dce980e_fk_layout_id` (`layout`),
  CONSTRAINT `dashboard_author_8ef66c6d_fk_user_id` FOREIGN KEY (`author`) REFERENCES `user` (`id`),
  CONSTRAINT `dashboard_layout_1dce980e_fk_layout_id` FOREIGN KEY (`layout`) REFERENCES `dash_layout` (`id`),
  CONSTRAINT `dashboard_updated_by_546f3c4a_fk_user_id` FOREIGN KEY (`updated_by`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=latin1;

-- Dumping data for table flexdash.dash_dashboard: ~9 rows (approximately)
/*!40000 ALTER TABLE `dash_dashboard` DISABLE KEYS */;
INSERT INTO `dash_dashboard` (`id`, `name`, `description`, `title`, `date_created`, `date_updated`, `data`, `author`, `updated_by`, `layout`, `date_format`) VALUES
	(21, 'control1', '', NULL, '2022-01-28 06:58:19.555546', '2022-04-05 06:51:56.097191', '{"0": {"id": null, "name": "1810290b-8136-4c5c-83c4-8099e016e3c7", "description": "", "title": "", "component_type": "CONTROL", "query": {"query_selection": "2", "query": "SELECT * FROM world.country WHERE $SurfaceArea$ > 1000000", "query_selected_fields": ["Code", "Name", "Continent", "Region", "SurfaceArea", "IndepYear", "Population", "LifeExpectancy", "GNP", "GNPOld", "LocalName", "GovernmentForm", "HeadOfState", "Capital", "Code2"], "query_fields": ["Code", "Name", "Continent", "Region", "SurfaceArea", "IndepYear", "Population", "LifeExpectancy", "GNP", "GNPOld", "LocalName", "GovernmentForm", "HeadOfState", "Capital", "Code2"]}, "visualization": {"visualization_type": "CN", "visualization_tab": "data-visualization-controls"}, "data_config": {"fields": ["Code", "Name", "Continent", "Region", "SurfaceArea", "IndepYear", "Population", "LifeExpectancy", "GNP", "GNPOld", "LocalName", "GovernmentForm", "HeadOfState", "Capital", "Code2"], "name": "3a5964f6-1869-4ee1-a0c7-dd11c39e729a", "default": "0", "min": "50000", "max": "10000000", "step": "1", "type": "slider"}, "uuid": "a8d54062-6eab-43af-ac58-9bc9a1623617"}, "1": {"id": null, "name": "3843185f-1047-4587-9927-2650ec5e13f4", "description": "", "title": "", "component_type": "GRAPH", "query": {"query_selection": "2", "query": "SELECT * FROM world.country WHERE country.SurfaceArea > 5000000", "query_selected_fields": ["Code", "Name", "Continent", "Region", "SurfaceArea", "IndepYear", "Population", "LifeExpectancy", "GNP", "GNPOld", "LocalName", "GovernmentForm", "HeadOfState", "Capital", "Code2"], "query_fields": ["Code", "Name", "Continent", "Region", "SurfaceArea", "IndepYear", "Population", "LifeExpectancy", "GNP", "GNPOld", "LocalName", "GovernmentForm", "HeadOfState", "Capital", "Code2"]}, "visualization": {"visualization_type": "G1N", "visualization_tab": "data-visualization-graphs"}, "data_config": {"fields": ["Code", "SurfaceArea"]}, "uuid": "506b2773-d520-4a5d-afd3-1f4d1f963fe3"}}', 1, 1, 2, 'DD/MM/YYYY'),
	(24, '9c493001-ab31-4a0b-ab2e-f2510f7aa7e4', '', NULL, '2022-01-28 14:09:46.118512', '2022-05-09 07:14:33.623989', '{"components": {"0": {"id": null, "name": "3b4929d7-75b4-4cfd-b9a5-70c273148cc0", "description": "error?", "title": "", "component_type": "INFO", "query": {"query_selection": "13", "query": "SELECT \\n\\tCOUNT(*) AS Count, (SELECT COUNT(*) FROM world.country) AS Total\\nFROM\\n\\tworld.country\\nWHERE \\n\\tcountry.SurfaceArea > 1000000", "query_selected_fields": ["Count"], "query_fields": ["Count"]}, "visualization": {"visualization_type": "ISL", "visualization_tab": "data-visualization-info"}, "data_config": {"value": "Count", "text_1": "Count", "text_2": "", "fields": ["Count"]}, "uuid": "c8deaeb6-c3e0-46ba-ace5-9fd74dd9a85e", "options": {"icon": "ion ion-md-alert", "icon-background-color": "#ff0000", "icon-color": "#ffffff", "icon-size": 92, "text-size": 24, "value-size": 32, "card-back-color": "#ffffff", "text-color": "#000000", "value-color": "#000000"}}, "1": {"id": null, "name": null, "description": null, "title": null, "component_type": null, "query": {"query_selection": null, "query": null, "query_selected_fields": null, "query_fields": null}, "visualization": {"visualization_type": null, "visualization_tab": null}, "data_config": {}, "uuid": "6d24fd5c-7a74-46da-9069-38d94f638f0b", "options": null}}, "comms": {"io": {"uuid-global-calendar": {"inputs": [], "outputs": ["Data Inicio", "Ano Inicio", "M\\u00eas Inicio", "Dia Inicio", "Data Fim", "Ano Fim", "M\\u00eas Fim", "Dia Fim"], "name": "Calend\\u00e1rio Global", "indices": {"inputs": [], "outputs": []}}, "c8deaeb6-c3e0-46ba-ace5-9fd74dd9a85e": {"inputs": ["country.SurfaceArea"], "outputs": [], "name": "3b4929d7-75b4-4cfd-b9a5-70c273148cc0", "indices": {"inputs": [], "outputs": []}}}, "links": {}, "in_diagram": {}}}', 1, NULL, 2, NULL),
	(25, '333333', '', NULL, '2022-01-28 15:01:39.540385', '2022-01-28 15:01:39.540385', '{"0": {"id": null, "name": "3b012a46-be9e-4a1f-8554-14fbce7e71e0", "description": "", "title": "", "component_type": "TABLE", "query": {"query_selection": "2", "query": "SELECT * FROM world.country WHERE SurfaceArea > 1000000", "query_selected_fields": ["Code", "Name", "Continent", "Region", "SurfaceArea", "IndepYear", "Population", "LifeExpectancy", "GNP", "GNPOld", "LocalName", "GovernmentForm", "HeadOfState", "Capital", "Code2"], "query_fields": ["Code", "Name", "Continent", "Region", "SurfaceArea", "IndepYear", "Population", "LifeExpectancy", "GNP", "GNPOld", "LocalName", "GovernmentForm", "HeadOfState", "Capital", "Code2"]}, "visualization": {"visualization_type": "TS", "visualization_tab": "data-visualization-tables"}, "data_config": {"fields": ["Code", "Name", "Continent", "Region", "SurfaceArea", "IndepYear", "Population", "LifeExpectancy", "GNP", "GNPOld", "LocalName", "GovernmentForm", "HeadOfState", "Capital", "Code2"]}}, "1": {"id": null, "name": "1655eedb-7815-465c-bba6-100b2eb3b4ff", "description": "", "title": "", "component_type": "GRAPH", "query": {"query_selection": "12", "query": "SELECT continent,\\tCOUNT(*) as total FROM world.country GROUP BY continent;", "query_selected_fields": [], "query_fields": []}, "visualization": {"visualization_type": "G1N", "visualization_tab": "data-visualization-graphs"}, "data_config": {"fields": ["continent", "total"]}}}', 1, 1, 5, NULL),
	(26, '76103efa-eb73-41a4-969e-4b58f7d3a690', '', NULL, '2022-03-04 11:17:50.968434', '2022-03-04 11:17:50.968434', '{"0": {"id": null, "name": "1810290b-8136-4c5c-83c4-8099e016e3c7", "description": "", "title": "", "component_type": "TEMPLATE", "query": {"query_selection": "2", "query": "SELECT * FROM world.country WHERE SurfaceArea > 1000000", "query_selected_fields": ["Code", "Name", "Continent", "Region", "SurfaceArea", "IndepYear", "Population", "LifeExpectancy", "GNP", "GNPOld", "LocalName", "GovernmentForm", "HeadOfState", "Capital", "Code2"], "query_fields": ["Code", "Name", "Continent", "Region", "SurfaceArea", "IndepYear", "Population", "LifeExpectancy", "GNP", "GNPOld", "LocalName", "GovernmentForm", "HeadOfState", "Capital", "Code2"]}, "visualization": {"visualization_type": "TEC", "visualization_tab": "data-visualization-templates"}, "data_config": {"fields": ["Code", "Name", "Continent", "Region", "SurfaceArea", "IndepYear", "Population", "LifeExpectancy", "GNP", "GNPOld", "LocalName", "GovernmentForm", "HeadOfState", "Capital", "Code2"]}}, "1": {"id": null, "name": "3843185f-1047-4587-9927-2650ec5e13f4", "description": "", "title": "", "component_type": "GRAPH", "query": {"query_selection": "12", "query": "SELECT continent,\\tCOUNT(*) as total FROM world.country GROUP BY continent;", "query_selected_fields": [], "query_fields": []}, "visualization": {"visualization_type": "G1N", "visualization_tab": "data-visualization-graphs"}, "data_config": {"fields": ["continent", "total"]}}}', NULL, NULL, 2, NULL),
	(27, '58b56083-8265-482f-b675-374f24813545', '', NULL, '2022-03-04 16:00:26.780427', '2022-03-04 16:00:26.780427', '{"0": {"id": null, "name": null, "description": null, "title": null, "component_type": null, "query": {"query_selection": null, "query": null, "query_selected_fields": null, "query_fields": null}, "visualization": {"visualization_type": null, "visualization_tab": null}, "data_config": {}}, "1": {"id": null, "name": null, "description": null, "title": null, "component_type": null, "query": {"query_selection": null, "query": null, "query_selected_fields": null, "query_fields": null}, "visualization": {"visualization_type": null, "visualization_tab": null}, "data_config": {}}}', NULL, NULL, 2, NULL),
	(28, 'ee5f66ec-7bf0-4237-b607-abdbb40db83e', '', NULL, '2022-03-04 16:01:35.011473', '2022-03-04 16:01:35.011473', '{"0": {"id": null, "name": null, "description": null, "title": null, "component_type": null, "query": {"query_selection": null, "query": null, "query_selected_fields": null, "query_fields": null}, "visualization": {"visualization_type": null, "visualization_tab": null}, "data_config": {}}, "1": {"id": null, "name": null, "description": null, "title": null, "component_type": null, "query": {"query_selection": null, "query": null, "query_selected_fields": null, "query_fields": null}, "visualization": {"visualization_type": null, "visualization_tab": null}, "data_config": {}}}', NULL, NULL, 2, NULL),
	(29, '999', '', NULL, '2022-03-07 13:44:50.800943', '2022-04-28 15:02:11.541524', '{"components": {"0": {"id": null, "name": "1810290b-8136-4c5c-83c4-8099e016e3c7", "description": "", "title": "zzzzzzzzzzzzzz", "component_type": "TABLE", "query": {"query_selection": "2", "query": "SELECT * FROM world.country WHERE SurfaceArea > 1000000", "query_selected_fields": ["Code", "Name", "Continent", "Region", "SurfaceArea", "IndepYear", "Population", "LifeExpectancy", "GNP", "GNPOld", "LocalName", "GovernmentForm", "HeadOfState", "Capital", "Code2"], "query_fields": ["Code", "Name", "Continent", "Region", "SurfaceArea", "IndepYear", "Population", "LifeExpectancy", "GNP", "GNPOld", "LocalName", "GovernmentForm", "HeadOfState", "Capital", "Code2"]}, "visualization": {"visualization_type": "TS", "visualization_tab": "data-visualization-tables"}, "data_config": {"fields": ["Code", "Name", "Continent", "Region", "SurfaceArea", "IndepYear", "Population", "LifeExpectancy", "GNP", "GNPOld", "LocalName", "GovernmentForm", "HeadOfState", "Capital", "Code2"]}, "uuid": "9643dea7-bbc0-4ada-a3ef-f253d4d0b64b", "options": {"sizes-height-component": "550", "header-background-color": "#0000ff", "header-color": "#ffffff", "header-alignment": "start", "header-vertical-alignment": "bottom", "rows-background-color": "#ffffff", "rows-color": "rgb(33, 37, 41)", "rows-alignment": "end", "rows-vertical-alignment": "top"}}, "1": {"id": null, "name": "3843185f-1047-4587-9927-2650ec5e13f4", "description": "", "title": "", "component_type": "GRAPH", "query": {"query_selection": "12", "query": "SELECT * FROM world.country WHERE country.SurfaceArea > 5000000", "query_selected_fields": ["Code", "Name", "Continent", "Region", "SurfaceArea", "IndepYear", "Population", "LifeExpectancy", "GNP", "GNPOld", "LocalName", "GovernmentForm", "HeadOfState", "Capital", "Code2"], "query_fields": ["Code", "Name", "Continent", "Region", "SurfaceArea", "IndepYear", "Population", "LifeExpectancy", "GNP", "GNPOld", "LocalName", "GovernmentForm", "HeadOfState", "Capital", "Code2"]}, "visualization": {"visualization_type": "G1N", "visualization_tab": "data-visualization-graphs"}, "data_config": {"fields": ["Code", "SurfaceArea"]}, "uuid": "de2eccac-2f48-4507-ac76-8800e48d93df", "options": null}}, "comms": {"io": {"uuid-global-calendar": {"inputs": [], "outputs": ["Data Inicio", "Ano Inicio", "M\\u00eas Inicio", "Dia Inicio", "Data Fim", "Ano Fim", "M\\u00eas Fim", "Dia Fim"], "name": "Calend\\u00e1rio Global", "indices": {"inputs": [], "outputs": []}}, "9643dea7-bbc0-4ada-a3ef-f253d4d0b64b": {"inputs": ["SurfaceArea"], "outputs": ["Code", "Name", "Continent", "Region", "SurfaceArea", "IndepYear", "Population", "LifeExpectancy", "GNP", "GNPOld", "LocalName", "GovernmentForm", "HeadOfState", "Capital", "Code2"], "name": "1810290b-8136-4c5c-83c4-8099e016e3c7", "indices": {"inputs": ["2c8329fe-9e51-427b-8767-e343186ae032", "2c8329fe-9e51-427b-8767-e343186ae032", "2c8329fe-9e51-427b-8767-e343186ae032", "2c8329fe-9e51-427b-8767-e343186ae032", "2c8329fe-9e51-427b-8767-e343186ae032", "2c8329fe-9e51-427b-8767-e343186ae032", "2c8329fe-9e51-427b-8767-e343186ae032", "2c8329fe-9e51-427b-8767-e343186ae032", "2c8329fe-9e51-427b-8767-e343186ae032", "2c8329fe-9e51-427b-8767-e343186ae032", "2c8329fe-9e51-427b-8767-e343186ae032", "2c8329fe-9e51-427b-8767-e343186ae032", "2c8329fe-9e51-427b-8767-e343186ae032", "2c8329fe-9e51-427b-8767-e343186ae032"], "outputs": ["23c77a43-ccbc-4327-8392-94d4855271d4", "205e2526-61eb-46ad-9fc0-f2e0a6f8cdbd", "044aad66-6b16-4276-99fc-6539d14b0e69", "3fcb1941-f752-4e5d-aed6-a5dcffe02883", "e0b69e41-9773-4f11-99be-ee44a9b8ced4", "a0f4e39b-6b75-460b-8e72-216a2dd7977a", "ea6d8656-5061-43ca-8604-07880d2eea8a", "23fe81d3-3e6e-4b6f-ad25-12fbfff77b47", "441c8a77-6b38-459e-af7a-782391bbb2dd", "5542f3d4-9820-4961-b167-aaf87aaa2237", "273e4110-bcaa-4578-984e-2768f3e9e023", "dd17321a-b473-46a8-ab60-2076213c5faf", "98a8ae8c-ca88-4433-bc98-ac1a32690d6e", "718dcb1f-fab1-4389-a311-d8c910474479", "57086334-bdfc-4cbb-8caa-e33fe1c59d33", "23c77a43-ccbc-4327-8392-94d4855271d4", "205e2526-61eb-46ad-9fc0-f2e0a6f8cdbd", "044aad66-6b16-4276-99fc-6539d14b0e69", "3fcb1941-f752-4e5d-aed6-a5dcffe02883", "e0b69e41-9773-4f11-99be-ee44a9b8ced4", "a0f4e39b-6b75-460b-8e72-216a2dd7977a", "ea6d8656-5061-43ca-8604-07880d2eea8a", "23fe81d3-3e6e-4b6f-ad25-12fbfff77b47", "441c8a77-6b38-459e-af7a-782391bbb2dd", "5542f3d4-9820-4961-b167-aaf87aaa2237", "273e4110-bcaa-4578-984e-2768f3e9e023", "dd17321a-b473-46a8-ab60-2076213c5faf", "98a8ae8c-ca88-4433-bc98-ac1a32690d6e", "718dcb1f-fab1-4389-a311-d8c910474479", "57086334-bdfc-4cbb-8caa-e33fe1c59d33", "23c77a43-ccbc-4327-8392-94d4855271d4", "205e2526-61eb-46ad-9fc0-f2e0a6f8cdbd", "044aad66-6b16-4276-99fc-6539d14b0e69", "3fcb1941-f752-4e5d-aed6-a5dcffe02883", "e0b69e41-9773-4f11-99be-ee44a9b8ced4", "a0f4e39b-6b75-460b-8e72-216a2dd7977a", "ea6d8656-5061-43ca-8604-07880d2eea8a", "23fe81d3-3e6e-4b6f-ad25-12fbfff77b47", "441c8a77-6b38-459e-af7a-782391bbb2dd", "5542f3d4-9820-4961-b167-aaf87aaa2237", "273e4110-bcaa-4578-984e-2768f3e9e023", "dd17321a-b473-46a8-ab60-2076213c5faf", "98a8ae8c-ca88-4433-bc98-ac1a32690d6e", "718dcb1f-fab1-4389-a311-d8c910474479", "57086334-bdfc-4cbb-8caa-e33fe1c59d33", "23c77a43-ccbc-4327-8392-94d4855271d4", "205e2526-61eb-46ad-9fc0-f2e0a6f8cdbd", "044aad66-6b16-4276-99fc-6539d14b0e69", "3fcb1941-f752-4e5d-aed6-a5dcffe02883", "e0b69e41-9773-4f11-99be-ee44a9b8ced4", "a0f4e39b-6b75-460b-8e72-216a2dd7977a", "ea6d8656-5061-43ca-8604-07880d2eea8a", "23fe81d3-3e6e-4b6f-ad25-12fbfff77b47", "441c8a77-6b38-459e-af7a-782391bbb2dd", "5542f3d4-9820-4961-b167-aaf87aaa2237", "273e4110-bcaa-4578-984e-2768f3e9e023", "dd17321a-b473-46a8-ab60-2076213c5faf", "98a8ae8c-ca88-4433-bc98-ac1a32690d6e", "718dcb1f-fab1-4389-a311-d8c910474479", "57086334-bdfc-4cbb-8caa-e33fe1c59d33", "23c77a43-ccbc-4327-8392-94d4855271d4", "205e2526-61eb-46ad-9fc0-f2e0a6f8cdbd", "044aad66-6b16-4276-99fc-6539d14b0e69", "3fcb1941-f752-4e5d-aed6-a5dcffe02883", "e0b69e41-9773-4f11-99be-ee44a9b8ced4", "a0f4e39b-6b75-460b-8e72-216a2dd7977a", "ea6d8656-5061-43ca-8604-07880d2eea8a", "23fe81d3-3e6e-4b6f-ad25-12fbfff77b47", "441c8a77-6b38-459e-af7a-782391bbb2dd", "5542f3d4-9820-4961-b167-aaf87aaa2237", "273e4110-bcaa-4578-984e-2768f3e9e023", "dd17321a-b473-46a8-ab60-2076213c5faf", "98a8ae8c-ca88-4433-bc98-ac1a32690d6e", "718dcb1f-fab1-4389-a311-d8c910474479", "57086334-bdfc-4cbb-8caa-e33fe1c59d33", "23c77a43-ccbc-4327-8392-94d4855271d4", "205e2526-61eb-46ad-9fc0-f2e0a6f8cdbd", "044aad66-6b16-4276-99fc-6539d14b0e69", "3fcb1941-f752-4e5d-aed6-a5dcffe02883", "e0b69e41-9773-4f11-99be-ee44a9b8ced4", "a0f4e39b-6b75-460b-8e72-216a2dd7977a", "ea6d8656-5061-43ca-8604-07880d2eea8a", "23fe81d3-3e6e-4b6f-ad25-12fbfff77b47", "441c8a77-6b38-459e-af7a-782391bbb2dd", "5542f3d4-9820-4961-b167-aaf87aaa2237", "273e4110-bcaa-4578-984e-2768f3e9e023", "dd17321a-b473-46a8-ab60-2076213c5faf", "98a8ae8c-ca88-4433-bc98-ac1a32690d6e", "718dcb1f-fab1-4389-a311-d8c910474479", "57086334-bdfc-4cbb-8caa-e33fe1c59d33", "23c77a43-ccbc-4327-8392-94d4855271d4", "205e2526-61eb-46ad-9fc0-f2e0a6f8cdbd", "044aad66-6b16-4276-99fc-6539d14b0e69", "3fcb1941-f752-4e5d-aed6-a5dcffe02883", "e0b69e41-9773-4f11-99be-ee44a9b8ced4", "a0f4e39b-6b75-460b-8e72-216a2dd7977a", "ea6d8656-5061-43ca-8604-07880d2eea8a", "23fe81d3-3e6e-4b6f-ad25-12fbfff77b47", "441c8a77-6b38-459e-af7a-782391bbb2dd", "5542f3d4-9820-4961-b167-aaf87aaa2237", "273e4110-bcaa-4578-984e-2768f3e9e023", "dd17321a-b473-46a8-ab60-2076213c5faf", "98a8ae8c-ca88-4433-bc98-ac1a32690d6e", "718dcb1f-fab1-4389-a311-d8c910474479", "57086334-bdfc-4cbb-8caa-e33fe1c59d33", "23c77a43-ccbc-4327-8392-94d4855271d4", "205e2526-61eb-46ad-9fc0-f2e0a6f8cdbd", "044aad66-6b16-4276-99fc-6539d14b0e69", "3fcb1941-f752-4e5d-aed6-a5dcffe02883", "e0b69e41-9773-4f11-99be-ee44a9b8ced4", "a0f4e39b-6b75-460b-8e72-216a2dd7977a", "ea6d8656-5061-43ca-8604-07880d2eea8a", "23fe81d3-3e6e-4b6f-ad25-12fbfff77b47", "441c8a77-6b38-459e-af7a-782391bbb2dd", "5542f3d4-9820-4961-b167-aaf87aaa2237", "273e4110-bcaa-4578-984e-2768f3e9e023", "dd17321a-b473-46a8-ab60-2076213c5faf", "98a8ae8c-ca88-4433-bc98-ac1a32690d6e", "718dcb1f-fab1-4389-a311-d8c910474479", "57086334-bdfc-4cbb-8caa-e33fe1c59d33", "23c77a43-ccbc-4327-8392-94d4855271d4", "205e2526-61eb-46ad-9fc0-f2e0a6f8cdbd", "044aad66-6b16-4276-99fc-6539d14b0e69", "3fcb1941-f752-4e5d-aed6-a5dcffe02883", "e0b69e41-9773-4f11-99be-ee44a9b8ced4", "a0f4e39b-6b75-460b-8e72-216a2dd7977a", "ea6d8656-5061-43ca-8604-07880d2eea8a", "23fe81d3-3e6e-4b6f-ad25-12fbfff77b47", "441c8a77-6b38-459e-af7a-782391bbb2dd", "5542f3d4-9820-4961-b167-aaf87aaa2237", "273e4110-bcaa-4578-984e-2768f3e9e023", "dd17321a-b473-46a8-ab60-2076213c5faf", "98a8ae8c-ca88-4433-bc98-ac1a32690d6e", "718dcb1f-fab1-4389-a311-d8c910474479", "57086334-bdfc-4cbb-8caa-e33fe1c59d33", "23c77a43-ccbc-4327-8392-94d4855271d4", "205e2526-61eb-46ad-9fc0-f2e0a6f8cdbd", "044aad66-6b16-4276-99fc-6539d14b0e69", "3fcb1941-f752-4e5d-aed6-a5dcffe02883", "e0b69e41-9773-4f11-99be-ee44a9b8ced4", "a0f4e39b-6b75-460b-8e72-216a2dd7977a", "ea6d8656-5061-43ca-8604-07880d2eea8a", "23fe81d3-3e6e-4b6f-ad25-12fbfff77b47", "441c8a77-6b38-459e-af7a-782391bbb2dd", "5542f3d4-9820-4961-b167-aaf87aaa2237", "273e4110-bcaa-4578-984e-2768f3e9e023", "dd17321a-b473-46a8-ab60-2076213c5faf", "98a8ae8c-ca88-4433-bc98-ac1a32690d6e", "718dcb1f-fab1-4389-a311-d8c910474479", "57086334-bdfc-4cbb-8caa-e33fe1c59d33", "23c77a43-ccbc-4327-8392-94d4855271d4", "205e2526-61eb-46ad-9fc0-f2e0a6f8cdbd", "044aad66-6b16-4276-99fc-6539d14b0e69", "3fcb1941-f752-4e5d-aed6-a5dcffe02883", "e0b69e41-9773-4f11-99be-ee44a9b8ced4", "a0f4e39b-6b75-460b-8e72-216a2dd7977a", "ea6d8656-5061-43ca-8604-07880d2eea8a", "23fe81d3-3e6e-4b6f-ad25-12fbfff77b47", "441c8a77-6b38-459e-af7a-782391bbb2dd", "5542f3d4-9820-4961-b167-aaf87aaa2237", "273e4110-bcaa-4578-984e-2768f3e9e023", "dd17321a-b473-46a8-ab60-2076213c5faf", "98a8ae8c-ca88-4433-bc98-ac1a32690d6e", "718dcb1f-fab1-4389-a311-d8c910474479", "57086334-bdfc-4cbb-8caa-e33fe1c59d33", "23c77a43-ccbc-4327-8392-94d4855271d4", "205e2526-61eb-46ad-9fc0-f2e0a6f8cdbd", "044aad66-6b16-4276-99fc-6539d14b0e69", "3fcb1941-f752-4e5d-aed6-a5dcffe02883", "e0b69e41-9773-4f11-99be-ee44a9b8ced4", "a0f4e39b-6b75-460b-8e72-216a2dd7977a", "ea6d8656-5061-43ca-8604-07880d2eea8a", "23fe81d3-3e6e-4b6f-ad25-12fbfff77b47", "441c8a77-6b38-459e-af7a-782391bbb2dd", "5542f3d4-9820-4961-b167-aaf87aaa2237", "273e4110-bcaa-4578-984e-2768f3e9e023", "dd17321a-b473-46a8-ab60-2076213c5faf", "98a8ae8c-ca88-4433-bc98-ac1a32690d6e", "718dcb1f-fab1-4389-a311-d8c910474479", "57086334-bdfc-4cbb-8caa-e33fe1c59d33", "23c77a43-ccbc-4327-8392-94d4855271d4", "205e2526-61eb-46ad-9fc0-f2e0a6f8cdbd", "044aad66-6b16-4276-99fc-6539d14b0e69", "3fcb1941-f752-4e5d-aed6-a5dcffe02883", "e0b69e41-9773-4f11-99be-ee44a9b8ced4", "a0f4e39b-6b75-460b-8e72-216a2dd7977a", "ea6d8656-5061-43ca-8604-07880d2eea8a", "23fe81d3-3e6e-4b6f-ad25-12fbfff77b47", "441c8a77-6b38-459e-af7a-782391bbb2dd", "5542f3d4-9820-4961-b167-aaf87aaa2237", "273e4110-bcaa-4578-984e-2768f3e9e023", "dd17321a-b473-46a8-ab60-2076213c5faf", "98a8ae8c-ca88-4433-bc98-ac1a32690d6e", "718dcb1f-fab1-4389-a311-d8c910474479", "57086334-bdfc-4cbb-8caa-e33fe1c59d33", "23c77a43-ccbc-4327-8392-94d4855271d4", "205e2526-61eb-46ad-9fc0-f2e0a6f8cdbd", "044aad66-6b16-4276-99fc-6539d14b0e69", "3fcb1941-f752-4e5d-aed6-a5dcffe02883", "e0b69e41-9773-4f11-99be-ee44a9b8ced4", "a0f4e39b-6b75-460b-8e72-216a2dd7977a", "ea6d8656-5061-43ca-8604-07880d2eea8a", "23fe81d3-3e6e-4b6f-ad25-12fbfff77b47", "441c8a77-6b38-459e-af7a-782391bbb2dd", "5542f3d4-9820-4961-b167-aaf87aaa2237", "273e4110-bcaa-4578-984e-2768f3e9e023", "dd17321a-b473-46a8-ab60-2076213c5faf", "98a8ae8c-ca88-4433-bc98-ac1a32690d6e", "718dcb1f-fab1-4389-a311-d8c910474479", "57086334-bdfc-4cbb-8caa-e33fe1c59d33"]}}, "de2eccac-2f48-4507-ac76-8800e48d93df": {"inputs": ["country.SurfaceArea"], "outputs": [], "name": "3843185f-1047-4587-9927-2650ec5e13f4", "indices": {"inputs": ["7d073736-cee4-4177-8dd8-927ce4bd3d44", "7d073736-cee4-4177-8dd8-927ce4bd3d44", "7d073736-cee4-4177-8dd8-927ce4bd3d44", "7d073736-cee4-4177-8dd8-927ce4bd3d44", "7d073736-cee4-4177-8dd8-927ce4bd3d44", "7d073736-cee4-4177-8dd8-927ce4bd3d44", "7d073736-cee4-4177-8dd8-927ce4bd3d44", "7d073736-cee4-4177-8dd8-927ce4bd3d44", "7d073736-cee4-4177-8dd8-927ce4bd3d44", "7d073736-cee4-4177-8dd8-927ce4bd3d44", "7d073736-cee4-4177-8dd8-927ce4bd3d44", "7d073736-cee4-4177-8dd8-927ce4bd3d44", "7d073736-cee4-4177-8dd8-927ce4bd3d44", "7d073736-cee4-4177-8dd8-927ce4bd3d44"], "outputs": []}}}, "links": {"con_56": {"source": {"component": "9643dea7-bbc0-4ada-a3ef-f253d4d0b64b", "pin": "SurfaceArea", "index": 4}, "target": {"component": "de2eccac-2f48-4507-ac76-8800e48d93df", "pin": "country.SurfaceArea", "index": 0}}}, "in_diagram": {"9643dea7-bbc0-4ada-a3ef-f253d4d0b64b": {"top": 129, "left": 215}, "de2eccac-2f48-4507-ac76-8800e48d93df": {"top": 265, "left": 798}}}}', NULL, NULL, 2, NULL),
	(31, '1bc87b65-91ff-4e3d-b9a9-a9da71cf6ee6', '', NULL, '2022-03-14 08:01:39.266698', '2022-04-27 10:06:44.321051', '{"components": {"0": {"id": null, "uuid": "bea0f761-cfec-4197-89d0-acf51d262e43", "name": "d2f22360-7ac0-4cae-99d6-bccbd46302a2", "description": "", "title": "", "component_type": "GRAPH", "query": {"query_selection": "2", "query": "SELECT * FROM world.country WHERE SurfaceArea > 1000000", "query_selected_fields": [], "query_fields": []}, "visualization": {"visualization_type": "G1N", "visualization_tab": "data-visualization-graphs"}, "data_config": {"fields": ["Code", "SurfaceArea"]}, "options": null}, "1": {"id": null, "uuid": "4c0f23ac-b3a0-4692-8dca-db3b05a56be0", "name": "516ad775-62d0-44f8-9bb3-eb04dbb17428", "description": "", "title": "xxxx", "component_type": "INFO", "query": {"query_selection": "13", "query": "SELECT \\n\\tCOUNT(*) AS Count, (SELECT COUNT(*) FROM world.country) AS Total\\nFROM\\n\\tworld.country\\nWHERE \\n\\tcountry.SurfaceArea > 1000000", "query_selected_fields": ["Count"], "query_fields": ["Count"]}, "visualization": {"visualization_type": "ISL", "visualization_tab": "data-visualization-info"}, "data_config": {"value": "Count", "text_1": "Count", "text_2": "text#2", "icon": "icon ion-md-alert", "fields": []}, "options": {"icon": "ion ion-md-book", "icon-background-color": "#0000ff", "icon-color": "#ffff00", "icon-size": "92", "text-size": "24", "value-size": "32"}}}, "comms": {"io": {"uuid-global-calendar": {"inputs": [], "outputs": ["Data Inicio", "Ano Inicio", "M\\u00eas Inicio", "Dia Inicio", "Data Fim", "Ano Fim", "M\\u00eas Fim", "Dia Fim"], "name": "Calend\\u00e1rio Global", "indices": {"inputs": [], "outputs": []}}, "bea0f761-cfec-4197-89d0-acf51d262e43": {"inputs": ["SurfaceArea"], "outputs": [], "name": "d2f22360-7ac0-4cae-99d6-bccbd46302a2", "indices": {"inputs": [], "outputs": []}}, "4c0f23ac-b3a0-4692-8dca-db3b05a56be0": {"inputs": ["country.SurfaceArea"], "outputs": [], "name": "516ad775-62d0-44f8-9bb3-eb04dbb17428", "indices": {"inputs": [], "outputs": []}}}, "links": {}, "in_diagram": {}}}', NULL, NULL, 2, NULL),
	(35, 'apagar', '', NULL, '2022-04-14 10:39:09.215662', '2022-04-14 10:39:09.215662', '{"0": {"id": null, "uuid": "c07799fc-e6dd-442e-b42e-160f92fb9c93", "name": null, "description": null, "title": null, "component_type": null, "query": {"query_selection": null, "query": null, "query_selected_fields": null, "query_fields": null}, "visualization": {"visualization_type": null, "visualization_tab": null}, "data_config": {}}, "1": {"id": null, "uuid": "6559d82b-3e65-4d9b-98a1-e63c77b6709a", "name": null, "description": null, "title": null, "component_type": null, "query": {"query_selection": null, "query": null, "query_selected_fields": null, "query_fields": null}, "visualization": {"visualization_type": null, "visualization_tab": null}, "data_config": {}}}', NULL, NULL, 2, 'YYYY-MM-DD'),
	(37, 'bool', '', NULL, '2022-04-28 07:11:03.039142', '2022-04-28 07:11:03.039142', '{"components": {"0": {"id": null, "uuid": "709a37f7-831d-4464-beff-b9fb012abd96", "name": "54e5818d-450b-416e-ba87-9c78e1035dcb", "description": "", "title": "", "component_type": "CONTROL", "query": {"query_selection": "", "query": "", "query_selected_fields": [], "query_fields": []}, "visualization": {"visualization_type": "CB", "visualization_tab": "data-visualization-controls"}, "data_config": {"name": "a87c48f7-9ace-4c3e-8263-8b902fb67eb5", "default": "true", "true": "V", "false": "F", "type": "switch", "fields": []}, "options": null}, "1": {"id": null, "uuid": "fee88801-0bfe-457e-91b2-7fd2bcee7e5f", "name": null, "description": null, "title": null, "component_type": null, "query": {"query_selection": null, "query": null, "query_selected_fields": null, "query_fields": null}, "visualization": {"visualization_type": null, "visualization_tab": null}, "data_config": {}, "options": null}}, "comms": {"io": {"uuid-global-calendar": {"inputs": [], "outputs": ["Data Inicio", "Ano Inicio", "M\\u00eas Inicio", "Dia Inicio", "Data Fim", "Ano Fim", "M\\u00eas Fim", "Dia Fim"], "name": "Calend\\u00e1rio Global", "indices": {"inputs": [], "outputs": []}}, "709a37f7-831d-4464-beff-b9fb012abd96": {"inputs": [], "outputs": ["a87c48f7-9ace-4c3e-8263-8b902fb67eb5"], "name": "54e5818d-450b-416e-ba87-9c78e1035dcb", "indices": {"inputs": [], "outputs": []}}}, "links": {}, "in_diagram": {}}}', NULL, NULL, 2, 'YYYY-MM-DD'),
	(38, 'ers_1', '', NULL, '2022-05-22 12:01:21.854903', '2022-05-23 13:14:51.928405', '{"components": {"0": {"id": null, "uuid": "775aac72-13e2-446b-9b61-838e95c54f04", "name": "especialidades", "description": "", "title": "", "component_type": "INFO", "query": {"query_selection": "", "query": "select count(*) as \\"Numero de Especialidades\\" from ia_especialidade;", "query_selected_fields": ["Numero de Especialidades"], "query_fields": ["Numero de Especialidades"], "query_database": "ers"}, "visualization": {"visualization_type": "ISL", "visualization_tab": "data-visualization-info"}, "data_config": {"value": "Numero de Especialidades", "text_1": "N\\u00famero de Especialidades", "text_2": "", "fields": ["Numero de Especialidades"]}, "options": {"icon": "ion ion-md-pulse", "icon-background-color": "#ff0000", "icon-color": "#ffffff", "icon-size": 92, "text-size": 24, "value-size": 32, "card-back-color": "#ffffff", "text-color": "#000000", "value-color": "#000000"}}, "1": {"id": null, "uuid": "04d066d0-05a6-4909-a367-b581d084ed25", "name": "entidades", "description": "", "title": "", "component_type": "INFO", "query": {"query_selection": "", "query": "select count(*) as \\"Numero de Entidades\\" from ia_entidade;", "query_selected_fields": ["Numero de Entidades"], "query_fields": ["Numero de Entidades"], "query_database": "ers"}, "visualization": {"visualization_type": "ISL", "visualization_tab": "data-visualization-info"}, "data_config": {"value": "Numero de Entidades", "text_1": "Numero de Entidades", "text_2": "", "fields": ["Numero de Entidades"]}, "options": {"icon": "ion ion-md-business", "icon-background-color": "#ff0000", "icon-color": "#ffffff", "icon-size": 92, "text-size": 24, "value-size": 32, "card-back-color": "#ffffff", "text-color": "#000000", "value-color": "#000000"}}, "2": {"id": null, "uuid": "51e94973-f528-48cd-879a-e15511ed75c6", "name": "utentes", "description": "", "title": "", "component_type": "INFO", "query": {"query_selection": "", "query": "select count(*) as \\"Numero de Utentes\\" from ia_utente;", "query_selected_fields": ["Numero de Utentes"], "query_fields": ["Numero de Utentes"], "query_database": "ers"}, "visualization": {"visualization_type": "ISL", "visualization_tab": "data-visualization-info"}, "data_config": {"value": "Numero de Utentes", "text_1": "Numero de Utentes", "text_2": "", "fields": ["Numero de Utentes"]}, "options": {"icon": "ion ion-md-person", "icon-background-color": "#ff0000", "icon-color": "#ffffff", "icon-size": 92, "text-size": 24, "value-size": 32, "card-back-color": "#ffffff", "text-color": "#000000", "value-color": "#000000"}}, "3": {"id": null, "uuid": "96f7dc12-f610-4b2a-9982-6c3566c6b9dc", "name": "estab vs prestador", "description": "", "title": "Establecimento vs Prestador", "component_type": "GRAPH", "query": {"query_selection": "", "query": "select \\n\\titp.descricao , \\n\\tcount(*)  as Numero\\nfrom \\n\\tia_estabelecimento iae\\nLEFT JOIN\\n\\tia_tipo_prestador itp \\n ON \\n\\titp.tip_id = iae.tip_id\\ngroup by \\n\\titp.descricao ;", "query_selected_fields": ["descricao", "Numero"], "query_fields": ["descricao", "Numero"], "query_database": "ers"}, "visualization": {"visualization_type": "G1N", "visualization_tab": "data-visualization-graphs"}, "data_config": {"fields": ["descricao", "Numero"]}, "options": null}, "4": {"id": null, "uuid": "528ce261-4acf-40b2-a4ac-953c060fc8dc", "name": "Rec por ano", "description": "", "title": "Reclama\\u00e7\\u00f5es por ano", "component_type": "GRAPH", "query": {"query_selection": "", "query": "select ano, count(*) as Numero from ia_processo_rec where ano > 2015 group by ano;", "query_selected_fields": ["ano", "Numero"], "query_fields": ["ano", "Numero"], "query_database": "ers"}, "visualization": {"visualization_type": "G1N", "visualization_tab": "data-visualization-graphs"}, "data_config": {"fields": ["ano", "Numero"]}, "options": null}, "5": {"id": null, "uuid": "0ef3b3c7-6e21-48c9-a4db-7aa9c83f496e", "name": "prestador", "description": "", "title": "Prestadores", "component_type": "TABLE", "query": {"query_selection": "", "query": "select * from ia_tipo_prestador", "query_selected_fields": ["tip_id", "descricao", "valido", "tem_internamento"], "query_fields": ["tip_id", "descricao", "valido", "tem_internamento"], "query_database": "ers"}, "visualization": {"visualization_type": "TS", "visualization_tab": "data-visualization-tables"}, "data_config": {"fields": ["tip_id", "descricao", "valido", "tem_internamento"]}, "options": {"sizes-height-component": 300, "header-background-color": "rgba(0, 0, 0, 0)", "header-color": "rgb(33, 37, 41)", "header-alignment": "left", "header-vertical-alignment": "baseline", "rows-background-color": "rgba(0, 0, 0, 0)", "rows-color": "rgb(33, 37, 41)", "rows-alignment": "left", "rows-vertical-alignment": "baseline"}}, "6": {"id": null, "uuid": "ec8df0e6-ce5b-4683-b5fb-2ac1d3bee20f", "name": "estab vs prestador", "description": "", "title": "Establecimento vs Prestador", "component_type": "TABLE", "query": {"query_selection": "", "query": "select * from ia_estabelecimento where tip_id = 1;", "query_selected_fields": ["est_id", "ers_pkid", "ent_id", "tip_id", "nome", "morada", "porta", "andar", "cod_postal", "cod_postal_ext", "localidade", "latitude", "longitude", "telefone", "fax", "email", "activo", "num_registo", "data_registo", "ars_id"], "query_fields": ["est_id", "ers_pkid", "ent_id", "tip_id", "nome", "morada", "porta", "andar", "cod_postal", "cod_postal_ext", "localidade", "latitude", "longitude", "telefone", "fax", "email", "activo", "num_registo", "data_registo", "ars_id"], "query_database": "ers"}, "visualization": {"visualization_type": "TS", "visualization_tab": "data-visualization-tables"}, "data_config": {"fields": ["est_id", "ers_pkid", "ent_id", "tip_id", "nome", "morada", "porta", "andar", "cod_postal", "cod_postal_ext", "localidade", "latitude", "longitude", "telefone", "fax", "email", "activo", "num_registo", "data_registo", "ars_id"]}, "options": {"sizes-height-component": 300, "header-background-color": "rgba(0, 0, 0, 0)", "header-color": "rgb(33, 37, 41)", "header-alignment": "left", "header-vertical-alignment": "baseline", "rows-background-color": "rgba(0, 0, 0, 0)", "rows-color": "rgb(33, 37, 41)", "rows-alignment": "left", "rows-vertical-alignment": "baseline"}}}, "comms": {"io": {"uuid-global-calendar": {"inputs": [], "outputs": ["Data Inicio", "Ano Inicio", "M\\u00eas Inicio", "Dia Inicio", "Data Fim", "Ano Fim", "M\\u00eas Fim", "Dia Fim"], "name": "Calend\\u00e1rio Global", "indices": {"inputs": [], "outputs": []}}, "04d066d0-05a6-4909-a367-b581d084ed25": {"inputs": [], "outputs": [], "name": "entidades", "indices": {"inputs": [], "outputs": []}}, "775aac72-13e2-446b-9b61-838e95c54f04": {"inputs": [], "outputs": [], "name": "especialidades", "indices": {"inputs": [], "outputs": []}}, "0ef3b3c7-6e21-48c9-a4db-7aa9c83f496e": {"inputs": [], "outputs": ["tip_id", "descricao", "valido", "tem_internamento"], "name": "prestador", "indices": {"inputs": [], "outputs": []}}, "96f7dc12-f610-4b2a-9982-6c3566c6b9dc": {"inputs": [], "outputs": [], "name": "estab vs prestador", "indices": {"inputs": [], "outputs": []}}, "51e94973-f528-48cd-879a-e15511ed75c6": {"inputs": [], "outputs": [], "name": "utentes", "indices": {"inputs": [], "outputs": []}}, "528ce261-4acf-40b2-a4ac-953c060fc8dc": {"inputs": ["ano"], "outputs": [], "name": "Rec por ano", "indices": {"inputs": [], "outputs": []}}, "ec8df0e6-ce5b-4683-b5fb-2ac1d3bee20f": {"inputs": ["tip_id"], "outputs": ["est_id", "ers_pkid", "ent_id", "tip_id", "nome", "morada", "porta", "andar", "cod_postal", "cod_postal_ext", "localidade", "latitude", "longitude", "telefone", "fax", "email", "activo", "num_registo", "data_registo", "ars_id"], "name": "estab vs prestador", "indices": {"inputs": [], "outputs": []}}}, "links": {}, "in_diagram": {}}}', NULL, 1, 21, 'YYYY-MM-DD'),
	(39, 'ers_delete', '', NULL, '2022-05-22 18:29:09.245244', '2022-05-22 18:33:06.384591', '{"components": {"0": {"id": null, "uuid": "00786bc2-3038-4de0-bb67-f766b973014a", "name": "13b5a73a-0b92-4bca-97a2-da13acb929b0", "description": "", "title": "", "component_type": "TABLE", "query": {"query_selection": "", "query": "SELECT * FROM world.country WHERE country.SurfaceArea > 5000000", "query_selected_fields": ["Code", "Name", "Continent", "Region", "SurfaceArea", "IndepYear", "Population", "LifeExpectancy", "GNP", "GNPOld", "LocalName", "GovernmentForm", "HeadOfState", "Capital", "Code2"], "query_fields": ["Code", "Name", "Continent", "Region", "SurfaceArea", "IndepYear", "Population", "LifeExpectancy", "GNP", "GNPOld", "LocalName", "GovernmentForm", "HeadOfState", "Capital", "Code2"], "query_database": "default"}, "visualization": {"visualization_type": "TS", "visualization_tab": "data-visualization-tables"}, "data_config": {"fields": ["Code", "Name", "Continent", "Region", "SurfaceArea", "IndepYear", "Population", "LifeExpectancy", "GNP", "GNPOld", "LocalName", "GovernmentForm", "HeadOfState", "Capital", "Code2"]}, "options": {"sizes-height-component": 300, "header-background-color": "rgba(0, 0, 0, 0)", "header-color": "rgb(33, 37, 41)", "header-alignment": "left", "header-vertical-alignment": "baseline", "rows-background-color": "rgba(0, 0, 0, 0)", "rows-color": "rgb(33, 37, 41)", "rows-alignment": "left", "rows-vertical-alignment": "baseline"}}, "1": {"id": null, "uuid": "108d7b5d-0597-46b4-8097-d7c7040fc903", "name": "a2531fc5-604e-445c-8d66-adde64be8c21", "description": "", "title": "", "component_type": "TABLE", "query": {"query_selection": "", "query": "select ano, count(*) as Numero from ia_processo_rec where ano > 2015 group by ano;", "query_selected_fields": ["ano", "Numero"], "query_fields": ["ano", "Numero"], "query_database": "ers"}, "visualization": {"visualization_type": "TS", "visualization_tab": "data-visualization-tables"}, "data_config": {"fields": ["ano", "Numero"]}, "options": {"sizes-height-component": 300, "header-background-color": "rgba(0, 0, 0, 0)", "header-color": "rgb(33, 37, 41)", "header-alignment": "left", "header-vertical-alignment": "baseline", "rows-background-color": "rgba(0, 0, 0, 0)", "rows-color": "rgb(33, 37, 41)", "rows-alignment": "left", "rows-vertical-alignment": "baseline"}}}, "comms": {"io": {"uuid-global-calendar": {"inputs": [], "outputs": ["Data Inicio", "Ano Inicio", "M\\u00eas Inicio", "Dia Inicio", "Data Fim", "Ano Fim", "M\\u00eas Fim", "Dia Fim"], "name": "Calend\\u00e1rio Global", "indices": {"inputs": [], "outputs": []}}, "00786bc2-3038-4de0-bb67-f766b973014a": {"inputs": ["country.SurfaceArea"], "outputs": ["Code", "Name", "Continent", "Region", "SurfaceArea", "IndepYear", "Population", "LifeExpectancy", "GNP", "GNPOld", "LocalName", "GovernmentForm", "HeadOfState", "Capital", "Code2"], "name": "13b5a73a-0b92-4bca-97a2-da13acb929b0", "indices": {"inputs": ["03920ab2-9674-4bd5-8b45-e763612ff4cd"], "outputs": ["0bf36ffa-bb39-4cda-9971-4692e1445031", "ec4b06ae-eda7-43b9-911b-86ec56c35dcf", "05ca64f2-d7ea-4155-86b8-657651567a71", "1106f233-f883-449c-8cf2-588ad744c8eb", "453a177d-90b2-4af9-87c6-d9ef6082d7d6", "7864c5b9-bbda-4f4b-b17e-8e4f1698701e", "91d69d28-4ed8-4dc5-a9dd-042508a7df8f", "bdd3932e-1f98-474f-8e4b-f7a90801494c", "0b334387-25b4-40e0-a8c7-9280446393ec", "bcb6c11c-c451-42e0-924d-1286b7997c74", "aecb25a1-d661-40c9-af3e-596c2e68559c", "ce07bc54-d462-4f2b-9731-10c38c91825b", "cf0c65f9-2818-4bfe-a8f8-0e469c19891c", "8d8ccca8-2906-425c-8e4f-35138043a18e", "d86e8363-7f57-4d15-810e-909700564d1f"]}}, "108d7b5d-0597-46b4-8097-d7c7040fc903": {"inputs": [], "outputs": ["ano", "Numero"], "name": "a2531fc5-604e-445c-8d66-adde64be8c21", "indices": {"inputs": [], "outputs": ["255d46e6-ef40-4c89-b361-ccff7a3171e1", "8632a26c-0494-41a8-a2ca-d89df3db4f69"]}}}, "links": {}, "in_diagram": {"108d7b5d-0597-46b4-8097-d7c7040fc903": {"top": 90, "left": 189.417}, "00786bc2-3038-4de0-bb67-f766b973014a": {"top": 20, "left": 761}}}}', NULL, NULL, 2, 'YYYY-MM-DD');
/*!40000 ALTER TABLE `dash_dashboard` ENABLE KEYS */;

-- Dumping structure for table flexdash.dash_layout
CREATE TABLE IF NOT EXISTS `dash_layout` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(80) NOT NULL,
  `description` varchar(128) DEFAULT NULL,
  `date` datetime(6) NOT NULL,
  `author` int(11) DEFAULT NULL,
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `layout_name` (`name`),
  KEY `layout_author_b466a2db_fk_user_id` (`author`),
  CONSTRAINT `layout_author_b466a2db_fk_user_id` FOREIGN KEY (`author`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=latin1;

-- Dumping data for table flexdash.dash_layout: ~26 rows (approximately)
/*!40000 ALTER TABLE `dash_layout` DISABLE KEYS */;
INSERT INTO `dash_layout` (`id`, `name`, `description`, `date`, `author`, `data`) VALUES
	(1, 'L1', NULL, '2022-01-25 20:49:30.954973', NULL, '[[12, 1]]'),
	(2, 'L2', NULL, '2022-01-25 20:49:50.062396', NULL, '[[6, 1], [6, 1]]'),
	(3, 'L3', NULL, '2022-01-25 20:50:00.171559', NULL, '[[4, 1], [4, 1], [4, 1]]'),
	(4, 'L4', NULL, '2022-01-25 20:50:11.215543', NULL, '[[3, 1], [3, 1], [3, 1], [3, 1]]'),
	(5, 'L5', NULL, '2022-01-25 20:50:26.780900', NULL, '[[12, 1], [12, 1]]'),
	(6, 'L6', NULL, '2022-01-25 20:50:46.962823', NULL, '[[6, 1], [6, 1], [6, 1], [6, 1]]'),
	(7, 'L7', NULL, '2022-01-25 20:51:07.965077', NULL, '[[4, 1], [4, 1], [4, 1], [4, 1], [4, 1], [4, 1]]'),
	(8, 'L8', NULL, '2022-01-25 20:52:04.429029', NULL, '[[3, 1], [3, 1], [3, 1], [3, 1], [3, 1], [3, 1], [3, 1], [3, 1]]'),
	(9, 'L9', NULL, '2022-01-25 20:52:25.834887', NULL, '[[12, 1], [6, 1], [6, 1]]'),
	(10, 'L10', NULL, '2022-01-25 20:52:49.417081', NULL, '[[6, 1], [6, 1], [12, 1]]'),
	(11, 'L11', NULL, '2022-01-25 20:53:12.935108', NULL, '[[4, 1], [4, 1], [4, 1], [12, 1]]'),
	(12, 'L12', NULL, '2022-01-25 20:53:28.585124', NULL, '[[4, 1], [4, 1], [4, 1], [6, 1], [6, 1]]'),
	(13, 'L13', NULL, '2022-01-25 20:53:46.899496', NULL, '[[12, 1], [12, 1], [12, 1]]'),
	(14, 'L14', NULL, '2022-01-25 20:54:04.858227', NULL, '[[6, 1], [6, 1], [6, 1], [6, 1], [6, 1], [6, 1]]'),
	(15, 'L15', NULL, '2022-01-25 20:54:21.781655', NULL, '[[4, 1], [4, 1], [4, 1], [4, 1], [4, 1], [4, 1], [4, 1], [4, 1], [4, 1]]'),
	(16, 'L16', NULL, '2022-01-25 20:54:38.920623', NULL, '[[3, 1], [3, 1], [3, 1], [3, 1], [3, 1], [3, 1], [3, 1], [3, 1], [3, 1], [3, 1], [3, 1], [3, 1]]'),
	(17, 'L17', NULL, '2022-01-25 20:54:54.297992', NULL, '[[12, 1], [6, 1], [6, 1], [6, 1], [6, 1]]'),
	(18, 'L18', NULL, '2022-01-25 20:55:07.561416', NULL, '[[6, 1], [6, 1], [6, 1], [6, 1], [12, 1]]'),
	(19, 'L19', NULL, '2022-01-25 20:55:20.787483', NULL, '[[6, 1], [6, 1], [12, 1], [12, 1]]'),
	(20, 'L20', NULL, '2022-01-25 20:55:36.176156', NULL, '[[4, 1], [4, 1], [4, 1], [12, 1], [12, 1]]'),
	(21, 'L21', NULL, '2022-01-25 20:55:50.535485', NULL, '[[4, 1], [4, 1], [4, 1], [6, 1], [6, 1], [6, 1], [6, 1]]'),
	(22, 'L22', NULL, '2022-01-25 20:56:05.058632', NULL, '[[4, 1], [4, 1], [4, 1], [6, 1], [6, 1], [12, 1]]'),
	(23, 'L23', NULL, '2022-01-25 20:56:44.661720', NULL, '[[4, 1], [4, 1], [4, 1], [6, 1], [6, 2], [6, 1]]'),
	(24, 'L24', NULL, '2022-01-25 20:57:09.181208', NULL, '[[4, 1], [4, 1], [4, 1], [4, 1], [8, 2], [4, 1]]'),
	(42, '710f1ba8-4ad9-4007-bcba-a4bbfaee9091', '', '2022-02-03 13:45:37.140145', NULL, '[[1, 1], [1, 1], [1, 1], [1, 1], [8, 1]]'),
	(44, 'fce0f09a-bb6a-4e44-8432-dbd6fa931e29', '', '2022-02-03 14:08:27.633164', NULL, '[[1, 1], [1, 1], [1, 1], [3, 1], [3, 1], [3, 1]]'),
	(45, 'c80e0013-aa9f-41ed-9b08-239c1b96be91', '', '2022-02-03 14:12:21.682229', NULL, '[[1, 1], [1, 1], [1, 1]]'),
	(48, '5ba942a5-1ea0-45b7-96d9-2f26dd99087b', '', '2022-03-03 12:33:17.189691', NULL, '[[1, 1], [1, 1], [1, 1], [5, 3], [4, 3], [1, 1], [1, 1], [1, 1], [1, 1], [1, 1], [1, 1]]'),
	(50, 'abc721b0-6be3-4f7c-a803-158cb79e71cf', '', '2022-03-23 11:32:57.545981', NULL, '[[1, 1], [1, 1], [4, 3], [4, 7]]');
/*!40000 ALTER TABLE `dash_layout` ENABLE KEYS */;

-- Dumping structure for table flexdash.dash_query
CREATE TABLE IF NOT EXISTS `dash_query` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(80) NOT NULL,
  `description` varchar(128) DEFAULT NULL,
  `date` datetime(6) NOT NULL,
  `query` varchar(1024) NOT NULL,
  `author` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `query_name` (`name`),
  KEY `query_author_22678fe3_fk_user_id` (`author`),
  CONSTRAINT `query_author_22678fe3_fk_user_id` FOREIGN KEY (`author`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=latin1;

-- Dumping data for table flexdash.dash_query: ~4 rows (approximately)
/*!40000 ALTER TABLE `dash_query` DISABLE KEYS */;
INSERT INTO `dash_query` (`id`, `name`, `description`, `date`, `query`, `author`) VALUES
	(1, 'continents', 'list all continents', '2021-10-18 05:09:20.373951', 'SELECT DISTINCT (continent) FROM world.country;', 1),
	(2, 'big area countries', '', '2021-10-18 05:56:40.408013', 'SELECT * FROM world.country WHERE SurfaceArea > 1000000', 1),
	(12, 'graph 1 num', '', '2021-12-31 06:17:32.643507', 'SELECT continent,	COUNT(*) as total FROM world.country GROUP BY continent;', NULL),
	(13, 'info simple', '', '2021-12-30 14:38:39.646270', 'SELECT \r\n	COUNT(*) AS Count, (SELECT COUNT(*) FROM world.country) AS Total\r\nFROM\r\n	world.country\r\nWHERE \r\n	country.SurfaceArea > 1000000', NULL);
/*!40000 ALTER TABLE `dash_query` ENABLE KEYS */;

-- Dumping structure for table flexdash.django_admin_log
CREATE TABLE IF NOT EXISTS `django_admin_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext DEFAULT NULL,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint(5) unsigned NOT NULL CHECK (`action_flag` >= 0),
  `change_message` longtext NOT NULL,
  `content_type_id` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_user_id` (`user_id`),
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=124 DEFAULT CHARSET=latin1;

-- Dumping data for table flexdash.django_admin_log: ~122 rows (approximately)
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
INSERT INTO `django_admin_log` (`id`, `action_time`, `object_id`, `object_repr`, `action_flag`, `change_message`, `content_type_id`, `user_id`) VALUES
	(1, '2021-10-18 05:00:59.981942', '1', 'admin', 2, '[{"changed": {"fields": ["password"]}}]', 6, 1),
	(2, '2021-10-18 05:09:20.373951', '1', 'continents', 1, '[{"added": {}}]', 7, 1),
	(3, '2021-10-18 05:12:06.032947', '2', 'big area countries', 1, '[{"added": {}}]', 7, 1),
	(4, '2021-10-18 05:56:40.408013', '2', 'big area countries', 2, '[{"changed": {"fields": ["Query"]}}]', 7, 1),
	(5, '2022-01-24 13:57:57.275653', '1', 'L1', 1, '[{"added": {}}]', 9, 1),
	(6, '2022-01-24 13:58:01.470305', '2', 'L2', 1, '[{"added": {}}]', 9, 1),
	(7, '2022-01-24 13:58:04.445942', '3', 'L3', 1, '[{"added": {}}]', 9, 1),
	(8, '2022-01-24 13:58:07.426252', '4', 'L4', 1, '[{"added": {}}]', 9, 1),
	(9, '2022-01-24 13:58:10.490391', '5', 'L5', 1, '[{"added": {}}]', 9, 1),
	(10, '2022-01-24 13:58:13.664857', '6', 'L6', 1, '[{"added": {}}]', 9, 1),
	(11, '2022-01-24 13:58:17.076189', '7', 'L7', 1, '[{"added": {}}]', 9, 1),
	(12, '2022-01-24 13:58:19.959166', '8', 'L8', 1, '[{"added": {}}]', 9, 1),
	(13, '2022-01-24 13:58:23.490069', '9', 'L9', 1, '[{"added": {}}]', 9, 1),
	(14, '2022-01-24 13:58:27.442115', '10', 'L10', 1, '[{"added": {}}]', 9, 1),
	(15, '2022-01-24 13:58:30.062017', '11', 'L11', 1, '[{"added": {}}]', 9, 1),
	(16, '2022-01-24 13:58:32.645953', '12', 'L12', 1, '[{"added": {}}]', 9, 1),
	(17, '2022-01-24 13:58:35.432363', '13', 'L13', 1, '[{"added": {}}]', 9, 1),
	(18, '2022-01-24 13:58:38.417041', '14', 'L14', 1, '[{"added": {}}]', 9, 1),
	(19, '2022-01-24 13:58:41.165034', '15', 'L15', 1, '[{"added": {}}]', 9, 1),
	(20, '2022-01-24 13:58:45.300680', '16', 'L16', 1, '[{"added": {}}]', 9, 1),
	(21, '2022-01-24 13:58:48.250946', '17', 'L17', 1, '[{"added": {}}]', 9, 1),
	(22, '2022-01-24 13:58:52.200931', '18', 'L18', 1, '[{"added": {}}]', 9, 1),
	(23, '2022-01-24 13:58:54.326731', '19', 'L19', 1, '[{"added": {}}]', 9, 1),
	(24, '2022-01-24 13:58:56.995820', '20', 'L20', 1, '[{"added": {}}]', 9, 1),
	(25, '2022-01-24 13:58:58.930357', '21', 'L21', 1, '[{"added": {}}]', 9, 1),
	(26, '2022-01-24 13:59:00.995882', '22', 'L22', 1, '[{"added": {}}]', 9, 1),
	(27, '2022-01-24 13:59:03.280484', '23', 'L23', 1, '[{"added": {}}]', 9, 1),
	(28, '2022-01-24 13:59:05.642844', '24', 'L24', 1, '[{"added": {}}]', 9, 1),
	(29, '2022-01-25 07:22:08.194859', '24', 'L24', 2, '[{"changed": {"fields": ["Data"]}}]', 9, 1),
	(30, '2022-01-25 07:22:17.037285', '23', 'L23', 2, '[{"changed": {"fields": ["Data"]}}]', 9, 1),
	(31, '2022-01-25 07:22:25.538456', '22', 'L22', 2, '[{"changed": {"fields": ["Data"]}}]', 9, 1),
	(32, '2022-01-25 07:22:35.174666', '21', 'L21', 2, '[{"changed": {"fields": ["Data"]}}]', 9, 1),
	(33, '2022-01-25 07:22:43.702928', '20', 'L20', 2, '[{"changed": {"fields": ["Data"]}}]', 9, 1),
	(34, '2022-01-25 07:22:51.282895', '19', 'L19', 2, '[{"changed": {"fields": ["Data"]}}]', 9, 1),
	(35, '2022-01-25 07:23:01.282672', '18', 'L18', 2, '[{"changed": {"fields": ["Data"]}}]', 9, 1),
	(36, '2022-01-25 07:23:11.552397', '17', 'L17', 2, '[{"changed": {"fields": ["Data"]}}]', 9, 1),
	(37, '2022-01-25 07:23:20.309352', '16', 'L16', 2, '[{"changed": {"fields": ["Data"]}}]', 9, 1),
	(38, '2022-01-25 07:23:29.128212', '15', 'L15', 2, '[{"changed": {"fields": ["Data"]}}]', 9, 1),
	(39, '2022-01-25 07:23:37.908752', '14', 'L14', 2, '[{"changed": {"fields": ["Data"]}}]', 9, 1),
	(40, '2022-01-25 07:23:47.485334', '13', 'L13', 2, '[{"changed": {"fields": ["Data"]}}]', 9, 1),
	(41, '2022-01-25 07:23:55.771104', '12', 'L12', 2, '[{"changed": {"fields": ["Data"]}}]', 9, 1),
	(42, '2022-01-25 07:24:04.852144', '11', 'L11', 2, '[{"changed": {"fields": ["Data"]}}]', 9, 1),
	(43, '2022-01-25 07:24:13.201982', '10', 'L10', 2, '[{"changed": {"fields": ["Data"]}}]', 9, 1),
	(44, '2022-01-25 07:24:23.348915', '9', 'L9', 2, '[{"changed": {"fields": ["Data"]}}]', 9, 1),
	(45, '2022-01-25 07:24:32.805848', '8', 'L8', 2, '[{"changed": {"fields": ["Data"]}}]', 9, 1),
	(46, '2022-01-25 07:24:41.522200', '7', 'L7', 2, '[{"changed": {"fields": ["Data"]}}]', 9, 1),
	(47, '2022-01-25 07:24:49.806986', '6', 'L6', 2, '[{"changed": {"fields": ["Data"]}}]', 9, 1),
	(48, '2022-01-25 07:24:58.903012', '5', 'L5', 2, '[{"changed": {"fields": ["Data"]}}]', 9, 1),
	(49, '2022-01-25 07:25:08.417865', '4', 'L4', 2, '[{"changed": {"fields": ["Data"]}}]', 9, 1),
	(50, '2022-01-25 07:25:18.166199', '3', 'L3', 2, '[{"changed": {"fields": ["Data"]}}]', 9, 1),
	(51, '2022-01-25 07:25:27.463569', '2', 'L2', 2, '[{"changed": {"fields": ["Data"]}}]', 9, 1),
	(52, '2022-01-25 07:25:35.283342', '1', 'L1', 2, '[{"changed": {"fields": ["Data"]}}]', 9, 1),
	(53, '2022-01-25 20:49:30.954973', '1', 'L1', 2, '[{"changed": {"fields": ["Temp"]}}]', 9, 1),
	(54, '2022-01-25 20:49:50.062396', '2', 'L2', 2, '[{"changed": {"fields": ["Temp"]}}]', 9, 1),
	(55, '2022-01-25 20:50:00.171559', '3', 'L3', 2, '[{"changed": {"fields": ["Temp"]}}]', 9, 1),
	(56, '2022-01-25 20:50:11.215543', '4', 'L4', 2, '[{"changed": {"fields": ["Temp"]}}]', 9, 1),
	(57, '2022-01-25 20:50:26.784907', '5', 'L5', 2, '[{"changed": {"fields": ["Temp"]}}]', 9, 1),
	(58, '2022-01-25 20:50:46.967602', '6', 'L6', 2, '[{"changed": {"fields": ["Temp"]}}]', 9, 1),
	(59, '2022-01-25 20:51:07.965077', '7', 'L7', 2, '[{"changed": {"fields": ["Temp"]}}]', 9, 1),
	(60, '2022-01-25 20:52:04.429029', '8', 'L8', 2, '[{"changed": {"fields": ["Temp"]}}]', 9, 1),
	(61, '2022-01-25 20:52:25.834887', '9', 'L9', 2, '[{"changed": {"fields": ["Temp"]}}]', 9, 1),
	(62, '2022-01-25 20:52:49.421077', '10', 'L10', 2, '[{"changed": {"fields": ["Temp"]}}]', 9, 1),
	(63, '2022-01-25 20:53:12.935108', '11', 'L11', 2, '[{"changed": {"fields": ["Temp"]}}]', 9, 1),
	(64, '2022-01-25 20:53:28.586124', '12', 'L12', 2, '[{"changed": {"fields": ["Temp"]}}]', 9, 1),
	(65, '2022-01-25 20:53:46.900497', '13', 'L13', 2, '[{"changed": {"fields": ["Temp"]}}]', 9, 1),
	(66, '2022-01-25 20:54:04.858227', '14', 'L14', 2, '[{"changed": {"fields": ["Temp"]}}]', 9, 1),
	(67, '2022-01-25 20:54:21.781655', '15', 'L15', 2, '[{"changed": {"fields": ["Temp"]}}]', 9, 1),
	(68, '2022-01-25 20:54:38.920623', '16', 'L16', 2, '[{"changed": {"fields": ["Temp"]}}]', 9, 1),
	(69, '2022-01-25 20:54:54.297992', '17', 'L17', 2, '[{"changed": {"fields": ["Temp"]}}]', 9, 1),
	(70, '2022-01-25 20:55:07.561416', '18', 'L18', 2, '[{"changed": {"fields": ["Temp"]}}]', 9, 1),
	(71, '2022-01-25 20:55:20.791488', '19', 'L19', 2, '[{"changed": {"fields": ["Temp"]}}]', 9, 1),
	(72, '2022-01-25 20:55:36.180160', '20', 'L20', 2, '[{"changed": {"fields": ["Temp"]}}]', 9, 1),
	(73, '2022-01-25 20:55:50.535485', '21', 'L21', 2, '[{"changed": {"fields": ["Temp"]}}]', 9, 1),
	(74, '2022-01-25 20:56:05.062634', '22', 'L22', 2, '[{"changed": {"fields": ["Temp"]}}]', 9, 1),
	(75, '2022-01-25 20:56:44.661720', '23', 'L23', 2, '[{"changed": {"fields": ["Temp"]}}]', 9, 1),
	(76, '2022-01-25 20:57:09.181208', '24', 'L24', 2, '[{"changed": {"fields": ["Temp"]}}]', 9, 1),
	(77, '2022-01-27 15:27:17.642683', '40', '2a1fd3df-c992-4191-b27a-7d3002c475c2', 3, '', 9, 1),
	(78, '2022-01-27 15:27:17.644539', '39', '6697de21-a115-4cdd-a87e-66cd31e67c30', 3, '', 9, 1),
	(79, '2022-01-27 15:27:17.645553', '38', '4564ad7e-5831-479f-a793-7d98fea97e96', 3, '', 9, 1),
	(80, '2022-01-27 15:27:17.646555', '37', '14ef18c3-7da5-492f-8110-25077caf6f00', 3, '', 9, 1),
	(81, '2022-01-27 15:27:17.647552', '35', 'f47bae90-50a1-43a0-8218-94513c754db5', 3, '', 9, 1),
	(82, '2022-01-27 15:27:17.648551', '34', '0e3641a1-dfa1-4387-a379-eada74b91b22', 3, '', 9, 1),
	(83, '2022-01-27 15:27:17.649551', '33', 'fb869575-cae0-45b1-a928-df261a21601e', 3, '', 9, 1),
	(84, '2022-01-27 15:27:17.649551', '32', 'b8e18301-612a-4877-a682-708cf89c9d37', 3, '', 9, 1),
	(85, '2022-01-27 15:27:17.650554', '31', 'f6ddacf9-deb2-4454-b1c3-92407b5e9d63', 3, '', 9, 1),
	(86, '2022-01-27 15:27:17.651553', '30', 'fc8dab95-4ba9-49de-9ed6-3cfb81861745', 3, '', 9, 1),
	(87, '2022-01-27 15:27:17.652550', '29', 'bbfabea9-5c98-4f7c-a9d3-2f48d580b6a5', 3, '', 9, 1),
	(88, '2022-01-27 15:27:17.653551', '28', 'eba4edf1-147a-4b68-9eba-6dd87f304a2a', 3, '', 9, 1),
	(89, '2022-01-27 15:47:55.332275', '20', 'f6d6a93a-ff76-40b6-928c-c02c1f443358', 3, '', 10, 1),
	(90, '2022-01-27 15:47:55.336890', '19', '97c90749-6cbe-44ad-813f-7d95d978f999', 3, '', 10, 1),
	(91, '2022-01-27 15:47:55.336890', '18', 'e9206a8f-1c53-4b1c-afa1-1dbb250ba9b0', 3, '', 10, 1),
	(92, '2022-01-27 15:47:55.336890', '17', '796c9e8a-b70b-4ebb-b3a9-597bca649b4e', 3, '', 10, 1),
	(93, '2022-01-27 15:47:55.336890', '16', 'e45ddd8a-4585-45f3-9a80-75deccfd2da3', 3, '', 10, 1),
	(94, '2022-01-27 15:47:55.340907', '15', 'f032f36d-9f04-4839-ade1-e128408653ce', 3, '', 10, 1),
	(95, '2022-01-27 15:47:55.341605', '14', 'a62c4fa9-c290-40cd-9897-3f01028e9701', 3, '', 10, 1),
	(96, '2022-01-27 15:47:55.341605', '13', '1a84c0b1-db9d-46cb-8dd4-b2e770209cf6', 3, '', 10, 1),
	(97, '2022-01-27 15:47:55.341605', '12', '0b002af1-2e51-4b97-9201-27511db572c6', 3, '', 10, 1),
	(98, '2022-01-27 15:47:55.341605', '11', '345e7cea-ee85-4635-a004-4131c3bd853f', 3, '', 10, 1),
	(99, '2022-01-27 15:47:55.341605', '10', '34656546hfghfg', 3, '', 10, 1),
	(100, '2022-01-27 15:47:55.345618', '9', '34656546', 3, '', 10, 1),
	(101, '2022-01-27 15:47:55.345618', '8', '34', 3, '', 10, 1),
	(102, '2022-01-27 15:47:55.345618', '7', '222222222', 3, '', 10, 1),
	(103, '2022-01-27 15:47:55.345618', '5', 'a7b60143-2f5d-4372-84f3-522844f1b99c', 3, '', 10, 1),
	(104, '2022-01-27 15:47:55.345618', '4', 'l1', 3, '', 10, 1),
	(105, '2022-01-27 15:47:55.345618', '3', 'd2a3c523-4c08-4f34-856b-7024ac4f0844', 3, '', 10, 1),
	(106, '2022-01-27 15:48:13.990345', '19', '3d8f074e-71aa-4b78-a20d-e13f1109a27f', 3, '', 8, 1),
	(107, '2022-01-27 15:48:14.005974', '18', 'ebb6f761-8418-4114-a5be-b4f5ff6fad42', 3, '', 8, 1),
	(108, '2022-01-27 15:48:14.005974', '17', 'f9f639a2-f963-40f5-b62f-0f206d9505dc', 3, '', 8, 1),
	(109, '2022-01-27 15:48:14.005974', '16', '4690bf65-6d81-43e9-8aa0-8a66ec12d486', 3, '', 8, 1),
	(110, '2022-01-27 15:48:14.005974', '15', 'e4d18e4e-f140-409e-94c7-6f9e09cd486a', 3, '', 8, 1),
	(111, '2022-01-27 15:48:14.005974', '14', 'info', 3, '', 8, 1),
	(112, '2022-01-27 15:48:14.005974', '13', 'cc7c8754-8e96-4bba-9bf0-7e42e9486de7', 3, '', 8, 1),
	(113, '2022-01-27 15:48:14.005974', '11', 'b93e6959-c6b6-4e56-a84f-3dfedfb4f82c', 3, '', 8, 1),
	(114, '2022-01-27 15:48:14.005974', '10', 'd2824b40-14d3-4875-a53a-c5f07961189f', 3, '', 8, 1),
	(115, '2022-01-27 15:48:14.005974', '9', '6631f0c7-a4e8-4b6e-8a4c-cdbde54d69bb', 3, '', 8, 1),
	(116, '2022-01-27 15:48:26.475509', '21', 'cccccccccccc', 3, '', 7, 1),
	(117, '2022-01-27 15:48:26.475509', '20', 'aaaaaaaaaaaa', 3, '', 7, 1),
	(118, '2022-01-27 15:48:26.475509', '19', '6666666666', 3, '', 7, 1),
	(119, '2022-01-27 15:48:26.475509', '18', '5555555555', 3, '', 7, 1),
	(120, '2022-01-27 15:48:26.475509', '17', '4444444', 3, '', 7, 1),
	(121, '2022-01-27 15:48:26.475509', '16', 'ccc', 3, '', 7, 1),
	(122, '2022-01-27 15:48:26.475509', '14', '222222', 3, '', 7, 1),
	(123, '2022-05-22 21:12:13.375885', '38', 'ers_1', 2, '[{"changed": {"fields": ["Data"]}}]', 10, 1);
/*!40000 ALTER TABLE `django_admin_log` ENABLE KEYS */;

-- Dumping structure for table flexdash.django_content_type
CREATE TABLE IF NOT EXISTS `django_content_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;

-- Dumping data for table flexdash.django_content_type: ~6 rows (approximately)
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES
	(6, 'accounts', 'user'),
	(1, 'admin', 'logentry'),
	(3, 'auth', 'group'),
	(2, 'auth', 'permission'),
	(4, 'contenttypes', 'contenttype'),
	(8, 'dashboards', 'component'),
	(11, 'dashboards', 'config'),
	(10, 'dashboards', 'dashboard'),
	(9, 'dashboards', 'layout'),
	(7, 'dashboards', 'query'),
	(5, 'sessions', 'session');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;

-- Dumping structure for table flexdash.django_migrations
CREATE TABLE IF NOT EXISTS `django_migrations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=latin1;

-- Dumping data for table flexdash.django_migrations: ~19 rows (approximately)
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES
	(1, 'contenttypes', '0001_initial', '2021-10-14 16:22:04.033097'),
	(2, 'contenttypes', '0002_remove_content_type_name', '2021-10-14 16:22:04.091096'),
	(3, 'auth', '0001_initial', '2021-10-14 16:22:04.153096'),
	(4, 'auth', '0002_alter_permission_name_max_length', '2021-10-14 16:22:04.234099'),
	(5, 'auth', '0003_alter_user_email_max_length', '2021-10-14 16:22:04.242094'),
	(6, 'auth', '0004_alter_user_username_opts', '2021-10-14 16:22:04.249095'),
	(7, 'auth', '0005_alter_user_last_login_null', '2021-10-14 16:22:04.257095'),
	(8, 'auth', '0006_require_contenttypes_0002', '2021-10-14 16:22:04.260096'),
	(9, 'auth', '0007_alter_validators_add_error_messages', '2021-10-14 16:22:04.267093'),
	(10, 'auth', '0008_alter_user_username_max_length', '2021-10-14 16:22:04.274096'),
	(11, 'auth', '0009_alter_user_last_name_max_length', '2021-10-14 16:22:04.282096'),
	(12, 'auth', '0010_alter_group_name_max_length', '2021-10-14 16:22:04.294095'),
	(13, 'auth', '0011_update_proxy_permissions', '2021-10-14 16:22:04.304094'),
	(14, 'auth', '0012_alter_user_first_name_max_length', '2021-10-14 16:22:04.311095'),
	(15, 'accounts', '0001_initial', '2021-10-14 16:22:04.364093'),
	(16, 'admin', '0001_initial', '2021-10-14 16:22:04.482095'),
	(17, 'admin', '0002_logentry_remove_auto_add', '2021-10-14 16:22:04.533095'),
	(18, 'admin', '0003_logentry_add_action_flag_choices', '2021-10-14 16:22:04.543093'),
	(19, 'sessions', '0001_initial', '2021-10-14 16:22:04.561095'),
	(20, 'dashboards', '0001_initial', '2021-10-18 05:00:17.351526'),
	(21, 'dashboards', '0002_auto_20211018_0601', '2021-10-18 05:01:51.861818'),
	(22, 'dashboards', '0003_auto_20211212_2013', '2021-12-12 20:13:13.721670'),
	(23, 'dashboards', '0004_auto_20220107_0900', '2022-01-07 09:00:21.051719'),
	(24, 'dashboards', '0005_auto_20220107_1307', '2022-01-07 13:07:32.318254'),
	(25, 'dashboards', '0006_auto_20220124_1312', '2022-01-24 13:12:42.870432'),
	(26, 'dashboards', '0007_auto_20220124_1339', '2022-01-24 13:39:49.812791'),
	(27, 'dashboards', '0008_dashboard_layout', '2022-01-24 13:43:23.105966'),
	(28, 'dashboards', '0009_layout_data', '2022-01-25 07:20:37.540693'),
	(29, 'dashboards', '0010_layout_temp', '2022-01-25 20:46:22.670134'),
	(30, 'dashboards', '0011_remove_layout_temp', '2022-01-26 11:53:53.705438'),
	(31, 'dashboards', '0012_auto_20220301_1558', '2022-03-01 15:58:52.067663'),
	(32, 'dashboards', '0013_auto_20220301_1625', '2022-03-01 16:25:41.286050'),
	(33, 'dashboards', '0014_auto_20220301_1629', '2022-03-01 16:29:13.295937'),
	(34, 'dashboards', '0015_component_uuid', '2022-03-09 18:55:10.119519'),
	(35, 'dashboards', '0016_dashboard_date_format', '2022-03-17 13:34:38.121226');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;

-- Dumping structure for table flexdash.django_session
CREATE TABLE IF NOT EXISTS `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table flexdash.django_session: ~13 rows (approximately)
/*!40000 ALTER TABLE `django_session` DISABLE KEYS */;
INSERT INTO `django_session` (`session_key`, `session_data`, `expire_date`) VALUES
	('6iaa3jq8lip5z6kyu1ho052cwh5oy23a', '.eJxVjDsOwjAQRO_iGlnybw2U9JzB2rXXOIBsKU6qiLsTSymgmWLem9lEwHUpYe08hymJq1Di9NsRxhfXAdIT66PJ2OoyTySHIg_a5b0lft8O9--gYC_72gNHp5TGCzufLRgDJhJZ0soQsaccCeC8h-WIShnrhgOJGVDrLD5f54I4Jg:1mdTFn:q1JMOsJVm9rAyAXyAuGh4isIudNA6wDilwxfG2j4c9U', '2021-11-04 08:16:47.207011'),
	('6zigayiq76ygseqrb7mncpjga5uc0igb', '.eJxVjMsOwiAQRf-FtSGd4RVcuvcbyACDVA0kpV0Z_12bdKHbe865LxFoW2vYBi9hzuIsQJx-t0jpwW0H-U7t1mXqbV3mKHdFHnTIa8_8vBzu30GlUb_15E1EdNZyAkxAjpMpbHROUKgAgrOaFVokS-yj9WCY_FSiVkprjeL9AeDAN5Q:1mb3Vu:DHDxX4FIFuiYkWA5WlwCeANWnBTWzGmLnzqhG__B2ec', '2021-10-28 16:23:26.926824'),
	('8769ivpj22ui2o8tgrh55mejiq0e9xir', '.eJxVjDsOwjAQRO_iGlnybw2U9JzB2rXXOIBsKU6qiLsTSymgmWLem9lEwHUpYe08hymJq1Di9NsRxhfXAdIT66PJ2OoyTySHIg_a5b0lft8O9--gYC_72gNHp5TGCzufLRgDJhJZ0soQsaccCeC8h-WIShnrhgOJGVDrLD5f54I4Jg:1nssqq:XGpfOhue5pNCNIrwcsBIgyaDocy2ThLfA2MagUqj758', '2022-06-05 21:11:00.176432'),
	('9o4ph8wdg7os2noscecv9t4ydr9s8zmf', '.eJxVjDsOwjAQRO_iGlnybw2U9JzB2rXXOIBsKU6qiLsTSymgmWLem9lEwHUpYe08hymJq1Di9NsRxhfXAdIT66PJ2OoyTySHIg_a5b0lft8O9--gYC_72gNHp5TGCzufLRgDJhJZ0soQsaccCeC8h-WIShnrhgOJGVDrLD5f54I4Jg:1nBzhG:nILv7cznkTldrSFYuF6k4ohRr4HpoLzOxnf0VbF2TTQ', '2022-02-07 13:47:50.179836'),
	('a1x806i8t2g2tjtzhvvngbuqmj8vcgvx', '.eJxVjDsOwjAQRO_iGlnybw2U9JzB2rXXOIBsKU6qiLsTSymgmWLem9lEwHUpYe08hymJq1Di9NsRxhfXAdIT66PJ2OoyTySHIg_a5b0lft8O9--gYC_72gNHp5TGCzufLRgDJhJZ0soQsaccCeC8h-WIShnrhgOJGVDrLD5f54I4Jg:1muxZT:TKVTyOMD-1twJYte07vPMG9WpcuBUtB9EUlCYD-Xss0', '2021-12-22 14:05:23.373157'),
	('a9fh1jnxvqjxx9ybg0q4vh60hvmmr68b', '.eJxVjDsOwjAQRO_iGlnybw2U9JzB2rXXOIBsKU6qiLsTSymgmWLem9lEwHUpYe08hymJq1Di9NsRxhfXAdIT66PJ2OoyTySHIg_a5b0lft8O9--gYC_72gNHp5TGCzufLRgDJhJZ0soQsaccCeC8h-WIShnrhgOJGVDrLD5f54I4Jg:1mcKlf:th0F2YlzGQ7iEt2-7CQf-y5Bh4PAk_jS8V_aI_C4BCw', '2021-11-01 05:00:59.989957'),
	('azto2wmtjfyyyiasd1jtt6svgsw2tju7', '.eJxVjDsOwjAQRO_iGlnybw2U9JzB2rXXOIBsKU6qiLsTSymgmWLem9lEwHUpYe08hymJq1Di9NsRxhfXAdIT66PJ2OoyTySHIg_a5b0lft8O9--gYC_72gNHp5TGCzufLRgDJhJZ0soQsaccCeC8h-WIShnrhgOJGVDrLD5f54I4Jg:1meuhU:OOpq1fPyum6KhJGHwmatIZbF2NC5Nr_QbMpJFXbRytI', '2021-11-08 07:47:20.996101'),
	('cyrtsklkrbc5qgmwrtu6kimuvimc7mon', '.eJxVjDsOwjAQRO_iGlnybw2U9JzB2rXXOIBsKU6qiLsTSymgmWLem9lEwHUpYe08hymJq1Di9NsRxhfXAdIT66PJ2OoyTySHIg_a5b0lft8O9--gYC_72gNHp5TGCzufLRgDJhJZ0soQsaccCeC8h-WIShnrhgOJGVDrLD5f54I4Jg:1muuU0:-FZoSB_oSAFjOmxyogHPbWf5sZW8NLPfPD-AHg0MPPs', '2021-12-22 10:47:32.929127'),
	('gbf48wv7lk36pqaf7w20hwbwxi1p17pb', '.eJxVjDsOwjAQRO_iGlnybw2U9JzB2rXXOIBsKU6qiLsTSymgmWLem9lEwHUpYe08hymJq1Di9NsRxhfXAdIT66PJ2OoyTySHIg_a5b0lft8O9--gYC_72gNHp5TGCzufLRgDJhJZ0soQsaccCeC8h-WIShnrhgOJGVDrLD5f54I4Jg:1mf1ER:0129EbX2l3GXIgbOmqUHWZEshlvqbAkiIqvT5wJHgG0', '2021-11-08 14:45:47.443067'),
	('h9s244vy1r519ra6vbqa87jsvoefh2fy', '.eJxVjDsOwjAQRO_iGlnybw2U9JzB2rXXOIBsKU6qiLsTSymgmWLem9lEwHUpYe08hymJq1Di9NsRxhfXAdIT66PJ2OoyTySHIg_a5b0lft8O9--gYC_72gNHp5TGCzufLRgDJhJZ0soQsaccCeC8h-WIShnrhgOJGVDrLD5f54I4Jg:1ngLgo:P37_4PWBcb60w8XZdqcWiEKgnXwV8MJ_2sVkm4o2c44', '2022-05-02 07:20:50.516370'),
	('k8f7dc1x9ebsu6pmv3jhgdh87h652rh9', '.eJxVjDsOwjAQRO_iGlnybw2U9JzB2rXXOIBsKU6qiLsTSymgmWLem9lEwHUpYe08hymJq1Di9NsRxhfXAdIT66PJ2OoyTySHIg_a5b0lft8O9--gYC_72gNHp5TGCzufLRgDJhJZ0soQsaccCeC8h-WIShnrhgOJGVDrLD5f54I4Jg:1nYoLu:rKAecn9IrIRVvymVJZzncoL_zzsUuiKxQm1YTTQSoUI', '2022-04-11 12:20:06.901058'),
	('khvtfvd4cvgsgs9znznll4ylim46vlpo', '.eJxVjDsOwjAQRO_iGlnybw2U9JzB2rXXOIBsKU6qiLsTSymgmWLem9lEwHUpYe08hymJq1Di9NsRxhfXAdIT66PJ2OoyTySHIg_a5b0lft8O9--gYC_72gNHp5TGCzufLRgDJhJZ0soQsaccCeC8h-WIShnrhgOJGVDrLD5f54I4Jg:1mdwaQ:ZpmiBX81y-FhQcwsOCC48DGOPOea_wLaFghJ9YLBkkQ', '2021-11-05 15:36:02.790415'),
	('pno5y5monn60wues5e13f2fffbm3dy9y', '.eJxVjDsOwjAQRO_iGlnybw2U9JzB2rXXOIBsKU6qiLsTSymgmWLem9lEwHUpYe08hymJq1Di9NsRxhfXAdIT66PJ2OoyTySHIg_a5b0lft8O9--gYC_72gNHp5TGCzufLRgDJhJZ0soQsaccCeC8h-WIShnrhgOJGVDrLD5f54I4Jg:1mcOhN:U-lrOyC0T7Stp963i43-jJAsFoNZWLD2nydmqtJvSeQ', '2021-11-01 09:12:49.584693'),
	('prwo9cat6m612cb5t2ii9lpdxesm1xyn', '.eJxVjDsOwjAQRO_iGlnybw2U9JzB2rXXOIBsKU6qiLsTSymgmWLem9lEwHUpYe08hymJq1Di9NsRxhfXAdIT66PJ2OoyTySHIg_a5b0lft8O9--gYC_72gNHp5TGCzufLRgDJhJZ0soQsaccCeC8h-WIShnrhgOJGVDrLD5f54I4Jg:1mcVE7:fEAtKdXnMjMFi1mJkHeVGBoxdbz3wPqkP2LwJr2DcQY', '2021-11-01 16:11:03.940756'),
	('qosiluk1hvljx4lpl84ogqekm378uuqo', '.eJxVjDsOwjAQRO_iGlnybw2U9JzB2rXXOIBsKU6qiLsTSymgmWLem9lEwHUpYe08hymJq1Di9NsRxhfXAdIT66PJ2OoyTySHIg_a5b0lft8O9--gYC_72gNHp5TGCzufLRgDJhJZ0soQsaccCeC8h-WIShnrhgOJGVDrLD5f54I4Jg:1mx8FO:_TD2aAOhzbzyXj-NR5KYntaW6t5NHfkvpvfkPPMKnhg', '2021-12-28 13:53:38.697090'),
	('s2fpakl485rnapd3n8or30qzsbe48gz2', '.eJxVjDsOwjAQRO_iGlnybw2U9JzB2rXXOIBsKU6qiLsTSymgmWLem9lEwHUpYe08hymJq1Di9NsRxhfXAdIT66PJ2OoyTySHIg_a5b0lft8O9--gYC_72gNHp5TGCzufLRgDJhJZ0soQsaccCeC8h-WIShnrhgOJGVDrLD5f54I4Jg:1mcMN0:2DQ6IAejWUia_T0Jdv7Gb_O_SXyqJRPjUd51vXzFQTA', '2021-11-01 06:43:38.372271'),
	('ttpxewalz15113dfj6405ej7w9i4m88e', '.eJxVjDsOwjAQRO_iGlnybw2U9JzB2rXXOIBsKU6qiLsTSymgmWLem9lEwHUpYe08hymJq1Di9NsRxhfXAdIT66PJ2OoyTySHIg_a5b0lft8O9--gYC_72gNHp5TGCzufLRgDJhJZ0soQsaccCeC8h-WIShnrhgOJGVDrLD5f54I4Jg:1mj0AU:KAnx2zcX3fpl5QP90JFKubLGgOxadjfVHbwibHHSAEQ', '2021-11-19 14:26:10.305475'),
	('uadi28faz9f35setjec8oga0koong7kq', '.eJxVjDsOwjAQRO_iGlnybw2U9JzB2rXXOIBsKU6qiLsTSymgmWLem9lEwHUpYe08hymJq1Di9NsRxhfXAdIT66PJ2OoyTySHIg_a5b0lft8O9--gYC_72gNHp5TGCzufLRgDJhJZ0soQsaccCeC8h-WIShnrhgOJGVDrLD5f54I4Jg:1mdZhw:H5Fp8zUlbwT0fMUdrFztm7-xuU5e5ey2mfscSUL295c', '2021-11-04 15:10:16.620878'),
	('w53far8borkyy5srkxiue24j85nls7sh', '.eJxVjDsOwjAQRO_iGlnybw2U9JzB2rXXOIBsKU6qiLsTSymgmWLem9lEwHUpYe08hymJq1Di9NsRxhfXAdIT66PJ2OoyTySHIg_a5b0lft8O9--gYC_72gNHp5TGCzufLRgDJhJZ0soQsaccCeC8h-WIShnrhgOJGVDrLD5f54I4Jg:1mj0Pe:t-rKfvMR_r05zN-OMJWWQzzn0fuek_anfvkqAmIKKrE', '2021-11-19 14:41:50.447157'),
	('xfnzfvkj072snb40hyfmrpmx5vwwjukf', '.eJxVjDsOwjAQRO_iGlnybw2U9JzB2rXXOIBsKU6qiLsTSymgmWLem9lEwHUpYe08hymJq1Di9NsRxhfXAdIT66PJ2OoyTySHIg_a5b0lft8O9--gYC_72gNHp5TGCzufLRgDJhJZ0soQsaccCeC8h-WIShnrhgOJGVDrLD5f54I4Jg:1nglFu:Kya5wZUHL0DzEF1-qtOOo1V2o3wEim8mJmIiG-5nnos', '2022-05-03 10:38:46.149444'),
	('yczavbv67kdb1f18jtuhei1mwtr91okq', '.eJxVjDsOwjAQRO_iGlnybw2U9JzB2rXXOIBsKU6qiLsTSymgmWLem9lEwHUpYe08hymJq1Di9NsRxhfXAdIT66PJ2OoyTySHIg_a5b0lft8O9--gYC_72gNHp5TGCzufLRgDJhJZ0soQsaccCeC8h-WIShnrhgOJGVDrLD5f54I4Jg:1mcM7o:11kVKAeFddtytcigutEIp0BIa9-xq8sSDZLAFo3h7OA', '2021-11-01 06:27:56.565587');
/*!40000 ALTER TABLE `django_session` ENABLE KEYS */;

-- Dumping structure for table flexdash.user
CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) NOT NULL,
  `first_name` varchar(150) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `email` varchar(254) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- Dumping data for table flexdash.user: ~0 rows (approximately)
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` (`id`, `password`, `last_login`, `is_superuser`, `username`, `first_name`, `last_name`, `email`, `is_staff`, `is_active`, `date_joined`) VALUES
	(1, 'pbkdf2_sha256$216000$gUQNPHOWH1ov$DcBDWzLl1NUzNwxGR8ZTLgXZGxXPVduJM1I5BogE74U=', '2022-05-22 21:11:00.176432', 1, 'admin', '', '', 'admin@admin.com', 1, 1, '2021-10-14 16:22:53.040080');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;

-- Dumping structure for table flexdash.user_groups
CREATE TABLE IF NOT EXISTS `user_groups` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_groups_user_id_group_id_40beef00_uniq` (`user_id`,`group_id`),
  KEY `user_groups_group_id_b76f8aba_fk_auth_group_id` (`group_id`),
  CONSTRAINT `user_groups_group_id_b76f8aba_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  CONSTRAINT `user_groups_user_id_abaea130_fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table flexdash.user_groups: ~0 rows (approximately)
/*!40000 ALTER TABLE `user_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_groups` ENABLE KEYS */;

-- Dumping structure for table flexdash.user_user_permissions
CREATE TABLE IF NOT EXISTS `user_user_permissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_user_permissions_user_id_permission_id_7dc6e2e0_uniq` (`user_id`,`permission_id`),
  KEY `user_user_permission_permission_id_9deb68a3_fk_auth_perm` (`permission_id`),
  CONSTRAINT `user_user_permission_permission_id_9deb68a3_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `user_user_permissions_user_id_ed4a47ea_fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table flexdash.user_user_permissions: ~0 rows (approximately)
/*!40000 ALTER TABLE `user_user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_user_permissions` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
