-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Sep 18, 2025 at 07:20 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `jobplatform`
--

-- --------------------------------------------------------

--
-- Table structure for table `applications`
--

CREATE TABLE `applications` (
  `id` int(11) NOT NULL,
  `job_id` int(11) NOT NULL,
  `employee_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `address` text DEFAULT NULL,
  `cover_letter` text DEFAULT NULL,
  `experience` text DEFAULT NULL,
  `skills` text DEFAULT NULL,
  `resume` varchar(255) DEFAULT NULL,
  `status` enum('pending','reviewed','shortlisted','rejected','accepted') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `applications`
--

INSERT INTO `applications` (`id`, `job_id`, `employee_id`, `name`, `email`, `phone`, `address`, `cover_letter`, `experience`, `skills`, `resume`, `status`, `created_at`, `updated_at`) VALUES
(1, 4, 9, 'Abhishek Mathur', 'abhishekmathur7575@gmail.com', '9999887787', 'new delhi', '', '4 years', 'asdf', '/uploads/1757328546316-Susanta Biswas Resume.pdf', '', '2025-09-08 10:49:06', '2025-09-11 05:26:53'),
(2, 3, 9, 'Nitendra', 'tekbooster8@gmail.com', '9891258507', 'new delhi', '', '4 years', 'html', '/uploads/1757328968950-resume abi.pdf', '', '2025-09-08 10:56:08', '2025-09-09 06:41:57'),
(3, 5, 9, 'Abhishek Mathur', 'abhishekmathur7575@gmail.com', '9891258507', 'new delhi', '', '4 years', 'meta ads', '/uploads/1757414868675-H_28680705 (1).pdf', 'pending', '2025-09-09 10:47:48', '2025-09-09 10:47:48'),
(4, 5, 10, 'Sumit', 'officialtreatglobe@gmail.com', '9879879876', 'new delhi', '', '2', 'nextjs', '/uploads/1757593904583-H_23093911.pdf', 'pending', '2025-09-11 12:31:44', '2025-09-11 12:31:44');

-- --------------------------------------------------------

--
-- Table structure for table `conversations`
--

CREATE TABLE `conversations` (
  `id` int(11) NOT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `conversation_participants`
--

CREATE TABLE `conversation_participants` (
  `id` int(11) NOT NULL,
  `conversation_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `last_read_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` int(11) NOT NULL,
  `employer_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `type` enum('full-time','part-time','contract','internship') NOT NULL DEFAULT 'full-time',
  `salary_min` decimal(10,2) DEFAULT NULL,
  `salary_max` decimal(10,2) DEFAULT NULL,
  `salary` varchar(100) DEFAULT NULL,
  `expires_at` date DEFAULT NULL,
  `status` enum('draft','published','closed') DEFAULT 'published',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `jobs`
--

INSERT INTO `jobs` (`id`, `employer_id`, `title`, `description`, `location`, `type`, `salary_min`, `salary_max`, `salary`, `expires_at`, `status`, `created_at`) VALUES
(1, 8, 'web developer', 'urgent hiring', 'new delhi', 'part-time', 45000.00, 60000.00, NULL, '2025-09-10', 'published', '2025-09-08 05:26:48'),
(2, 8, 'digital marketer', 'urgent hiring', 'hr', 'contract', 30000.00, 45000.00, NULL, '2025-09-19', 'published', '2025-09-08 05:43:47'),
(3, 8, 'graphics designer', 'asdfasdf', 'new delhi', 'full-time', 25000.00, 45000.00, NULL, '2025-09-13', 'published', '2025-09-08 05:47:57'),
(4, 8, 'content writer', 'Creative Content Writer | Storyteller | SEO Specialist\n\nI am a passionate content writer who loves transforming ideas into impactful words. From blog posts, website content, product descriptions, to social media captions – I create content that not only engages readers but also drives results. With strong research skills and SEO knowledge, I ensure every piece is original, audience-focused, and optimized for search engines.\n\n✨ Specialization: Blog Writing | Web Copy | SEO Articles | Social Media Content | Creative Writing\n\n📌 Goal: To deliver content that informs, inspires, and converts!', 'new delhi', 'internship', 10000.00, 150000.00, NULL, '2025-09-09', 'published', '2025-09-08 09:57:08'),
(5, 8, 'Performance Marketing', 'Job Description – Performance Marketing Specialist\n\nWe are seeking a skilled Performance Marketing Specialist to drive measurable growth across digital channels. The role involves managing paid campaigns on platforms like Google Ads, Meta Ads, and affiliates, focusing on lead generation, conversions, and ROI optimization. Responsibilities include campaign setup, audience targeting, keyword research, A/B testing, budget allocation, and performance tracking. The ideal candidate should be data-driven, analytical, and experienced with tools such as Google Analytics, Ads Manager, and SEO basics. Strong communication skills and the ability to scale campaigns efficiently are essential.', 'U.P', 'full-time', 45000.00, 50000.00, NULL, '2025-09-10', 'published', '2025-09-09 06:40:04');

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `receiver_id` int(11) NOT NULL,
  `job_id` int(11) DEFAULT NULL,
  `content` text NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `sender_id`, `receiver_id`, `job_id`, `content`, `is_read`, `created_at`) VALUES
(1, 8, 9, NULL, 'hello', 1, '2025-09-10 11:01:45'),
(2, 9, 8, NULL, 'Hii sir', 1, '2025-09-10 11:05:01'),
(3, 8, 9, NULL, 'are you on notice period?', 1, '2025-09-10 11:29:12'),
(4, 9, 8, NULL, 'yes', 1, '2025-09-10 12:36:33');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `type` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `body` text DEFAULT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`payload`)),
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `type`, `title`, `body`, `payload`, `is_read`, `created_at`) VALUES
(1, 9, 'message', 'New message', 'New message from Abhisek Mathur', '{\"messageId\":1,\"senderId\":\"8\",\"jobId\":null}', 0, '2025-09-10 11:01:45'),
(2, 8, 'message', 'New message', 'New message from sachin', '{\"messageId\":2,\"senderId\":\"9\",\"jobId\":null}', 0, '2025-09-10 11:05:01'),
(3, 9, 'message', 'New message', 'New message from Abhisek Mathur', '{\"messageId\":3,\"senderId\":\"8\",\"jobId\":null}', 0, '2025-09-10 11:29:12'),
(4, 8, 'message', 'New message', 'New message from sachin', '{\"messageId\":4,\"senderId\":\"9\",\"jobId\":null}', 0, '2025-09-10 12:36:33');

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_requests`
--

CREATE TABLE `password_reset_requests` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `otp_hash` varchar(255) NOT NULL,
  `reset_token` varchar(255) DEFAULT NULL,
  `expires_at` datetime NOT NULL,
  `consumed` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `password_reset_requests`
--

INSERT INTO `password_reset_requests` (`id`, `user_id`, `otp_hash`, `reset_token`, `expires_at`, `consumed`, `created_at`) VALUES
(11, 8, '$2b$10$hl5tavDiabA6N.008fkO3OxzDCXgKc6xPzr83I8JhNAx/PIlnO5cy', '08cd769620b8d3bf7a71db9e9bc827ad188e690764d7f4bf99ade9c9b173a281', '2025-09-06 16:46:57', 1, '2025-09-06 11:06:57'),
(12, 8, '$2b$10$al6L3aeyTeaglmKmX989c.2gaZtWkGumLRtNzK7pNuS73UDtj31IK', NULL, '2025-09-08 12:02:44', 0, '2025-09-08 06:22:44'),
(13, 9, '$2b$10$b1dfFWbFpz/tUhDMrBxeReucTtO9fhFgFt/XvSYLeTBR41MHt8nvS', '4345300c890f9ef7d4c27cea44135b05a3ad8d4c8319bb7b8ff4af858cc8f86f', '2025-09-08 12:03:59', 1, '2025-09-08 06:23:59');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `role` enum('employer','employee') NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `role`, `password`, `created_at`) VALUES
(8, 'Abhisek Mathur', 'tekbooster8@gmail.com', 'employer', '$2b$10$UzCx/VQveCj/hATDSe/YRO1TcF7AhASBEo9ka2gAAwQdpUnUSP3I2', '2025-09-06 11:00:39'),
(9, 'sachin', 'abhishekmathur7575@gmail.com', 'employee', '$2b$10$YcQafKlrqRBEcoh7gnd/C.ndg9kmyRB6.VSFj.vsgYGEp7c/M6Diy', '2025-09-08 06:20:49'),
(10, 'sumit', 'officialtreatglobe@gmail.com', 'employee', '$2b$10$/y4y7CsN.0YaQlFZpRyXyuWP0VBszsp6o0.c0wurx6ZxqMEon7Xk2', '2025-09-11 12:30:45'),
(11, 'Sachin Kumar', 'sachinthakurofficial25@gmail.com', 'employee', '$2b$10$NgJ1hJiyh/ooJFAfYdBpXOz6ACtsmT160RhvmjTSu2WMFU63Z.1tS', '2025-09-13 10:07:24');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `applications`
--
ALTER TABLE `applications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_applications_job` (`job_id`),
  ADD KEY `fk_applications_employee` (`employee_id`);

