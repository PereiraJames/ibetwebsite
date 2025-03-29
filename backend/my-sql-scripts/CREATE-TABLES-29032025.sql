-- Create the googleUsersDev table with emailVerified column
CREATE TABLE googleUsersDev (
    id INT AUTO_INCREMENT PRIMARY KEY,       -- Unique ID for Google users
    username VARCHAR(255) NOT NULL,          -- Google username
    email VARCHAR(255) NOT NULL,             -- Google email address
    emailVerified BOOLEAN DEFAULT FALSE,     -- Email verified status for Google users
    firstname VARCHAR(255),                  -- First name of the Google user
    lastname VARCHAR(255),                   -- Last name of the Google user
    UNIQUE (email)                           -- Ensure email is unique across Google users
);

-- Create the defaultUsersDev table
CREATE TABLE defaultUsers (
    id INT AUTO_INCREMENT PRIMARY KEY,       -- Unique ID for default users
    email VARCHAR(255) NOT NULL,             -- Default email address
    username VARCHAR(255) NOT NULL,          -- Default username
    phoneNo VARCHAR(20),                     -- Phone number for default users
    password VARCHAR(255) NOT NULL,          -- Password for default users
    UNIQUE (email),                          -- Ensure email is unique across default users
    UNIQUE (username)                        -- Ensure username is unique across default users
);

-- Create the usersDev table (central table linking googleUsersDev and defaultUsersDev)
CREATE TABLE usersDev (
    id INT AUTO_INCREMENT PRIMARY KEY,       -- Unique ID for the user in central table
    username VARCHAR(255) NOT NULL,          -- General username (could be from either Google or default)
    email VARCHAR(255) NOT NULL,             -- General email (could be from either Google or default)
    source ENUM('google', 'default') NOT NULL, -- Source of the user (either 'google' or 'default')
    registeredMethod ENUM('google', 'default') NOT NULL, -- Method of registration (either via Google or Default)
    google_user_id INT,                      -- Foreign key for Google users (nullable)
    default_user_id INT,                     -- Foreign key for Default users (nullable)
    FOREIGN KEY (google_user_id) REFERENCES googleUsersDev(id) ON DELETE SET NULL, -- Link to googleUsersDev
    FOREIGN KEY (default_user_id) REFERENCES defaultUsers(id) ON DELETE SET NULL, -- Link to defaultUsersDev
    UNIQUE (email),                          -- Ensure email is unique across both Google and Default users
    UNIQUE (username),                       -- Ensure username is unique across both Google and Default users
    UNIQUE (source, email)                   -- Ensures there is only one user per email/source combination
);

-- Add indexes for better performance when querying by email or username
CREATE INDEX idx_email ON usersDev(email);
CREATE INDEX idx_username ON usersDev(username);

-- Add indexes on the googleUsersDev and defaultUsersDev for quicker lookups
CREATE INDEX idx_googleEmail ON googleUsersDev(email);
CREATE INDEX idx_defaultEmail ON defaultUsers(email);
CREATE INDEX idx_defaultUsername ON defaultUsers(username);
