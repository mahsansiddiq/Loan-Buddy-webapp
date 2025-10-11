-- Users
CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(50),
  role ENUM('borrower','lender','admin') NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  nic_number VARCHAR(100),
  nic_image_key VARCHAR(512),
  nic_image_url VARCHAR(1024),
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Loans
CREATE TABLE IF NOT EXISTS loans (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  borrower_id BIGINT UNSIGNED NOT NULL,
  lender_id BIGINT UNSIGNED NULL,
  principal DECIMAL(15,2) NOT NULL,
  term_months INT NOT NULL,
  purpose VARCHAR(1000),
  status ENUM('PENDING','APPROVED','ACTIVE','REPAID','CANCELLED','REJECTED') DEFAULT 'PENDING',
  borrower_accepted_at DATETIME NULL,
  lender_accepted_at DATETIME NULL,
  agreement_s3_key VARCHAR(512),
  agreement_s3_url VARCHAR(1024),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  activated_at DATETIME NULL,
  repaid_at DATETIME NULL,
  CONSTRAINT fk_loans_borrower FOREIGN KEY (borrower_id) REFERENCES users(id),
  CONSTRAINT fk_loans_lender FOREIGN KEY (lender_id) REFERENCES users(id)
) ENGINE=InnoDB;

-- Witnesses
CREATE TABLE IF NOT EXISTS witnesses (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  loan_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(255) NOT NULL,
  national_card_number VARCHAR(255) NOT NULL,
  contact VARCHAR(255),
  nic_image_key VARCHAR(512),
  nic_image_url VARCHAR(1024),
  CONSTRAINT fk_witnesses_loan FOREIGN KEY (loan_id) REFERENCES loans(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Repayment schedule (principal only)
CREATE TABLE IF NOT EXISTS repayment_schedule (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  loan_id BIGINT UNSIGNED NOT NULL,
  due_date DATE NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  paid TINYINT(1) DEFAULT 0,
  paid_at DATETIME NULL,
  CONSTRAINT fk_schedule_loan FOREIGN KEY (loan_id) REFERENCES loans(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Payments
CREATE TABLE IF NOT EXISTS payments (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  loan_id BIGINT UNSIGNED NOT NULL,
  payer_id BIGINT UNSIGNED NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  payment_date DATE NOT NULL,
  method VARCHAR(100),
  note VARCHAR(1000),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_payments_loan FOREIGN KEY (loan_id) REFERENCES loans(id),
  CONSTRAINT fk_payments_user FOREIGN KEY (payer_id) REFERENCES users(id)
) ENGINE=InnoDB;

-- Audit logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  entity_type VARCHAR(100) NOT NULL,
  entity_id VARCHAR(100) NOT NULL,
  action VARCHAR(100) NOT NULL,
  performed_by BIGINT UNSIGNED NULL,
  metadata_json JSON NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
