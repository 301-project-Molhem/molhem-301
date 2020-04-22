DROP TABLE IF EXISTS savedIdeas;

CREATE TABLE savedIdeas (
    id SERIAL PRIMARY KEY,
    img_url  VARCHAR(65535),
    title VARCHAR(255),
    creator_name VARCHAR(255),
    categories VARCHAR(255),
    source VARCHAR(255),
    source_url VARCHAR(65535),
    saveDate DATE,
    notes TEXT,
    scoreOfTen NUMERIC(2),
    likes VARCHAR(255)

  );

