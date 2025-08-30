-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 30-08-2025 a las 05:14:46
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `riegodb`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `dispositivos`
--

CREATE TABLE `dispositivos` (
  `dispositivoId` int(11) NOT NULL,
  `nombre` varchar(200) DEFAULT NULL,
  `ubicacion` varchar(200) DEFAULT NULL,
  `electrovalvulaId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `dispositivos`
--

INSERT INTO `dispositivos` (`dispositivoId`, `nombre`, `ubicacion`, `electrovalvulaId`) VALUES
(1, 'Sensor 1', 'Patio', 1),
(2, 'Sensor 2', 'Cocina', 2),
(3, 'Sensor 3', 'Jardin Delantero', 3),
(4, 'Sensor 4', 'Living', 4),
(5, 'Sensor 5', 'Habitacion 1', 5),
(6, 'Sensor 6', 'Habitacion 2', 6);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `electrovalvulas`
--

CREATE TABLE `electrovalvulas` (
  `electrovalvulaId` int(11) NOT NULL,
  `nombre` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `electrovalvulas`
--

INSERT INTO `electrovalvulas` (`electrovalvulaId`, `nombre`) VALUES
(1, 'eLPatio'),
(2, 'eLCocina'),
(3, 'eLJardinDelantero'),
(4, 'eLLiving'),
(5, 'eLHabitacion1'),
(6, 'eLHabitacion2');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `log_riegos`
--

CREATE TABLE `log_riegos` (
  `logRiegoId` int(11) NOT NULL,
  `apertura` tinyint(1) DEFAULT NULL,
  `fecha` datetime DEFAULT NULL,
  `electrovalvulaId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `log_riegos`
--

INSERT INTO `log_riegos` (`logRiegoId`, `apertura`, `fecha`, `electrovalvulaId`) VALUES
(1, 1, '2025-08-29 21:04:54', 4),
(2, 0, '2025-08-29 21:04:57', 4),
(3, 1, '2025-08-29 21:04:59', 4),
(4, 0, '2025-08-29 21:05:00', 4),
(5, 1, '2025-08-29 21:10:57', 2),
(6, 0, '2025-08-29 21:11:00', 2),
(7, 1, '2025-08-29 21:11:06', 2),
(8, 0, '2025-08-29 21:11:19', 2),
(9, 1, '2025-08-29 21:42:02', 1),
(10, 0, '2025-08-29 21:48:23', 1),
(11, 1, '2025-08-29 21:48:28', 1),
(12, 0, '2025-08-29 21:48:32', 1),
(13, 1, '2025-08-29 21:48:43', 1),
(14, 0, '2025-08-29 21:48:45', 1),
(15, 1, '2025-08-29 21:49:30', 1),
(16, 0, '2025-08-29 21:49:32', 1),
(17, 1, '2025-08-29 21:49:58', 1),
(18, 0, '2025-08-29 21:50:01', 1),
(19, 1, '2025-08-29 21:50:06', 1),
(20, 0, '2025-08-29 21:50:10', 1),
(21, 1, '2025-08-29 21:50:15', 1),
(22, 0, '2025-08-29 21:50:21', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mediciones`
--

CREATE TABLE `mediciones` (
  `medicionId` int(11) NOT NULL,
  `fecha` datetime DEFAULT NULL,
  `valor` decimal(10,2) DEFAULT NULL,
  `dispositivoId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `mediciones`
--

INSERT INTO `mediciones` (`medicionId`, `fecha`, `valor`, `dispositivoId`) VALUES
(1, '2020-11-26 21:19:41', 60.00, 1),
(2, '2020-11-26 21:19:41', 40.00, 1),
(3, '2020-11-26 21:19:41', 30.00, 2),
(4, '2020-11-26 21:19:41', 50.00, 3),
(5, '2020-11-26 21:19:41', 33.00, 5),
(6, '2020-11-26 21:19:41', 17.00, 4),
(7, '2020-11-26 21:19:41', 29.00, 6),
(8, '2020-11-26 21:19:41', 20.00, 1),
(9, '2020-11-26 21:19:41', 44.00, 4),
(10, '2020-11-26 21:19:41', 61.00, 5),
(11, '2020-11-26 21:19:41', 12.00, 2),
(12, '2025-08-29 21:04:54', 33.00, 4),
(13, '2025-08-29 21:04:57', 79.00, 4),
(14, '2025-08-29 21:04:59', 54.00, 4),
(15, '2025-08-29 21:05:00', 67.00, 4),
(16, '2025-08-29 21:10:57', 86.00, 2),
(17, '2025-08-29 21:11:00', 14.00, 2),
(18, '2025-08-29 21:11:06', 28.00, 2),
(19, '2025-08-29 21:11:19', 38.00, 2),
(20, '2025-08-29 21:42:02', 20.00, 1),
(21, '2025-08-29 21:48:23', 18.00, 1),
(22, '2025-08-29 21:48:28', 24.00, 1),
(23, '2025-08-29 21:48:32', 32.00, 1),
(24, '2025-08-29 21:48:43', 53.00, 1),
(25, '2025-08-29 21:48:45', 48.00, 1),
(26, '2025-08-29 21:49:30', 17.00, 1),
(27, '2025-08-29 21:49:32', 15.00, 1),
(28, '2025-08-29 21:49:58', 30.00, 1),
(29, '2025-08-29 21:50:01', 67.00, 1),
(30, '2025-08-29 21:50:06', 35.00, 1),
(31, '2025-08-29 21:50:10', 88.00, 1),
(32, '2025-08-29 21:50:15', 59.00, 1),
(33, '2025-08-29 21:50:21', 39.00, 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `dispositivos`
--
ALTER TABLE `dispositivos`
  ADD PRIMARY KEY (`dispositivoId`),
  ADD KEY `fk_Dispositivos_Electrovalvulas1_idx` (`electrovalvulaId`);

--
-- Indices de la tabla `electrovalvulas`
--
ALTER TABLE `electrovalvulas`
  ADD PRIMARY KEY (`electrovalvulaId`);

--
-- Indices de la tabla `log_riegos`
--
ALTER TABLE `log_riegos`
  ADD PRIMARY KEY (`logRiegoId`),
  ADD KEY `fk_Log_Riegos_Electrovalvulas1_idx` (`electrovalvulaId`);

--
-- Indices de la tabla `mediciones`
--
ALTER TABLE `mediciones`
  ADD PRIMARY KEY (`medicionId`),
  ADD KEY `fk_Mediciones_Dispositivos_idx` (`dispositivoId`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `dispositivos`
--
ALTER TABLE `dispositivos`
  MODIFY `dispositivoId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `electrovalvulas`
--
ALTER TABLE `electrovalvulas`
  MODIFY `electrovalvulaId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `log_riegos`
--
ALTER TABLE `log_riegos`
  MODIFY `logRiegoId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT de la tabla `mediciones`
--
ALTER TABLE `mediciones`
  MODIFY `medicionId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `dispositivos`
--
ALTER TABLE `dispositivos`
  ADD CONSTRAINT `fk_Dispositivos_Electrovalvulas1` FOREIGN KEY (`electrovalvulaId`) REFERENCES `electrovalvulas` (`electrovalvulaId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `log_riegos`
--
ALTER TABLE `log_riegos`
  ADD CONSTRAINT `fk_Log_Riegos_Electrovalvulas1` FOREIGN KEY (`electrovalvulaId`) REFERENCES `electrovalvulas` (`electrovalvulaId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `mediciones`
--
ALTER TABLE `mediciones`
  ADD CONSTRAINT `fk_Mediciones_Dispositivos` FOREIGN KEY (`dispositivoId`) REFERENCES `dispositivos` (`dispositivoId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
