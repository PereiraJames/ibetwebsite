-- Create googleUsers table
CREATE TABLE googleUsers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    firstName VARCHAR(255),
    lastName VARCHAR(255),
    emailVerified BOOLEAN DEFAULT FALSE,
    INDEX(email) -- Indexing email for faster queries
);

-- Create defaultUsers table
CREATE TABLE defaultUsers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL, -- Assuming you store hashed passwords
    phoneNumber VARCHAR(20),
    email VARCHAR(255) NOT NULL UNIQUE,
    INDEX(email) -- Indexing email for faster queries
);

-- Create users table to track users from both googleUsers and defaultUsers
CREATE TABLE users (
    userid INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    registeredMethod ENUM('google', 'default') NOT NULL, -- Track the registration method
    googleUserId INT, -- Foreign key reference for Google Users
    defaultUserId INT, -- Foreign key reference for Default Users
    FOREIGN KEY (googleUserId) REFERENCES googleUsers(id) ON DELETE SET NULL,
    FOREIGN KEY (defaultUserId) REFERENCES defaultUsers(id) ON DELETE SET NULL,
    INDEX(email) -- Indexing email for faster queries
);

-- Optionally, if you want to handle registration method-specific data like googleUsers or defaultUsers data,
-- you can enforce integrity through application logic or additional constraints.