--
-- Indexes for table `conversations`
--
ALTER TABLE `conversations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `conversation_participants`
--
ALTER TABLE `conversation_participants`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `conversation_id` (`conversation_id`,`user_id`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_jobs_employer` (`employer_id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sender_id` (`sender_id`),
  ADD KEY `receiver_id` (`receiver_id`),
  ADD KEY `job_id` (`job_id`),
  ADD KEY `is_read` (`is_read`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `is_read` (`is_read`);

--
-- Indexes for table `password_reset_requests`
--
ALTER TABLE `password_reset_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `reset_token` (`reset_token`),
  ADD KEY `expires_at` (`expires_at`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `applications`
--
ALTER TABLE `applications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `conversations`
--
ALTER TABLE `conversations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `conversation_participants`
--
ALTER TABLE `conversation_participants`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `password_reset_requests`
--
ALTER TABLE `password_reset_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `applications`
--
ALTER TABLE `applications`
  ADD CONSTRAINT `fk_applications_employee` FOREIGN KEY (`employee_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_applications_job` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `conversation_participants`
--
ALTER TABLE `conversation_participants`
  ADD CONSTRAINT `conversation_participants_ibfk_1` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `jobs`
--
ALTER TABLE `jobs`
  ADD CONSTRAINT `fk_jobs_employer` FOREIGN KEY (`employer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
