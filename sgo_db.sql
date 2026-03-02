-- SGO Database Schema
-- Sistema de Gerenciamento de Oficinas

CREATE TABLE IF NOT EXISTS client (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    cpf VARCHAR(20),
    phone VARCHAR(20),
    homephone VARCHAR(20),
    fleet_number VARCHAR(30),
    state VARCHAR(50),
    city VARCHAR(100),
    customer_report TEXT,
    email VARCHAR(100),
    address VARCHAR(255),
    INDEX idx_name (name)
);

CREATE TABLE IF NOT EXISTS vehicle (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plate VARCHAR(10) NOT NULL UNIQUE,
    model VARCHAR(50),
    brand VARCHAR(50),
    year INT,
    client_id INT NOT NULL,
    FOREIGN KEY (client_id) REFERENCES client(id),
    INDEX idx_plate (plate),
    INDEX idx_client_id (client_id)
);

CREATE TABLE IF NOT EXISTS user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(250) NOT NULL,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    avatar TEXT DEFAULT NULL,
    status TINYINT(1) NOT NULL DEFAULT 1,
    type TINYINT(1) NOT NULL DEFAULT 0,
    last_login DATETIME DEFAULT NULL,
    date_added DATETIME NOT NULL DEFAULT current_timestamp(),
    date_updated DATETIME DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    INDEX idx_type (type)
);

CREATE TABLE IF NOT EXISTS product (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    image_path TEXT,
    status TINYINT(1) NOT NULL DEFAULT 1,
    delete_flag TINYINT(1) NOT NULL DEFAULT 0,
    date_created DATETIME NOT NULL DEFAULT current_timestamp(),
    date_updated DATETIME NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
);

CREATE TABLE IF NOT EXISTS service (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    status TINYINT(1) NOT NULL DEFAULT 1,
    delete_flag TINYINT(1) NOT NULL DEFAULT 0,
    date_created DATETIME NOT NULL DEFAULT current_timestamp(),
    date_updated DATETIME NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
);

CREATE TABLE IF NOT EXISTS inventory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    stock_date DATE NOT NULL,
    date_created DATETIME NOT NULL DEFAULT current_timestamp(),
    date_updated DATETIME NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    FOREIGN KEY (product_id) REFERENCES product(id),
    INDEX idx_product_id (product_id)
);

CREATE TABLE IF NOT EXISTS service_order (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(100) NOT NULL UNIQUE,
    client_id INT NOT NULL,
    vehicle_id INT,
    user_id INT NOT NULL,
    status ENUM('pending','open','in_progress','completed','paid','cancelled') NOT NULL DEFAULT 'open',
    date_opened DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_closed DATETIME,
    total_amount DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    client_contact VARCHAR(50),
    client_email VARCHAR(100),
    client_address VARCHAR(255),
    FOREIGN KEY (client_id) REFERENCES client(id),
    FOREIGN KEY (vehicle_id) REFERENCES vehicle(id),
    FOREIGN KEY (user_id) REFERENCES user(id),
    INDEX idx_status (status),
    INDEX idx_client_id (client_id),
    INDEX idx_user_id (user_id),
    INDEX idx_vehicle_id (vehicle_id),
    INDEX idx_date_opened (date_opened)
);

CREATE TABLE IF NOT EXISTS stage (
    id INT AUTO_INCREMENT PRIMARY KEY,
    service_order_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    execution_order INT NOT NULL,
    status ENUM('pending', 'in_progress', 'completed') NOT NULL DEFAULT 'pending',
    FOREIGN KEY (service_order_id) REFERENCES service_order(id),
    INDEX idx_service_order_id (service_order_id),
    INDEX idx_execution_order (execution_order),
    INDEX idx_status (status)
);

CREATE TABLE IF NOT EXISTS task (
    id INT AUTO_INCREMENT PRIMARY KEY,
    stage_id INT NOT NULL,
    description VARCHAR(255) NOT NULL,
    user_id INT,
    status ENUM('pending', 'in_progress', 'completed', 'blocked') NOT NULL DEFAULT 'pending',
    estimated_time_minutes INT,
    actual_time_minutes INT,
    date_started DATETIME,
    date_finished DATETIME,
    FOREIGN KEY (stage_id) REFERENCES stage(id),
    FOREIGN KEY (user_id) REFERENCES user(id),
    INDEX idx_stage_id (stage_id),
    INDEX idx_status (status),
    INDEX idx_user_id (user_id),
    INDEX idx_date_started (date_started),
    INDEX idx_date_finished (date_finished)
);

CREATE TABLE IF NOT EXISTS service_order_product (
    service_order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    price DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    PRIMARY KEY (service_order_id, product_id),
    FOREIGN KEY (service_order_id) REFERENCES service_order(id),
    FOREIGN KEY (product_id) REFERENCES product(id)
);

CREATE TABLE IF NOT EXISTS service_order_service (
    service_order_id INT NOT NULL,
    service_id INT NOT NULL,
    price DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    PRIMARY KEY (service_order_id, service_id),
    FOREIGN KEY (service_order_id) REFERENCES service_order(id),
    FOREIGN KEY (service_id) REFERENCES service(id)
);

CREATE TABLE IF NOT EXISTS system_info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    meta_field VARCHAR(100) NOT NULL,
    meta_value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS task_comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    task_id INT NOT NULL,
    user_id INT NOT NULL,
    comment TEXT NOT NULL,
    date_created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES task(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES user(id),
    INDEX idx_task_id (task_id),
    INDEX idx_user_id (user_id),
    INDEX idx_date_created (date_created)
);

CREATE TABLE IF NOT EXISTS task_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    task_id INT NOT NULL,
    user_id INT NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size INT DEFAULT 0,
    date_created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES task(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES user(id),
    INDEX idx_task_id (task_id),
    INDEX idx_user_id (user_id),
    INDEX idx_date_created (date_created)
);
